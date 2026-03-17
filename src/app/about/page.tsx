import Image from "next/image";
import Link from "next/link";
import { Github, Linkedin, Mail } from "lucide-react";
import { SectionHeading } from "@/components/display/SectionHeading";
import { InfoCard } from "@/components/display/InfoCard";

export default function AboutPage() {
  return (
    <div>
      <div className="mx-auto max-w-4xl px-6">
        {/* Owen Section */}
        <section className="py-16">
          <div className="flex flex-col sm:flex-row items-start gap-8">
            <Image
              src="/owen-hobbs.jpg"
              alt="Owen Hobbs"
              width={128}
              height={128}
              className="rounded-full object-cover shrink-0"
            />
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Owen Hobbs</h1>
              <p className="text-muted-foreground mt-1">Former Head of Trading &amp; Product Platforms · CoinAlpha (Hummingbot)</p>
              <p className="text-sm text-muted-foreground mt-1">United States · Hong Kong · Singapore</p>
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {/* Card 1: The Background */}
            <div className="border border-border rounded-lg p-5 bg-card/30">
              <h3 className="font-semibold mb-2">The Background</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                Led trading operations at CoinAlpha (Hummingbot), the most widely used open-source
                market making framework. Managed teams, execution infrastructure, and operational
                tooling across international markets.
              </p>
              <div className="pt-3 border-t border-border text-xs text-muted-foreground font-mono">
                100+ markets · 99%+ uptime · 3 regions
              </div>
            </div>

            {/* Card 2: The Gap */}
            <div className="border border-border rounded-lg p-5 bg-card/30">
              <h3 className="font-semibold mb-2">The Gap</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                Tools existed for each step individually, but connecting them into a single cohesive
                pipeline required domain knowledge most engineers don&apos;t have — and most traders
                can&apos;t build.
              </p>
              <div className="pt-3 border-t border-border text-xs text-muted-foreground font-mono">
                research → backtest → optimize → deploy → monitor
              </div>
            </div>

            {/* Card 3: The Approach — green accent */}
            <div className="border border-green-600/30 rounded-lg p-5 bg-green-600/[0.03]">
              <h3 className="font-semibold mb-2">The Approach</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                Domain expertise + AI = force multiplier. Every architecture decision and line of code
                built with Claude. Not an engineer by training — an operations leader who proved the
                model works.
              </p>
              <div className="pt-3 border-t border-green-600/20 text-xs text-green-600 font-mono">
                domain expert + AI = force multiplier
              </div>
            </div>
          </div>
        </section>

        {/* Built With Claude */}
        <section className="py-12 border-t border-border">
          <SectionHeading className="mb-8">Built With Claude</SectionHeading>

          <div className="space-y-4 text-muted-foreground leading-relaxed mb-8">
            <p>
              Claude isn&apos;t just a tool I used. It&apos;s a development partner. The entire
              Helios system was built through continuous collaboration: designing the agent
              architecture, implementing the research pipeline, debugging edge cases, and
              iterating on this website&apos;s design.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="border border-border rounded-lg p-4 bg-card/30">
              <span className="text-[10px] font-mono text-muted-foreground/60 uppercase tracking-wider">Architecture</span>
              <h3 className="font-semibold mt-1 mb-1">Agent Architecture</h3>
              <p className="text-sm text-muted-foreground">Three-layer monitoring system — deterministic checks, LLM analysts, rule-based router. 93% cost reduction through intelligent escalation.</p>
            </div>
            <div className="border border-border rounded-lg p-4 bg-card/30">
              <span className="text-[10px] font-mono text-muted-foreground/60 uppercase tracking-wider">Research</span>
              <h3 className="font-semibold mt-1 mb-1">Research Pipeline</h3>
              <p className="text-sm text-muted-foreground">Autonomous research agents that test trading hypotheses through budget-constrained, goal-directed experimentation.</p>
            </div>
            <div className="border border-border rounded-lg p-4 bg-card/30">
              <span className="text-[10px] font-mono text-muted-foreground/60 uppercase tracking-wider">Frontend</span>
              <h3 className="font-semibold mt-1 mb-1">This Website</h3>
              <p className="text-sm text-muted-foreground">Next.js frontend, Supabase data architecture, Recharts visualizations, and automated webhook pipeline for live trade ingestion.</p>
            </div>
            <div className="border border-border rounded-lg p-4 bg-card/30">
              <span className="text-[10px] font-mono text-muted-foreground/60 uppercase tracking-wider">Operations</span>
              <h3 className="font-semibold mt-1 mb-1">Live Monitoring</h3>
              <p className="text-sm text-muted-foreground">24/7 autonomous operation with crash recovery, state persistence, and cross-agent escalation for anomaly investigation.</p>
            </div>
          </div>
        </section>

        {/* The Agent Team */}
        <section className="py-12 border-t border-border">
          <SectionHeading
            className="mb-8"
            action={<span className="text-xs text-muted-foreground">Powered by Claude</span>}
          >
            The Agent Team
          </SectionHeading>

          <div className="bg-card border border-border rounded p-4 mb-6">
            <div className="text-xs text-muted-foreground mb-2">$ helios agents --status</div>
            <div className="space-y-1 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-green-600">[LAYER 1]</span>
                <span>deterministic checks: 6 active, all passing</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-yellow-500">[LAYER 2]</span>
                <span>llm analysts: 3 on standby, 0 active</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-600">[LAYER 3]</span>
                <span>router: nominal, next cycle in 28m</span>
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <InfoCard
              variant="compact"
              title="bug_check"
              titleClassName="text-sm text-green-600"
              description="Code changes, runtime errors, stack traces — deterministic, instant, free"
            />
            <InfoCard
              variant="compact"
              title="health_check"
              titleClassName="text-sm text-green-600"
              description="API connectivity, memory, process heartbeats — deterministic, instant, free"
            />
            <InfoCard
              variant="compact"
              title="signal_check"
              titleClassName="text-sm text-green-600"
              description="Signal consistency, threshold drift — deterministic, instant, free"
            />
            <InfoCard
              variant="compact"
              title="trade_analyst"
              titleClassName="text-sm text-yellow-500"
              description="Win/loss patterns, exit timing analysis — LLM, on-demand when flagged"
            />
            <InfoCard
              variant="compact"
              title="investigation_analyst"
              titleClassName="text-sm text-yellow-500"
              description="Root cause analysis for anomalies — LLM, on-demand when flagged"
            />
            <InfoCard
              variant="compact"
              title="strategy_analyst"
              titleClassName="text-sm text-yellow-500"
              description="Strategy health, adaptation recommendations — LLM, on-demand when flagged"
            />
          </div>

          <div className="mt-6 text-xs text-muted-foreground">
            <span className="text-foreground">Deterministic-first:</span> Checks run every cycle at zero cost.
            LLM analysts are invoked only when checks detect anomalies requiring reasoning.
          </div>
        </section>

        {/* What's Next */}
        <section className="py-12 border-t border-border">
          <SectionHeading className="mb-8">What&apos;s Next</SectionHeading>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="border border-border rounded-lg p-4 bg-card/30">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-sm">Autonomous Strategy Pipeline</h3>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-green-600/10 text-green-600 uppercase tracking-wider">In Progress</span>
              </div>
              <p className="text-sm text-muted-foreground">I provide the hypothesis, agents handle build, backtest, optimize, validate, and deploy end-to-end.</p>
            </div>
            <div className="border border-border rounded-lg p-4 bg-card/30">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-sm">ML Regime Detection</h3>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-muted text-muted-foreground uppercase tracking-wider">Planned</span>
              </div>
              <p className="text-sm text-muted-foreground">Machine learning agents that identify market regime changes and adapt strategy parameters automatically.</p>
            </div>
            <div className="border border-border rounded-lg p-4 bg-card/30">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-sm">Portfolio Optimizer Agent</h3>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-muted text-muted-foreground uppercase tracking-wider">Planned</span>
              </div>
              <p className="text-sm text-muted-foreground">Autonomous cross-market allocation, position sizing, and correlation management.</p>
            </div>
            <div className="border border-border rounded-lg p-4 bg-card/30">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-sm">Multi-Market Expansion</h3>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-muted text-muted-foreground uppercase tracking-wider">Planned</span>
              </div>
              <p className="text-sm text-muted-foreground">Extending the agent platform to manage ETH, SOL, and other markets simultaneously.</p>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="py-12 border-t border-border">
          <SectionHeading className="mb-8">Contact</SectionHeading>

          <div className="flex flex-wrap gap-6">
            <Link
              href="https://github.com/oh92/helioslabs"
              target="_blank"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <Github className="h-4 w-4" />
              @oh92
            </Link>
            <Link
              href="https://www.linkedin.com/in/owen-hobbs/"
              target="_blank"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <Linkedin className="h-4 w-4" />
              Owen Hobbs
            </Link>
            <Link
              href="mailto:hello@owen-hobbs.com"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <Mail className="h-4 w-4" />
              hello@owen-hobbs.com
            </Link>
          </div>
        </section>

        {/* Data Privacy Note */}
        <section className="py-12 border-t border-border">
          <div className="border border-border rounded p-6 bg-card/30">
            <h3 className="font-semibold mb-3">A Note on Data Privacy</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              All trade data displayed on this platform is intentionally delayed, and
              strategy parameters are sanitized to protect proprietary information.
              While the system is fully operational and trading live, the specific
              details shared here are designed to demonstrate capability without
              exposing sensitive trading logic or real-time positions.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
