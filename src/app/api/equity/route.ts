import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/db';
import { mockEquityData } from '@/lib/mock-data';

// Linearly interpolate BTC price from known trade price points
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

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const days = parseInt(searchParams.get('days') || '365', 10);
  const source = searchParams.get('source') || 'backtest';

  if (supabase) {
    try {
      // Explicit column selection — never expose daily_pnl (dollar amount)
      const { data, error } = await supabase
        .from('daily_snapshots')
        .select('date, close_balance, daily_pnl_pct')
        .eq('source', source)
        .order('date', { ascending: true })
        .limit(days);

      if (!error && data && data.length > 0) {
        // Transform daily_snapshots into EquityDataPoint format
        let peak = 0;
        let equityData = data.map((snap: { date: string; close_balance: number; daily_pnl_pct: number }) => {
          peak = Math.max(peak, snap.close_balance);
          const drawdown = ((peak - snap.close_balance) / peak) * 100;
          return {
            timestamp: snap.date + 'T00:00:00Z',
            balance: snap.close_balance,
            drawdown_pct: Math.round(drawdown * 100) / 100,
            daily_pnl_pct: Math.round(snap.daily_pnl_pct * 100) / 100,
          };
        });

        // Compute BTC buy-and-hold benchmark from trade entry/exit prices
        const { data: trades } = await supabase
          .from('trades')
          .select('entry_price, exit_price, entry_time, exit_time')
          .eq('source', source)
          .order('exit_time', { ascending: true });

        if (trades && trades.length >= 2) {
          // Build price timeline from all trade entry/exit points
          const pricePoints: { time: number; price: number }[] = [];
          for (const t of trades) {
            if (t.entry_time && t.entry_price) {
              pricePoints.push({ time: new Date(t.entry_time).getTime(), price: t.entry_price });
            }
            if (t.exit_time && t.exit_price) {
              pricePoints.push({ time: new Date(t.exit_time).getTime(), price: t.exit_price });
            }
          }
          pricePoints.sort((a, b) => a.time - b.time);

          if (pricePoints.length >= 2) {
            const startingBalance = equityData[0].balance;
            const day0Time = new Date(equityData[0].timestamp).getTime();
            const startingBtcPrice = interpolatePrice(pricePoints, day0Time);

            equityData = equityData.map((point) => {
              const pointTime = new Date(point.timestamp).getTime();
              const btcPrice = interpolatePrice(pricePoints, pointTime);
              return {
                ...point,
                benchmark_balance: Math.round((startingBalance * (btcPrice / startingBtcPrice)) * 100) / 100,
              };
            });
          }
        }

        return NextResponse.json(equityData);
      }
    } catch (e) {
      console.error('Error fetching equity data from Supabase:', e);
    }
  }

  // Fallback to mock data
  const data = mockEquityData.slice(-days);
  return NextResponse.json(data);
}
