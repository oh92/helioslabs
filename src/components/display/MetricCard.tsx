import { cn } from '@/lib/utils';

interface MetricCardProps {
  label: string;
  subLabel?: string;
  value: string;
  subtext?: string;
  positive?: boolean;
  negative?: boolean;
  variant?: 'default' | 'bordered';
  className?: string;
}

export function MetricCard({
  label,
  subLabel,
  value,
  subtext,
  positive,
  negative,
  variant = 'default',
  className,
}: MetricCardProps) {
  const valueColor = negative ? 'text-red-600' : positive ? 'text-green-600' : 'text-foreground';

  if (variant === 'bordered') {
    return (
      <div className={cn('border border-border rounded-lg p-4 bg-card/30', className)}>
        <p className="text-xs text-muted-foreground mb-2">{label}</p>
        <p className={cn('font-data text-xl font-semibold', valueColor)}>{value}</p>
      </div>
    );
  }

  return (
    <div className={className}>
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      {subLabel && <p className="text-[10px] text-muted-foreground/60 -mt-0.5 mb-1">{subLabel}</p>}
      <p className={cn('text-2xl font-semibold', valueColor)}>{value}</p>
      {subtext && <p className="text-xs text-muted-foreground mt-1">{subtext}</p>}
    </div>
  );
}
