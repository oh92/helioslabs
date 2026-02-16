"use client";

import { useMemo } from "react";
import {
  ResponsiveContainer,
  LineChart,
  AreaChart,
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
  showBenchmark?: boolean;
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

// Shared axis tick style
const tickStyle = {
  fill: "#737373",
  fontSize: 11,
  fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
};

const axisLineStyle = { stroke: "#e5e5e5" };

// Custom tooltip for equity panel
interface ChartDataPoint extends EquityDataPoint {
  formattedDate: string;
  displayDrawdown: number;
}

interface TooltipPayload {
  dataKey: string;
  value: number;
  color: string;
  payload: ChartDataPoint;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayload[];
}

function EquityTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload || !payload.length) return null;
  const dataPoint = payload[0]?.payload;
  if (!dataPoint) return null;

  const hasBenchmark = payload.some(p => p.dataKey === 'benchmark_balance');

  return (
    <div className="rounded border border-border bg-background px-3 py-2 shadow-sm">
      <p className="text-xs text-muted-foreground">
        {dataPoint.formattedDate}
      </p>
      <p className="text-sm mt-1">
        <span className="text-muted-foreground">{hasBenchmark ? 'Strategy: ' : 'Balance: '}</span>
        <span className="text-green-600 font-medium">
          ${dataPoint.balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
        </span>
      </p>
      {hasBenchmark && dataPoint.benchmark_balance != null && (
        <p className="text-sm mt-0.5">
          <span className="text-muted-foreground">Buy-and-hold: </span>
          <span className="font-medium" style={{ color: '#737373' }}>
            ${dataPoint.benchmark_balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </span>
        </p>
      )}
    </div>
  );
}

function DrawdownTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload || !payload.length) return null;
  const dataPoint = payload[0]?.payload;
  if (!dataPoint) return null;

  return (
    <div className="rounded border border-border bg-background px-3 py-2 shadow-sm">
      <p className="text-xs text-muted-foreground">
        {dataPoint.formattedDate}
      </p>
      {dataPoint.drawdown_pct > 0 && (
        <p className="text-sm mt-1">
          <span className="text-muted-foreground">Drawdown: </span>
          <span className="text-red-600 font-medium">
            -{formatPercent(dataPoint.drawdown_pct)}
          </span>
        </p>
      )}
    </div>
  );
}

export function EquityCurve({
  data,
  height = 400,
  showGrid = true,
  showDrawdown = true,
  showBenchmark = false,
  className,
}: EquityCurveProps) {
  // Transform data for the chart
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return [];

    return data.map((point) => ({
      ...point,
      formattedDate: formatDate(point.timestamp),
      displayDrawdown: -Math.abs(point.drawdown_pct),
    }));
  }, [data]);

  const hasBenchmarkData = useMemo(() => {
    return data?.some(d => d.benchmark_balance != null) ?? false;
  }, [data]);

  // Calculate domain for balance axis with some padding
  const { minBalance, maxBalance, balancePadding } = useMemo(() => {
    if (!data || data.length === 0) {
      return { minBalance: 0, maxBalance: 100, balancePadding: 10 };
    }
    const values = data.map((d) => d.balance);
    if (showBenchmark && hasBenchmarkData) {
      for (const d of data) {
        if (d.benchmark_balance != null) values.push(d.benchmark_balance);
      }
    }
    const min = Math.min(...values);
    const max = Math.max(...values);
    const padding = (max - min) * 0.1 || max * 0.05;
    return { minBalance: min, maxBalance: max, balancePadding: padding };
  }, [data, showBenchmark, hasBenchmarkData]);

  // Calculate domain for drawdown axis
  const drawdownMax = useMemo(() => {
    if (!data || data.length === 0) return 10;
    const max = Math.max(...data.map((d) => Math.abs(d.drawdown_pct)));
    return Math.ceil(max / 5) * 5 || 10;
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

  const equityHeight = showDrawdown ? Math.round(height * 0.75) : height;
  const drawdownHeight = Math.round(height * 0.25);

  const cursorStyle = {
    stroke: "#737373",
    strokeWidth: 1,
    strokeDasharray: "4 4",
  };

  return (
    <div className={className} style={{ height }}>
      {/* Top panel: Equity line + optional benchmark */}
      <div style={{ height: equityHeight }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            syncId="equity"
            margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
          >
            {showGrid && (
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#e5e5e5"
                strokeOpacity={0.8}
                vertical={false}
              />
            )}

            <XAxis dataKey="formattedDate" hide />

            <YAxis
              domain={[minBalance - balancePadding, maxBalance + balancePadding]}
              axisLine={axisLineStyle}
              tickLine={axisLineStyle}
              tick={tickStyle}
              tickFormatter={formatCurrency}
              tickMargin={4}
              width={60}
            />

            <Tooltip
              content={<EquityTooltip />}
              cursor={cursorStyle}
            />

            {showBenchmark && hasBenchmarkData && (
              <Line
                type="monotone"
                dataKey="benchmark_balance"
                stroke="#737373"
                strokeWidth={1.5}
                strokeDasharray="6 3"
                dot={false}
                activeDot={{
                  r: 3,
                  fill: "#737373",
                  stroke: "#ffffff",
                  strokeWidth: 2,
                }}
              />
            )}

            <Line
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
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Bottom panel: Drawdown area */}
      {showDrawdown && (
        <div style={{ height: drawdownHeight }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              syncId="equity"
              margin={{ top: 0, right: 10, left: 10, bottom: 0 }}
            >
              <defs>
                <linearGradient id="drawdownGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#dc2626" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#dc2626" stopOpacity={0.05} />
                </linearGradient>
              </defs>

              <XAxis
                dataKey="formattedDate"
                axisLine={axisLineStyle}
                tickLine={axisLineStyle}
                tick={tickStyle}
                tickMargin={8}
                interval="preserveStartEnd"
                minTickGap={40}
              />

              <YAxis
                domain={[-drawdownMax, 0]}
                axisLine={axisLineStyle}
                tickLine={axisLineStyle}
                tick={tickStyle}
                tickFormatter={(value: number) => `${Math.abs(value).toFixed(0)}%`}
                tickMargin={4}
                width={60}
              />

              <ReferenceLine y={0} stroke="#e5e5e5" strokeDasharray="3 3" />

              <Tooltip
                content={<DrawdownTooltip />}
                cursor={cursorStyle}
              />

              <Area
                type="monotone"
                dataKey="displayDrawdown"
                stroke="#dc2626"
                fill="url(#drawdownGradient)"
                strokeWidth={1}
                strokeOpacity={0.6}
                dot={false}
                activeDot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

export default EquityCurve;
