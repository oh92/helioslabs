'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { Github, ArrowLeft, TrendingUp, TrendingDown, Minus, Activity } from 'lucide-react';
import { EquityCurve } from '@/components/charts/EquityCurve';
import {
  mockMarkets,
  mockTrades,
  mockEquityData,
  mockPerformance,
  mockSystemHealth,
} from '@/lib/mock-data';

export default function DashboardPage() {
  // Get recent trades (last 10)
  const recentTrades = useMemo(() => {
    return [...mockTrades]
      .sort((a, b) => new Date(b.exit_time).getTime() - new Date(a.exit_time).getTime())
      .slice(0, 10);
  }, []);

  // Calculate total P&L from equity curve
  const latestEquity = mockEquityData[mockEquityData.length - 1];
  const startEquity = mockEquityData[0];
  const totalPnlPct = ((latestEquity.balance - startEquity.balance) / startEquity.balance) * 100;

  // ETH mock performance
  const ethPerformance = {
    current_position: 'FLAT' as const,
    session_pnl_pct: 6.58,
    total_trades: 32,
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-border">
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-base font-semibold tracking-tight">HELIOS</Link>
          <div className="flex items-center gap-6">
            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
              <ArrowLeft className="h-3 w-3" />
              Back
            </Link>
            <Link href="/system" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              System
            </Link>
            <Link
              href="https://github.com/oh92"
              target="_blank"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Github className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-12">
        {/* Page Title */}
        <div className="mb-12">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Live Dashboard</h1>
              <p className="mt-2 text-muted-foreground">Real-time trading performance and analytics</p>
            </div>
            <SystemStatus health={mockSystemHealth} />
          </div>
        </div>

        {/* Market Cards */}
        <section className="mb-12">
          <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-6">Active Markets</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <MarketCard
              symbol="BTC-USD"
              position={mockPerformance.current_position}
              sessionPnlPct={mockPerformance.session_pnl_pct}
              totalTrades={mockPerformance.total_trades}
            />
            <MarketCard
              symbol="ETH-USD"
              position={ethPerformance.current_position}
              sessionPnlPct={ethPerformance.session_pnl_pct}
              totalTrades={ethPerformance.total_trades}
            />
          </div>
        </section>

        {/* Equity Curve */}
        <section className="mb-12">
          <div className="flex items-baseline justify-between mb-6">
            <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Equity Curve</h2>
            <div className="text-right">
              <span className="text-xs text-muted-foreground">Current Balance</span>
              <p className="font-data text-2xl font-semibold">
                ${latestEquity.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>
          <div className="h-[400px] border border-border rounded-lg p-4 bg-card/30">
            <EquityCurve data={mockEquityData} showDrawdown />
          </div>
        </section>

        {/* Performance Metrics */}
        <section className="mb-12">
          <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-6">Performance Metrics</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            <MetricBox
              label="Total Return"
              value={`${totalPnlPct >= 0 ? '+' : ''}${totalPnlPct.toFixed(2)}%`}
              positive={totalPnlPct >= 0}
            />
            <MetricBox
              label="Win Rate"
              value={`${mockPerformance.win_rate.toFixed(1)}%`}
              positive={mockPerformance.win_rate > 50}
            />
            <MetricBox
              label="Sharpe"
              value={mockPerformance.sharpe_ratio?.toFixed(2) || '—'}
              positive={(mockPerformance.sharpe_ratio || 0) > 1}
            />
            <MetricBox
              label="Max Drawdown"
              value={`-${mockPerformance.max_drawdown_pct.toFixed(1)}%`}
              negative
            />
            <MetricBox
              label="Avg Win"
              value={`+${mockPerformance.avg_win_pct.toFixed(2)}%`}
              positive
            />
            <MetricBox
              label="Avg Loss"
              value={`${mockPerformance.avg_loss_pct.toFixed(2)}%`}
              negative
            />
          </div>
        </section>

        {/* Recent Trades */}
        <section className="mb-12">
          <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-6">Recent Trades</h2>
          <div className="border border-border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-card/50">
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
                  <tr key={trade.id} className="hover:bg-card/30 transition-colors">
                    <td className="px-4 py-3 font-data text-sm">
                      {new Date(trade.exit_time).toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
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
                      ${trade.entry_price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="px-4 py-3 font-data text-sm text-right">
                      ${trade.exit_price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className={`px-4 py-3 font-data text-sm text-right font-semibold ${
                      trade.pnl_pct >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {trade.pnl_pct >= 0 ? '+' : ''}{trade.pnl_pct.toFixed(2)}%
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground capitalize">
                      {trade.exit_reason.replace('_', ' ')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Footer Note */}
        <div className="text-center text-xs text-muted-foreground pt-8 border-t border-border">
          Demo mode · Data is simulated · 15min timeframe
        </div>
      </main>
    </div>
  );
}

function SystemStatus({ health }: { health: { status: 'healthy' | 'warning' | 'error'; uptime_hours: number; markets_active: number } }) {
  const statusColors = {
    healthy: 'text-green-600',
    warning: 'text-yellow-500',
    error: 'text-red-600',
  };

  return (
    <div className="flex items-center gap-3 text-sm">
      <div className="flex items-center gap-2">
        <span className={`h-2 w-2 rounded-full ${health.status === 'healthy' ? 'bg-green-600' : health.status === 'warning' ? 'bg-yellow-500' : 'bg-red-600'} pulse-dot`} />
        <span className={statusColors[health.status]}>
          {health.status === 'healthy' ? 'All Systems Operational' : health.status}
        </span>
      </div>
      <span className="text-muted-foreground">·</span>
      <span className="text-muted-foreground">{health.markets_active} markets</span>
      <span className="text-muted-foreground">·</span>
      <span className="text-muted-foreground">{health.uptime_hours}h uptime</span>
    </div>
  );
}

function MarketCard({
  symbol,
  position,
  sessionPnlPct,
  totalTrades,
}: {
  symbol: string;
  position: 'FLAT' | 'LONG' | 'SHORT';
  sessionPnlPct: number;
  totalTrades: number;
}) {
  return (
    <div className="border border-border rounded-lg p-6 bg-card/30">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">{symbol}</h3>
        <span className={`inline-flex items-center gap-1 font-data text-sm px-2 py-1 rounded ${
          position === 'LONG' ? 'bg-green-600/10 text-green-600' :
          position === 'SHORT' ? 'bg-red-600/10 text-red-600' :
          'bg-muted text-muted-foreground'
        }`}>
          {position === 'LONG' ? <TrendingUp className="h-3 w-3" /> :
           position === 'SHORT' ? <TrendingDown className="h-3 w-3" /> :
           <Minus className="h-3 w-3" />}
          {position}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-muted-foreground mb-1">Session P&L</p>
          <p className={`font-data text-xl font-semibold ${sessionPnlPct >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {sessionPnlPct >= 0 ? '+' : ''}{sessionPnlPct.toFixed(2)}%
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-1">Total Trades</p>
          <p className="font-data text-xl font-semibold">{totalTrades}</p>
        </div>
      </div>
    </div>
  );
}

function MetricBox({
  label,
  value,
  positive,
  negative,
}: {
  label: string;
  value: string;
  positive?: boolean;
  negative?: boolean;
}) {
  return (
    <div className="border border-border rounded-lg p-4 bg-card/30">
      <p className="text-xs text-muted-foreground mb-2">{label}</p>
      <p className={`font-data text-xl font-semibold ${
        negative ? 'text-red-600' : positive ? 'text-green-600' : 'text-foreground'
      }`}>
        {value}
      </p>
    </div>
  );
}
