'use client';

import Link from 'next/link';
import { Github, ArrowLeft, ArrowRight } from 'lucide-react';
import { mockOptimizationRuns } from '@/lib/mock-data';

export default function SystemPage() {
  // Aggregate optimization stats
  const totalCombinations = mockOptimizationRuns.reduce((acc, run) => acc + run.total_combinations, 0);
  const totalPassed = mockOptimizationRuns.reduce((acc, run) => acc + run.passed_constraints, 0);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-border">
        <div className="mx-auto max-w-4xl px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-base font-semibold tracking-tight">HELIOS</Link>
          <div className="flex items-center gap-6">
            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
              <ArrowLeft className="h-3 w-3" />
              Back
            </Link>
            <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Dashboard
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
        {/* Title */}
        <section className="py-16">
          <h1 className="text-4xl font-bold tracking-tight">System Architecture</h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
            A deep dive into the engineering behind Helios: from market data ingestion to AI-powered monitoring.
          </p>
        </section>

        {/* Data Flow */}
        <section className="py-12 border-t border-border">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-8">Data Flow</h2>

          <div className="space-y-6">
            <FlowStep
              number="01"
              title="Market Data"
              items={["WebSocket streams from dYdX", "Order book snapshots", "Trade ticks & funding rates", "15-min bar aggregation"]}
            />
            <FlowStep
              number="02"
              title="Strategy Engine"
              items={["Signal generation (mean reversion + funding)", "Entry/exit rules with Z-score thresholds", "Position sizing with risk controls", "Multi-market coordination"]}
            />
            <FlowStep
              number="03"
              title="Execution"
              items={["Order submission to dYdX v4", "Fill reconciliation", "Position tracking", "PnL calculation"]}
            />
            <FlowStep
              number="04"
              title="Monitoring"
              items={["AI agents for health checks", "Bug detection on code changes", "Trade analysis & pattern recognition", "Alerting via webhook"]}
            />
          </div>
        </section>

        {/* Technology Stack */}
        <section className="py-12 border-t border-border">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-8">Technology Stack</h2>

          <div className="grid gap-6 md:grid-cols-2">
            <TechCard
              category="Execution"
              name="NautilusTrader"
              description="High-performance trading framework. Event-driven architecture with tick-level backtesting precision."
            />
            <TechCard
              category="Exchange"
              name="dYdX v4"
              description="Decentralized perpetual futures on Cosmos SDK. On-chain order book with sub-second finality."
            />
            <TechCard
              category="Intelligence"
              name="Claude AI"
              description="Anthropic's language model for autonomous monitoring agents and trade analysis."
            />
            <TechCard
              category="Backend"
              name="Python"
              description="Core trading logic with async processing, NumPy/Pandas analytics, and type-safe validation."
            />
            <TechCard
              category="Frontend"
              name="Next.js"
              description="React framework with server rendering, real-time updates, and Recharts visualization."
            />
            <TechCard
              category="Database"
              name="PostgreSQL"
              description="Trade history, daily snapshots, and optimization results via Supabase."
            />
          </div>
        </section>

        {/* AI Agents */}
        <section className="py-12 border-t border-border">
          <div className="flex items-baseline justify-between mb-8">
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">AI Agents</h2>
            <span className="text-xs text-muted-foreground">Powered by Claude</span>
          </div>

          <div className="space-y-6">
            <AgentCard
              name="bug_detector"
              purpose="Analyzes code changes and runtime logs for potential issues"
              triggers={["Code commits", "Error logs", "Stack traces"]}
            />
            <AgentCard
              name="health_checker"
              purpose="Monitors system vitals: API connectivity, memory, process heartbeats"
              triggers={["Scheduled intervals", "Threshold breaches", "Connection drops"]}
            />
            <AgentCard
              name="trade_analyst"
              purpose="Reviews completed trades for patterns and performance insights"
              triggers={["Trade completion", "Session end", "Drawdown events"]}
            />
          </div>

          <div className="mt-8 pt-6 border-t border-border/50">
            <p className="text-xs text-muted-foreground">
              <span className="text-foreground">Future agents:</span> strategy_advisor, market_regime_detector, portfolio_optimizer
            </p>
          </div>
        </section>

        {/* Optimization */}
        <section className="py-12 border-t border-border">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-8">Optimization Process</h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            <StatBox label="Combinations Tested" value={totalCombinations.toLocaleString()} />
            <StatBox label="Passed Constraints" value={totalPassed.toLocaleString()} />
            <StatBox label="Backtest Period" value="12+ months" />
            <StatBox label="Markets" value="BTC, ETH" />
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Constraint Filtering</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-green-600">•</span>
                Minimum 50 trades for statistical significance
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600">•</span>
                Maximum 15% drawdown threshold
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600">•</span>
                Positive Sharpe ratio requirement
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600">•</span>
                Walk-forward validation on out-of-sample data
              </li>
            </ul>
          </div>
        </section>

        {/* Code Architecture */}
        <section className="py-12 border-t border-border">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-8">Code Architecture</h2>

          <div className="grid gap-4 md:grid-cols-3">
            <ModuleCard name="Core" path="/core" components={["Order", "Position", "Instrument", "Account"]} />
            <ModuleCard name="Strategy" path="/strategy" components={["SignalGenerator", "EntryRules", "ExitRules"]} />
            <ModuleCard name="Execution" path="/execution" components={["OrderExecutor", "PositionManager", "RiskController"]} />
            <ModuleCard name="Data" path="/data" components={["DataFeed", "BarAggregator", "DataStore"]} />
            <ModuleCard name="Adapters" path="/adapters" components={["DydxAdapter", "WebSocketClient", "RestClient"]} />
            <ModuleCard name="Agents" path="/agents" components={["AgentOrchestrator", "BugDetector", "TradeAnalyst"]} />
          </div>
        </section>

        {/* Design Patterns */}
        <section className="py-12 border-t border-border">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-8">Design Patterns</h2>

          <div className="grid gap-6 md:grid-cols-2">
            <PatternCard
              name="Event-Driven"
              description="All components communicate via event bus for loose coupling"
            />
            <PatternCard
              name="Strategy Pattern"
              description="Trading strategies implement common interface for hot-swapping"
            />
            <PatternCard
              name="Adapter Pattern"
              description="Exchange-specific logic isolated behind adapters"
            />
            <PatternCard
              name="Repository Pattern"
              description="Data access abstracted for easy storage switching"
            />
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 border-t border-border">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              View live dashboard <ArrowRight className="h-3 w-3" />
            </Link>
            <p className="text-xs text-muted-foreground">
              Demo mode · Architecture documentation
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}

function FlowStep({ number, title, items }: { number: string; title: string; items: string[] }) {
  return (
    <div className="flex gap-6">
      <span className="font-data text-sm text-muted-foreground shrink-0 w-6">{number}</span>
      <div className="flex-1">
        <h3 className="font-semibold mb-2">{title}</h3>
        <ul className="grid md:grid-cols-2 gap-x-8 gap-y-1">
          {items.map((item, i) => (
            <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
              <span className="text-green-600 mt-1.5">•</span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function TechCard({ category, name, description }: { category: string; name: string; description: string }) {
  return (
    <div className="border border-border rounded-lg p-5 bg-card/30">
      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{category}</p>
      <h3 className="font-semibold mb-2">{name}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

function AgentCard({ name, purpose, triggers }: { name: string; purpose: string; triggers: string[] }) {
  return (
    <div className="border border-border rounded-lg p-5 bg-card/30">
      <h3 className="font-data text-green-600 mb-2">{name}</h3>
      <p className="text-sm text-muted-foreground mb-3">{purpose}</p>
      <div className="flex flex-wrap gap-2">
        {triggers.map((trigger, i) => (
          <span key={i} className="text-xs px-2 py-1 rounded bg-muted text-muted-foreground">
            {trigger}
          </span>
        ))}
      </div>
    </div>
  );
}

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <p className="font-data text-xl font-semibold">{value}</p>
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

function PatternCard({ name, description }: { name: string; description: string }) {
  return (
    <div className="flex gap-4">
      <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
      <div>
        <h3 className="font-semibold mb-1">{name}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
