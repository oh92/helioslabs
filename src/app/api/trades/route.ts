import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/db';
import { mockTrades } from '@/lib/mock-data';
import { toStrategyKey } from '@/lib/strategy';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const limit = parseInt(searchParams.get('limit') || '20', 10);
  const source = searchParams.get('source') || 'backtest';
  const strategy = toStrategyKey(searchParams.get('strategy'));

  if (supabase) {
    try {
      // Explicit column selection — never use select('*') on trades (IP protection)
      let query = supabase
        .from('trades')
        .select('id, session_id, entry_time, exit_time, direction, entry_price, exit_price, pnl_pct, exit_reason, created_at, source, strategy_name')
        .eq('source', source)
        .order('exit_time', { ascending: false })
        .limit(limit);

      // Only apply 1-hour delay for live data
      if (source === 'live') {
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
        query = query.lt('exit_time', oneHourAgo);
        // Split live trades by strategy (funding vs volume)
        if (strategy) query = query.eq('strategy_name', strategy);
      }

      const { data, error } = await query;

      if (!error && data && data.length > 0) {
        return NextResponse.json(data);
      }
      // Live data is real or empty — never show mock trades for a real strategy tab
      if (source === 'live') return NextResponse.json([]);
    } catch (e) {
      console.error('Error fetching trades from Supabase:', e);
      if (source === 'live') return NextResponse.json([]);
    }
  }

  // Fallback to mock data (backtest / Supabase unconfigured)
  const trades = mockTrades.slice(0, limit);
  return NextResponse.json(trades);
}
