'use client';

import { useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  YAxis,
} from 'recharts';
import type { EquityDataPoint } from '@/lib/types';
import { useChartColors } from '@/lib/chart-colors';

interface SparklineChartProps {
  data: EquityDataPoint[];
  height?: number;
  className?: string;
}

export function SparklineChart({
  data,
  height = 96,
  className,
}: SparklineChartProps) {
  const colors = useChartColors();

  const chartData = useMemo(() => {
    if (!data || data.length === 0) return [];
    return data.map((point) => ({
      balance: point.balance,
    }));
  }, [data]);

  const { minBalance, maxBalance } = useMemo(() => {
    if (!data || data.length === 0) {
      return { minBalance: 0, maxBalance: 100 };
    }
    const balances = data.map((d) => d.balance);
    const min = Math.min(...balances);
    const max = Math.max(...balances);
    const padding = (max - min) * 0.1;
    return { minBalance: min - padding, maxBalance: max + padding };
  }, [data]);

  if (!data || data.length === 0) {
    return null;
  }

  return (
    <div className={className} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="sparklineGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={colors.profit} stopOpacity={0.2} />
              <stop offset="100%" stopColor={colors.profit} stopOpacity={0} />
            </linearGradient>
          </defs>
          <YAxis
            domain={[minBalance, maxBalance]}
            hide
          />
          <Area
            type="monotone"
            dataKey="balance"
            stroke={colors.profit}
            strokeWidth={1.5}
            fill="url(#sparklineGradient)"
            dot={false}
            activeDot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export default SparklineChart;
