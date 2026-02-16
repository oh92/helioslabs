'use client';

import { FlaskConical, Radio } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ViewToggleProps {
  view: 'backtest' | 'live';
  onViewChange: (view: 'backtest' | 'live') => void;
  size?: 'sm' | 'md';
  labels?: { backtest: string; live: string };
  className?: string;
}

export function ViewToggle({
  view,
  onViewChange,
  size = 'sm',
  labels = { backtest: 'Backtest', live: 'Live' },
  className,
}: ViewToggleProps) {
  const textSize = size === 'sm' ? 'text-xs' : 'text-sm';
  const iconSize = size === 'sm' ? 'h-3 w-3' : 'h-3.5 w-3.5';
  const padding = size === 'sm' ? 'px-3 py-1.5' : 'px-4 py-2';
  const containerPadding = size === 'sm' ? 'p-0.5' : 'p-1';
  const rounded = size === 'sm' ? 'rounded' : 'rounded-md';
  const containerRounded = size === 'sm' ? 'rounded-md' : 'rounded-lg';

  return (
    <div className={cn('flex items-center gap-1 bg-muted/50', containerPadding, containerRounded, className)}>
      <button
        onClick={() => onViewChange('backtest')}
        className={cn(
          'flex items-center gap-1.5 font-medium transition-all',
          textSize, padding, rounded,
          view === 'backtest'
            ? 'bg-background text-foreground shadow-sm'
            : 'text-muted-foreground hover:text-foreground bg-muted/20 hover:bg-muted/30',
        )}
      >
        <FlaskConical className={iconSize} />
        {labels.backtest}
      </button>
      <button
        onClick={() => onViewChange('live')}
        className={cn(
          'flex items-center gap-1.5 font-medium transition-all',
          textSize, padding, rounded,
          view === 'live'
            ? 'bg-background text-foreground shadow-sm'
            : 'text-muted-foreground hover:text-foreground bg-muted/20 hover:bg-muted/30',
        )}
      >
        <Radio className={iconSize} />
        {labels.live}
      </button>
    </div>
  );
}
