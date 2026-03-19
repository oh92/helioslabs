import { createHash } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { adminSupabase } from '@/lib/db';

const SESSION_ID = 'sess_live_proscore2_15m';
const MARKET_ID = 'mkt_btc_001';
const STARTING_BALANCE = 10000; // Normalized display balance — not real account size

function deterministicId(entryTime: string, direction: string): string {
  const raw = `${entryTime}:${direction}:live`;
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

    // Upsert the trade — strip sensitive fields, only store safe data
    // pnl_pct should be account-level (from trade_recorder.py) not price-level
    const trade = {
      id: tradeId,
      session_id: SESSION_ID,
      entry_time: entryTime + '+00:00',
      exit_time: String(tradeData.exit_time).trim() + '+00:00',
      direction,
      entry_price: Number(tradeData.entry_price),
      exit_price: Number(tradeData.exit_price),
      size: null,       // Never store — reveals account size
      pnl: null,        // Never store — reveals account size
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
        { error: 'Failed to store trade' },
        { status: 500 }
      );
    }

    console.log(`[Webhook] Trade ${tradeId}: ${direction} (${trade.pnl_pct}%)`);

    // Rebuild daily snapshots from all live trades
    const { data: allTrades, error: fetchError } = await adminSupabase
      .from('trades')
      .select('exit_time, pnl_pct')
      .eq('source', 'live')
      .order('exit_time', { ascending: true });

    if (fetchError) {
      console.error('[Webhook] Snapshot rebuild failed:', fetchError);
      return NextResponse.json(
        { error: 'Trade stored but snapshot rebuild failed' },
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

    // Date range from first trade to latest
    const sortedDates = Object.keys(tradesByDate).sort();
    if (sortedDates.length === 0) {
      return NextResponse.json({ success: true, trade_id: tradeId });
    }

    const firstDate = new Date(sortedDates[0] + 'T00:00:00Z');
    const lastDate = new Date(sortedDates[sortedDates.length - 1] + 'T00:00:00Z');

    // Day before first trade as starting snapshot
    const dayZero = new Date(firstDate);
    dayZero.setUTCDate(dayZero.getUTCDate() - 1);

    // Build snapshots using normalized display balance
    const snapshots: Array<Record<string, unknown>> = [];
    let balance = STARTING_BALANCE;

    // Day-zero snapshot
    const dayZeroStr = dayZero.toISOString().slice(0, 10);
    snapshots.push({
      id: `snap_live_${dayZeroStr.replace(/-/g, '')}`,
      market_id: MARKET_ID,
      date: dayZeroStr,
      open_balance: STARTING_BALANCE,
      close_balance: STARTING_BALANCE,
      daily_pnl: 0,
      daily_pnl_pct: 0,
      num_trades: 0,
      source: 'live',
    });

    const current = new Date(firstDate);
    while (current <= lastDate) {
      const dateStr = current.toISOString().slice(0, 10);
      const dayPnls = tradesByDate[dateStr] || [];

      const openBalance = balance;
      for (const p of dayPnls) {
        balance *= (1 + p / 100);
      }
      const dailyPnl = balance - openBalance;
      const dailyPnlPct = openBalance > 0 ? (dailyPnl / openBalance) * 100 : 0;

      snapshots.push({
        id: `snap_live_${dateStr.replace(/-/g, '')}`,
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

    // Replace all live snapshots
    await adminSupabase
      .from('daily_snapshots')
      .delete()
      .eq('source', 'live');

    if (snapshots.length > 0) {
      const { error: snapError } = await adminSupabase
        .from('daily_snapshots')
        .insert(snapshots);

      if (snapError) {
        console.error('[Webhook] Snapshot insert error:', snapError);
      }
    }

    // Response — no balance or sensitive data
    return NextResponse.json({
      success: true,
      trade_id: tradeId,
    });
  } catch (error) {
    console.error('[Webhook] Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
