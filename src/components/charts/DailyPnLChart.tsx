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
import { useChartStyles } from "@/lib/chart-colors";

interface DailyPnLChartProps {
  data: EquityDataPoint[];
  height?: number;
}

function formatDateShort(timestamp: string): string {
  const date = new Date(timestamp);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[date.getMonth()]} '${String(date.getFullYear()).slice(2)}`;
}

function formatDateFull(timestamp: string): string {
  const date = new Date(timestamp);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

interface ChartEntry {
  date: string;
  fullDate: string;
  pnl: number;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
function renderTooltip(props: any) {
  const { active, payload } = props;
  if (!active || !payload || !payload.length) return null;
  const entry: ChartEntry = payload[0]?.payload;
  if (!entry) return null;
  return (
    <div className="rounded border border-border bg-background px-3 py-2 shadow-sm">
      <p className="text-xs text-muted-foreground">{entry.fullDate}</p>
      <p className={`text-sm font-medium mt-1 ${entry.pnl >= 0 ? "text-green-600" : "text-red-600"}`}>
        {entry.pnl >= 0 ? "+" : ""}{entry.pnl.toFixed(2)}%
      </p>
    </div>
  );
}
/* eslint-enable @typescript-eslint/no-explicit-any */

export function DailyPnLChart({ data, height = 250 }: DailyPnLChartProps) {
  const { tickStyle, axisLineStyle, cursorFill, gridStroke, profitColor, lossColor } = useChartStyles();

  const chartData = useMemo(() => {
    return data
      .filter((d) => d.daily_pnl_pct !== undefined)
      .map((d) => ({
        date: formatDateShort(d.timestamp),
        fullDate: formatDateFull(d.timestamp),
        pnl: d.daily_pnl_pct!,
      }));
  }, [data]);

  if (chartData.length === 0) return null;

  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
          <XAxis
            dataKey="fullDate"
            axisLine={axisLineStyle}
            tickLine={axisLineStyle}
            tick={tickStyle}
            tickMargin={8}
            interval="preserveStartEnd"
            minTickGap={40}
            tickFormatter={(value: string) => {
              const d = new Date(value);
              const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
              return `${months[d.getMonth()]} '${String(d.getFullYear()).slice(2)}`;
            }}
          />
          <YAxis
            axisLine={axisLineStyle}
            tickLine={axisLineStyle}
            tick={tickStyle}
            tickFormatter={(v: number) => `${v.toFixed(1)}%`}
            width={50}
          />
          <ReferenceLine y={0} stroke={gridStroke} />
          <Tooltip content={renderTooltip} cursor={{ fill: cursorFill }} />
          <Bar dataKey="pnl" radius={[2, 2, 0, 0]}>
            {chartData.map((entry, i) => (
              <Cell key={i} fill={entry.pnl >= 0 ? profitColor : lossColor} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
