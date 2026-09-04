import { createHash } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { adminSupabase } from '@/lib/db';
import { categorizeStrategy, type StrategyKey } from '@/lib/strategy';

const SESSION_ID = 'sess_live_proscore2_15m';
const MARKET_ID = 'mkt_btc_001';
const STARTING_BALANCE = 10000; // Normalized display balance — not real account size

// Deterministic id includes the strategy so two strategies closing a trade on
// the same bar (same entry_time + direction) don't collide and overwrite.
function deterministicId(entryTime: string, direction: string, strategy: StrategyKey): string {
  const raw = `${entryTime}:${direction}:${strategy}:live`;
  return `trd_${createHash('sha256').update(raw).digest('hex').slice(0, 12)}`;
}

interface SnapshotTrade {
  exit_time: string;
  pnl_pct: number;
  strategy_name: string | null;
}

// Build per-strategy daily equity snapshots from all live trades. Each strategy
// gets its own normalized curve starting at STARTING_BALANCE — they are separate
// accounts on separate venues and must never be compounded together.
function buildSnapshots(trades: SnapshotTrade[]): Array<Record<string, unknown>> {
  const byStrategy: Record<string, SnapshotTrade[]> = {};
  for (const t of trades) {
    const key = t.strategy_name || categorizeStrategy(t.strategy_name);
    (byStrategy[key] ||= []).push(t);
  }

  const snapshots: Array<Record<string, unknown>> = [];

  for (const [strategy, stTrades] of Object.entries(byStrategy)) {
    const tradesByDate: Record<string, number[]> = {};
    for (const t of stTrades) {
      const exitDate = String(t.exit_time).slice(0, 10);
      (tradesByDate[exitDate] ||= []).push(Number(t.pnl_pct));
    }

    const sortedDates = Object.keys(tradesByDate).sort();
    if (sortedDates.length === 0) continue;

    const firstDate = new Date(sortedDates[0] + 'T00:00:00Z');
    const lastDate = new Date(sortedDates[sortedDates.length - 1] + 'T00:00:00Z');

    const dayZero = new Date(firstDate);
    dayZero.setUTCDate(dayZero.getUTCDate() - 1);
    const dayZeroStr = dayZero.toISOString().slice(0, 10);

    snapshots.push({
      id: `snap_live_${strategy}_${dayZeroStr.replace(/-/g, '')}`,
      market_id: MARKET_ID,
      strategy_name: strategy,
      date: dayZeroStr,
      open_balance: STARTING_BALANCE,
      close_balance: STARTING_BALANCE,
      daily_pnl: 0,
      daily_pnl_pct: 0,
      num_trades: 0,
      source: 'live',
    });

    let balance = STARTING_BALANCE;
    const current = new Date(firstDate);
    while (current <= lastDate) {
      const dateStr = current.toISOString().slice(0, 10);
      const dayPnls = tradesByDate[dateStr] || [];

      const openBalance = balance;
      for (const p of dayPnls) balance *= 1 + p / 100;
      const dailyPnl = balance - openBalance;
      const dailyPnlPct = openBalance > 0 ? (dailyPnl / openBalance) * 100 : 0;

      snapshots.push({
        id: `snap_live_${strategy}_${dateStr.replace(/-/g, '')}`,
        market_id: MARKET_ID,
        strategy_name: strategy,
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
  }

  return snapshots;
}

export async function POST(request: NextRequest) {
  // Validate webhook secret
  const webhookSecret = request.headers.get('X-Webhook-Secret');
  const expectedSecret = process.env.WEBHOOK_SECRET;

  if (!expectedSecret || webhookSecret !== expectedSecret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!adminSupabase) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
  }

  let tradeData;
  try {
    tradeData = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  // Validate required fields
  const required = ['entry_time', 'type', 'entry_price', 'exit_time', 'exit_price', 'pnl_pct', 'exit_reason'];
  for (const field of required) {
    if (tradeData[field] === undefined || tradeData[field] === null) {
      return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 });
    }
  }

  try {
    const entryTime = String(tradeData.entry_time).trim();
    const direction = String(tradeData.type).trim();
    // Categorize into a stable key from the raw config name + market. The raw
    // strategy name is IP-sensitive and never stored.
    const strategy = categorizeStrategy(tradeData.strategy, tradeData.market);
    const tradeId = deterministicId(entryTime, direction, strategy);

    // Upsert the trade — strip sensitive fields, only store safe data.
    const trade = {
      id: tradeId,
      session_id: SESSION_ID,
      strategy_name: strategy,
      entry_time: entryTime + '+00:00',
      exit_time: String(tradeData.exit_time).trim() + '+00:00',
      direction,
      entry_price: Number(tradeData.entry_price),
      exit_price: Number(tradeData.exit_price),
      size: null, // Never store — reveals account size
      pnl: null, // Never store — reveals account size
      pnl_pct: Math.round(Number(tradeData.pnl_pct) * 10000) / 10000,
      exit_reason: String(tradeData.exit_reason).trim(),
      source: 'live',
    };

    const { error: tradeError } = await adminSupabase
      .from('trades')
      .upsert(trade, { onConflict: 'id' });

    if (tradeError) {
      console.error('[Webhook] Trade upsert error:', tradeError);
      return NextResponse.json({ error: 'Failed to store trade' }, { status: 500 });
    }

    console.log(`[Webhook] Trade ${tradeId}: ${strategy} ${direction} (${trade.pnl_pct}%)`);

    // Rebuild per-strategy daily snapshots from all live trades
    const { data: allTrades, error: fetchError } = await adminSupabase
      .from('trades')
      .select('exit_time, pnl_pct, strategy_name')
      .eq('source', 'live')
      .order('exit_time', { ascending: true });

    if (fetchError) {
      console.error('[Webhook] Snapshot rebuild failed:', fetchError);
      return NextResponse.json({ error: 'Trade stored but snapshot rebuild failed' }, { status: 500 });
    }

    const snapshots = buildSnapshots((allTrades || []) as SnapshotTrade[]);

    // Replace all live snapshots
    await adminSupabase.from('daily_snapshots').delete().eq('source', 'live');

    if (snapshots.length > 0) {
      const { error: snapError } = await adminSupabase.from('daily_snapshots').insert(snapshots);
      if (snapError) {
        console.error('[Webhook] Snapshot insert error:', snapError);
      }
    }

    return NextResponse.json({ success: true, trade_id: tradeId, strategy });
  } catch (error) {
    console.error('[Webhook] Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
