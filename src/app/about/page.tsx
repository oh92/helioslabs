import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Github,
  Linkedin,
  Mail,
  Target,
  Code2,
  Brain,
  Shield,
  Layers,
  LineChart,
  Lock,
} from "lucide-react";

const skills = [
  {
    icon: LineChart,
    title: "Quantitative Trading System Design",
    description: "End-to-end design of algorithmic trading systems with systematic strategy development and rigorous backtesting.",
  },
  {
    icon: Code2,
    title: "Python Backend Development",
    description: "High-performance backend systems using NautilusTrader for institutional-grade execution.",
  },
  {
    icon: Brain,
    title: "AI/ML Integration with Claude",
    description: "AI-assisted strategy development, trade analysis, and automated monitoring using Claude.",
  },
  {
    icon: Shield,
    title: "Risk Management Systems",
    description: "Position sizing, stop-loss logic, drawdown limits, and comprehensive risk controls.",
  },
  {
    icon: Layers,
    title: "Full-Stack Development",
    description: "Modern web applications with Next.js, TypeScript, React, and TailwindCSS.",
  },
];

const projectGoals = [
  {
    icon: Target,
    title: "Showcase Technical Capability",
    description: "Demonstrate proficiency across the full stack of quantitative trading system development.",
  },
  {
    icon: LineChart,
    title: "Demonstrate Systematic Approach",
    description: "Illustrate a disciplined, data-driven methodology for strategy development and deployment.",
  },
  {
    icon: Brain,
    title: "AI-Assisted Development Workflow",
    description: "Leverage AI tools like Claude to accelerate development, improve code quality, and enable sophisticated analysis.",
  },
];

const contactLinks = [
  {
    icon: Github,
    label: "GitHub",
    href: "https://github.com/oh92",
    username: "@oh92",
  },
  {
    icon: Linkedin,
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/owen-hobbs/",
    username: "Owen Hobbs",
  },
  {
    icon: Mail,
    label: "Email",
    href: "mailto:hello@owen-hobbs.com",
    username: "hello@owen-hobbs.com",
  },
];

export default function AboutPage() {
  return (
    <div className="flex flex-col">
      {/* Page Header */}
      <section className="relative px-6 py-16 lg:py-24">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
        <div className="relative mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            About <span className="text-primary">Helios Labs</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground">
            Building transparent, AI-assisted algorithmic trading systems
          </p>
        </div>
      </section>

      {/* Introduction */}
      <section className="px-6 py-12">
        <div className="mx-auto max-w-4xl">
          <Card className="border-border/50 bg-card/50">
            <CardContent className="pt-6">
              <p className="text-lg leading-relaxed text-muted-foreground">
                Helios Labs is a personal project showcasing the development of a complete
                algorithmic trading system. From strategy design and backtesting to live
                execution on dYdX perpetuals, this platform demonstrates a systematic,
                transparent approach to quantitative trading with AI-assisted development.
              </p>
              <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
                The goal is not just to trade, but to document and share the entire process:
                the architecture decisions, the backtesting methodology, the risk management
                framework, and the real performance results.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Skills Demonstrated */}
      <section className="border-t border-border/50 bg-card/30 px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="text-2xl font-semibold sm:text-3xl">Skills Demonstrated</h2>
            <p className="mt-2 text-muted-foreground">
              Technical capabilities showcased in this project
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {skills.map((skill) => (
              <Card key={skill.title} className="border-border/50 bg-card/50">
                <CardContent className="pt-6">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <skill.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold">{skill.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {skill.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Project Goals */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="text-2xl font-semibold sm:text-3xl">Project Goals</h2>
            <p className="mt-2 text-muted-foreground">
              What this project aims to achieve
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {projectGoals.map((goal) => (
              <Card key={goal.title} className="border-border/50 bg-card/50">
                <CardContent className="pt-6">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <goal.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold">{goal.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {goal.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Data Privacy Note */}
      <section className="border-t border-border/50 bg-card/30 px-6 py-12">
        <div className="mx-auto max-w-4xl">
          <Card className="border-border/50 bg-card/50">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Lock className="h-5 w-5 text-primary" />
                </div>
                <CardTitle>A Note on Data Privacy</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                All trade data displayed on this platform is intentionally delayed, and
                strategy parameters are sanitized to protect proprietary information.
                While the system is fully operational and trading live, the specific
                details shared here are designed to demonstrate capability without
                exposing sensitive trading logic or real-time positions.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Contact Section */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-4xl">
          <div className="mb-12 text-center">
            <h2 className="text-2xl font-semibold sm:text-3xl">Get in Touch</h2>
            <p className="mt-2 text-muted-foreground">
              Interested in learning more or collaborating?
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            {contactLinks.map((contact) => (
              <Button
                key={contact.label}
                asChild
                variant="outline"
                size="lg"
                className="min-w-[200px]"
              >
                <Link href={contact.href} target="_blank" rel="noopener noreferrer">
                  <contact.icon className="mr-2 h-5 w-5" />
                  {contact.username}
                </Link>
              </Button>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-2">
            <Badge variant="outline">Quantitative Trading</Badge>
            <Badge variant="outline">Python</Badge>
            <Badge variant="outline">TypeScript</Badge>
            <Badge variant="outline">AI/ML</Badge>
            <Badge variant="outline">Next.js</Badge>
            <Badge variant="outline">NautilusTrader</Badge>
          </div>
        </div>
      </section>
    </div>
  );
}
