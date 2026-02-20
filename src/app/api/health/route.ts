import { NextResponse } from 'next/server';
import { supabase } from '@/lib/db';
import { mockSystemHealth } from '@/lib/mock-data';
import type { SystemHealth } from '@/lib/types';

export async function GET() {
  if (supabase) {
    try {
      // Get earliest and latest live trade timestamps
      const [tradesResult, marketsResult] = await Promise.all([
        supabase
          .from('trades')
          .select('entry_time, exit_time')
          .eq('source', 'live')
          .order('entry_time', { ascending: true })
          .limit(1)
          .single(),
        supabase
          .from('markets')
          .select('id')
          .eq('is_active', true),
      ]);

      // Also get the most recent live trade by exit_time
      const latestTradeResult = await supabase
        .from('trades')
        .select('exit_time')
        .eq('source', 'live')
        .order('exit_time', { ascending: false })
        .limit(1)
        .single();

      if (tradesResult.data && latestTradeResult.data) {
        const earliestEntry = new Date(tradesResult.data.entry_time).getTime();
        const latestExit = new Date(latestTradeResult.data.exit_time).getTime();
        const now = Date.now();

        const uptimeHours = (now - earliestEntry) / 3_600_000;
        const hoursSinceLastTrade = (now - latestExit) / 3_600_000;

        let status: SystemHealth['status'] = 'healthy';
        if (hoursSinceLastTrade > 168) {
          status = 'error';
        } else if (hoursSinceLastTrade > 72) {
          status = 'warning';
        }

        const health: SystemHealth = {
          status,
          last_check: new Date().toISOString(),
          last_trade: latestTradeResult.data.exit_time,
          markets_active: marketsResult.data?.length ?? 0,
          uptime_hours: Math.round(uptimeHours * 10) / 10,
        };

        return NextResponse.json(health);
      }
    } catch (e) {
      console.error('Error fetching health from Supabase:', e);
    }
  }

  // Fallback to mock data
  return NextResponse.json(mockSystemHealth);
}
