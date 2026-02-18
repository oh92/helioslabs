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
} from "recharts";
import type { Trade } from "@/lib/types";
import { useChartStyles } from "@/lib/chart-colors";

interface ReturnDistributionProps {
  trades: Trade[];
  height?: number;
}

interface BinEntry {
  label: string;
  count: number;
  midpoint: number;
}

interface TooltipPayload {
  payload: BinEntry;
}

function BinTooltip({ active, payload }: { active?: boolean; payload?: TooltipPayload[] }) {
  if (!active || !payload || !payload.length) return null;
  const d = payload[0].payload;
  return (
    <div className="rounded border border-border bg-background px-3 py-2 shadow-sm">
      <p className="text-xs text-muted-foreground">Return: {d.label}</p>
      <p className="text-sm font-medium mt-1">{d.count} trades</p>
    </div>
  );
}

export function ReturnDistribution({ trades, height = 220 }: ReturnDistributionProps) {
  const { tickStyle, axisLineStyle, cursorFill, profitColor, lossColor } = useChartStyles();

  const bins = useMemo(() => {
    const returns = trades.map((t) => t.pnl_pct);
    if (returns.length < 3) return [];

    const min = Math.min(...returns);
    const max = Math.max(...returns);
    const numBins = 8;
    const binWidth = (max - min) / numBins;
    if (binWidth === 0) return [];

    const result: BinEntry[] = [];
    for (let i = 0; i < numBins; i++) {
      const lo = min + i * binWidth;
      const hi = lo + binWidth;
      const count = returns.filter(
        (r) => (i === numBins - 1 ? r >= lo && r <= hi : r >= lo && r < hi)
      ).length;
      const midpoint = (lo + hi) / 2;
      result.push({
        label: `${lo.toFixed(1)}% – ${hi.toFixed(1)}%`,
        count,
        midpoint,
      });
    }
    return result;
  }, [trades]);

  if (bins.length === 0) return null;

  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={bins} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
          <XAxis
            dataKey="label"
            axisLine={axisLineStyle}
            tickLine={axisLineStyle}
            tick={tickStyle}
            interval={0}
            angle={-30}
            textAnchor="end"
            height={50}
          />
          <YAxis
            axisLine={axisLineStyle}
            tickLine={axisLineStyle}
            tick={tickStyle}
            allowDecimals={false}
            width={30}
          />
          <Tooltip content={<BinTooltip />} cursor={{ fill: cursorFill }} />
          <Bar dataKey="count" radius={[2, 2, 0, 0]}>
            {bins.map((entry, i) => (
              <Cell key={i} fill={entry.midpoint >= 0 ? profitColor : lossColor} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
