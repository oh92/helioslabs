'use client';

import { Percent, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { STRATEGY_KEYS, STRATEGY_META, type StrategyKey } from '@/lib/strategy';

interface StrategyTabsProps {
  strategy: StrategyKey;
  onStrategyChange: (strategy: StrategyKey) => void;
  className?: string;
}

const ICONS: Record<StrategyKey, typeof Percent> = {
  funding: Percent,
  volume: BarChart3,
};

export function StrategyTabs({ strategy, onStrategyChange, className }: StrategyTabsProps) {
  return (
    <div className={cn('flex items-center gap-1 bg-muted/50 p-0.5 rounded-md w-fit', className)}>
      {STRATEGY_KEYS.map((key) => {
        const Icon = ICONS[key];
        const active = strategy === key;
        return (
          <button
            key={key}
            onClick={() => onStrategyChange(key)}
            title={`${STRATEGY_META[key].tagline} · ${STRATEGY_META[key].venue}`}
            className={cn(
              'flex items-center gap-1.5 font-medium transition-all text-xs px-3 py-1.5 rounded',
              active
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground bg-muted/20 hover:bg-muted/30',
            )}
          >
            <Icon className="h-3 w-3" />
            {STRATEGY_META[key].label}
          </button>
        );
      })}
    </div>
  );
}
