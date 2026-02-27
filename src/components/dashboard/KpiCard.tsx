import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface KpiCardProps {
  title: string;
  value: ReactNode;
  subtitle?: ReactNode;
  icon?: ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  className?: string;
}

const variantStyles = {
  default: 'border-border/50',
  success: 'border-l-4 border-l-status-success',
  warning: 'border-l-4 border-l-status-warning',
  error: 'border-l-4 border-l-status-error',
  info: 'border-l-4 border-l-status-pending',
};

export function KpiCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  trendValue,
  variant = 'default',
  className,
}: KpiCardProps) {
  return (
    <div
      className={cn(
        'kpi-card animate-fade-in',
        variantStyles[variant],
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold tracking-tight text-foreground">
            {value}
          </p>
          {subtitle && (
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          )}
          {trend && trendValue && (
            <div className="flex items-center gap-1 text-sm">
              {trend === 'up' && (
                <span className="text-status-success">↑ {trendValue}</span>
              )}
              {trend === 'down' && (
                <span className="text-status-error">↓ {trendValue}</span>
              )}
              {trend === 'neutral' && (
                <span className="text-muted-foreground">→ {trendValue}</span>
              )}
            </div>
          )}
        </div>
        {icon && (
          <div className="rounded-lg bg-secondary/50 p-3 text-muted-foreground">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
