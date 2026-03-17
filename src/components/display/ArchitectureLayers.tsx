interface ArchitectureLayersProps {
  compact?: boolean;
}

const CHECKS = [
  { name: 'bug_check', description: 'Code changes, runtime errors, stack traces' },
  { name: 'health_check', description: 'API connectivity, memory, process heartbeats' },
  { name: 'signal_check', description: 'Signal generation consistency, threshold drift' },
  { name: 'trade_check', description: 'Fill quality, slippage, position reconciliation' },
  { name: 'backtest_check', description: 'Live vs backtest divergence, outcome alignment' },
  { name: 'drift_check', description: 'Performance degradation, regime shift detection' },
];

const ANALYSTS = [
  { name: 'trade_analyst', description: 'Deep analysis of win/loss patterns and exit timing' },
  { name: 'investigation_analyst', description: 'Root cause analysis when checks flag anomalies' },
  { name: 'strategy_analyst', description: 'Strategy health assessment and adaptation recommendations' },
];

export function ArchitectureLayers({ compact = false }: ArchitectureLayersProps) {
  if (compact) {
    return (
      <div className="space-y-3">
        <LayerHeader
          number="1"
          title="Deterministic Checks"
          tag="Always free, instant"
          tagColor="text-green-600"
        />
        <div className="grid grid-cols-3 gap-2 ml-6">
          {CHECKS.map((check) => (
            <div key={check.name} className="text-xs font-mono text-muted-foreground">
              {check.name}
            </div>
          ))}
        </div>

        <div className="ml-6 flex items-center gap-2 text-muted-foreground/30">
          <div className="h-4 w-px bg-border" />
          <span className="text-[10px]">flags issues</span>
          <div className="h-px w-8 bg-border" />
          <span className="text-[10px]">▼</span>
        </div>

        <LayerHeader
          number="2"
          title="LLM Analysts"
          tag="On-demand, only when flagged"
          tagColor="text-yellow-500"
        />
        <div className="grid grid-cols-3 gap-2 ml-6">
          {ANALYSTS.map((analyst) => (
            <div key={analyst.name} className="text-xs font-mono text-muted-foreground">
              {analyst.name}
            </div>
          ))}
        </div>

        <div className="ml-6 flex items-center gap-2 text-muted-foreground/30">
          <div className="h-4 w-px bg-border" />
          <span className="text-[10px]">reports to</span>
          <div className="h-px w-8 bg-border" />
          <span className="text-[10px]">▼</span>
        </div>

        <LayerHeader
          number="3"
          title="Router"
          tag="Rule-based, no LLM"
          tagColor="text-muted-foreground"
        />
        <p className="text-xs text-muted-foreground ml-6">
          State machine dispatches checks, escalates to analysts only when needed
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Layer 1 */}
      <div>
        <LayerHeader
          number="1"
          title="Deterministic Checks"
          tag="Always free, instant"
          tagColor="text-green-600"
        />
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3 ml-6">
          {CHECKS.map((check) => (
            <div key={check.name} className="border border-border rounded p-3 bg-card/30">
              <p className="text-sm font-mono text-foreground mb-1">{check.name}</p>
              <p className="text-xs text-muted-foreground">{check.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Connector */}
      <div className="flex items-center gap-3 ml-6">
        <div className="h-8 w-px bg-border ml-3" />
        <span className="text-xs text-muted-foreground/50">Flags issues → escalates</span>
      </div>

      {/* Layer 2 */}
      <div>
        <LayerHeader
          number="2"
          title="LLM Analysts"
          tag="On-demand, only when flagged"
          tagColor="text-yellow-500"
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3 ml-6">
          {ANALYSTS.map((analyst) => (
            <div key={analyst.name} className="border border-border rounded p-3 bg-card/30">
              <p className="text-sm font-mono text-foreground mb-1">{analyst.name}</p>
              <p className="text-xs text-muted-foreground">{analyst.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Connector */}
      <div className="flex items-center gap-3 ml-6">
        <div className="h-8 w-px bg-border ml-3" />
        <span className="text-xs text-muted-foreground/50">Reports to → routes actions</span>
      </div>

      {/* Layer 3 */}
      <div>
        <LayerHeader
          number="3"
          title="Router"
          tag="Rule-based state machine, no LLM"
          tagColor="text-muted-foreground"
        />
        <div className="border border-border rounded p-4 bg-card/30 mt-3 ml-6">
          <p className="text-sm text-muted-foreground">
            Orchestrates the full monitoring cycle. Dispatches deterministic checks first, evaluates results,
            and only escalates to LLM analysts when anomalies are detected. No AI cost during normal operation.
          </p>
        </div>
      </div>
    </div>
  );
}

function LayerHeader({ number, title, tag, tagColor }: {
  number: string;
  title: string;
  tag: string;
  tagColor: string;
}) {
  return (
    <div className="flex items-baseline gap-3">
      <span className="font-data text-sm text-muted-foreground shrink-0 w-4">{number}</span>
      <h3 className="font-semibold text-sm">{title}</h3>
      <span className={`text-xs ${tagColor}`}>{tag}</span>
    </div>
  );
}
