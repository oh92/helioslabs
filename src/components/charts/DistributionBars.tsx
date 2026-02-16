"use client";

import type { OptimizationDistributions, DistributionStats } from "@/lib/types";

interface DistributionBarsProps {
  distributions: OptimizationDistributions;
}

const METRIC_CONFIG: {
  key: keyof OptimizationDistributions;
  label: string;
  format: (v: number) => string;
  invert?: boolean;
}[] = [
  { key: "sharpe_ratio", label: "Sharpe Ratio", format: (v) => v.toFixed(2) },
  { key: "pnl_pct", label: "ROI %", format: (v) => `${v.toFixed(1)}%` },
  { key: "max_drawdown", label: "Max Drawdown", format: (v) => `${v.toFixed(1)}%`, invert: true },
  { key: "win_rate", label: "Win Rate", format: (v) => `${v.toFixed(1)}%` },
];

function PercentileBar({ stats, format, invert }: { stats: DistributionStats; format: (v: number) => string; invert?: boolean }) {
  const range = stats.max - stats.min;
  if (range === 0) return null;

  const toPercent = (v: number) => ((v - stats.min) / range) * 100;

  const p10Left = toPercent(stats.p10);
  const p90Right = toPercent(stats.p90);
  const p25Left = toPercent(stats.p25);
  const p75Right = toPercent(stats.p75);
  const medianPos = toPercent(stats.p50);

  // Color: green for normal metrics, red-orange for drawdown (inverted)
  const barColor = invert ? "bg-red-600/30" : "bg-green-600/30";
  const iqrColor = invert ? "bg-red-600/50" : "bg-green-600/50";
  const medianColor = invert ? "bg-red-600" : "bg-green-600";

  return (
    <div className="relative h-5 bg-muted/50 rounded overflow-hidden">
      {/* p10–p90 range */}
      <div
        className={`absolute top-0 h-full ${barColor} rounded`}
        style={{ left: `${p10Left}%`, width: `${p90Right - p10Left}%` }}
      />
      {/* p25–p75 IQR */}
      <div
        className={`absolute top-0 h-full ${iqrColor} rounded`}
        style={{ left: `${p25Left}%`, width: `${p75Right - p25Left}%` }}
      />
      {/* p50 median line */}
      <div
        className={`absolute top-0 h-full w-0.5 ${medianColor}`}
        style={{ left: `${medianPos}%` }}
      />
      {/* Median label */}
      <span
        className="absolute top-0.5 text-[10px] font-data text-foreground leading-none"
        style={{ left: `${Math.min(medianPos + 2, 80)}%` }}
      >
        {format(stats.p50)}
      </span>
    </div>
  );
}

export function DistributionBars({ distributions }: DistributionBarsProps) {
  const metrics = METRIC_CONFIG.filter((m) => distributions[m.key]);
  if (metrics.length === 0) return null;

  const count = metrics[0] ? distributions[metrics[0].key]?.count : 0;

  return (
    <div className="space-y-4">
      {metrics.map((m) => {
        const stats = distributions[m.key]!;
        return (
          <div key={m.key}>
            <div className="flex items-baseline justify-between mb-1">
              <span className="text-xs text-muted-foreground">{m.label}</span>
              <span className="text-xs text-muted-foreground font-data">
                {m.format(stats.min)} – {m.format(stats.max)}
              </span>
            </div>
            <PercentileBar stats={stats} format={m.format} invert={m.invert} />
          </div>
        );
      })}
      <p className="text-[10px] text-muted-foreground/60 mt-2">
        Bars show p10–p90 range (light), IQR p25–p75 (dark), median line. n={count}
      </p>
    </div>
  );
}
