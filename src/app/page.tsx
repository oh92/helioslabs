'use client';

import Link from "next/link";
import { useState, useEffect } from "react";
import { ArrowRight, BarChart3, Cpu, User } from "lucide-react";
import { SparklineChart } from "@/components/charts/SparklineChart";
import { SectionHeading } from "@/components/display/SectionHeading";
import { MetricCard } from "@/components/display/MetricCard";
import { InfoCard } from "@/components/display/InfoCard";
import { StepIndicator } from "@/components/display/StepIndicator";
import { ViewToggle } from "@/components/display/ViewToggle";
import type { MarketPerformance, EquityDataPoint, OptimizationRun } from "@/lib/types";

type ViewMode = 'backtest' | 'live';

export default function Home() {
  const [view, setView] = useState<ViewMode>('backtest');
  const [btPerformance, setBtPerformance] = useState<MarketPerformance | null>(null);
  const [btEquityData, setBtEquityData] = useState<EquityDataPoint[] | null>(null);
  const [livePerformance, setLivePerformance] = useState<MarketPerformance | null>(null);
  const [liveEquityData, setLiveEquityData] = useState<EquityDataPoint[] | null>(null);
  const [optimization, setOptimization] = useState<OptimizationRun[] | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [btPerfRes, btEquityRes, livePerfRes, liveEquityRes, optRes] = await Promise.all([
          fetch('/api/performance?source=backtest'),
          fetch('/api/equity?source=backtest'),
          fetch('/api/performance?source=live'),
          fetch('/api/equity?source=live'),
          fetch('/api/optimization'),
        ]);

        if (btPerfRes.ok) setBtPerformance(await btPerfRes.json());
        if (btEquityRes.ok) setBtEquityData(await btEquityRes.json());
        if (livePerfRes.ok) setLivePerformance(await livePerfRes.json());
        if (liveEquityRes.ok) setLiveEquityData(await liveEquityRes.json());
        if (optRes.ok) setOptimization(await optRes.json());
      } catch (e) {
        console.error('Error fetching data:', e);
      }
    }
    fetchData();
  }, []);

  const performance = view === 'backtest' ? btPerformance : livePerformance;
  const equityData = view === 'backtest' ? btEquityData : liveEquityData;

  const totalReturn = performance?.session_pnl_pct
    ?? (equityData && equityData.length >= 2
      ? ((equityData[equityData.length - 1].balance - equityData[0].balance) / equityData[0].balance * 100)
      : null);

  const totalTrades = performance?.total_trades || 0;
  const winRate = performance?.win_rate || 0;
  const winningTrades = Math.round(totalTrades * winRate / 100);

  // Aggregate optimization stats
  const totalCombinations = optimization
    ? optimization.reduce((acc, run) => acc + run.total_combinations, 0)
    : 0;

  return (
    <div>
      <div className="mx-auto max-w-4xl px-6">
        {/* Hero — Personal + Outcome */}
        <section className="py-16 md:py-20">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <span className="h-2 w-2 rounded-full bg-green-600 pulse-dot" />
            <span>Trading live on dYdX v4</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight leading-tight">
            Owen Hobbs
          </h1>
          <p className="mt-2 text-muted-foreground">
            Trading Operations &rarr; Algorithmic Systems
          </p>
          <p className="mt-4 text-muted-foreground max-w-2xl leading-relaxed">
            Built a complete algorithmic trading system — strategy design, backtesting,
            optimization, live execution, and AI-powered monitoring — with Claude as
            development partner.
          </p>
          {btPerformance && (
            <p className="mt-6 text-4xl font-semibold text-green-600 tracking-tight">
              +{btPerformance.session_pnl_pct.toFixed(0)}% backtest return
            </p>
          )}
        </section>

        {/* Results — Moved Up (Progressive Disclosure) */}
        <section className="py-12 border-t border-border">
          <div className="flex items-center justify-between mb-2">
            <SectionHeading>Results</SectionHeading>
            <ViewToggle view={view} onViewChange={setView} size="sm" />
          </div>
          <p className="text-xs text-muted-foreground mb-8">
            {view === 'backtest'
              ? 'ProScore2 · Jul 2025 – Jan 2026'
              : 'ProScore2 · Live since Feb 2026'
            }
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            <MetricCard
              label="Return"
              value={totalReturn !== null ? `${totalReturn >= 0 ? '+' : ''}${totalReturn.toFixed(1)}%` : '—'}
              positive={totalReturn !== null && totalReturn >= 0}
              negative={totalReturn !== null && totalReturn < 0}
            />
            <MetricCard
              label="Win Rate"
              subLabel="of trades profitable"
              value={performance ? `${performance.win_rate.toFixed(1)}%` : '—'}
              subtext={performance ? `${winningTrades}/${totalTrades} trades` : undefined}
            />
            <MetricCard
              label="Sharpe Ratio"
              subLabel="risk-adjusted return"
              value={performance?.sharpe_ratio?.toFixed(2) || '—'}
              positive={(performance?.sharpe_ratio || 0) > 1}
            />
            <MetricCard
              label="Max Drawdown"
              subLabel="worst peak-to-trough drop"
              value={performance ? `-${performance.max_drawdown_pct.toFixed(1)}%` : '—'}
              negative={!!performance}
            />
          </div>

          {/* Benchmark comparison */}
          {performance?.benchmark_return_pct != null && totalReturn !== null && (
            <p className="text-xs text-muted-foreground mb-4">
              <span className={totalReturn >= 0 ? 'text-green-600' : 'text-red-600'}>
                Strategy: {totalReturn >= 0 ? '+' : ''}{totalReturn.toFixed(1)}%
              </span>
              {'  vs  '}
              <span className={performance.benchmark_return_pct >= 0 ? 'text-green-600/70' : 'text-muted-foreground'}>
                BTC buy-and-hold: {performance.benchmark_return_pct >= 0 ? '+' : ''}{performance.benchmark_return_pct.toFixed(1)}%
              </span>
            </p>
          )}

          {/* Live context note */}
          {view === 'live' && totalTrades > 0 && totalTrades < 30 && (
            <p className="text-xs text-muted-foreground/70 italic mb-4">
              Early-stage track record — statistical significance requires 30+ trades.
            </p>
          )}

          {/* Sparkline */}
          <div className="h-24 border border-border rounded bg-card/50 p-2">
            {equityData ? (
              <SparklineChart data={equityData} />
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground text-xs">Loading...</div>
            )}
          </div>

          <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
            <span>
              {view === 'backtest'
                ? 'BTC-USD 15m | 7-month backtest'
                : 'BTC-USD perpetuals | 15m timeframe'
              }
            </span>
            <Link
              href={`/dashboard?view=${view}`}
              className="inline-flex items-center gap-1 hover:text-foreground transition-colors"
            >
              Full dashboard <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </section>

        {/* How It Works — Condensed Workflow */}
        <section className="py-12 border-t border-border">
          <SectionHeading className="mb-10">How It Works</SectionHeading>

          <div className="space-y-0">
            <StepIndicator
              variant="timeline"
              number="01"
              title="Strategy Design"
              status="complete"
              description="Defined trading hypothesis: mean-reversion with funding rate confirmation on BTC-USD perpetuals."
            />
            <StepIndicator
              variant="timeline"
              number="02"
              title="Build Strategy"
              status="complete"
              description="Implemented matching backtest and live trading code — both generate identical signals from the same parameters."
            />
            <StepIndicator
              variant="timeline"
              number="03"
              title="Parameter Optimization"
              status="complete"
              description={`Systematic parameter sweeps with constraint filtering. ${totalCombinations.toLocaleString()} combinations tested.`}
            />
            <StepIndicator
              variant="timeline"
              number="04"
              title="Live Deployment"
              status="complete"
              description="Deployed to dYdX v4 perpetual futures with automated risk controls and sub-second execution."
            />
            <StepIndicator
              variant="timeline"
              number="05"
              title="AI Monitoring"
              status="active"
              description="6 Claude-powered agents monitor the system 24/7 — detecting bugs, validating signals, and analyzing performance."
              isLast
            />
          </div>
        </section>

        {/* Under the Hood — Merged Tech + AI */}
        <section className="py-12 border-t border-border">
          <SectionHeading className="mb-8">Under the Hood</SectionHeading>

          <div className="grid gap-4 md:grid-cols-2 mb-8">
            <InfoCard
              variant="compact"
              title="NautilusTrader"
              description="High-performance trading framework (Rust/Python). Event-driven architecture with tick-level backtesting precision."
              titleClassName="font-semibold"
              className="p-4"
            />
            <InfoCard
              variant="compact"
              title="dYdX v4"
              description="Decentralized perpetual futures on Cosmos SDK. On-chain order book with sub-second block finality."
              titleClassName="font-semibold"
              className="p-4"
            />
            <InfoCard
              variant="compact"
              title="Claude AI"
              description="Anthropic's language model powering development partnership, code generation, and the autonomous agent framework."
              titleClassName="font-semibold"
              className="p-4"
            />
            <InfoCard
              variant="compact"
              title="Python"
              description="Core trading logic with async processing, NumPy/Pandas analytics, and type-safe validation via Pydantic."
              titleClassName="font-semibold"
              className="p-4"
            />
          </div>

          <div className="border border-border rounded p-4 bg-card/30 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">AI Agent Framework</p>
              <p className="text-xs text-muted-foreground mt-1">
                6 specialized agents monitor the live system 24/7 — bug detection, health checks, signal validation, and more.
              </p>
            </div>
            <Link
              href="/system"
              className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors shrink-0 ml-4"
            >
              Learn more <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </section>

        {/* What's Next */}
        <section className="py-12 border-t border-border">
          <SectionHeading className="mb-8">What&apos;s Next</SectionHeading>

          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-foreground mt-0.5">-</span>
              <span>Deeper backtesting rigor — expanding in-sample/out-of-sample validation to stress-test strategies across unseen market conditions.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-foreground mt-0.5">-</span>
              <span>New strategy classes — Order Book Imbalance and orderflow analysis, adding microstructure-based edges alongside mean-reversion.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-foreground mt-0.5">-</span>
              <span>ML integration — machine learning for regime detection and pattern recognition, letting the system adapt to changing market conditions.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-foreground mt-0.5">-</span>
              <span>Autonomous strategy pipeline — I provide the strategy design, AI agents handle the build, backtesting, optimization, and reporting end-to-end.</span>
            </li>
          </ul>
        </section>

        {/* Navigation CTAs */}
        <section className="py-12 border-t border-border">
          <div className="grid gap-4 md:grid-cols-3">
            <Link href="/dashboard" className="group border border-border rounded p-6 hover:border-foreground/20 transition-colors">
              <BarChart3 className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors mb-3" />
              <h3 className="font-semibold mb-1">Dashboard</h3>
              <p className="text-xs text-muted-foreground">Equity curves, trade history, and optimization results.</p>
            </Link>
            <Link href="/system" className="group border border-border rounded p-6 hover:border-foreground/20 transition-colors">
              <Cpu className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors mb-3" />
              <h3 className="font-semibold mb-1">System</h3>
              <p className="text-xs text-muted-foreground">Architecture, code structure, and the AI agent framework.</p>
            </Link>
            <Link href="/about" className="group border border-border rounded p-6 hover:border-foreground/20 transition-colors">
              <User className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors mb-3" />
              <h3 className="font-semibold mb-1">About</h3>
              <p className="text-xs text-muted-foreground">Owen&apos;s background, the Claude partnership, and contact.</p>
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
}
