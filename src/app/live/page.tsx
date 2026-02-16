'use client';

import { useMemo } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { EquityCurve } from '@/components/charts/EquityCurve';
import {
  mockMarkets,
  mockTrades,
  mockEquityData,
  mockPerformance,
  mockSystemHealth,
} from '@/lib/mock-data';
import {
  Activity,
  TrendingUp,
  TrendingDown,
  Minus,
  CircleDot,
  Clock,
  Target,
  Percent,
  BarChart3,
  AlertTriangle,
  Zap,
} from 'lucide-react';

// Mock data for ETH market (derived from BTC mock)
const ethPerformance = {
  market: mockMarkets[1],
  current_position: 'FLAT' as const,
  entry_price: undefined,
  unrealized_pnl: 0,
  unrealized_pnl_pct: 0,
  session_pnl: 0,
  session_pnl_pct: 6.58,
  total_trades: 32,
  win_rate: 62.5,
  sharpe_ratio: 1.65,
  max_drawdown_pct: 3.82,
  avg_win_pct: 1.75,
  avg_loss_pct: -0.82,
};

function formatDateTime(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatPrice(price: number, symbol: string): string {
  if (symbol.includes('BTC')) {
    return `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
  return `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatExitReason(reason: string): string {
  return reason
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export default function LivePerformancePage() {
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
  const totalPnlValue = latestEquity.balance - startEquity.balance;

  // Combined metrics from both markets
  const combinedMetrics = {
    totalPnl: totalPnlValue,
    totalPnlPct: totalPnlPct,
    winRate: (mockPerformance.win_rate + ethPerformance.win_rate) / 2,
    sharpeRatio: ((mockPerformance.sharpe_ratio || 0) + (ethPerformance.sharpe_ratio || 0)) / 2,
    maxDrawdown: Math.max(mockPerformance.max_drawdown_pct, ethPerformance.max_drawdown_pct),
    avgWin: (mockPerformance.avg_win_pct + ethPerformance.avg_win_pct) / 2,
    avgLoss: (mockPerformance.avg_loss_pct + ethPerformance.avg_loss_pct) / 2,
  };

  return (
    <div className="flex flex-col gap-8 px-6 py-8">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Live Performance</h1>
          <p className="mt-1 text-muted-foreground">
            Real-time trading system performance and analytics
          </p>
        </div>
        <SystemHealthIndicator health={mockSystemHealth} />
      </div>

      {/* Market Cards Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        <MarketCard
          symbol="BTC-USD"
          position={mockPerformance.current_position}
          entryPrice={mockPerformance.entry_price}
          sessionPnlPct={mockPerformance.session_pnl_pct}
          unrealizedPnlPct={mockPerformance.unrealized_pnl_pct}
          totalTrades={mockPerformance.total_trades}
        />
        <MarketCard
          symbol="ETH-USD"
          position={ethPerformance.current_position}
          entryPrice={ethPerformance.entry_price}
          sessionPnlPct={ethPerformance.session_pnl_pct}
          unrealizedPnlPct={ethPerformance.unrealized_pnl_pct}
          totalTrades={ethPerformance.total_trades}
        />
      </div>

      {/* Equity Curve Section */}
      <Card className="border-border/50 bg-card/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Equity Curve
              </CardTitle>
              <CardDescription>30-day portfolio performance</CardDescription>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Current Balance</p>
              <p className="font-mono text-2xl font-bold text-foreground">
                ${latestEquity.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <EquityCurve data={mockEquityData} showDrawdown />
          </div>
        </CardContent>
      </Card>

      {/* Performance Metrics Panel */}
      <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-6">
        <MetricCard
          icon={TrendingUp}
          label="Total P&L"
          value={`$${combinedMetrics.totalPnl.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          subValue={`${combinedMetrics.totalPnlPct >= 0 ? '+' : ''}${combinedMetrics.totalPnlPct.toFixed(2)}%`}
          positive={combinedMetrics.totalPnl >= 0}
        />
        <MetricCard
          icon={Target}
          label="Win Rate"
          value={`${combinedMetrics.winRate.toFixed(1)}%`}
          subValue="All trades"
          positive={combinedMetrics.winRate > 50}
        />
        <MetricCard
          icon={BarChart3}
          label="Sharpe Ratio"
          value={combinedMetrics.sharpeRatio.toFixed(2)}
          subValue="Risk-adjusted"
          positive={combinedMetrics.sharpeRatio > 1}
        />
        <MetricCard
          icon={AlertTriangle}
          label="Max Drawdown"
          value={`${combinedMetrics.maxDrawdown.toFixed(2)}%`}
          subValue="Peak to trough"
          positive={false}
          isNegativeMetric
        />
        <MetricCard
          icon={TrendingUp}
          label="Avg Win"
          value={`+${combinedMetrics.avgWin.toFixed(2)}%`}
          subValue="Per winning trade"
          positive
        />
        <MetricCard
          icon={TrendingDown}
          label="Avg Loss"
          value={`${combinedMetrics.avgLoss.toFixed(2)}%`}
          subValue="Per losing trade"
          positive={false}
          isNegativeMetric
        />
      </div>

      {/* Recent Trades Table */}
      <Card className="border-border/50 bg-card/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Recent Trades
          </CardTitle>
          <CardDescription>Last 10 completed trades across all markets</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-border/50 hover:bg-transparent">
                <TableHead className="text-muted-foreground">Entry Time</TableHead>
                <TableHead className="text-muted-foreground">Exit Time</TableHead>
                <TableHead className="text-muted-foreground">Direction</TableHead>
                <TableHead className="text-right text-muted-foreground">Entry Price</TableHead>
                <TableHead className="text-right text-muted-foreground">Exit Price</TableHead>
                <TableHead className="text-right text-muted-foreground">P&L %</TableHead>
                <TableHead className="text-muted-foreground">Exit Reason</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentTrades.map((trade) => {
                const isProfitable = trade.pnl_pct >= 0;
                const symbol = trade.session_id.includes('btc') ? 'BTC-USD' : 'ETH-USD';

                return (
                  <TableRow key={trade.id} className="border-border/30 hover:bg-muted/30">
                    <TableCell className="font-mono text-sm">
                      {formatDateTime(trade.entry_time)}
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {formatDateTime(trade.exit_time)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`font-mono ${
                          trade.direction === 'LONG'
                            ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-500'
                            : 'border-red-500/50 bg-red-500/10 text-red-500'
                        }`}
                      >
                        {trade.direction === 'LONG' ? (
                          <TrendingUp className="mr-1 h-3 w-3" />
                        ) : (
                          <TrendingDown className="mr-1 h-3 w-3" />
                        )}
                        {trade.direction}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm">
                      {formatPrice(trade.entry_price, symbol)}
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm">
                      {formatPrice(trade.exit_price, symbol)}
                    </TableCell>
                    <TableCell
                      className={`text-right font-mono text-sm font-semibold ${
                        isProfitable ? 'text-emerald-500' : 'text-red-500'
                      }`}
                    >
                      {isProfitable ? '+' : ''}
                      {trade.pnl_pct.toFixed(2)}%
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={`text-xs ${
                          trade.exit_reason === 'take_profit'
                            ? 'bg-emerald-500/10 text-emerald-500'
                            : trade.exit_reason === 'stop_loss'
                              ? 'bg-red-500/10 text-red-500'
                              : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {formatExitReason(trade.exit_reason)}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

// System Health Indicator Component
function SystemHealthIndicator({
  health,
}: {
  health: {
    status: 'healthy' | 'warning' | 'error';
    last_check: string;
    markets_active: number;
    uptime_hours: number;
  };
}) {
  const statusConfig = {
    healthy: {
      color: 'bg-emerald-500',
      textColor: 'text-emerald-500',
      label: 'All Systems Operational',
      icon: Activity,
    },
    warning: {
      color: 'bg-yellow-500',
      textColor: 'text-yellow-500',
      label: 'Degraded Performance',
      icon: AlertTriangle,
    },
    error: {
      color: 'bg-red-500',
      textColor: 'text-red-500',
      label: 'System Error',
      icon: AlertTriangle,
    },
  };

  const config = statusConfig[health.status];
  const StatusIcon = config.icon;

  return (
    <Card className="border-border/50 bg-card/50">
      <CardContent className="flex items-center gap-4 p-4">
        <div className="relative">
          <div className={`h-3 w-3 rounded-full ${config.color}`} />
          <div className={`absolute inset-0 h-3 w-3 animate-ping rounded-full ${config.color} opacity-75`} />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <StatusIcon className={`h-4 w-4 ${config.textColor}`} />
            <span className={`text-sm font-medium ${config.textColor}`}>
              {config.label}
            </span>
          </div>
          <div className="mt-0.5 flex items-center gap-3 text-xs text-muted-foreground">
            <span>{health.markets_active} markets active</span>
            <span className="text-border">|</span>
            <span>Uptime: {health.uptime_hours.toFixed(0)}h</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Market Card Component
function MarketCard({
  symbol,
  position,
  entryPrice,
  sessionPnlPct,
  unrealizedPnlPct,
  totalTrades,
}: {
  symbol: string;
  position: 'FLAT' | 'LONG' | 'SHORT';
  entryPrice?: number;
  sessionPnlPct: number;
  unrealizedPnlPct?: number;
  totalTrades: number;
}) {
  const positionConfig = {
    FLAT: {
      color: 'text-muted-foreground',
      bgColor: 'bg-muted/50',
      borderColor: 'border-muted',
      icon: Minus,
    },
    LONG: {
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/50',
      icon: TrendingUp,
    },
    SHORT: {
      color: 'text-red-500',
      bgColor: 'bg-red-500/10',
      borderColor: 'border-red-500/50',
      icon: TrendingDown,
    },
  };

  const config = positionConfig[position];
  const PositionIcon = config.icon;

  return (
    <Card className="border-border/50 bg-card/50">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CircleDot className="h-4 w-4 text-primary" />
            <CardTitle className="text-lg">{symbol}</CardTitle>
          </div>
          <Badge
            variant="outline"
            className={`${config.bgColor} ${config.borderColor} ${config.color} font-mono`}
          >
            <PositionIcon className="mr-1 h-3 w-3" />
            {position}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-muted-foreground">Entry Price</p>
            <p className="font-mono text-lg font-semibold">
              {entryPrice ? formatPrice(entryPrice, symbol) : '---'}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Unrealized P&L</p>
            <p
              className={`font-mono text-lg font-semibold ${
                (unrealizedPnlPct || 0) >= 0 ? 'text-emerald-500' : 'text-red-500'
              }`}
            >
              {position !== 'FLAT'
                ? `${(unrealizedPnlPct || 0) >= 0 ? '+' : ''}${(unrealizedPnlPct || 0).toFixed(2)}%`
                : '---'}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Session P&L</p>
            <p
              className={`font-mono text-lg font-semibold ${
                sessionPnlPct >= 0 ? 'text-emerald-500' : 'text-red-500'
              }`}
            >
              {sessionPnlPct >= 0 ? '+' : ''}
              {sessionPnlPct.toFixed(2)}%
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Total Trades</p>
            <p className="font-mono text-lg font-semibold text-foreground">{totalTrades}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Metric Card Component
function MetricCard({
  icon: Icon,
  label,
  value,
  subValue,
  positive,
  isNegativeMetric = false,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  subValue: string;
  positive: boolean;
  isNegativeMetric?: boolean;
}) {
  return (
    <Card className="border-border/50 bg-card/50">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Icon className="h-4 w-4" />
          <span className="text-xs font-medium">{label}</span>
        </div>
        <p
          className={`mt-2 font-mono text-xl font-bold ${
            isNegativeMetric
              ? 'text-red-500'
              : positive
                ? 'text-emerald-500'
                : 'text-muted-foreground'
          }`}
        >
          {value}
        </p>
        <p className="mt-0.5 text-xs text-muted-foreground">{subValue}</p>
      </CardContent>
    </Card>
  );
}
