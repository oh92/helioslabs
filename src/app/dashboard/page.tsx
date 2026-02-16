'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { EquityCurve } from '@/components/charts/EquityCurve';
import { DailyPnLChart } from '@/components/charts/DailyPnLChart';
import { ReturnDistribution } from '@/components/charts/ReturnDistribution';
import { WinLossStreaks } from '@/components/charts/WinLossStreaks';
import { TradeDurationStats } from '@/components/charts/TradeDurationStats';
import { DistributionBars } from '@/components/charts/DistributionBars';
import { SectionHeading } from '@/components/display/SectionHeading';
import { MetricCard } from '@/components/display/MetricCard';
import { ViewToggle } from '@/components/display/ViewToggle';
import { SystemStatus } from '@/components/display/SystemStatus';
import { MarketCard } from '@/components/display/MarketCard';
import { mockSystemHealth } from '@/lib/mock-data';
import { formatPrice, formatPnlPct, formatTradeTime, formatExitReason, formatBalance } from '@/lib/format';
import type { Trade, EquityDataPoint, MarketPerformance, OptimizationRun, OptimizationDistributions } from '@/lib/types';

type ViewMode = 'backtest' | 'live';

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading...</div>}>
      <DashboardContent />
    </Suspense>
  );
}

function DashboardContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialView = (searchParams.get('view') as ViewMode) || 'backtest';

  const [view, setView] = useState<ViewMode>(initialView);
  const [trades, setTrades] = useState<Trade[] | null>(null);
  const [allTrades, setAllTrades] = useState<Trade[] | null>(null);
  const [equityData, setEquityData] = useState<EquityDataPoint[] | null>(null);
  const [performance, setPerformance] = useState<MarketPerformance | null>(null);
  const [optimization, setOptimization] = useState<OptimizationRun[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [showBenchmark, setShowBenchmark] = useState(true);

  const fetchData = useCallback(async (source: ViewMode) => {
    setLoading(true);
    try {
      const fetches = [
        fetch(`/api/trades?limit=10&source=${source}`),
        fetch(`/api/equity?source=${source}`),
        fetch(`/api/performance?source=${source}`),
        fetch(`/api/trades?limit=500&source=${source}`),
      ];

      if (source === 'backtest') {
        fetches.push(fetch('/api/optimization'));
      }

      const results = await Promise.all(fetches);

      if (results[0].ok) setTrades(await results[0].json());
      if (results[1].ok) setEquityData(await results[1].json());
      if (results[2].ok) setPerformance(await results[2].json());
      if (results[3].ok) setAllTrades(await results[3].json());
      if (source === 'backtest' && results[4]?.ok) setOptimization(await results[4].json());
    } catch (e) {
      console.error('Error fetching dashboard data:', e);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData(view);
  }, [view, fetchData]);

  const switchView = (newView: ViewMode) => {
    setView(newView);
    router.replace(`/dashboard?view=${newView}`, { scroll: false });
  };

  const totalPnlPct = equityData && equityData.length >= 2
    ? ((equityData[equityData.length - 1].balance - equityData[0].balance) / equityData[0].balance) * 100
    : 0;

  const recentTrades = trades
    ? [...trades].sort((a, b) => new Date(b.exit_time).getTime() - new Date(a.exit_time).getTime())
    : [];

  const latestBalance = equityData && equityData.length > 0
    ? equityData[equityData.length - 1].balance
    : 0;

  const opt = optimization && optimization.length > 0 ? optimization[0] : null;

  // Check if we have enough trades for analytics sections
  const hasEnoughTrades = allTrades && allTrades.length > 5;

  return (
    <div>
      <div className="mx-auto max-w-6xl px-6 py-12">
        {/* Page Title + Toggle */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
              <p className="mt-2 text-muted-foreground">Trading performance and analytics</p>
            </div>
            <SystemStatus health={mockSystemHealth} />
          </div>

          {/* Tab Toggle */}
          <ViewToggle
            view={view}
            onViewChange={switchView}
            size="md"
            labels={{ backtest: 'Backtest Results', live: 'Live Trading' }}
            className="w-fit"
          />
        </div>

        {loading ? (
          <div className="text-center py-24 text-muted-foreground">Loading {view} data...</div>
        ) : (
          <>
            {/* Backtest Context Banner */}
            {view === 'backtest' && performance && (
              <div className="mb-8 px-4 py-3 border border-border rounded-lg bg-card/30 text-sm text-muted-foreground">
                ProScore2 | BTC-USD 15m | Jul 2025 – Jan 2026 | 20,240 candles
              </div>
            )}

            {/* Performance Metrics */}
            <section className="mb-12">
              <SectionHeading className="mb-6">Performance Metrics</SectionHeading>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                <MetricCard
                  variant="bordered"
                  label="Total Return"
                  value={formatPnlPct(performance?.session_pnl_pct ?? totalPnlPct)}
                  positive={(performance?.session_pnl_pct ?? totalPnlPct) > 0}
                  negative={(performance?.session_pnl_pct ?? totalPnlPct) < 0}
                />
                <MetricCard
                  variant="bordered"
                  label="Win Rate"
                  value={performance ? `${performance.win_rate.toFixed(1)}%` : '—'}
                  positive={(performance?.win_rate || 0) > 50}
                />
                <MetricCard
                  variant="bordered"
                  label="Sharpe"
                  value={performance?.sharpe_ratio?.toFixed(2) || '—'}
                  positive={(performance?.sharpe_ratio || 0) > 1}
                />
                <MetricCard
                  variant="bordered"
                  label="Max Drawdown"
                  value={performance ? `-${performance.max_drawdown_pct.toFixed(1)}%` : '—'}
                  negative
                />
                <MetricCard
                  variant="bordered"
                  label="Avg Win"
                  value={performance && performance.avg_win_pct > 0 ? `+${performance.avg_win_pct.toFixed(2)}%` : '—'}
                  positive={!!performance && performance.avg_win_pct > 0}
                />
                <MetricCard
                  variant="bordered"
                  label="Avg Loss"
                  value={performance && performance.avg_loss_pct < 0 ? `${performance.avg_loss_pct.toFixed(2)}%` : '—'}
                  negative={!!performance && performance.avg_loss_pct < 0}
                />
              </div>
            </section>

            {/* Market Cards */}
            <section className="mb-12">
              <SectionHeading className="mb-6">
                {view === 'backtest' ? 'Backtest Summary' : 'Active Markets'}
              </SectionHeading>
              <div className="grid gap-6 md:grid-cols-2">
                <MarketCard
                  symbol="BTC-USD"
                  position={view === 'live' ? (performance?.current_position || 'FLAT') : 'FLAT'}
                  sessionPnlPct={performance?.session_pnl_pct || totalPnlPct}
                  totalTrades={performance?.total_trades || 0}
                  isBacktest={view === 'backtest'}
                />
              </div>
            </section>

            {/* Equity Curve */}
            <section className="mb-12">
              <div className="flex items-baseline justify-between mb-6">
                <div className="flex items-center gap-4">
                  <SectionHeading>Equity Curve</SectionHeading>
                  {equityData?.some(d => d.benchmark_balance != null) && (
                    <button
                      onClick={() => setShowBenchmark(!showBenchmark)}
                      className={`text-xs px-2.5 py-1 rounded border transition-all ${
                        showBenchmark
                          ? 'border-foreground/20 text-foreground bg-muted/50'
                          : 'border-border text-muted-foreground hover:text-foreground hover:border-foreground/20 bg-muted/20 hover:bg-muted/30'
                      }`}
                    >
                      BTC buy-and-hold
                    </button>
                  )}
                </div>
                <div className="text-right">
                  <span className="text-xs text-muted-foreground">
                    {view === 'backtest' ? 'Final Balance' : 'Current Balance'}
                  </span>
                  <p className="font-data text-2xl font-semibold">
                    {formatBalance(latestBalance)}
                  </p>
                </div>
              </div>
              <div className="h-[400px] border border-border rounded-lg p-4 bg-card/30">
                <EquityCurve data={equityData || []} showDrawdown showBenchmark={showBenchmark} />
              </div>
            </section>

            {/* Daily Performance */}
            {equityData && equityData.some(d => d.daily_pnl_pct !== undefined) && (
              <section className="mb-12">
                <SectionHeading className="mb-6">Daily Performance</SectionHeading>
                <div className="border border-border rounded-lg p-4 bg-card/30">
                  <DailyPnLChart data={equityData} height={250} />
                </div>
              </section>
            )}

            {/* Trade Analysis — only if enough data */}
            {hasEnoughTrades && (
              <section className="mb-12">
                <SectionHeading className="mb-6">Trade Analysis</SectionHeading>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="border border-border rounded-lg p-4 bg-card/30">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-4">Return Distribution</p>
                    <ReturnDistribution trades={allTrades!} height={220} />
                  </div>
                  <div className="border border-border rounded-lg p-4 bg-card/30">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-4">Win/Loss Streaks</p>
                    <WinLossStreaks trades={allTrades!} height={220} />
                  </div>
                  <div className="border border-border rounded-lg p-4 bg-card/30">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-4">Trade Duration</p>
                    <TradeDurationStats trades={allTrades!} />
                  </div>
                </div>
              </section>
            )}

            {/* Optimization Summary (backtest only) */}
            {view === 'backtest' && opt && (
              <section className="mb-12">
                <SectionHeading className="mb-6">Optimization Summary</SectionHeading>
                <div className="border border-border rounded-lg p-6 bg-card/30">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Combinations Tested</p>
                      <p className="font-data text-2xl font-semibold">{opt.total_combinations.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Passed Constraints</p>
                      <p className="font-data text-2xl font-semibold">
                        {opt.passed_constraints.toLocaleString()}
                        <span className="text-sm text-muted-foreground ml-2">
                          ({(opt.passed_constraints / opt.total_combinations * 100).toFixed(1)}%)
                        </span>
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Best Sharpe</p>
                      <p className="font-data text-2xl font-semibold text-green-600">{opt.best_sharpe.toFixed(2)}</p>
                    </div>
                  </div>

                  {/* Distribution bars if available */}
                  {opt.distributions && (
                    <div className="pt-4 border-t border-border mb-6">
                      <p className="text-xs text-muted-foreground mb-4">
                        Performance Distribution Across {opt.passed_constraints.toLocaleString()} Passing Configurations
                      </p>
                      <DistributionBars distributions={opt.distributions as OptimizationDistributions} />
                    </div>
                  )}

                  <div className="pt-4 border-t border-border">
                    <p className="text-xs text-muted-foreground mb-2">Constraint Criteria</p>
                    <div className="flex flex-wrap gap-2">
                      <span className="text-xs px-2 py-1 bg-muted rounded">min 20 trades</span>
                      <span className="text-xs px-2 py-1 bg-muted rounded">max 20% drawdown</span>
                      <span className="text-xs px-2 py-1 bg-muted rounded">min 1.5 Sharpe</span>
                      <span className="text-xs px-2 py-1 bg-muted rounded">min 30% win rate</span>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Recent Trades */}
            <section className="mb-12">
              <SectionHeading className="mb-6">
                {view === 'backtest' ? 'Sample Trades' : 'Recent Trades'}
              </SectionHeading>
              <div className="border border-border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-muted/30">
                    <tr className="text-left text-xs text-muted-foreground uppercase tracking-wider">
                      <th className="px-4 py-3 font-medium">Time</th>
                      <th className="px-4 py-3 font-medium">Direction</th>
                      <th className="px-4 py-3 font-medium text-right">Entry</th>
                      <th className="px-4 py-3 font-medium text-right">Exit</th>
                      <th className="px-4 py-3 font-medium text-right">P&L</th>
                      <th className="px-4 py-3 font-medium">Exit Reason</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {recentTrades.map((trade) => (
                      <tr key={trade.id} className="hover:bg-muted/10 transition-colors even:bg-muted/5">
                        <td className="px-4 py-3 font-data text-sm">
                          {formatTradeTime(trade.exit_time)}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1 font-data text-sm ${
                            trade.direction === 'LONG' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {trade.direction === 'LONG' ? (
                              <TrendingUp className="h-3 w-3" />
                            ) : (
                              <TrendingDown className="h-3 w-3" />
                            )}
                            {trade.direction}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-data text-sm text-right">
                          {formatPrice(trade.entry_price)}
                        </td>
                        <td className="px-4 py-3 font-data text-sm text-right">
                          {formatPrice(trade.exit_price)}
                        </td>
                        <td className={`px-4 py-3 font-data text-sm text-right font-semibold ${
                          trade.pnl_pct >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {formatPnlPct(trade.pnl_pct)}
                        </td>
                        <td className="px-4 py-3 text-sm text-muted-foreground capitalize">
                          {formatExitReason(trade.exit_reason)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Footer Note */}
            <div className="text-center text-xs text-muted-foreground pt-8 border-t border-border">
              {view === 'backtest'
                ? 'Backtest data · ProScore2 · 15m timeframe'
                : 'Live data · 1-hour delay · 15m timeframe'
              }
            </div>
          </>
        )}
      </div>
    </div>
  );
}
