import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/db';
import { mockTrades } from '@/lib/mock-data';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const limit = parseInt(searchParams.get('limit') || '20', 10);
  const source = searchParams.get('source') || 'backtest';

  if (supabase) {
    try {
      // Explicit column selection — never use select('*') on trades (IP protection)
      let query = supabase
        .from('trades')
        .select('id, session_id, entry_time, exit_time, direction, entry_price, exit_price, pnl_pct, exit_reason, created_at, source')
        .eq('source', source)
        .order('exit_time', { ascending: false })
        .limit(limit);

      // Only apply 1-hour delay for live data
      if (source === 'live') {
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
        query = query.lt('exit_time', oneHourAgo);
      }

      const { data, error } = await query;

      if (!error && data && data.length > 0) {
        return NextResponse.json(data);
      }
    } catch (e) {
      console.error('Error fetching trades from Supabase:', e);
    }
  }

  // Fallback to mock data
  const trades = mockTrades.slice(0, limit);
  return NextResponse.json(trades);
}
