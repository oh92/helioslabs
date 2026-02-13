'use client';

import Link from "next/link";
import { Github, Linkedin, Mail, ArrowRight, ExternalLink } from "lucide-react";
import { mockPerformance, mockEquityData, mockTrades, mockOptimizationRuns } from "@/lib/mock-data";
import { SparklineChart } from "@/components/charts/SparklineChart";

export default function Home() {
  const latestEquity = mockEquityData[mockEquityData.length - 1];
  const startEquity = mockEquityData[0];
  const totalReturn = ((latestEquity.balance - startEquity.balance) / startEquity.balance * 100);
  const totalTrades = mockTrades.length;
  const winningTrades = mockTrades.filter(t => t.pnl > 0).length;

  // Aggregate optimization stats
  const totalCombinations = mockOptimizationRuns.reduce((acc, run) => acc + run.total_combinations, 0);
  const totalPassed = mockOptimizationRuns.reduce((acc, run) => acc + run.passed_constraints, 0);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-border">
        <div className="mx-auto max-w-4xl px-6 py-4 flex items-center justify-between">
          <span className="text-base font-semibold tracking-tight">HELIOS</span>
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Dashboard
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

      <main className="mx-auto max-w-4xl px-6">
        {/* Hero */}
        <section className="py-16 md:py-20">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <span className="h-2 w-2 rounded-full bg-green-600 pulse-dot" />
            <span>Trading live on dYdX v4</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight leading-tight">
            Algorithmic Trading System
          </h1>
          <p className="mt-4 text-muted-foreground max-w-2xl leading-relaxed">
            A complete trading infrastructure built from scratch: strategy development,
            rigorous backtesting, parameter optimization, live execution, and autonomous
            AI-powered monitoring.
          </p>
        </section>

        {/* What I Built - The Story */}
        <section className="py-12 border-t border-border">
          <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-10">
            Development Workflow
          </h2>

          <div className="space-y-0">
            {/* Step 1: Strategy Design */}
            <WorkflowStep
              number="01"
              title="Strategy Design"
              status="complete"
              description="Defined trading hypothesis: mean-reversion with funding rate confirmation. Entry on Z-score extremes, exit on mean reversion or ATR-based stops."
              details={[
                "ProScore strategy: Z-score normalization + momentum filter",
                "Funding rate confirmation for directional bias",
                "ATR-based dynamic stop-loss and take-profit",
                "Position sizing based on account risk percentage"
              ]}
            />

            {/* Step 2: Build */}
            <WorkflowStep
              number="02"
              title="Build Strategy"
              status="complete"
              description="Implemented matching backtest and live trading code. Both environments generate identical signals from the same parameters."
              details={[
                "NautilusTrader integration (Rust/Python framework)",
                "Parity between backtest and live signal generation",
                "Position manager with order lifecycle handling",
                "Trade recorder for CSV export and analysis"
              ]}
            />

            {/* Step 3: Optimize */}
            <WorkflowStep
              number="03"
              title="Parameter Optimization"
              status="complete"
              description={`Systematic parameter sweeps with constraint filtering. ${totalCombinations.toLocaleString()} combinations tested across multiple markets.`}
              details={[
                `${totalCombinations.toLocaleString()} parameter combinations evaluated`,
                `${totalPassed.toLocaleString()} passed constraint filtering`,
                "Constraints: min win rate, max drawdown, min trades, Sharpe ratio",
                "Walk-forward validation on out-of-sample data"
              ]}
            />

            {/* Step 4: Deploy */}
            <WorkflowStep
              number="04"
              title="Live Deployment"
              status="complete"
              description="Deployed to dYdX v4 perpetual futures. Sub-second order execution with automated risk controls."
              details={[
                "dYdX v4 (Cosmos SDK) for decentralized execution",
                "Binance data feed for price and funding rates",
                "Paper trading validation before live capital",
                "Automated position management and order routing"
              ]}
            />

            {/* Step 5: Monitor */}
            <WorkflowStep
              number="05"
              title="AI Monitoring"
              status="active"
              description="Built autonomous agent framework for continuous system oversight. Multiple specialized agents running 24/7."
              details={[
                "supervisor: Meta-agent that orchestrates other agents",
                "bug_detector: Identifies critical trading bugs",
                "health_checker: System health and connectivity",
                "trade_analyst: Performance pattern analysis",
                "signal_validator: Signal generation verification",
                "backtest_comparator: Live vs backtest divergence detection"
              ]}
              isLast
            />
          </div>
        </section>

        {/* Live Results */}
        <section className="py-12 border-t border-border">
          <div className="flex items-baseline justify-between mb-8">
            <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Live Results
            </h2>
            <span className="text-xs text-muted-foreground">30-day window</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            <MetricCard
              label="Return"
              value={`${totalReturn >= 0 ? '+' : ''}${totalReturn.toFixed(2)}%`}
              positive={totalReturn >= 0}
            />
            <MetricCard
              label="Win Rate"
              value={`${mockPerformance.win_rate.toFixed(1)}%`}
              subtext={`${winningTrades}/${totalTrades} trades`}
            />
            <MetricCard
              label="Sharpe Ratio"
              value={mockPerformance.sharpe_ratio?.toFixed(2) || "—"}
            />
            <MetricCard
              label="Max Drawdown"
              value={`-${mockPerformance.max_drawdown_pct.toFixed(1)}%`}
              negative
            />
          </div>

          {/* Sparkline */}
          <div className="h-24 border border-border rounded bg-card/50 p-2">
            <SparklineChart data={mockEquityData} />
          </div>

          <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
            <span>BTC-USD, ETH-USD perpetuals | 15min timeframe</span>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1 hover:text-foreground transition-colors"
            >
              Full dashboard <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </section>

        {/* Technology Stack */}
        <section className="py-12 border-t border-border">
          <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-8">
            Technology Stack
          </h2>

          <div className="grid gap-4 md:grid-cols-2">
            <TechItem
              name="NautilusTrader"
              description="High-performance trading framework (Rust/Python). Event-driven architecture with tick-level backtesting precision."
            />
            <TechItem
              name="dYdX v4"
              description="Decentralized perpetual futures on Cosmos SDK. On-chain order book with sub-second block finality."
            />
            <TechItem
              name="Claude AI"
              description="Anthropic's language model powering the autonomous agent framework. Continuous monitoring and analysis."
            />
            <TechItem
              name="Python"
              description="Core trading logic with async processing, NumPy/Pandas analytics, and type-safe validation via Pydantic."
            />
          </div>
        </section>

        {/* Agent Framework */}
        <section className="py-12 border-t border-border">
          <div className="flex items-baseline justify-between mb-8">
            <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              AI Agent Framework
            </h2>
            <span className="text-xs text-muted-foreground">Powered by Claude</span>
          </div>

          <div className="bg-card border border-border rounded p-4 mb-6">
            <div className="text-xs text-muted-foreground mb-2">$ python -m helios.cli.agents monitor --interval 15</div>
            <div className="space-y-1 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-green-600">[OK]</span>
                <span>bug_detector: No critical issues</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-600">[OK]</span>
                <span>health_checker: All systems operational</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-600">[OK]</span>
                <span>signal_validator: Signals verified</span>
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <AgentCard
              name="bug_detector"
              description="Order fill mismatches, position desync, signal execution gaps"
            />
            <AgentCard
              name="health_checker"
              description="API connectivity, memory usage, process heartbeats"
            />
            <AgentCard
              name="trade_analyst"
              description="Win/loss patterns, exit timing, parameter suggestions"
            />
            <AgentCard
              name="signal_validator"
              description="Z-score thresholds, momentum verification, missed opportunities"
            />
            <AgentCard
              name="backtest_comparator"
              description="Trade-by-trade matching, divergence detection, root cause analysis"
            />
            <AgentCard
              name="supervisor"
              description="Meta-orchestration, dynamic agent dispatch, feedback generation"
            />
          </div>

          <div className="mt-6 text-xs text-muted-foreground">
            <span className="text-foreground">Continuous monitoring:</span> Agents run every 15 minutes,
            maintain memory across cycles, track persistent issues, and escalate new critical findings.
          </div>
        </section>

        {/* Code Architecture */}
        <section className="py-12 border-t border-border">
          <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-8">
            Code Architecture
          </h2>

          <div className="bg-card border border-border rounded p-4 text-sm overflow-x-auto">
            <pre className="text-muted-foreground">{`helios/
├── strategies/        # ProScore strategy (backtest + live)
│   ├── proscore_strategy.py
│   ├── proscore_backtest.py
│   ├── position_manager.py
│   └── trade_recorder.py
├── optimizer/         # Parameter sweep engine
│   ├── optimizer.py
│   └── config.py
├── agents/            # AI monitoring framework
│   ├── supervisor.py
│   ├── monitoring/    # bug_detector, health_checker, trade_analyst
│   ├── research/      # backtest_comparator
│   └── tools/         # LLM, log_parser, exchange
├── config/
│   ├── production/    # Live trading configs (.json)
│   └── optimization/  # Parameter sweep configs (.yaml)
└── scripts/
    ├── backtest/      # run_backtest.py, optimize.py
    └── trading/       # run_trading.py`}</pre>
          </div>
        </section>

        {/* What's Next */}
        <section className="py-12 border-t border-border">
          <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-6">
            Roadmap
          </h2>

          <div className="space-y-3">
            <RoadmapItem status="planned" text="strategy_advisor agent: AI-driven parameter tuning suggestions" />
            <RoadmapItem status="planned" text="market_regime_detector: Adaptive strategy switching based on volatility" />
            <RoadmapItem status="planned" text="portfolio_optimizer: Multi-strategy allocation and rebalancing" />
            <RoadmapItem status="planned" text="Additional exchanges: Hyperliquid, GMX, Vertex" />
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 border-t border-border">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-center gap-6">
              <Link
                href="https://github.com/oh92"
                target="_blank"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <Github className="h-4 w-4" />
                GitHub
              </Link>
              <Link
                href="https://www.linkedin.com/in/owen-hobbs/"
                target="_blank"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <Linkedin className="h-4 w-4" />
                LinkedIn
              </Link>
              <Link
                href="mailto:hello@owen-hobbs.com"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <Mail className="h-4 w-4" />
                Contact
              </Link>
            </div>
            <p className="text-xs text-muted-foreground">
              Demo mode | Performance data simulated
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}

function WorkflowStep({
  number,
  title,
  status,
  description,
  details,
  isLast = false,
}: {
  number: string;
  title: string;
  status: 'complete' | 'active' | 'planned';
  description: string;
  details: string[];
  isLast?: boolean;
}) {
  return (
    <div className="relative flex gap-6 pb-8">
      {/* Vertical line */}
      {!isLast && (
        <div className="absolute left-[11px] top-8 bottom-0 w-px bg-border" />
      )}

      {/* Status indicator */}
      <div className="relative z-10 flex-shrink-0">
        <div className={`h-6 w-6 rounded-full border-2 flex items-center justify-center text-xs
          ${status === 'complete' ? 'border-foreground bg-foreground text-background' : ''}
          ${status === 'active' ? 'border-green-600 bg-green-600 text-white' : ''}
          ${status === 'planned' ? 'border-border bg-background text-muted-foreground' : ''}
        `}>
          {status === 'complete' && '✓'}
          {status === 'active' && <span className="h-2 w-2 rounded-full bg-white pulse-dot" />}
          {status === 'planned' && number}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-3 mb-2">
          <span className="text-xs text-muted-foreground">{number}</span>
          <h3 className="font-semibold">{title}</h3>
          {status === 'active' && (
            <span className="text-xs text-green-600">Active</span>
          )}
        </div>
        <p className="text-sm text-muted-foreground mb-3">{description}</p>
        <ul className="space-y-1">
          {details.map((detail, i) => (
            <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
              <span className="text-border mt-0.5">—</span>
              {detail}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function MetricCard({
  label,
  value,
  subtext,
  positive,
  negative
}: {
  label: string;
  value: string;
  subtext?: string;
  positive?: boolean;
  negative?: boolean;
}) {
  return (
    <div>
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <p className={`text-2xl font-semibold ${
        negative ? 'text-red-600' : positive ? 'text-green-600' : 'text-foreground'
      }`}>
        {value}
      </p>
      {subtext && <p className="text-xs text-muted-foreground mt-1">{subtext}</p>}
    </div>
  );
}

function TechItem({
  name,
  description,
}: {
  name: string;
  description: string;
}) {
  return (
    <div className="border border-border rounded p-4">
      <h3 className="font-semibold mb-1">{name}</h3>
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
  );
}

function AgentCard({
  name,
  description,
}: {
  name: string;
  description: string;
}) {
  return (
    <div className="border border-border rounded p-3">
      <h3 className="text-sm text-green-600 mb-1">{name}</h3>
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
  );
}

function RoadmapItem({
  status,
  text,
}: {
  status: 'planned' | 'in-progress' | 'complete';
  text: string;
}) {
  return (
    <div className="flex items-start gap-3 text-sm">
      <span className={`mt-0.5 h-4 w-4 rounded border flex items-center justify-center text-xs
        ${status === 'complete' ? 'border-foreground bg-foreground text-background' : 'border-border'}
      `}>
        {status === 'complete' && '✓'}
      </span>
      <span className={status === 'complete' ? 'text-muted-foreground line-through' : ''}>
        {text}
      </span>
    </div>
  );
}
