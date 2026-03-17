interface CostComparisonProps {
  compact?: boolean;
}

const ROWS = [
  { scenario: 'Routine cycle (no issues)', before: '$0.05–0.10', after: '$0', savings: '100%' },
  { scenario: 'Deployment validation (1 hr)', before: '$1.50–3.00', after: '$0–0.30', savings: '~80%' },
  { scenario: 'Steady-state (24 hrs)', before: '$12–30', after: '$0–2.00', savings: '93%' },
];

export function CostComparison({ compact = false }: CostComparisonProps) {
  if (compact) {
    return (
      <div className="border border-border rounded p-4 bg-card/30">
        <div className="flex items-baseline gap-3">
          <span className="text-2xl font-semibold text-green-600">93%</span>
          <span className="text-sm text-muted-foreground">LLM cost reduction in steady-state monitoring</span>
        </div>
        <p className="text-xs text-muted-foreground/70 mt-2">
          Deterministic checks handle routine operations for free. LLMs are called only when anomalies require reasoning.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-baseline gap-3 mb-4">
        <span className="text-3xl font-semibold text-green-600">93%</span>
        <span className="text-sm text-muted-foreground">cost reduction in steady-state monitoring</span>
      </div>

      <div className="border border-border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/30">
            <tr className="text-left text-xs text-muted-foreground uppercase tracking-wider">
              <th className="px-4 py-3 font-medium">Scenario</th>
              <th className="px-4 py-3 font-medium text-right">LLM-Only</th>
              <th className="px-4 py-3 font-medium text-right">Deterministic-First</th>
              <th className="px-4 py-3 font-medium text-right">Savings</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {ROWS.map((row) => (
              <tr key={row.scenario} className="hover:bg-muted/10 transition-colors">
                <td className="px-4 py-3 text-muted-foreground">{row.scenario}</td>
                <td className="px-4 py-3 text-right font-data text-muted-foreground">{row.before}</td>
                <td className="px-4 py-3 text-right font-data text-green-600">{row.after}</td>
                <td className="px-4 py-3 text-right font-data font-semibold text-green-600">{row.savings}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-muted-foreground/70 mt-3">
        Deterministic checks handle routine operations at zero cost. LLM analysts are invoked only when
        checks flag anomalies that require reasoning — typically {'<'}5% of monitoring cycles.
      </p>
    </div>
  );
}
