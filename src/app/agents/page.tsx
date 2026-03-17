import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { SectionHeading } from '@/components/display/SectionHeading';
import { InfoCard } from '@/components/display/InfoCard';
import { ArchitectureLayers } from '@/components/display/ArchitectureLayers';
import { CostComparison } from '@/components/display/CostComparison';
import { ResearchAgentDemoWrapper } from './ResearchAgentDemoWrapper';

export default function AgentsPage() {
  return (
    <div>
      <div className="mx-auto max-w-4xl px-6">
        {/* Title */}
        <section className="py-16">
          <h1 className="text-4xl font-bold tracking-tight">Agent Architecture</h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
            A three-layer system where deterministic checks do the heavy lifting and LLMs are called only when they add value.
          </p>
        </section>

        {/* Three Operational Phases */}
        <section className="py-12 border-t border-border">
          <SectionHeading className="mb-10">Operational Phases</SectionHeading>

          <div className="grid gap-4 md:grid-cols-3">
            {/* Phase A */}
            <div className="border border-border rounded-lg p-5 bg-card/30">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-mono text-muted-foreground">PHASE A</span>
              </div>
              <h3 className="font-semibold mb-2">Research &amp; Strategy Building</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                Hypothesis-driven exploration with budget constraints and quality gates on every action.
                Haiku plans cheaply, Sonnet makes high-stakes decisions. A state machine governs the
                full research lifecycle.
              </p>
              <div className="pt-3 border-t border-border text-xs text-muted-foreground font-mono">
                state machine · budget-constrained · quality gates
              </div>
            </div>

            {/* Phase B */}
            <div className="border border-border rounded-lg p-5 bg-card/30">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-mono text-muted-foreground">PHASE B</span>
              </div>
              <h3 className="font-semibold mb-2">Live Deployment Validation</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                Intensive monitoring during the first hour after go-live. All deterministic checks
                run simultaneously with LLM analysts on standby. Automatic rollback on critical findings.
              </p>
              <div className="pt-3 border-t border-border text-xs text-muted-foreground font-mono">
                5-min intervals · 6 checks active · auto-rollback
              </div>
            </div>

            {/* Phase C — Active */}
            <div className="border border-green-600/30 rounded-lg p-5 bg-green-600/[0.03]">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-mono text-muted-foreground">PHASE C</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-green-600/10 text-green-600 uppercase tracking-wider">Active</span>
              </div>
              <h3 className="font-semibold mb-2">Steady-State Monitoring</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                Deterministic-first monitoring at 30-minute intervals — free. LLM analysts invoked only
                on degradation or anomalies. 24/7 autonomous operation with crash recovery.
              </p>
              <div className="pt-3 border-t border-green-600/20 text-xs text-muted-foreground font-mono">
                93% cost reduction · 24/7 autonomous · crash recovery
              </div>
            </div>
          </div>
        </section>

        {/* Deterministic vs LLM Architecture */}
        <section className="py-12 border-t border-border">
          <SectionHeading className="mb-4">Deterministic vs LLM</SectionHeading>
          <p className="text-sm text-muted-foreground mb-8 max-w-2xl">
            The key insight: most monitoring cycles find nothing wrong. Running an LLM to confirm
            &quot;everything is fine&quot; is wasteful. Deterministic checks are instant, free, and
            catch 95%+ of actionable issues.
          </p>
          <ArchitectureLayers />
        </section>

        {/* Research Agent Deep Dive */}
        <section className="py-12 border-t border-border">
          <SectionHeading className="mb-4">Research Agent</SectionHeading>
          <p className="text-sm text-muted-foreground mb-8 max-w-2xl">
            An autonomous agent that tests trading hypotheses through iterative experimentation.
            Budget-constrained, goal-directed, with quality gates on every action. Two modes:
            <span className="text-foreground"> hypothesis</span> (test a specific idea) and
            <span className="text-foreground"> explorer</span> (discover new opportunities).
          </p>

          <ResearchAgentDemoWrapper />

          {/* State Machine */}
          <div className="mt-8 border border-border rounded-lg bg-card/30 p-5 font-mono text-xs overflow-x-auto">
            <div className="text-muted-foreground mb-3">State Machine</div>
            <div className="flex flex-wrap items-center gap-2 text-sm min-w-[380px]">
              <span className="px-2 py-1 rounded bg-muted text-foreground">PLAN</span>
              <span className="text-muted-foreground/30">&rarr;</span>
              <span className="px-2 py-1 rounded bg-muted text-foreground">BASELINE</span>
              <span className="text-muted-foreground/30">&rarr;</span>
              <span className="px-2 py-1 rounded bg-muted text-foreground">EXPERIMENT</span>
              <span className="text-muted-foreground/30">&rarr;</span>
              <span className="px-2 py-1 rounded bg-muted text-foreground">EVALUATE</span>
              <span className="text-muted-foreground/30">&rarr;</span>
              <span className="px-2 py-1 rounded bg-muted text-green-600 border border-green-600/30">CONCLUDE</span>
            </div>
            <div className="mt-3 text-muted-foreground/60 flex items-center gap-2">
              <span className="text-[10px]">↺</span>
              <span>EVALUATE can loop back to EXPERIMENT if budget allows</span>
            </div>
          </div>
        </section>

        {/* Strategy System (consolidated) */}
        <section className="py-12 border-t border-border">
          <SectionHeading className="mb-4">Strategy System</SectionHeading>
          <p className="text-sm text-muted-foreground mb-8 max-w-2xl">
            Strategies are assembled from pluggable components defined in YAML. New indicators and
            filters are added by subclassing base types — no core modifications needed. The explorer
            agent can generate, validate, and integrate new components autonomously.
          </p>

          <div className="border border-border rounded-lg bg-card/30 overflow-hidden mb-6">
            <div className="px-4 py-2 border-b border-border bg-muted/20 flex items-center gap-2 text-xs text-muted-foreground">
              <span className="h-2 w-2 rounded-full bg-green-600" />
              <span className="font-mono">strategy.yaml</span>
            </div>
            <pre className="p-4 font-mono text-xs overflow-x-auto text-muted-foreground leading-relaxed">
{`strategy:
  indicators:
    primary:    { type: zscore, source: hl2 }
    momentum:   { type: momentum, source: primary }
    volume:     { type: zscore, source: volume }
    atr:        { type: atr, method: ewm }
  entry_conditions:
    - indicator: primary, operator: ">=", mirror: true
  exit_conditions:
    - indicator: primary, operator: crosses_below
  risk:
    stop_loss:  { type: atr }
    take_profit: { type: atr }
    sizing:     { type: risk_pct }
`}<span className="text-muted-foreground/40"># Parameter values loaded at runtime — never committed to config</span></pre>
          </div>

          <div className="grid gap-4 md:grid-cols-2 mb-6">
            <InfoCard
              variant="compact"
              title="Extensible Components"
              description="New indicators (subclass BaseIndicator), new filters (subclass BaseFilter), new exit rules — all plug-and-play with zero core changes."
              className="p-4"
            />
            <InfoCard
              variant="compact"
              title="Autonomous Creation"
              description="Explorer agent can generate, validate, and integrate new strategy components without human intervention."
              className="p-4"
            />
          </div>

          <h3 className="font-semibold mt-8 mb-4">Validation Pipeline</h3>
          <div className="grid gap-3 md:grid-cols-4">
            <InfoCard
              variant="compact"
              title="1. Structural"
              titleClassName="text-sm font-mono"
              description="Correct inheritance, required methods, type signatures"
              className="p-3"
            />
            <InfoCard
              variant="compact"
              title="2. Integration"
              titleClassName="text-sm font-mono"
              description="Component loads, connects to data feeds, no import errors"
              className="p-3"
            />
            <InfoCard
              variant="compact"
              title="3. Functional"
              titleClassName="text-sm font-mono"
              description="Generates valid signals, handles edge cases, no NaN outputs"
              className="p-3"
            />
            <InfoCard
              variant="compact"
              title="4. Quality"
              titleClassName="text-sm font-mono"
              description="Backtest meets minimum thresholds before integration"
              className="p-3"
            />
          </div>
        </section>

        {/* Analysis Dashboard */}
        <section className="py-12 border-t border-border">
          <SectionHeading className="mb-4">Analysis Dashboard</SectionHeading>
          <p className="text-sm text-muted-foreground mb-8 max-w-2xl">
            A private FastAPI + Plotly.js dashboard for deep analysis. Backtests are scanned from the
            filesystem, indexed, and made searchable. Every optimization run gets distribution charts,
            parameter sensitivity analysis, and constraint failure breakdowns.
          </p>

          <div className="border border-border rounded-lg bg-card/30 overflow-hidden">
            <div className="px-4 py-2 border-b border-border bg-muted/20 flex items-center gap-2 text-xs text-muted-foreground">
              <span className="h-2 w-2 rounded-full bg-green-600" />
              <span className="font-mono">helios-dashboard</span>
            </div>
            <pre className="p-4 font-mono text-xs overflow-x-auto text-muted-foreground leading-relaxed">
{`$ helios dashboard --summary

Backtest Explorer    54,000+ runs indexed · sortable · filterable
Optimization View    66 sweeps · heatmaps · parameter sensitivity
Chart Suite          7 interactive types · equity · drawdown · scatter
Comparison Tool      Side-by-side metrics · parameter diffs · equity overlay`}</pre>
          </div>
        </section>

        {/* Walk-Forward Validation */}
        <section className="py-12 border-t border-border">
          <SectionHeading className="mb-4">Walk-Forward Validation</SectionHeading>
          <p className="text-sm text-muted-foreground mb-8 max-w-2xl">
            Strategies are validated using time-series-aware methodology. No shuffling, no
            future data leakage — the same constraints a live trader faces.
          </p>

          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <InfoCard
                variant="compact"
                title="In-Sample / Out-of-Sample"
                description="Chronological fold splitting preserves time-series integrity. Optimize on IS data, validate on OOS data per fold."
                className="p-4"
              />
              <InfoCard
                variant="compact"
                title="Monte Carlo Bootstrap"
                description="1,000 resamples generate confidence intervals for Sharpe, drawdown, and win rate. Flags: low_confidence, sequence_dependent."
                className="p-4"
              />
            </div>

            <div className="border border-border rounded-lg bg-card/30 p-4 font-mono text-xs overflow-x-auto">
              <div className="text-muted-foreground mb-2">IS/OOS Fold Structure</div>
              <div className="space-y-1 min-w-[380px]">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground w-12 shrink-0 text-right">Fold 1</span>
                  <div className="flex-1 flex">
                    <div className="bg-blue-500/20 border border-blue-500/30 rounded-l px-3 py-1 text-blue-500 flex-[3]">IS: Train</div>
                    <div className="bg-green-600/20 border border-green-600/30 rounded-r px-3 py-1 text-green-600 flex-1">OOS</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground w-12 shrink-0 text-right">Fold 2</span>
                  <div className="flex-1 flex">
                    <div className="bg-blue-500/20 border border-blue-500/30 rounded-l px-3 py-1 text-blue-500 flex-[4]">IS: Train</div>
                    <div className="bg-green-600/20 border border-green-600/30 rounded-r px-3 py-1 text-green-600 flex-1">OOS</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground w-12 shrink-0 text-right">Fold 3</span>
                  <div className="flex-1 flex">
                    <div className="bg-blue-500/20 border border-blue-500/30 rounded-l px-3 py-1 text-blue-500 flex-[5]">IS: Train</div>
                    <div className="bg-green-600/20 border border-green-600/30 rounded-r px-3 py-1 text-green-600 flex-1">OOS</div>
                  </div>
                </div>
              </div>
              <div className="mt-2 text-muted-foreground/50">
                → No shuffling — preserves temporal causality
              </div>
            </div>
          </div>
        </section>

        {/* Cost Optimization */}
        <section className="py-12 border-t border-border">
          <SectionHeading className="mb-4">Cost Optimization</SectionHeading>
          <p className="text-sm text-muted-foreground mb-8 max-w-2xl">
            The deterministic-first architecture dramatically reduces LLM costs. Most monitoring
            cycles complete without a single API call.
          </p>
          <CostComparison />
        </section>

        {/* Code Architecture */}
        <section className="py-12 border-t border-border">
          <SectionHeading className="mb-8">Code Architecture</SectionHeading>

          <div className="grid gap-4 md:grid-cols-3">
            <ModuleCard name="Core" path="/core" components={['Order', 'Position', 'Instrument', 'Account']} />
            <ModuleCard name="Strategy" path="/strategy" components={['PluginStrategy', 'BaseIndicator', 'BaseFilter']} />
            <ModuleCard name="Execution" path="/execution" components={['OrderExecutor', 'PositionManager', 'RiskController']} />
            <ModuleCard name="Research" path="/research" components={['ResearchAgent', 'StateMachine', 'BudgetTracker']} />
            <ModuleCard name="Monitoring" path="/monitoring" components={['Router', 'CheckRunner', 'AnalystDispatcher']} />
            <ModuleCard name="Validation" path="/validation" components={['WalkForward', 'MonteCarlo', 'FoldSplitter']} />
          </div>
        </section>

        {/* CTA */}
        <section className="py-12 border-t border-border">
          <div className="flex flex-wrap gap-6">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              View performance data <ArrowRight className="h-3 w-3" />
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Background &amp; contact <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
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
