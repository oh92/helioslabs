"use client";

import { useMemo } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
} from "recharts";
import type { Trade } from "@/lib/types";
import { useChartStyles } from "@/lib/chart-colors";

interface WinLossStreaksProps {
  trades: Trade[];
  height?: number;
}

interface StreakEntry {
  index: number;
  length: number;
  type: "win" | "loss";
}

interface TooltipPayload {
  payload: StreakEntry;
}

function StreakTooltip({ active, payload }: { active?: boolean; payload?: TooltipPayload[] }) {
  if (!active || !payload || !payload.length) return null;
  const d = payload[0].payload;
  return (
    <div className="rounded border border-border bg-background px-3 py-2 shadow-sm">
      <p className={`text-sm font-medium ${d.type === "win" ? "text-green-600" : "text-red-600"}`}>
        {Math.abs(d.length)} {d.type === "win" ? "wins" : "losses"} in a row
      </p>
    </div>
  );
}

export function WinLossStreaks({ trades, height = 220 }: WinLossStreaksProps) {
  const { tickStyle, axisLineStyle, cursorFill, gridStroke, profitColor, lossColor } = useChartStyles();

  const streaks = useMemo(() => {
    const sorted = [...trades].sort(
      (a, b) => new Date(a.exit_time).getTime() - new Date(b.exit_time).getTime()
    );
    if (sorted.length < 2) return [];

    const result: StreakEntry[] = [];
    let currentType: "win" | "loss" = sorted[0].pnl_pct >= 0 ? "win" : "loss";
    let currentLength = 1;

    for (let i = 1; i < sorted.length; i++) {
      const type = sorted[i].pnl_pct >= 0 ? "win" : "loss";
      if (type === currentType) {
        currentLength++;
      } else {
        result.push({
          index: result.length,
          length: currentType === "win" ? currentLength : -currentLength,
          type: currentType,
        });
        currentType = type;
        currentLength = 1;
      }
    }
    result.push({
      index: result.length,
      length: currentType === "win" ? currentLength : -currentLength,
      type: currentType,
    });

    return result;
  }, [trades]);

  if (streaks.length < 2) return null;

  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={streaks} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
          <XAxis dataKey="index" hide />
          <YAxis
            axisLine={axisLineStyle}
            tickLine={axisLineStyle}
            tick={tickStyle}
            allowDecimals={false}
            width={30}
          />
          <ReferenceLine y={0} stroke={gridStroke} />
          <Tooltip content={<StreakTooltip />} cursor={{ fill: cursorFill }} />
          <Bar dataKey="length" radius={[2, 2, 0, 0]}>
            {streaks.map((entry, i) => (
              <Cell key={i} fill={entry.type === "win" ? profitColor : lossColor} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
