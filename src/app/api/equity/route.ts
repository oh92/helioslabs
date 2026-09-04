import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/db';
import { mockEquityData } from '@/lib/mock-data';
import { toStrategyKey } from '@/lib/strategy';
import type { EquityDataPoint } from '@/lib/types';

const STARTING_BALANCE = 10000; // Normalized display balance (matches webhook)

// Linearly interpolate a price from known trade price points
function interpolatePrice(
  points: { time: number; price: number }[],
  targetTime: number
): number {
  if (points.length === 0) return 0;
  if (targetTime <= points[0].time) return points[0].price;
  if (targetTime >= points[points.length - 1].time) return points[points.length - 1].price;

  let lo = 0, hi = points.length - 1;
  while (lo < hi - 1) {
    const mid = Math.floor((lo + hi) / 2);
    if (points[mid].time <= targetTime) lo = mid;
    else hi = mid;
  }

  const t = (targetTime - points[lo].time) / (points[hi].time - points[lo].time);
  return points[lo].price + t * (points[hi].price - points[lo].price);
}

type BenchTrade = { entry_price: number; exit_price: number; entry_time: string; exit_time: string };

// Buy-and-hold benchmark for the strategy's own market, aligned to the equity dates
function withBenchmark(equityData: EquityDataPoint[], trades: BenchTrade[] | null): EquityDataPoint[] {
  if (!trades || trades.length < 2 || equityData.length === 0) return equityData;

  const pricePoints: { time: number; price: number }[] = [];
  for (const t of trades) {
    if (t.entry_time && t.entry_price) pricePoints.push({ time: new Date(t.entry_time).getTime(), price: t.entry_price });
    if (t.exit_time && t.exit_price) pricePoints.push({ time: new Date(t.exit_time).getTime(), price: t.exit_price });
  }
  pricePoints.sort((a, b) => a.time - b.time);
  if (pricePoints.length < 2) return equityData;

  const startingBalance = equityData[0].balance;
  const day0Time = new Date(equityData[0].timestamp).getTime();
  const startingPrice = interpolatePrice(pricePoints, day0Time);
  if (startingPrice <= 0) return equityData;

  return equityData.map((point) => {
    const price = interpolatePrice(pricePoints, new Date(point.timestamp).getTime());
    return {
      ...point,
      benchmark_balance: Math.round((startingBalance * (price / startingPrice)) * 100) / 100,
    };
  });
}

// Build a per-day equity curve directly from trades (fallback when no snapshots
// exist yet, e.g. right after the strategy-split migration clears old ones).
function equityFromTrades(trades: { exit_time: string; pnl_pct: number }[]): EquityDataPoint[] {
  const byDate: Record<string, number[]> = {};
  for (const t of trades) {
    const d = String(t.exit_time).slice(0, 10);
    (byDate[d] ||= []).push(Number(t.pnl_pct));
  }
  const dates = Object.keys(byDate).sort();
  if (dates.length === 0) return [];

  const out: EquityDataPoint[] = [];
  let balance = STARTING_BALANCE;
  let peak = STARTING_BALANCE;

  // Day-zero baseline
  const dayZero = new Date(dates[0] + 'T00:00:00Z');
  dayZero.setUTCDate(dayZero.getUTCDate() - 1);
  out.push({ timestamp: dayZero.toISOString().slice(0, 10) + 'T00:00:00Z', balance, drawdown_pct: 0, daily_pnl_pct: 0 });

  const current = new Date(dates[0] + 'T00:00:00Z');
  const lastDate = new Date(dates[dates.length - 1] + 'T00:00:00Z');
  while (current <= lastDate) {
    const dateStr = current.toISOString().slice(0, 10);
    const open = balance;
    for (const p of byDate[dateStr] || []) balance *= 1 + p / 100;
    peak = Math.max(peak, balance);
    out.push({
      timestamp: dateStr + 'T00:00:00Z',
      balance: Math.round(balance * 100) / 100,
      drawdown_pct: Math.round(((peak - balance) / peak) * 10000) / 100,
      daily_pnl_pct: open > 0 ? Math.round(((balance - open) / open) * 10000) / 100 : 0,
    });
    current.setUTCDate(current.getUTCDate() + 1);
  }
  return out;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const days = parseInt(searchParams.get('days') || '800', 10);
  const source = searchParams.get('source') || 'backtest';
  const strategy = source === 'live' ? toStrategyKey(searchParams.get('strategy')) : null;

  if (supabase) {
    try {
      // Per-strategy benchmark trades (own market: BTC for funding, HYPE for volume)
      let tradesQuery = supabase
        .from('trades')
        .select('entry_price, exit_price, entry_time, exit_time, pnl_pct')
        .eq('source', source)
        .order('exit_time', { ascending: true });
      if (strategy) tradesQuery = tradesQuery.eq('strategy_name', strategy);
      const { data: trades } = await tradesQuery;

      // Per-strategy daily snapshots
      let snapQuery = supabase
        .from('daily_snapshots')
        .select('date, close_balance, daily_pnl_pct')
        .eq('source', source)
        .order('date', { ascending: true })
        .limit(days);
      if (strategy) snapQuery = snapQuery.eq('strategy_name', strategy);
      const { data, error } = await snapQuery;

      if (!error && data && data.length > 0) {
        let peak = 0;
        const equityData = data.map((snap: { date: string; close_balance: number; daily_pnl_pct: number }) => {
          peak = Math.max(peak, snap.close_balance);
          const drawdown = ((peak - snap.close_balance) / peak) * 100;
          return {
            timestamp: snap.date + 'T00:00:00Z',
            balance: snap.close_balance,
            drawdown_pct: Math.round(drawdown * 100) / 100,
            daily_pnl_pct: Math.round(snap.daily_pnl_pct * 100) / 100,
          };
        });
        return NextResponse.json(withBenchmark(equityData, trades as BenchTrade[] | null));
      }

      // Fallback: no snapshots for this strategy yet — derive from trades
      if (strategy && trades && trades.length > 0) {
        const equityData = equityFromTrades(trades as { exit_time: string; pnl_pct: number }[]);
        if (equityData.length > 0) {
          return NextResponse.json(withBenchmark(equityData, trades as BenchTrade[]));
        }
      }
      // Live is real or empty — never show mock equity for a real strategy tab
      if (source === 'live') return NextResponse.json([]);
    } catch (e) {
      console.error('Error fetching equity data from Supabase:', e);
      if (source === 'live') return NextResponse.json([]);
    }
  }

  // Fallback to mock data (backtest / Supabase unconfigured)
  const data = mockEquityData.slice(-days);
  return NextResponse.json(data);
}
