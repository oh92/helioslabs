import { createHash } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { adminSupabase } from '@/lib/db';

const SESSION_ID = 'sess_btc_live_001';
const MARKET_ID = 'mkt_btc_001';
const STARTING_BALANCE = 10000;

function deterministicId(entryTime: string, direction: string): string {
  const raw = `${entryTime}:${direction}`;
  return `trd_${createHash('sha256').update(raw).digest('hex').slice(0, 12)}`;
}

export async function POST(request: NextRequest) {
  // Validate webhook secret
  const webhookSecret = request.headers.get('X-Webhook-Secret');
  const expectedSecret = process.env.WEBHOOK_SECRET;

  if (!expectedSecret || webhookSecret !== expectedSecret) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  if (!adminSupabase) {
    return NextResponse.json(
      { error: 'Database not configured' },
      { status: 503 }
    );
  }

  let tradeData;
  try {
    tradeData = await request.json();
  } catch {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    );
  }

  // Validate required fields
  const required = ['entry_time', 'type', 'entry_price', 'exit_time', 'exit_price', 'pnl_pct', 'exit_reason'];
  for (const field of required) {
    if (tradeData[field] === undefined || tradeData[field] === null) {
      return NextResponse.json(
        { error: `Missing required field: ${field}` },
        { status: 400 }
      );
    }
  }

  try {
    const entryTime = String(tradeData.entry_time).trim();
    const direction = String(tradeData.type).trim();
    const tradeId = deterministicId(entryTime, direction);

    // 1. Upsert the trade (strip sensitive fields — only store safe data)
    const trade = {
      id: tradeId,
      session_id: SESSION_ID,
      entry_time: entryTime + '+00:00',
      exit_time: String(tradeData.exit_time).trim() + '+00:00',
      direction,
      entry_price: Number(tradeData.entry_price),
      exit_price: Number(tradeData.exit_price),
      size: null,
      pnl: null,
      pnl_pct: Math.round(Number(tradeData.pnl_pct) * 10000) / 10000,
      exit_reason: String(tradeData.exit_reason).trim(),
      source: 'live',
    };

    const { error: tradeError } = await adminSupabase
      .from('trades')
      .upsert(trade, { onConflict: 'id' });

    if (tradeError) {
      console.error('[Webhook] Trade upsert error:', tradeError);
      return NextResponse.json(
        { error: 'Failed to store trade', detail: tradeError.message },
        { status: 500 }
      );
    }

    console.log(`[Webhook] Upserted trade ${tradeId}: ${direction} ${trade.entry_price} -> ${trade.exit_price} (${trade.pnl_pct}%)`);

    // 2. Rebuild daily snapshots from all live trades
    const { data: allTrades, error: fetchError } = await adminSupabase
      .from('trades')
      .select('exit_time, pnl_pct')
      .eq('source', 'live')
      .order('exit_time', { ascending: true });

    if (fetchError) {
      console.error('[Webhook] Failed to fetch trades for snapshots:', fetchError);
      return NextResponse.json(
        { error: 'Trade stored but snapshot rebuild failed', detail: fetchError.message },
        { status: 500 }
      );
    }

    // Group trades by exit date
    const tradesByDate: Record<string, number[]> = {};
    for (const t of allTrades || []) {
      const exitDate = String(t.exit_time).slice(0, 10);
      if (!tradesByDate[exitDate]) tradesByDate[exitDate] = [];
      tradesByDate[exitDate].push(Number(t.pnl_pct));
    }

    // Find date range: session start through latest trade exit
    const sessionStartDate = '2026-02-11';
    const sortedDates = Object.keys(tradesByDate).sort();
    const lastTradeDate = sortedDates[sortedDates.length - 1] || sessionStartDate;

    // Build snapshots for every day in range
    const snapshots: Array<Record<string, unknown>> = [];
    let balance = STARTING_BALANCE;
    const current = new Date(sessionStartDate + 'T00:00:00Z');
    const end = new Date(lastTradeDate + 'T00:00:00Z');

    while (current <= end) {
      const dateStr = current.toISOString().slice(0, 10);
      const dayPnls = tradesByDate[dateStr] || [];

      const openBalance = balance;
      const dailyPnlPct = dayPnls.reduce((sum, p) => sum + p, 0);
      balance = openBalance * (1 + dailyPnlPct / 100);
      const dailyPnl = balance - openBalance;

      snapshots.push({
        id: `snap_${dateStr.replace(/-/g, '')}`,
        market_id: MARKET_ID,
        date: dateStr,
        open_balance: Math.round(openBalance * 100) / 100,
        close_balance: Math.round(balance * 100) / 100,
        daily_pnl: Math.round(dailyPnl * 100) / 100,
        daily_pnl_pct: Math.round(dailyPnlPct * 10000) / 10000,
        num_trades: dayPnls.length,
        source: 'live',
      });

      current.setUTCDate(current.getUTCDate() + 1);
    }

    // Delete existing live snapshots and insert fresh ones
    const { error: deleteError } = await adminSupabase
      .from('daily_snapshots')
      .delete()
      .eq('source', 'live');

    if (deleteError) {
      console.error('[Webhook] Snapshot delete error:', deleteError);
    }

    if (snapshots.length > 0) {
      const { error: snapError } = await adminSupabase
        .from('daily_snapshots')
        .insert(snapshots);

      if (snapError) {
        console.error('[Webhook] Snapshot insert error:', snapError);
        return NextResponse.json(
          { error: 'Trade stored but snapshot insert failed', detail: snapError.message },
          { status: 500 }
        );
      }
    }

    console.log(`[Webhook] Rebuilt ${snapshots.length} daily snapshots. Balance: $${balance.toFixed(2)}`);

    return NextResponse.json({
      success: true,
      trade_id: tradeId,
      balance: Math.round(balance * 100) / 100,
    });
  } catch (error) {
    console.error('[Webhook] Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
