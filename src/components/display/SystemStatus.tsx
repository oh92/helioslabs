import { cn } from '@/lib/utils';

interface SystemStatusProps {
  health: { status: 'healthy' | 'warning' | 'error'; uptime_hours: number; markets_active: number };
  className?: string;
}

export function SystemStatus({ health, className }: SystemStatusProps) {
  const statusColors = {
    healthy: 'text-green-600',
    warning: 'text-yellow-500',
    error: 'text-red-600',
  };

  const dotColors = {
    healthy: 'bg-green-600',
    warning: 'bg-yellow-500',
    error: 'bg-red-600',
  };

  return (
    <div className={cn('flex items-center gap-3 text-sm', className)}>
      <div className="flex items-center gap-2">
        <span className={cn('h-2 w-2 rounded-full pulse-dot', dotColors[health.status])} />
        <span className={statusColors[health.status]}>
          {health.status === 'healthy' ? 'All Systems Operational' : health.status}
        </span>
      </div>
      <span className="text-muted-foreground">&middot;</span>
      <span className="text-muted-foreground">{health.markets_active} markets</span>
      <span className="text-muted-foreground">&middot;</span>
      <span className="text-muted-foreground">{health.uptime_hours}h uptime</span>
    </div>
  );
}
