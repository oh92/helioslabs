'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Activity,
  Brain,
  Cpu,
  Database,
  GitBranch,
  Layers,
  LineChart,
  MessageSquare,
  Network,
  Radio,
  Server,
  Shield,
  Terminal,
  Workflow,
  Zap,
  ArrowRight,
  ArrowDown,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Eye,
  Bug,
  HeartPulse,
  BarChart3,
  Code2,
  Boxes,
  RefreshCw,
  Lock,
  Clock,
  Gauge,
  FileCode,
  FolderTree,
  Plug,
  Send,
} from "lucide-react";

// Technology stack with detailed descriptions
const technologyStack = [
  {
    category: "Execution Engine",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/30",
    items: [
      {
        name: "NautilusTrader",
        icon: Zap,
        description: "High-performance algorithmic trading framework written in Rust/Python",
        details: [
          "Event-driven architecture for low-latency execution",
          "Built-in backtesting engine with tick-level precision",
          "Portfolio management with multi-asset support",
          "Execution algorithms and smart order routing",
        ],
      },
    ],
  },
  {
    category: "Exchange Connectivity",
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/30",
    items: [
      {
        name: "dYdX v4",
        icon: Network,
        description: "Decentralized perpetual futures exchange built on Cosmos SDK",
        details: [
          "On-chain order book with validator consensus",
          "WebSocket streaming for real-time market data",
          "REST API for order management",
          "Sub-second block finality for trade settlement",
        ],
      },
    ],
  },
  {
    category: "AI Intelligence",
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/30",
    items: [
      {
        name: "Claude AI",
        icon: Brain,
        description: "Anthropic's advanced language model for intelligent monitoring",
        details: [
          "Autonomous agent framework for trade analysis",
          "Natural language bug detection and code review",
          "Health monitoring with contextual insights",
          "Anomaly detection in trading patterns",
        ],
      },
    ],
  },
  {
    category: "Backend",
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10",
    borderColor: "border-yellow-500/30",
    items: [
      {
        name: "Python",
        icon: Terminal,
        description: "Core trading logic and strategy implementation",
        details: [
          "Async/await for concurrent data processing",
          "NumPy/Pandas for quantitative analysis",
          "Type hints with Pydantic validation",
          "Poetry for dependency management",
        ],
      },
    ],
  },
  {
    category: "Frontend",
    color: "text-cyan-500",
    bgColor: "bg-cyan-500/10",
    borderColor: "border-cyan-500/30",
    items: [
      {
        name: "TypeScript/Next.js",
        icon: Code2,
        description: "Modern web dashboard for monitoring and analysis",
        details: [
          "Server-side rendering for fast initial load",
          "Real-time updates via WebSocket connections",
          "Recharts for interactive data visualization",
          "Tailwind CSS with shadcn/ui components",
        ],
      },
    ],
  },
];

// AI Agents configuration
const aiAgents = [
  {
    name: "Bug Detector Agent",
    icon: Bug,
    color: "text-red-500",
    bgColor: "bg-red-500/10",
    borderColor: "border-red-500/30",
    purpose: "Identifies code issues, runtime errors, and potential bugs in the trading system",
    capabilities: [
      "Static analysis of strategy code",
      "Exception pattern recognition",
      "Dependency conflict detection",
      "Log anomaly identification",
    ],
    triggers: ["Code changes", "Error logs", "Failed tests", "Stack traces"],
  },
  {
    name: "Health Checker Agent",
    icon: HeartPulse,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
    borderColor: "border-green-500/30",
    purpose: "Monitors system health, connectivity, and resource utilization",
    capabilities: [
      "API endpoint health checks",
      "Memory/CPU utilization monitoring",
      "Network latency measurement",
      "Process heartbeat verification",
    ],
    triggers: ["Scheduled intervals", "Threshold breaches", "Connection drops", "Resource alerts"],
  },
  {
    name: "Trade Analyst Agent",
    icon: BarChart3,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/30",
    purpose: "Analyzes trading performance, patterns, and provides actionable insights",
    capabilities: [
      "Win/loss pattern analysis",
      "Drawdown attribution",
      "Market regime detection",
      "Strategy performance review",
    ],
    triggers: ["Trade completion", "Session end", "Drawdown events", "Performance queries"],
  },
];

// Code architecture modules
const codeModules = [
  {
    name: "Core",
    path: "/core",
    icon: Cpu,
    description: "Trading primitives and domain models",
    components: ["Order", "Position", "Instrument", "Account", "Event"],
  },
  {
    name: "Strategy",
    path: "/strategy",
    icon: GitBranch,
    description: "Signal generation and decision logic",
    components: ["BaseStrategy", "SignalGenerator", "EntryRules", "ExitRules", "Filters"],
  },
  {
    name: "Execution",
    path: "/execution",
    icon: Send,
    description: "Order management and exchange interaction",
    components: ["OrderExecutor", "PositionManager", "RiskController", "FillHandler"],
  },
  {
    name: "Data",
    path: "/data",
    icon: Database,
    description: "Market data ingestion and storage",
    components: ["DataFeed", "BarAggregator", "TickProcessor", "DataStore"],
  },
  {
    name: "Adapters",
    path: "/adapters",
    icon: Plug,
    description: "Exchange-specific implementations",
    components: ["DydxAdapter", "WebSocketClient", "RestClient", "AuthHandler"],
  },
  {
    name: "Agents",
    path: "/agents",
    icon: Brain,
    description: "AI monitoring and analysis agents",
    components: ["AgentOrchestrator", "BugDetector", "HealthChecker", "TradeAnalyst"],
  },
];

export default function ArchitecturePage() {
  return (
    <div className="flex flex-col">
      {/* Header */}
      <section className="relative px-6 py-16 lg:py-24">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
        <div className="relative mx-auto max-w-6xl">
          <div className="flex flex-col items-center text-center">
            <Badge variant="secondary" className="mb-6">
              <Layers className="mr-1.5 h-3 w-3" />
              Technical Deep Dive
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              System <span className="text-primary">Architecture</span>
            </h1>
            <p className="mt-6 max-w-3xl text-lg text-muted-foreground">
              A comprehensive look at the engineering behind Helios: from high-frequency market data
              ingestion to AI-powered monitoring agents. Built for reliability, performance, and observability.
            </p>
          </div>
        </div>
      </section>

      <Separator className="mx-auto max-w-6xl" />

      {/* System Overview Diagram */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12">
            <h2 className="text-2xl font-semibold sm:text-3xl">System Overview</h2>
            <p className="mt-2 text-muted-foreground">
              High-level architecture showing data flow through the trading system
            </p>
          </div>

          {/* ASCII-style diagram using cards */}
          <div className="relative">
            {/* Main flow */}
            <div className="grid gap-4 md:grid-cols-4">
              {/* Data Ingestion */}
              <Card className="border-purple-500/30 bg-purple-500/5">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10">
                      <Radio className="h-5 w-5 text-purple-500" />
                    </div>
                    <CardTitle className="text-base">Data Ingestion</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-purple-500" />
                      WebSocket streams
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-purple-500" />
                      Order book snapshots
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-purple-500" />
                      Trade ticks
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-purple-500" />
                      Funding rates
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Strategy Engine */}
              <Card className="border-blue-500/30 bg-blue-500/5">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                      <Workflow className="h-5 w-5 text-blue-500" />
                    </div>
                    <CardTitle className="text-base">Strategy Engine</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                      Signal generation
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                      Entry/exit logic
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                      Position sizing
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                      Parameter state
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Position Management */}
              <Card className="border-emerald-500/30 bg-emerald-500/5">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
                      <Layers className="h-5 w-5 text-emerald-500" />
                    </div>
                    <CardTitle className="text-base">Position Mgmt</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      Open positions
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      PnL tracking
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      Order lifecycle
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      Fill reconciliation
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Risk Controls */}
              <Card className="border-red-500/30 bg-red-500/5">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/10">
                      <Shield className="h-5 w-5 text-red-500" />
                    </div>
                    <CardTitle className="text-base">Risk Controls</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-red-500" />
                      Drawdown limits
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-red-500" />
                      Position caps
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-red-500" />
                      Stop-loss orders
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-red-500" />
                      Circuit breakers
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Flow arrows */}
            <div className="mt-6 flex items-center justify-center gap-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Badge variant="outline" className="gap-1">
                  <ArrowRight className="h-3 w-3" />
                  Data Flow
                </Badge>
              </div>
            </div>

            {/* Exchange connection */}
            <div className="mt-8 flex justify-center">
              <Card className="w-full max-w-md border-yellow-500/30 bg-yellow-500/5">
                <CardContent className="flex items-center justify-center gap-4 py-4">
                  <Network className="h-6 w-6 text-yellow-500" />
                  <div className="text-center">
                    <p className="font-semibold">dYdX v4 Exchange</p>
                    <p className="text-sm text-muted-foreground">Cosmos SDK Chain</p>
                  </div>
                  <Network className="h-6 w-6 text-yellow-500" />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Separator className="mx-auto max-w-6xl" />

      {/* Technology Stack */}
      <section className="bg-card/30 px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12">
            <h2 className="text-2xl font-semibold sm:text-3xl">Technology Stack</h2>
            <p className="mt-2 text-muted-foreground">
              Detailed breakdown of the technologies powering each layer of the system
            </p>
          </div>

          <div className="space-y-8">
            {technologyStack.map((category) => (
              <div key={category.category}>
                <div className="mb-4 flex items-center gap-3">
                  <Badge variant="outline" className={`${category.color} ${category.borderColor}`}>
                    {category.category}
                  </Badge>
                </div>
                <div className="grid gap-6 md:grid-cols-1">
                  {category.items.map((item) => (
                    <Card key={item.name} className={`${category.borderColor} ${category.bgColor}`}>
                      <CardHeader>
                        <div className="flex items-start gap-4">
                          <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${category.bgColor}`}>
                            <item.icon className={`h-6 w-6 ${category.color}`} />
                          </div>
                          <div className="flex-1">
                            <CardTitle className="text-lg">{item.name}</CardTitle>
                            <CardDescription className="mt-1">{item.description}</CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid gap-2 sm:grid-cols-2">
                          {item.details.map((detail, idx) => (
                            <div key={idx} className="flex items-start gap-2 text-sm">
                              <CheckCircle2 className={`mt-0.5 h-4 w-4 shrink-0 ${category.color}`} />
                              <span className="text-muted-foreground">{detail}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Separator className="mx-auto max-w-6xl" />

      {/* AI Agent Framework */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12">
            <h2 className="text-2xl font-semibold sm:text-3xl">AI Agent Framework</h2>
            <p className="mt-2 text-muted-foreground">
              Autonomous monitoring agents powered by Claude that provide continuous system oversight
            </p>
          </div>

          {/* Agent orchestration diagram */}
          <Card className="mb-8 border-primary/30 bg-primary/5">
            <CardContent className="py-6">
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Brain className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Agent Orchestrator</h3>
                  <p className="mt-1 max-w-lg text-sm text-muted-foreground">
                    Central coordinator that routes events to appropriate agents, manages agent lifecycle,
                    and aggregates insights for unified reporting
                  </p>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Badge variant="outline" className="gap-1">
                    <RefreshCw className="h-3 w-3" />
                    Event-Driven
                  </Badge>
                  <Badge variant="outline" className="gap-1">
                    <Lock className="h-3 w-3" />
                    Sandboxed Execution
                  </Badge>
                  <Badge variant="outline" className="gap-1">
                    <Clock className="h-3 w-3" />
                    Async Processing
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-center">
            <ArrowDown className="h-8 w-8 text-muted-foreground" />
          </div>

          {/* Individual agents */}
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {aiAgents.map((agent) => (
              <Card key={agent.name} className={`${agent.borderColor} ${agent.bgColor}`}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${agent.bgColor}`}>
                      <agent.icon className={`h-6 w-6 ${agent.color}`} />
                    </div>
                    <CardTitle className="text-base">{agent.name}</CardTitle>
                  </div>
                  <CardDescription className="mt-2">{agent.purpose}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Capabilities
                    </p>
                    <ul className="space-y-1.5">
                      {agent.capabilities.map((cap, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm">
                          <CheckCircle2 className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${agent.color}`} />
                          <span className="text-muted-foreground">{cap}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Separator />
                  <div>
                    <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Triggers
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {agent.triggers.map((trigger, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {trigger}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* How agents work together */}
          <Card className="mt-8 border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                Agent Collaboration
              </CardTitle>
              <CardDescription>
                How the agents work together to provide comprehensive system monitoring
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-semibold">
                      1
                    </div>
                    <div>
                      <p className="font-medium">Event Detection</p>
                      <p className="text-sm text-muted-foreground">
                        System events (trades, errors, metrics) are captured and routed to relevant agents
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-semibold">
                      2
                    </div>
                    <div>
                      <p className="font-medium">Parallel Analysis</p>
                      <p className="text-sm text-muted-foreground">
                        Each agent processes events independently using specialized prompts and context
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-semibold">
                      3
                    </div>
                    <div>
                      <p className="font-medium">Insight Aggregation</p>
                      <p className="text-sm text-muted-foreground">
                        Agent outputs are combined and cross-referenced for comprehensive insights
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-semibold">
                      4
                    </div>
                    <div>
                      <p className="font-medium">Alert Dispatch</p>
                      <p className="text-sm text-muted-foreground">
                        Critical findings trigger notifications via webhook to monitoring dashboard
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator className="mx-auto max-w-6xl" />

      {/* Data Flow Diagram */}
      <section className="bg-card/30 px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12">
            <h2 className="text-2xl font-semibold sm:text-3xl">Data Flow</h2>
            <p className="mt-2 text-muted-foreground">
              Two parallel pipelines: trading execution and system monitoring
            </p>
          </div>

          {/* Trading Pipeline */}
          <div className="mb-12">
            <h3 className="mb-6 flex items-center gap-2 text-lg font-semibold">
              <TrendingUp className="h-5 w-5 text-primary" />
              Trading Pipeline
            </h3>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <FlowNode icon={LineChart} label="Market Data" color="purple" />
              <FlowArrow />
              <FlowNode icon={Workflow} label="Strategy" color="blue" />
              <FlowArrow />
              <FlowNode icon={FileCode} label="Signals" color="cyan" />
              <FlowArrow />
              <FlowNode icon={Send} label="Orders" color="emerald" />
              <FlowArrow />
              <FlowNode icon={Network} label="Exchange" color="yellow" />
              <FlowArrow />
              <FlowNode icon={CheckCircle2} label="Fills" color="green" />
            </div>
          </div>

          {/* Monitoring Pipeline */}
          <div>
            <h3 className="mb-6 flex items-center gap-2 text-lg font-semibold">
              <Eye className="h-5 w-5 text-primary" />
              Monitoring Pipeline
            </h3>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <FlowNode icon={Activity} label="System Events" color="blue" />
              <FlowArrow />
              <FlowNode icon={Brain} label="AI Agents" color="emerald" />
              <FlowArrow />
              <FlowNode icon={Gauge} label="Analysis" color="purple" />
              <FlowArrow />
              <FlowNode icon={AlertTriangle} label="Alerts" color="yellow" />
              <FlowArrow />
              <FlowNode icon={Server} label="Dashboard" color="cyan" />
            </div>
          </div>

          {/* Latency metrics */}
          <div className="mt-12 grid gap-4 sm:grid-cols-4">
            <MetricBadge label="WebSocket Latency" value="<50ms" icon={Zap} />
            <MetricBadge label="Strategy Tick-to-Trade" value="<100ms" icon={Clock} />
            <MetricBadge label="Order Submission" value="<200ms" icon={Send} />
            <MetricBadge label="Agent Response" value="<5s" icon={Brain} />
          </div>
        </div>
      </section>

      <Separator className="mx-auto max-w-6xl" />

      {/* Code Architecture */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12">
            <h2 className="text-2xl font-semibold sm:text-3xl">Code Architecture</h2>
            <p className="mt-2 text-muted-foreground">
              Modular design patterns for maintainability and extensibility
            </p>
          </div>

          {/* Module overview */}
          <div className="mb-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {codeModules.map((module) => (
              <Card key={module.name} className="border-border/50 bg-card/50">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <module.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-base">{module.name}</CardTitle>
                      <code className="text-xs text-muted-foreground">{module.path}</code>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="mb-3 text-sm text-muted-foreground">{module.description}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {module.components.map((comp) => (
                      <Badge key={comp} variant="outline" className="text-xs font-mono">
                        {comp}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Design patterns */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Boxes className="h-5 w-5 text-primary" />
                Design Patterns
              </CardTitle>
              <CardDescription>
                Key architectural patterns used throughout the codebase
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <DesignPatternCard
                  title="Event-Driven Architecture"
                  description="All system components communicate via an event bus, enabling loose coupling and easy extensibility"
                  icon={Activity}
                />
                <DesignPatternCard
                  title="Strategy Pattern"
                  description="Trading strategies implement a common interface, allowing hot-swapping and A/B testing"
                  icon={GitBranch}
                />
                <DesignPatternCard
                  title="Adapter Pattern"
                  description="Exchange-specific logic is isolated behind adapters, making it easy to add new exchanges"
                  icon={Plug}
                />
                <DesignPatternCard
                  title="Command Pattern"
                  description="Orders are encapsulated as command objects, enabling queuing, logging, and replay"
                  icon={Terminal}
                />
                <DesignPatternCard
                  title="Observer Pattern"
                  description="Components subscribe to relevant events, receiving notifications without tight coupling"
                  icon={Eye}
                />
                <DesignPatternCard
                  title="Repository Pattern"
                  description="Data access is abstracted behind repositories, enabling easy switching between storage backends"
                  icon={Database}
                />
              </div>
            </CardContent>
          </Card>

          {/* Code quality badges */}
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Badge variant="outline" className="gap-2 px-4 py-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              Type-Safe Python
            </Badge>
            <Badge variant="outline" className="gap-2 px-4 py-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              100% Type Coverage
            </Badge>
            <Badge variant="outline" className="gap-2 px-4 py-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              Comprehensive Tests
            </Badge>
            <Badge variant="outline" className="gap-2 px-4 py-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              CI/CD Pipeline
            </Badge>
            <Badge variant="outline" className="gap-2 px-4 py-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              Automated Linting
            </Badge>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="border-t border-border/50 bg-card/30 px-6 py-16">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-semibold">Questions About the Architecture?</h2>
          <p className="mt-4 text-muted-foreground">
            This system represents months of iterative development, combining quantitative finance
            principles with modern software engineering practices.
          </p>
          <div className="mt-6 flex justify-center gap-2">
            <Badge variant="secondary" className="gap-1">
              <Activity className="h-3 w-3" />
              Production Ready
            </Badge>
            <Badge variant="secondary" className="gap-1">
              <Shield className="h-3 w-3" />
              Battle Tested
            </Badge>
            <Badge variant="secondary" className="gap-1">
              <Zap className="h-3 w-3" />
              High Performance
            </Badge>
          </div>
        </div>
      </section>
    </div>
  );
}

// Helper components
function FlowNode({
  icon: Icon,
  label,
  color,
}: {
  icon: React.ElementType;
  label: string;
  color: string;
}) {
  const colorClasses: Record<string, { bg: string; text: string; border: string }> = {
    purple: { bg: "bg-purple-500/10", text: "text-purple-500", border: "border-purple-500/30" },
    blue: { bg: "bg-blue-500/10", text: "text-blue-500", border: "border-blue-500/30" },
    cyan: { bg: "bg-cyan-500/10", text: "text-cyan-500", border: "border-cyan-500/30" },
    emerald: { bg: "bg-emerald-500/10", text: "text-emerald-500", border: "border-emerald-500/30" },
    yellow: { bg: "bg-yellow-500/10", text: "text-yellow-500", border: "border-yellow-500/30" },
    green: { bg: "bg-green-500/10", text: "text-green-500", border: "border-green-500/30" },
  };

  const classes = colorClasses[color] || colorClasses.blue;

  return (
    <div className={`flex flex-col items-center gap-2 rounded-lg border p-4 ${classes.bg} ${classes.border}`}>
      <Icon className={`h-6 w-6 ${classes.text}`} />
      <span className="text-xs font-medium">{label}</span>
    </div>
  );
}

function FlowArrow() {
  return <ArrowRight className="h-5 w-5 shrink-0 text-muted-foreground" />;
}

function MetricBadge({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: React.ElementType;
}) {
  return (
    <Card className="border-border/50 bg-card/50">
      <CardContent className="flex items-center gap-3 py-4">
        <Icon className="h-5 w-5 text-primary" />
        <div>
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="font-mono font-semibold">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function DesignPatternCard({
  title,
  description,
  icon: Icon,
}: {
  title: string;
  description: string;
  icon: React.ElementType;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <div>
        <p className="font-medium">{title}</p>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
