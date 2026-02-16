"use client";

import { useMemo } from "react";
import type { Trade } from "@/lib/types";

interface TradeDurationStatsProps {
  trades: Trade[];
}

function formatDuration(ms: number): string {
  const hours = ms / (1000 * 60 * 60);
  if (hours < 1) {
    const mins = Math.round(ms / (1000 * 60));
    return `${mins}m`;
  }
  if (hours < 24) {
    return `${hours.toFixed(1)}h`;
  }
  const days = hours / 24;
  return `${days.toFixed(1)}d`;
}

export function TradeDurationStats({ trades }: TradeDurationStatsProps) {
  const stats = useMemo(() => {
    if (trades.length < 2) return null;

    const durations = trades.map((t) => {
      const entry = new Date(t.entry_time).getTime();
      const exit = new Date(t.exit_time).getTime();
      return exit - entry;
    });

    const sorted = [...durations].sort((a, b) => a - b);
    const avg = durations.reduce((s, d) => s + d, 0) / durations.length;
    const median = sorted[Math.floor(sorted.length / 2)];
    const min = sorted[0];
    const max = sorted[sorted.length - 1];

    // Exit reason breakdown
    const reasons: Record<string, number> = {};
    for (const t of trades) {
      const reason = t.exit_reason || "unknown";
      reasons[reason] = (reasons[reason] || 0) + 1;
    }

    return { avg, median, min, max, reasons };
  }, [trades]);

  if (!stats) return null;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <p className="text-xs text-muted-foreground mb-1">Avg Hold Time</p>
          <p className="font-data text-lg font-semibold">{formatDuration(stats.avg)}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-1">Median Hold Time</p>
          <p className="font-data text-lg font-semibold">{formatDuration(stats.median)}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-1">Shortest</p>
          <p className="font-data text-lg font-semibold">{formatDuration(stats.min)}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-1">Longest</p>
          <p className="font-data text-lg font-semibold">{formatDuration(stats.max)}</p>
        </div>
      </div>

      <div className="pt-3 border-t border-border">
        <p className="text-xs text-muted-foreground mb-2">Exit Reasons</p>
        <div className="flex flex-wrap gap-2">
          {Object.entries(stats.reasons)
            .sort(([, a], [, b]) => b - a)
            .map(([reason, count]) => (
              <span
                key={reason}
                className="text-xs px-2 py-1 bg-muted rounded font-data"
              >
                {reason.replace(/_/g, " ")} ({count})
              </span>
            ))}
        </div>
      </div>
    </div>
  );
}
