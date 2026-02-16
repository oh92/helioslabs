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
              <p className="text-muted-foreground mt-1">Head of Trading Operations & Product Platforms</p>
              <p className="text-sm text-muted-foreground mt-1">United States · Hong Kong · Singapore</p>
            </div>
          </div>

          <div className="mt-8 space-y-4 text-muted-foreground leading-relaxed">
            <p>
              I lead Trading Operations & Product Platforms at CoinAlpha, the company behind
              Hummingbot, the most widely used open-source market making framework. I manage the
              trading team responsible for our client accounts, own the execution infrastructure
              they operate on, and build the platforms on top of it: performance dashboards,
              execution quality tracking, automated reporting, and the operational tooling that
              keeps 100+ concurrent trading markets running at 99%+ uptime. Representing CoinAlpha
              internationally across Hong Kong, Singapore, and the U.S., I&apos;ve seen firsthand
              what institutional clients need and how platforms should serve them.
            </p>
            <p>
              That experience showed me a gap: the tools existed to build institutional-quality
              trading systems, but connecting strategy research, backtesting, optimization, live
              execution, and monitoring into a single cohesive pipeline required deep domain
              knowledge that most engineers don&apos;t have, and most traders can&apos;t build.
            </p>
            <p>
              Helios is my answer. I&apos;m not a software engineer by training. I&apos;m an
              operations and platform leader who built this system to prove that domain expertise
              paired with AI can produce something that stands up to professional scrutiny. Every
              line of strategy code, every infrastructure decision, and this website were built in
              partnership with Claude.
            </p>
          </div>
        </section>

        {/* Built With Claude */}
        <section className="py-12 border-t border-border">
          <SectionHeading className="mb-8">Built With Claude</SectionHeading>

          <div className="space-y-4 text-muted-foreground leading-relaxed mb-8">
            <p>
              Claude isn&apos;t just a tool I used. It&apos;s a development partner. The entire
              Helios system was built through continuous collaboration: discussing architecture
              decisions, debugging edge cases, reviewing trading logic, and iterating on this
              website&apos;s design.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <InfoCard
              title="Strategy Development"
              description="Signal generation logic, entry/exit rules, risk management, and position sizing, all developed through iterative dialogue."
              className="rounded p-4"
            />
            <InfoCard
              title="Infrastructure"
              description="NautilusTrader integration, dYdX adapter, order lifecycle management, and the complete backtesting pipeline."
              className="rounded p-4"
            />
            <InfoCard
              title="This Website"
              description="Next.js frontend, Supabase data architecture, Recharts visualizations, and automated webhook pipeline for live trade ingestion."
              className="rounded p-4"
            />
            <InfoCard
              title="Monitoring Agents"
              description="An autonomous agent framework where Claude-powered agents monitor the live trading system 24/7, detecting bugs and analyzing performance."
              className="rounded p-4"
            />
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
            <div className="text-xs text-muted-foreground mb-2">$ python -m helios.cli.agents monitor</div>
            <div className="space-y-1 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-green-600">[OK]</span>
                <span>supervisor: All agents reporting nominal</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-600">[OK]</span>
                <span>bug_detector: No critical issues</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-600">[OK]</span>
                <span>health_checker: All systems operational</span>
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <InfoCard
              variant="compact"
              title="supervisor"
              titleClassName="text-sm text-green-600"
              description="Meta-orchestration: dispatches agents, aggregates findings, escalates critical issues"
            />
            <InfoCard
              variant="compact"
              title="bug_detector"
              titleClassName="text-sm text-green-600"
              description="Analyzes code changes and runtime logs for order fill mismatches and position desync"
            />
            <InfoCard
              variant="compact"
              title="health_checker"
              titleClassName="text-sm text-green-600"
              description="Monitors API connectivity, memory usage, process heartbeats, and connection stability"
            />
            <InfoCard
              variant="compact"
              title="trade_analyst"
              titleClassName="text-sm text-green-600"
              description="Reviews completed trades for win/loss patterns, exit timing, and performance insights"
            />
            <InfoCard
              variant="compact"
              title="signal_validator"
              titleClassName="text-sm text-green-600"
              description="Verifies signal generation, checks threshold consistency, identifies missed opportunities"
            />
            <InfoCard
              variant="compact"
              title="backtest_comparator"
              titleClassName="text-sm text-green-600"
              description="Trade-by-trade matching between backtest and live, divergence detection, root cause analysis"
            />
          </div>

          <div className="mt-6 text-xs text-muted-foreground">
            <span className="text-foreground">Continuous monitoring:</span> Agents run every 15 minutes,
            maintain memory across cycles, track persistent issues, and escalate new critical findings.
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
