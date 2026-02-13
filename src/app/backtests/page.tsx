'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  FlaskConical,
  Calendar,
  TrendingUp,
  BarChart3,
  Filter,
  Shuffle,
  CheckCircle2,
  XCircle,
  Target,
  Layers,
  ArrowRight,
  Clock,
  Database,
} from 'lucide-react';
import { mockOptimizationRuns } from '@/lib/mock-data';

// Sample top parameter sets (sanitized - no actual parameters shown)
const topParameterSets = [
  {
    rank: 1,
    configId: 'CFG-A7X2',
    sharpe: 2.34,
    roi: 45.8,
    maxDrawdown: 8.2,
    trades: 156,
    winRate: 62.4,
    profitFactor: 2.15,
  },
  {
    rank: 2,
    configId: 'CFG-B3M9',
    sharpe: 2.28,
    roi: 43.2,
    maxDrawdown: 7.8,
    trades: 142,
    winRate: 60.8,
    profitFactor: 2.08,
  },
  {
    rank: 3,
    configId: 'CFG-C1K5',
    sharpe: 2.21,
    roi: 41.5,
    maxDrawdown: 9.1,
    trades: 168,
    winRate: 58.9,
    profitFactor: 1.95,
  },
  {
    rank: 4,
    configId: 'CFG-D8N4',
    sharpe: 2.15,
    roi: 39.8,
    maxDrawdown: 8.5,
    trades: 134,
    winRate: 61.2,
    profitFactor: 2.01,
  },
  {
    rank: 5,
    configId: 'CFG-E2P7',
    sharpe: 2.09,
    roi: 38.1,
    maxDrawdown: 7.2,
    trades: 149,
    winRate: 59.5,
    profitFactor: 1.88,
  },
];

const methodologySteps = [
  {
    icon: Shuffle,
    title: 'Cartesian Parameter Sweeps',
    description:
      'Generate all possible combinations of strategy parameters across defined ranges. This exhaustive approach ensures no potentially profitable configuration is overlooked.',
    details: [
      'Define parameter ranges and step sizes',
      'Generate full combinatorial grid',
      'Parallel backtest execution',
      'Results aggregation and storage',
    ],
  },
  {
    icon: Filter,
    title: 'Constraint Filtering',
    description:
      'Apply strict filters to eliminate configurations that fail to meet risk and performance requirements. Only robust strategies survive this stage.',
    details: [
      'Minimum 50 trades required',
      'Maximum 15% drawdown limit',
      'Minimum 1.5 Sharpe ratio',
      'Positive profit factor',
    ],
  },
  {
    icon: Layers,
    title: 'Walk-Forward Validation',
    description:
      'Split historical data into training and testing periods. Optimize on training data, validate on unseen test data to prevent overfitting.',
    details: [
      '70/30 train-test split',
      'Rolling window analysis',
      'Out-of-sample verification',
      'Performance consistency checks',
    ],
  },
];

const constraints = [
  { name: 'Minimum Trades', value: '50', icon: Target, passed: true },
  { name: 'Max Drawdown', value: '< 15%', icon: TrendingUp, passed: true },
  { name: 'Min Sharpe Ratio', value: '> 1.5', icon: BarChart3, passed: true },
  { name: 'Profit Factor', value: '> 1.0', icon: CheckCircle2, passed: true },
];

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function BacktestsPage() {
  return (
    <div className="flex flex-col">
      {/* Page Header */}
      <section className="relative px-6 py-16 lg:py-24">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
        <div className="relative mx-auto max-w-6xl">
          <div className="flex flex-col items-center text-center">
            <Badge variant="secondary" className="mb-6">
              <FlaskConical className="mr-1.5 h-3 w-3" />
              Systematic Testing
            </Badge>

            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Backtest Results
            </h1>

            <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
              Every strategy deployed on Helios undergoes rigorous historical
              testing across thousands of parameter combinations. Only
              configurations that pass strict risk and performance constraints
              are considered for live trading.
            </p>
          </div>
        </div>
      </section>

      {/* Optimization Runs Grid */}
      <section className="border-t border-border/50 bg-card/30 px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold">Optimization Runs</h2>
            <p className="mt-2 text-muted-foreground">
              Recent parameter optimization campaigns and their results
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {mockOptimizationRuns.map((run) => (
              <Card
                key={run.id}
                className="border-border/50 bg-card/50 transition-colors hover:border-primary/30"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{run.name}</CardTitle>
                      <CardDescription className="mt-1 flex items-center gap-2">
                        <Calendar className="h-3.5 w-3.5" />
                        {formatDate(run.run_date)}
                      </CardDescription>
                    </div>
                    <Badge variant="outline" className="font-mono text-xs">
                      {run.symbol}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Symbol & Interval */}
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Clock className="h-3.5 w-3.5" />
                        <span>{run.interval}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Database className="h-3.5 w-3.5" />
                        <span>{run.num_candles.toLocaleString()} candles</span>
                      </div>
                    </div>

                    {/* Combinations Tested */}
                    <div className="rounded-lg bg-muted/50 p-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          Combinations Tested
                        </span>
                        <span className="font-mono font-medium">
                          {run.total_combinations.toLocaleString()}
                        </span>
                      </div>
                      <div className="mt-2 flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          Passed Constraints
                        </span>
                        <span className="font-mono font-medium text-primary">
                          {run.passed_constraints.toLocaleString()}
                        </span>
                      </div>
                      <div className="mt-2">
                        <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                          <div
                            className="h-full bg-primary transition-all"
                            style={{
                              width: `${(run.passed_constraints / run.total_combinations) * 100}%`,
                            }}
                          />
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {(
                            (run.passed_constraints / run.total_combinations) *
                            100
                          ).toFixed(1)}
                          % pass rate
                        </p>
                      </div>
                    </div>

                    {/* Best Results */}
                    <div>
                      <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Best Configuration
                      </p>
                      <div className="grid grid-cols-3 gap-2">
                        <div className="rounded-md bg-muted/30 p-2 text-center">
                          <p className="font-mono text-lg font-semibold text-primary">
                            {run.best_sharpe.toFixed(2)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Sharpe
                          </p>
                        </div>
                        <div className="rounded-md bg-muted/30 p-2 text-center">
                          <p className="font-mono text-lg font-semibold text-primary">
                            {run.best_roi_pct.toFixed(1)}%
                          </p>
                          <p className="text-xs text-muted-foreground">ROI</p>
                        </div>
                        <div className="rounded-md bg-muted/30 p-2 text-center">
                          <p className="font-mono text-lg font-semibold text-destructive">
                            {run.best_drawdown_pct.toFixed(1)}%
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Max DD
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Methodology Section */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="text-2xl font-semibold sm:text-3xl">
              Testing Methodology
            </h2>
            <p className="mt-2 text-muted-foreground">
              A systematic, multi-stage approach to strategy validation
            </p>
          </div>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="mx-auto mb-8 w-fit">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="constraints">Constraints</TabsTrigger>
              <TabsTrigger value="results">Top Results</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="grid gap-6 lg:grid-cols-3">
                {methodologySteps.map((step, index) => (
                  <Card
                    key={step.title}
                    className="relative border-border/50 bg-card/50"
                  >
                    <CardContent className="pt-6">
                      <div className="absolute right-4 top-4 font-mono text-xs text-muted-foreground">
                        {String(index + 1).padStart(2, '0')}
                      </div>
                      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                        <step.icon className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="text-lg font-semibold">{step.title}</h3>
                      <p className="mt-2 text-sm text-muted-foreground">
                        {step.description}
                      </p>
                      <ul className="mt-4 space-y-2">
                        {step.details.map((detail) => (
                          <li
                            key={detail}
                            className="flex items-center gap-2 text-sm text-muted-foreground"
                          >
                            <ArrowRight className="h-3 w-3 text-primary" />
                            {detail}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="constraints">
              <Card className="border-border/50 bg-card/50">
                <CardHeader>
                  <CardTitle>Constraint Filters</CardTitle>
                  <CardDescription>
                    Minimum requirements for a configuration to be considered
                    viable. These constraints help eliminate overfitted or
                    high-risk strategies.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {constraints.map((constraint) => (
                      <div
                        key={constraint.name}
                        className="flex items-center gap-3 rounded-lg border border-border/50 bg-muted/30 p-4"
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                          <constraint.icon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{constraint.name}</p>
                          <p className="font-mono text-sm text-muted-foreground">
                            {constraint.value}
                          </p>
                        </div>
                        {constraint.passed ? (
                          <CheckCircle2 className="ml-auto h-5 w-5 text-primary" />
                        ) : (
                          <XCircle className="ml-auto h-5 w-5 text-destructive" />
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 rounded-lg border border-border/50 bg-muted/20 p-6">
                    <h4 className="mb-4 font-semibold">Why These Constraints?</h4>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <p className="text-sm font-medium">Minimum Trades (50)</p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          Ensures statistical significance. Strategies with too
                          few trades may show misleading results due to random
                          variance.
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Max Drawdown (15%)</p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          Limits peak-to-trough losses. Excessive drawdowns
                          indicate poor risk management and can lead to
                          catastrophic losses.
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Min Sharpe Ratio (1.5)</p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          Measures risk-adjusted returns. A Sharpe above 1.5
                          indicates returns adequately compensate for the risk
                          taken.
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Profit Factor (&gt; 1.0)</p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          Ratio of gross profits to gross losses. Values above 1
                          confirm the strategy is net profitable.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="results">
              <Card className="border-border/50 bg-card/50">
                <CardHeader>
                  <CardTitle>Top Parameter Configurations</CardTitle>
                  <CardDescription>
                    Leading configurations from the latest BTC Momentum
                    optimization run. Actual parameter values are not displayed
                    to protect strategy IP.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[60px]">Rank</TableHead>
                        <TableHead>Config ID</TableHead>
                        <TableHead className="text-right">Sharpe</TableHead>
                        <TableHead className="text-right">ROI %</TableHead>
                        <TableHead className="text-right">Max DD %</TableHead>
                        <TableHead className="text-right">Trades</TableHead>
                        <TableHead className="text-right">Win Rate</TableHead>
                        <TableHead className="text-right">
                          Profit Factor
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {topParameterSets.map((config) => (
                        <TableRow key={config.configId}>
                          <TableCell>
                            <Badge
                              variant={config.rank === 1 ? 'default' : 'outline'}
                              className="font-mono"
                            >
                              #{config.rank}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-mono text-muted-foreground">
                            {config.configId}
                          </TableCell>
                          <TableCell className="text-right font-mono font-medium text-primary">
                            {config.sharpe.toFixed(2)}
                          </TableCell>
                          <TableCell className="text-right font-mono font-medium text-primary">
                            {config.roi.toFixed(1)}%
                          </TableCell>
                          <TableCell className="text-right font-mono text-destructive">
                            {config.maxDrawdown.toFixed(1)}%
                          </TableCell>
                          <TableCell className="text-right font-mono">
                            {config.trades}
                          </TableCell>
                          <TableCell className="text-right font-mono">
                            {config.winRate.toFixed(1)}%
                          </TableCell>
                          <TableCell className="text-right font-mono">
                            {config.profitFactor.toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  <div className="mt-6 flex items-start gap-3 rounded-lg border border-primary/20 bg-primary/5 p-4">
                    <FlaskConical className="mt-0.5 h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium">
                        Selection Criteria for Live Deployment
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        The top-ranked configuration is not automatically
                        selected. Final selection considers parameter stability
                        (how sensitive returns are to small parameter changes),
                        out-of-sample performance, and correlation with existing
                        live strategies.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Summary Stats */}
      <section className="border-t border-border/50 bg-card/30 px-6 py-12">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            <SummaryMetric
              label="Total Backtests Run"
              value={mockOptimizationRuns
                .reduce((acc, run) => acc + run.total_combinations, 0)
                .toLocaleString()}
              subtext="All-time combinations"
            />
            <SummaryMetric
              label="Configurations Passed"
              value={mockOptimizationRuns
                .reduce((acc, run) => acc + run.passed_constraints, 0)
                .toLocaleString()}
              subtext="Met all constraints"
            />
            <SummaryMetric
              label="Best Sharpe Achieved"
              value={Math.max(
                ...mockOptimizationRuns.map((r) => r.best_sharpe)
              ).toFixed(2)}
              subtext="Risk-adjusted return"
            />
            <SummaryMetric
              label="Historical Data"
              value={`${Math.round(mockOptimizationRuns.reduce((acc, run) => acc + run.num_candles, 0) / 1000)}k`}
              subtext="Total candles analyzed"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function SummaryMetric({
  label,
  value,
  subtext,
}: {
  label: string;
  value: string;
  subtext: string;
}) {
  return (
    <div className="text-center">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-1 font-mono text-2xl font-bold text-primary sm:text-3xl">
        {value}
      </p>
      <p className="mt-1 text-xs text-muted-foreground">{subtext}</p>
    </div>
  );
}
