import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/db';
import { mockPerformance } from '@/lib/mock-data';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const source = searchParams.get('source') || 'backtest';

  if (supabase) {
    try {
      // Explicit column selection — never use select('*') on trades (IP protection)
      let query = supabase
        .from('trades')
        .select('id, pnl_pct, exit_time, entry_price, exit_price')
        .eq('source', source)
        .order('exit_time', { ascending: true });

      // Only apply 1-hour delay for live data
      if (source === 'live') {
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
        query = query.lt('exit_time', oneHourAgo);
      }

      const { data: trades, error } = await query;

      if (!error && trades && trades.length > 0) {
        const totalTrades = trades.length;
        const wins = trades.filter((t: { pnl_pct: number }) => t.pnl_pct > 0);
        const losses = trades.filter((t: { pnl_pct: number }) => t.pnl_pct <= 0);

        const winRate = (wins.length / totalTrades) * 100;

        const avgWinPct = wins.length > 0
          ? wins.reduce((sum: number, t: { pnl_pct: number }) => sum + t.pnl_pct, 0) / wins.length
          : 0;

        const avgLossPct = losses.length > 0
          ? losses.reduce((sum: number, t: { pnl_pct: number }) => sum + t.pnl_pct, 0) / losses.length
          : 0;

        // Cumulative return and max drawdown from trade-level account pnl_pct
        let cumReturn = 1;
        let peak = 1;
        let maxDrawdown = 0;
        for (const t of trades) {
          cumReturn *= (1 + t.pnl_pct / 100);
          peak = Math.max(peak, cumReturn);
          const dd = ((peak - cumReturn) / peak) * 100;
          maxDrawdown = Math.max(maxDrawdown, dd);
        }
        const sessionPnlPct = (cumReturn - 1) * 100;

        // Get market info
        const { data: market } = await supabase
          .from('markets')
          .select('id, symbol, interval, is_active')
          .eq('id', 'mkt_btc_001')
          .single();

        // For backtest, get headline metrics from optimization_runs (authoritative)
        // and session info for date range
        let backtestStart: string | undefined;
        let backtestEnd: string | undefined;
        let numCandles: number | undefined;
        let sharpeRatio: number | undefined;
        let headlineRoi: number | undefined;
        let headlineDrawdown: number | undefined;

        if (source === 'backtest') {
          const { data: sessions } = await supabase
            .from('trading_sessions')
            .select('id, started_at, ended_at')
            .eq('mode', 'backtest')
            .limit(1);

          if (sessions && sessions.length > 0) {
            backtestStart = sessions[0].started_at;
            backtestEnd = sessions[0].ended_at;
          }

          // Use optimization_runs for accurate headline metrics
          const { data: optRuns } = await supabase
            .from('optimization_runs')
            .select('best_sharpe, best_roi_pct, best_drawdown_pct, num_candles')
            .order('run_date', { ascending: false })
            .limit(1);

          if (optRuns && optRuns.length > 0) {
            sharpeRatio = optRuns[0].best_sharpe;
            headlineRoi = optRuns[0].best_roi_pct;
            headlineDrawdown = optRuns[0].best_drawdown_pct;
            if (!numCandles && optRuns[0].num_candles) numCandles = optRuns[0].num_candles;
          }
        }

        const response: Record<string, unknown> = {
          market: market || { id: 'mkt_btc_001', symbol: 'BTC-USD', interval: '15m', is_active: true },
          current_position: 'FLAT',
          session_pnl: 0,
          // Use optimization headline metrics for backtest, computed metrics for live
          session_pnl_pct: headlineRoi != null ? Math.round(headlineRoi * 100) / 100 : Math.round(sessionPnlPct * 100) / 100,
          total_trades: totalTrades,
          win_rate: Math.round(winRate * 10) / 10,
          max_drawdown_pct: headlineDrawdown != null ? Math.round(headlineDrawdown * 100) / 100 : Math.round(maxDrawdown * 100) / 100,
          avg_win_pct: Math.round(avgWinPct * 100) / 100,
          avg_loss_pct: Math.round(avgLossPct * 100) / 100,
        };

        // Benchmark: BTC buy-and-hold from first trade entry to last trade exit
        const firstTrade = trades[0];
        const lastTrade = trades[trades.length - 1];
        if (firstTrade.entry_price && lastTrade.exit_price) {
          const benchmarkReturn = ((lastTrade.exit_price - firstTrade.entry_price) / firstTrade.entry_price) * 100;
          response.benchmark_return_pct = Math.round(benchmarkReturn * 100) / 100;
        }

        if (sharpeRatio != null) response.sharpe_ratio = Math.round(sharpeRatio * 10000) / 10000;
        if (backtestStart) response.backtest_start = backtestStart;
        if (backtestEnd) response.backtest_end = backtestEnd;
        if (numCandles) response.num_candles = numCandles;

        return NextResponse.json(response);
      }
    } catch (e) {
      console.error('Error computing performance from Supabase:', e);
    }
  }

  // Fallback to mock data
  return NextResponse.json(mockPerformance);
}
