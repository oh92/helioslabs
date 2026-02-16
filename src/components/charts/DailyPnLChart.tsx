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
import type { EquityDataPoint } from "@/lib/types";

interface DailyPnLChartProps {
  data: EquityDataPoint[];
  height?: number;
}

function formatDate(timestamp: string): string {
  const date = new Date(timestamp);
  return `${String(date.getMonth() + 1).padStart(2, "0")}/${String(
    date.getDate()
  ).padStart(2, "0")}`;
}

const tickStyle = {
  fill: "#737373",
  fontSize: 11,
  fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
};

interface ChartEntry {
  date: string;
  pnl: number;
}

interface TooltipPayload {
  payload: ChartEntry;
}

function PnLTooltip({ active, payload }: { active?: boolean; payload?: TooltipPayload[] }) {
  if (!active || !payload || !payload.length) return null;
  const d = payload[0].payload;
  return (
    <div className="rounded border border-border bg-background px-3 py-2 shadow-sm">
      <p className="text-xs text-muted-foreground">{d.date}</p>
      <p className={`text-sm font-medium mt-1 ${d.pnl >= 0 ? "text-green-600" : "text-red-600"}`}>
        {d.pnl >= 0 ? "+" : ""}{d.pnl.toFixed(2)}%
      </p>
    </div>
  );
}

export function DailyPnLChart({ data, height = 250 }: DailyPnLChartProps) {
  const chartData = useMemo(() => {
    return data
      .filter((d) => d.daily_pnl_pct !== undefined)
      .map((d) => ({
        date: formatDate(d.timestamp),
        pnl: d.daily_pnl_pct!,
      }));
  }, [data]);

  if (chartData.length === 0) return null;

  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
          <XAxis
            dataKey="date"
            axisLine={{ stroke: "#e5e5e5" }}
            tickLine={{ stroke: "#e5e5e5" }}
            tick={tickStyle}
            tickMargin={8}
            interval="preserveStartEnd"
            minTickGap={30}
          />
          <YAxis
            axisLine={{ stroke: "#e5e5e5" }}
            tickLine={{ stroke: "#e5e5e5" }}
            tick={tickStyle}
            tickFormatter={(v: number) => `${v.toFixed(1)}%`}
            width={50}
          />
          <ReferenceLine y={0} stroke="#e5e5e5" />
          <Tooltip content={<PnLTooltip />} cursor={{ fill: "rgba(115,115,115,0.1)" }} />
          <Bar dataKey="pnl" radius={[2, 2, 0, 0]}>
            {chartData.map((entry, i) => (
              <Cell key={i} fill={entry.pnl >= 0 ? "#16a34a" : "#dc2626"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
