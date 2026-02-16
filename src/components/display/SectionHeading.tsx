import { cn } from '@/lib/utils';

interface SectionHeadingProps {
  children: React.ReactNode;
  className?: string;
  action?: React.ReactNode;
}

export function SectionHeading({ children, className, action }: SectionHeadingProps) {
  if (action) {
    return (
      <div className={cn('flex items-baseline justify-between', className)}>
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider pl-3 border-l-2 border-foreground/20">
          {children}
        </h2>
        {action}
      </div>
    );
  }

  return (
    <h2 className={cn(
      'text-sm font-medium text-muted-foreground uppercase tracking-wider pl-3 border-l-2 border-foreground/20',
      className,
    )}>
      {children}
    </h2>
  );
}
