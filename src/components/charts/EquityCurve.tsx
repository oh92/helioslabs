"use client";

import { useMemo } from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from "recharts";
import type { EquityDataPoint } from "@/lib/types";

interface EquityCurveProps {
  data: EquityDataPoint[];
  height?: number;
  showGrid?: boolean;
  showDrawdown?: boolean;
  className?: string;
}

// Format date as MM/DD
function formatDate(timestamp: string): string {
  const date = new Date(timestamp);
  return `${String(date.getMonth() + 1).padStart(2, "0")}/${String(
    date.getDate()
  ).padStart(2, "0")}`;
}

// Format currency values for axis labels
function formatCurrency(value: number): string {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(1)}K`;
  }
  return `$${value.toFixed(0)}`;
}

// Format percentage
function formatPercent(value: number): string {
  return `${value.toFixed(2)}%`;
}

// Custom tooltip component
interface TooltipPayload {
  dataKey: string;
  value: number;
  color: string;
  payload: ChartDataPoint;
}

interface ChartDataPoint extends EquityDataPoint {
  formattedDate: string;
  displayDrawdown: number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string;
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload || !payload.length) {
    return null;
  }

  const dataPoint = payload[0]?.payload;
  if (!dataPoint) return null;

  return (
    <div className="rounded border border-border bg-background px-3 py-2 shadow-sm">
      <p className="text-xs text-muted-foreground">
        {dataPoint.formattedDate}
      </p>
      <div className="mt-1 space-y-1">
        <p className="text-sm">
          <span className="text-muted-foreground">Balance: </span>
          <span className="text-green-600 font-medium">
            ${dataPoint.balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </span>
        </p>
        {dataPoint.drawdown_pct > 0 && (
          <p className="text-sm">
            <span className="text-muted-foreground">Drawdown: </span>
            <span className="text-red-600 font-medium">
              -{formatPercent(dataPoint.drawdown_pct)}
            </span>
          </p>
        )}
      </div>
    </div>
  );
}

export function EquityCurve({
  data,
  height = 400,
  showGrid = true,
  showDrawdown = true,
  className,
}: EquityCurveProps) {
  // Transform data for the chart
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return [];

    return data.map((point) => ({
      ...point,
      formattedDate: formatDate(point.timestamp),
      // Invert drawdown for display (shown as negative area below)
      displayDrawdown: -Math.abs(point.drawdown_pct),
    }));
  }, [data]);

  // Calculate domain for balance axis with some padding
  const { minBalance, maxBalance, balancePadding } = useMemo(() => {
    if (!data || data.length === 0) {
      return { minBalance: 0, maxBalance: 100, balancePadding: 10 };
    }
    const balances = data.map((d) => d.balance);
    const min = Math.min(...balances);
    const max = Math.max(...balances);
    const padding = (max - min) * 0.1 || max * 0.05;
    return { minBalance: min, maxBalance: max, balancePadding: padding };
  }, [data]);

  // Calculate domain for drawdown axis
  const drawdownMax = useMemo(() => {
    if (!data || data.length === 0) return 10;
    const max = Math.max(...data.map((d) => Math.abs(d.drawdown_pct)));
    return Math.ceil(max / 5) * 5 || 10; // Round up to nearest 5
  }, [data]);

  if (!data || data.length === 0) {
    return (
      <div
        className={`flex items-center justify-center text-muted-foreground ${className || ""}`}
        style={{ height }}
      >
        No equity data available
      </div>
    );
  }

  return (
    <div className={className} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={chartData}
          margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
        >
          {/* Gradient definitions */}
          <defs>
            <linearGradient id="drawdownGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#dc2626" stopOpacity={0.15} />
              <stop offset="100%" stopColor="#dc2626" stopOpacity={0.02} />
            </linearGradient>
          </defs>

          {showGrid && (
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#e5e5e5"
              strokeOpacity={0.8}
              vertical={false}
            />
          )}

          {/* X Axis - Date */}
          <XAxis
            dataKey="formattedDate"
            axisLine={{ stroke: "#e5e5e5" }}
            tickLine={{ stroke: "#e5e5e5" }}
            tick={{
              fill: "#737373",
              fontSize: 11,
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
            }}
            tickMargin={8}
            interval="preserveStartEnd"
            minTickGap={40}
          />

          {/* Y Axis - Balance (left) */}
          <YAxis
            yAxisId="balance"
            orientation="left"
            domain={[minBalance - balancePadding, maxBalance + balancePadding]}
            axisLine={{ stroke: "#e5e5e5" }}
            tickLine={{ stroke: "#e5e5e5" }}
            tick={{
              fill: "#737373",
              fontSize: 11,
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
            }}
            tickFormatter={formatCurrency}
            tickMargin={4}
            width={60}
          />

          {/* Y Axis - Drawdown (right, inverted) */}
          <YAxis
            yAxisId="drawdown"
            orientation="right"
            domain={[-drawdownMax, 0]}
            axisLine={{ stroke: "#e5e5e5" }}
            tickLine={{ stroke: "#e5e5e5" }}
            tick={{
              fill: "#737373",
              fontSize: 11,
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
            }}
            tickFormatter={(value: number) => `${Math.abs(value).toFixed(0)}%`}
            tickMargin={4}
            width={45}
          />

          {/* Reference line at 0% drawdown */}
          <ReferenceLine
            yAxisId="drawdown"
            y={0}
            stroke="#e5e5e5"
            strokeDasharray="3 3"
          />

          {/* Tooltip */}
          <Tooltip
            content={<CustomTooltip />}
            cursor={{
              stroke: "#737373",
              strokeWidth: 1,
              strokeDasharray: "4 4",
            }}
          />

          {/* Drawdown Area (inverted, shown below) */}
          {showDrawdown && (
            <Area
              yAxisId="drawdown"
              type="monotone"
              dataKey="displayDrawdown"
              name="drawdown_pct"
              stroke="#dc2626"
              fill="url(#drawdownGradient)"
              strokeWidth={1}
              strokeOpacity={0.6}
              dot={false}
              activeDot={false}
            />
          )}

          {/* Balance Line */}
          <Line
            yAxisId="balance"
            type="monotone"
            dataKey="balance"
            stroke="#16a34a"
            strokeWidth={2}
            dot={false}
            activeDot={{
              r: 4,
              fill: "#16a34a",
              stroke: "#ffffff",
              strokeWidth: 2,
            }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

export default EquityCurve;
