import { NextResponse } from 'next/server';
import { supabase } from '@/lib/db';
import { mockOptimizationRuns } from '@/lib/mock-data';

// Only these metric keys are safe to expose from distributions JSONB
const SAFE_DISTRIBUTION_KEYS = ['sharpe_ratio', 'pnl_pct', 'max_drawdown', 'win_rate'];

export async function GET() {
  if (supabase) {
    try {
      // Explicit column selection — never use select('*') on optimization_runs
      const { data, error } = await supabase
        .from('optimization_runs')
        .select('id, name, run_date, symbol, interval, total_combinations, passed_constraints, best_sharpe, best_roi_pct, best_drawdown_pct, backtest_start, backtest_end, num_candles, distributions')
        .order('run_date', { ascending: false });

      if (!error && data && data.length > 0) {
        // Whitelist distributions keys to prevent accidental IP leakage
        const sanitized = data.map((run: Record<string, unknown>) => {
          if (run.distributions && typeof run.distributions === 'object') {
            const dist = run.distributions as Record<string, unknown>;
            const filtered: Record<string, unknown> = {};
            for (const key of SAFE_DISTRIBUTION_KEYS) {
              if (key in dist) filtered[key] = dist[key];
            }
            return { ...run, distributions: filtered };
          }
          return run;
        });
        return NextResponse.json(sanitized);
      }
    } catch (e) {
      console.error('Error fetching optimization runs from Supabase:', e);
    }
  }

  // Fallback to mock data
  return NextResponse.json(mockOptimizationRuns);
}
