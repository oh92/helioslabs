import { cn } from '@/lib/utils';

interface InfoCardProps {
  title: string;
  description: string;
  category?: string;
  subtitle?: string;
  titleClassName?: string;
  variant?: 'default' | 'compact';
  className?: string;
}

export function InfoCard({
  title,
  description,
  category,
  subtitle,
  titleClassName,
  variant = 'default',
  className,
}: InfoCardProps) {
  if (variant === 'compact') {
    return (
      <div className={cn('border border-border rounded p-3', className)}>
        <h3 className={cn('mb-1', titleClassName)}>{title}</h3>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    );
  }

  return (
    <div className={cn('border border-border rounded-lg p-5 bg-card/30', className)}>
      {category && (
        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{category}</p>
      )}
      <h3 className={cn('font-semibold mb-2', titleClassName)}>{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
      {subtitle && (
        <p className="text-xs text-muted-foreground/70 mt-2 italic">{subtitle}</p>
      )}
    </div>
  );
}
