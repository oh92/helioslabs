'use client';

import { FlaskConical, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatPnlPct } from '@/lib/format';

interface MarketCardProps {
  symbol: string;
  position: 'FLAT' | 'LONG' | 'SHORT';
  sessionPnlPct: number;
  totalTrades: number;
  isBacktest?: boolean;
  className?: string;
}

export function MarketCard({
  symbol,
  position,
  sessionPnlPct,
  totalTrades,
  isBacktest = false,
  className,
}: MarketCardProps) {
  return (
    <div className={cn('border border-border rounded-lg p-6 bg-card/30', className)}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">{symbol}</h3>
        {isBacktest ? (
          <span className="inline-flex items-center gap-1 font-data text-sm px-2 py-1 rounded bg-muted text-muted-foreground">
            <FlaskConical className="h-3 w-3" />
            BACKTEST
          </span>
        ) : (
          <span className={cn(
            'inline-flex items-center gap-1 font-data text-sm px-2 py-1 rounded',
            position === 'LONG' ? 'bg-green-600/10 text-green-600' :
            position === 'SHORT' ? 'bg-red-600/10 text-red-600' :
            'bg-muted text-muted-foreground',
          )}>
            {position === 'LONG' ? <TrendingUp className="h-3 w-3" /> :
             position === 'SHORT' ? <TrendingDown className="h-3 w-3" /> :
             <Minus className="h-3 w-3" />}
            {position}
          </span>
        )}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-muted-foreground mb-1">{isBacktest ? 'ROI' : 'Session P&L'}</p>
          <p className={cn(
            'font-data text-xl font-semibold',
            sessionPnlPct >= 0 ? 'text-green-600' : 'text-red-600',
          )}>
            {formatPnlPct(sessionPnlPct)}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-1">Total Trades</p>
          <p className="font-data text-xl font-semibold">{totalTrades}</p>
        </div>
      </div>
    </div>
  );
}
