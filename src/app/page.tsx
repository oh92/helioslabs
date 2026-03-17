'use client';

import Link from "next/link";
import { useState, useEffect } from "react";
import { ArrowRight, BarChart3, Cpu, User } from "lucide-react";
import { SparklineChart } from "@/components/charts/SparklineChart";
import { SectionHeading } from "@/components/display/SectionHeading";
import { MetricCard } from "@/components/display/MetricCard";
import { ViewToggle } from "@/components/display/ViewToggle";
import { ResearchAgentDemo } from "@/components/display/ResearchAgentDemo";
import type { MarketPerformance, EquityDataPoint } from "@/lib/types";

type ViewMode = 'backtest' | 'live';

export default function Home() {
  const [view, setView] = useState<ViewMode>('backtest');
  const [btPerformance, setBtPerformance] = useState<MarketPerformance | null>(null);
  const [btEquityData, setBtEquityData] = useState<EquityDataPoint[] | null>(null);
  const [livePerformance, setLivePerformance] = useState<MarketPerformance | null>(null);
  const [liveEquityData, setLiveEquityData] = useState<EquityDataPoint[] | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [btPerfRes, btEquityRes, livePerfRes, liveEquityRes] = await Promise.all([
          fetch('/api/performance?source=backtest'),
          fetch('/api/equity?source=backtest'),
          fetch('/api/performance?source=live'),
          fetch('/api/equity?source=live'),
        ]);

        if (btPerfRes.ok) setBtPerformance(await btPerfRes.json());
        if (btEquityRes.ok) setBtEquityData(await btEquityRes.json());
        if (livePerfRes.ok) setLivePerformance(await livePerfRes.json());
        if (liveEquityRes.ok) setLiveEquityData(await liveEquityRes.json());
      } catch (e) {
        console.error('Error fetching data:', e);
      }
    }
    fetchData().catch(() => {});
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

  return (
    <div>
      <div className="mx-auto max-w-4xl px-6">

        {/* ── 1. Hero ── */}
        <section className="py-16 md:py-20">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
            <span className="h-2 w-2 rounded-full bg-green-600 pulse-dot" />
            <span>Live on dYdX v4 · Hyperliquid</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight leading-tight">
            Owen Hobbs
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Trading Systems &middot; AI Architecture &middot; Scalable Design
          </p>
          <p className="mt-1 text-xs text-muted-foreground/60">
            Ex-Head of Trading &amp; Product Platforms &middot; CoinAlpha
          </p>
          <p className="mt-3 text-muted-foreground max-w-xl">
            I built a three-layer AI agent platform that manages live algorithmic
            trading — from autonomous research through deployment to 24/7 monitoring.
          </p>

          {/* Stat Strip — investor-focused */}
          <div className="mt-8 border border-border rounded-lg p-6 bg-card/30">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <MetricCard
                label="Return"
                subLabel="24-mo backtest"
                value={btPerformance ? `+${btPerformance.session_pnl_pct.toFixed(0)}%` : '—'}
                positive={!!btPerformance}
              />
              <MetricCard
                label="Sharpe"
                subLabel="Risk-adjusted"
                value={btPerformance?.sharpe_ratio?.toFixed(2) || '—'}
                positive={(btPerformance?.sharpe_ratio || 0) > 1}
              />
              <MetricCard
                label="Max Drawdown"
                subLabel="Risk control"
                value={btPerformance ? `-${btPerformance.max_drawdown_pct.toFixed(1)}%` : '—'}
                negative={!!btPerformance}
              />
              <MetricCard
                label="Win Rate"
                subLabel="Consistency"
                value={btPerformance ? `${btPerformance.win_rate.toFixed(1)}%` : '—'}
                positive={(btPerformance?.win_rate || 0) > 50}
              />
            </div>
          </div>
        </section>

        {/* ── 2. Results ── */}
        <section className="py-12 border-t border-border">
          <div className="flex items-center justify-between mb-2">
            <SectionHeading>Results</SectionHeading>
            <ViewToggle view={view} onViewChange={setView} size="sm" />
          </div>
          <p className="text-xs text-muted-foreground mb-8">
            {view === 'backtest'
              ? 'ProScore2 · Mar 2024 – Mar 2026 · IS/OOS validated'
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

          {view === 'live' && totalTrades > 0 && totalTrades < 30 && (
            <p className="text-xs text-muted-foreground/70 italic mb-4">
              Early-stage track record — statistical significance requires 30+ trades.
            </p>
          )}

          <div className="h-36 border border-border rounded bg-card/50 p-2">
            {equityData ? (
              <SparklineChart data={equityData} />
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground text-xs">Loading...</div>
            )}
          </div>

          <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
            <span>
              {view === 'backtest'
                ? 'BTC-USD 15m | 24-month backtest | IS/OOS validated'
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

        {/* ── 3. What I Built ── */}
        <section className="py-12 border-t border-border">
          <SectionHeading className="mb-8">What I Built</SectionHeading>

          <div className="grid gap-4 md:grid-cols-3">
            {/* Autonomous Research */}
            <div className="border border-border rounded-lg p-5 bg-card/30">
              <h3 className="font-semibold mb-2">Autonomous Research</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                Agents test trading hypotheses through iterative experimentation —
                baseline measurement, parameter optimization, walk-forward validation.
                Budget-constrained with quality gates on every action.
              </p>
              <div className="pt-3 border-t border-border text-xs text-muted-foreground font-mono">
                IS/OOS validated · Monte Carlo · budget-constrained
              </div>
            </div>

            {/* Multi-Exchange Deployment */}
            <div className="border border-border rounded-lg p-5 bg-card/30">
              <h3 className="font-semibold mb-2">Multi-Exchange Trading</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                Live on dYdX v4 and Hyperliquid with automated risk controls,
                circuit breakers, and a webhook pipeline feeding real trades
                to this dashboard.
              </p>
              <div className="pt-3 border-t border-border text-xs text-muted-foreground font-mono">
                dYdX v4 · Hyperliquid · automated risk controls
              </div>
            </div>

            {/* Monitoring Architecture — green accent */}
            <div className="border border-green-600/30 rounded-lg p-5 bg-green-600/[0.03]">
              <h3 className="font-semibold mb-2">Deterministic-First Monitoring</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                Three-layer system: free deterministic checks do the heavy lifting,
                LLM analysts handle anomalies on-demand, rule-based router orchestrates.
                24/7 autonomous with crash recovery.
              </p>
              <div className="pt-3 border-t border-green-600/20 text-xs text-green-600 font-mono">
                93% cost reduction · 24/7 autonomous · crash recovery
              </div>
            </div>
          </div>
        </section>

        {/* ── 4. The Pivot ── */}
        <section className="py-12 border-t border-border">
          <div className="border border-border rounded-lg p-6 bg-card/30">
            <div className="flex items-baseline gap-3 mb-3">
              <SectionHeading>The Pivot</SectionHeading>
              <span className="text-[10px] font-mono text-muted-foreground/60">the architecture decision</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
              Built 6 Claude-powered agents for 24/7 monitoring. Then realized: 95%+ of
              monitoring cycles find nothing wrong. Paying an LLM to confirm &quot;everything
              is fine&quot; is wasteful. Rebuilt as a three-layer architecture — deterministic
              checks first (free, instant), LLM analysts only when anomalies require reasoning.
              Same coverage, 93% lower cost.
            </p>
          </div>
        </section>

        {/* ── 5. Research Agent Demo ── */}
        <section className="py-12 border-t border-border">
          <SectionHeading className="mb-4">What It Does Today</SectionHeading>
          <p className="text-sm text-muted-foreground mb-6 max-w-2xl">
            The research agent takes a trading hypothesis and autonomously tests it — from baseline
            measurement through parameter optimization to IS/OOS walk-forward validation.
          </p>
          <ResearchAgentDemo compact />
          <div className="mt-4 flex justify-end">
            <Link
              href="/agents"
              className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Full architecture deep dive <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </section>

        {/* ── 6. Navigation CTAs ── */}
        <section className="py-12 border-t border-border">
          <div className="grid gap-4 md:grid-cols-3">
            <Link href="/dashboard" className="group border border-border rounded p-6 hover:border-foreground/20 transition-colors">
              <BarChart3 className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors mb-3" />
              <h3 className="font-semibold mb-1">Dashboard</h3>
              <p className="text-xs text-muted-foreground">24-month backtest — every trade transparent.</p>
            </Link>
            <Link href="/agents" className="group border border-border rounded p-6 hover:border-foreground/20 transition-colors">
              <Cpu className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors mb-3" />
              <h3 className="font-semibold mb-1">Agents</h3>
              <p className="text-xs text-muted-foreground">Three-layer architecture — deterministic-first with 93% cost reduction.</p>
            </Link>
            <Link href="/about" className="group border border-border rounded p-6 hover:border-foreground/20 transition-colors">
              <User className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors mb-3" />
              <h3 className="font-semibold mb-1">About</h3>
              <p className="text-xs text-muted-foreground">CoinAlpha, scaling from zero to 100+ markets, and the Claude partnership.</p>
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
}
