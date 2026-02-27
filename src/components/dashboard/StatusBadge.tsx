import { cn } from '@/lib/utils';
import { ApiStatus, TestResult } from '@/data/apiData';
import { CheckCircle2, AlertCircle, XCircle, Clock, Info } from 'lucide-react';

interface StatusBadgeProps {
  status: ApiStatus | TestResult;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  colorOverride?: 'blue' | 'red' | 'green' | 'yellow' | 'orange' | 'gray';
}

const statusConfig = {
  // API Status
  'go': {
    label: 'GO',
    className: 'status-badge-success',
    icon: CheckCircle2,
  },
  'go-observaciones': {
    label: 'GO CON OBSERVACIONES',
    className: 'status-badge-success',
    icon: CheckCircle2,
  },
  'condicionada': {
    label: 'APROBACIÓN CONDICIONADA',
    className: 'status-badge-warning',
    icon: AlertCircle,
  },
  'pendiente': {
    label: 'PENDIENTE',
    className: 'status-badge-pending',
    icon: Clock,
  },
  // Test Results
  'pass': {
    label: 'PASS',
    className: 'status-badge-success',
    icon: CheckCircle2,
  },
  'warning': {
    label: 'WARNING',
    className: 'status-badge-warning',
    icon: AlertCircle,
  },
  'fail': {
    label: 'FAIL',
    className: 'status-badge-error',
    icon: XCircle,
  },
  'not-tested': {
    label: 'N/T',
    className: 'status-badge-info',
    icon: Info,
  },
  'false-positive': {
    label: 'FALSO POSITIVO',
    className: 'status-badge-info',
    icon: Info,
  },
};

const sizeStyles = {
  sm: 'text-xs px-2 py-1',
  md: 'text-sm px-3 py-1.5',
  lg: 'text-base px-4 py-2',
};

export function StatusBadge({
  status,
  label,
  size = 'md',
  showIcon = true,
  colorOverride,
}: StatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  const colorClasses = {
    blue: 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800',
    red: 'bg-status-error/15 text-status-error border-status-error/20',
    green: 'bg-status-success/15 text-status-success border-status-success/20',
    yellow: 'bg-status-warning/15 text-status-warning border-status-warning/20',
    orange: 'bg-orange-500/15 text-orange-600 border-orange-200',
    gray: 'bg-muted/50 text-muted-foreground border-border',
  };

  return (
    <span
      className={cn(
        colorOverride ? colorClasses[colorOverride] : config.className,
        sizeStyles[size],
        'inline-flex items-center gap-1.5 border'
      )}
    >
      {showIcon && <Icon className="h-3.5 w-3.5" />}
      {label || config.label}
    </span>
  );
}

// Emoji-based status indicators for quick visual scanning
export function StatusIndicator({ status, colorOverride }: { status: ApiStatus, colorOverride?: string }) {
  const indicators = {
    'go': colorOverride === 'blue' ? '🔵' : '🟢',
    'go-observaciones': colorOverride === 'red' ? '🔴' : '🟢', // En este caso específico de recalibración
    'condicionada': '🟡',
    'pendiente': '🔵',
  };

  // Lógica específica para override si se provee
  let emoji = indicators[status];
  if (colorOverride === 'blue') emoji = '🔵';
  if (colorOverride === 'red') emoji = '🔴';

  return <span className="text-lg">{emoji}</span>;
}
