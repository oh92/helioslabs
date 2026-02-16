import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { SectionHeading } from '@/components/display/SectionHeading';
import { InfoCard } from '@/components/display/InfoCard';
import { StepIndicator } from '@/components/display/StepIndicator';

export default function SystemPage() {
  return (
    <div>
      <div className="mx-auto max-w-4xl px-6">
        {/* Title */}
        <section className="py-16">
          <h1 className="text-4xl font-bold tracking-tight">System Architecture</h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
            A deep dive into the engineering behind Helios: from market data ingestion to AI-powered monitoring.
          </p>
        </section>

        {/* Data Flow */}
        <section className="py-12 border-t border-border">
          <SectionHeading className="mb-8">Data Flow</SectionHeading>

          <div className="space-y-6">
            <StepIndicator
              variant="numbered"
              number="01"
              title="Market Data"
              items={["WebSocket streams from Binance", "Order book snapshots & trade ticks", "Funding rates & open interest", "15-min bar aggregation"]}
            />
            <StepIndicator
              variant="numbered"
              number="02"
              title="Strategy Engine"
              items={["Signal generation (mean reversion + funding)", "Entry/exit rules with Z-score thresholds", "Position sizing with risk controls", "Multi-market coordination"]}
            />
            <StepIndicator
              variant="numbered"
              number="03"
              title="Execution"
              items={["Order routing to dYdX v4", "Venue-agnostic adapter layer", "Fill reconciliation & position tracking", "PnL calculation"]}
            />
            <StepIndicator
              variant="numbered"
              number="04"
              title="Monitoring"
              items={["AI agents for health checks", "Bug detection on code changes", "Trade analysis & pattern recognition", "Alerting via webhook"]}
            />
          </div>
        </section>

        {/* Technology Stack */}
        <section className="py-12 border-t border-border">
          <SectionHeading className="mb-8">Technology Stack</SectionHeading>

          <div className="grid gap-6 md:grid-cols-2">
            <InfoCard
              category="Execution"
              title="NautilusTrader"
              description="High-performance trading framework. Event-driven architecture with tick-level backtesting precision."
              subtitle="Institutional-grade event-driven architecture with Rust performance — backtesting and live execution share identical code paths."
            />
            <InfoCard
              category="Market Data"
              title="Binance"
              description="Primary data source for strategy signals. WebSocket streams for real-time order books, trades, and funding rates."
              subtitle="Deepest liquidity across crypto markets — price discovery happens here. Signals generated on Binance data transfer reliably to execution venues."
            />
            <InfoCard
              category="Execution Venue"
              title="dYdX v4"
              description="Decentralized perpetual futures on Cosmos SDK. On-chain order book with sub-second finality."
              subtitle="Decentralized execution eliminates counterparty risk. On-chain order book provides transparent, verifiable fills."
            />
            <InfoCard
              category="Intelligence"
              title="Claude AI"
              description="Anthropic's language model for autonomous monitoring agents and trade analysis."
              subtitle="Natural language interface for monitoring complex systems. Agents reason about bugs and performance in ways rule-based alerts can't."
            />
            <InfoCard
              category="Backend"
              title="Python"
              description="Core trading logic with async processing, NumPy/Pandas analytics, and type-safe validation."
              subtitle="Rich ecosystem for quantitative finance (NumPy, Pandas). Async I/O for concurrent data feeds without threading complexity."
            />
            <InfoCard
              category="Frontend"
              title="Next.js"
              description="React framework with server rendering, real-time updates, and Recharts visualization."
              subtitle="Server-side rendering for fast initial load. App Router for clean API routes co-located with the pages that consume them."
            />
            <InfoCard
              category="Database"
              title="PostgreSQL"
              description="Trade history, daily snapshots, and optimization results via Supabase."
              subtitle="Time-series trade data with JSONB for flexible optimization distributions. Supabase adds instant API layer and auth."
            />
          </div>
        </section>

        {/* AI Agents */}
        <section className="py-12 border-t border-border">
          <SectionHeading
            className="mb-4"
            action={<span className="text-xs text-muted-foreground">Powered by Claude</span>}
          >
            AI Agents
          </SectionHeading>
          <p className="text-sm text-muted-foreground mb-8 max-w-2xl">
            Not chatbot wrappers — autonomous agents that reason about complex system state,
            maintain memory across cycles, and escalate findings they can&apos;t resolve alone.
          </p>

          {/* Agent Architecture Flow */}
          <div className="border border-border rounded-lg bg-card/30 p-5 mb-8 font-mono text-xs overflow-x-auto">
            <div className="text-muted-foreground mb-3">$ helios agents --architecture</div>
            <div className="space-y-2 min-w-[420px]">
              <div className="flex items-baseline gap-2">
                <span className="text-green-600 whitespace-nowrap">supervisor</span>
                <span className="text-muted-foreground/50">&rarr;</span>
                <span className="text-muted-foreground">orchestrates cycle, dispatches tasks, aggregates reports</span>
              </div>
              <div className="flex items-baseline gap-2 pl-4">
                <span className="text-muted-foreground/30 shrink-0">├─</span>
                <span className="text-green-600 whitespace-nowrap">bug_detector</span>
                <span className="text-muted-foreground">code changes, runtime logs, error patterns</span>
              </div>
              <div className="flex items-baseline gap-2 pl-4">
                <span className="text-muted-foreground/30 shrink-0">├─</span>
                <span className="text-green-600 whitespace-nowrap">health_checker</span>
                <span className="text-muted-foreground">API connectivity, memory, process heartbeats</span>
              </div>
              <div className="flex items-baseline gap-2 pl-4">
                <span className="text-muted-foreground/30 shrink-0">├─</span>
                <span className="text-green-600 whitespace-nowrap">trade_analyst</span>
                <span className="text-muted-foreground">win/loss patterns, exit timing, performance drift</span>
              </div>
              <div className="flex items-baseline gap-2 pl-4">
                <span className="text-muted-foreground/30 shrink-0">└─</span>
                <span className="text-green-600 whitespace-nowrap">backtest_comparator</span>
                <span className="text-muted-foreground">trade-by-trade matching, divergence analysis</span>
              </div>
              <div className="mt-3 pt-3 border-t border-border/30 text-muted-foreground/60">
                15-min cycles · persistent memory · cross-agent escalation
              </div>
            </div>
          </div>

          {/* Live Agent Finding */}
          <div className="border border-border rounded-lg bg-card/30 overflow-hidden mb-8">
            <div className="px-5 py-3 border-b border-border bg-muted/20 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs">
                <span className="h-2 w-2 rounded-full bg-green-600" />
                <span className="font-mono text-green-600">backtest_comparator</span>
                <span className="text-muted-foreground">— latest finding</span>
              </div>
              <span className="text-xs text-muted-foreground font-mono">2026-01-29</span>
            </div>
            <div className="px-5 py-4 space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <span className="text-green-600 shrink-0 mt-0.5">&#10003;</span>
                <div>
                  <p className="text-foreground font-medium">92.9% trade outcome alignment</p>
                  <p className="text-muted-foreground text-xs mt-0.5">Direction and timing match between backtest predictions and live execution across 82 live trades.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-green-600 shrink-0 mt-0.5">&#10003;</span>
                <div>
                  <p className="text-foreground font-medium">Entry slippage: -12.1 bps favorable</p>
                  <p className="text-muted-foreground text-xs mt-0.5">dYdX perpetuals have 2-4x tighter spreads than spot during volatile periods. Backtest uses conservative fill assumptions — live execution is outperforming the model.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-yellow-500 shrink-0 mt-0.5">&#9651;</span>
                <div>
                  <p className="text-foreground font-medium">Live win rate 15.9% vs backtest 10.5%</p>
                  <p className="text-muted-foreground text-xs mt-0.5">Mildly concerning — perpetual funding dynamics may create exit advantages not modeled in spot backtest. Monitoring with larger sample size.</p>
                </div>
              </div>
            </div>
          </div>

          <p className="text-sm text-muted-foreground max-w-2xl">
            This is not rule-based alerting. Each agent reads system state, reasons about what it finds,
            and produces structured analysis that a human operator would otherwise spend hours on.
            The supervisor coordinates the full team and maintains context across monitoring cycles.
          </p>

          <div className="mt-8 pt-6 border-t border-border/50">
            <p className="text-xs text-muted-foreground">
              <span className="text-foreground">Future agents:</span> signal_validator, strategy_advisor, market_regime_detector, portfolio_optimizer
            </p>
          </div>
        </section>

        {/* Optimization */}
        <section className="py-12 border-t border-border">
          <SectionHeading className="mb-4">Optimization Process</SectionHeading>
          <p className="text-sm text-muted-foreground mb-8 max-w-2xl">
            NautilusTrader&apos;s Rust-powered backtesting engine makes exhaustive parameter sweeps
            practical — thousands of configurations tested in minutes, not hours.
          </p>

          {/* Research Funnel */}
          <div className="border border-border rounded-lg bg-card/30 p-5 mb-8 font-mono text-xs overflow-x-auto">
            <div className="text-muted-foreground mb-3">$ helios optimization --summary</div>
            <div className="space-y-2 min-w-[400px]">
              <div className="flex items-baseline gap-3">
                <span className="text-muted-foreground whitespace-nowrap w-24 shrink-0 text-right">310,000+</span>
                <span className="text-muted-foreground/30">&rarr;</span>
                <span className="text-muted-foreground">parameter combinations evaluated across 66 runs, 3 markets</span>
              </div>
              <div className="flex items-baseline gap-3">
                <span className="text-muted-foreground whitespace-nowrap w-24 shrink-0 text-right">34,000+</span>
                <span className="text-muted-foreground/30">&rarr;</span>
                <span className="text-muted-foreground">passed constraint filtering (11% survival rate)</span>
              </div>
              <div className="flex items-baseline gap-3">
                <span className="text-foreground whitespace-nowrap w-24 shrink-0 text-right font-semibold">ProScore2</span>
                <span className="text-muted-foreground/30">&rarr;</span>
                <span className="text-muted-foreground">selected strategy class — converged across 4 rounds</span>
              </div>
            </div>
          </div>

          {/* ProScore2 Convergence */}
          <h3 className="font-semibold mb-4">ProScore2 Convergence</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="border border-border rounded-lg p-4 bg-card/30">
              <p className="text-xs text-muted-foreground mb-1">Round 001</p>
              <p className="font-data text-lg font-semibold">59.1%</p>
              <p className="text-xs text-muted-foreground">pass rate · 1,680 combos</p>
            </div>
            <div className="border border-border rounded-lg p-4 bg-card/30">
              <p className="text-xs text-muted-foreground mb-1">Round 003</p>
              <p className="font-data text-lg font-semibold">71.7%</p>
              <p className="text-xs text-muted-foreground">pass rate · 20,736 combos</p>
            </div>
            <div className="border border-border rounded-lg p-4 bg-card/30 border-green-600/30">
              <p className="text-xs text-muted-foreground mb-1">Round 004</p>
              <p className="font-data text-lg font-semibold text-green-600">80.7%</p>
              <p className="text-xs text-muted-foreground">pass rate · 3,750 combos</p>
            </div>
            <div className="border border-border rounded-lg p-4 bg-card/30 border-green-600/30">
              <p className="text-xs text-muted-foreground mb-1">Best Result</p>
              <p className="font-data text-lg font-semibold text-green-600">3.13</p>
              <p className="text-xs text-muted-foreground">Sharpe · 107% ROI</p>
            </div>
          </div>

          {/* Constraints */}
          <div className="space-y-4">
            <h3 className="font-semibold">Constraint Filtering</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Every configuration must pass all constraints simultaneously — no cherry-picking the best metric while ignoring risk.
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-green-600">&bull;</span>
                Minimum 20 trades for statistical confidence
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600">&bull;</span>
                Maximum 20% drawdown threshold
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600">&bull;</span>
                Minimum 1.5 Sharpe ratio
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600">&bull;</span>
                Minimum 30% win rate
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600">&bull;</span>
                Walk-forward validation on out-of-sample data
              </li>
            </ul>
          </div>
        </section>

        {/* Code Architecture */}
        <section className="py-12 border-t border-border">
          <SectionHeading className="mb-8">Code Architecture</SectionHeading>

          <div className="grid gap-4 md:grid-cols-3">
            <ModuleCard name="Core" path="/core" components={["Order", "Position", "Instrument", "Account"]} />
            <ModuleCard name="Strategy" path="/strategy" components={["SignalGenerator", "EntryRules", "ExitRules"]} />
            <ModuleCard name="Execution" path="/execution" components={["OrderExecutor", "PositionManager", "RiskController"]} />
            <ModuleCard name="Data" path="/data" components={["DataFeed", "BarAggregator", "DataStore"]} />
            <ModuleCard name="Adapters" path="/adapters" components={["BinanceAdapter", "DydxAdapter", "WebSocketClient", "RestClient"]} />
            <ModuleCard name="Agents" path="/agents" components={["AgentOrchestrator", "BugDetector", "TradeAnalyst"]} />
          </div>
        </section>

        {/* CTA */}
        <section className="py-12 border-t border-border">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            View live dashboard <ArrowRight className="h-3 w-3" />
          </Link>
        </section>
      </div>
    </div>
  );
}

function ModuleCard({ name, path, components }: { name: string; path: string; components: string[] }) {
  return (
    <div className="border border-border rounded-lg p-4 bg-card/30">
      <div className="flex items-baseline justify-between mb-2">
        <h3 className="font-semibold">{name}</h3>
        <code className="text-xs text-muted-foreground">{path}</code>
      </div>
      <div className="flex flex-wrap gap-1">
        {components.map((comp, i) => (
          <span key={i} className="font-data text-xs px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
            {comp}
          </span>
        ))}
      </div>
    </div>
  );
}
