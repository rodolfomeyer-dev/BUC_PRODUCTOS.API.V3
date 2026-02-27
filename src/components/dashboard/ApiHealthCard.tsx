import { ApiData } from '@/data/apiData';
import { StatusBadge, StatusIndicator } from './StatusBadge';
import { cn } from '@/lib/utils';
import { ArrowRight, Server, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';

interface ApiHealthCardProps {
  api: ApiData;
  onClick?: () => void;
  isActive?: boolean;
}

export function ApiHealthCard({ api, onClick, isActive }: ApiHealthCardProps) {
  // Recalibración: Usar testCases en lugar de endpointResults para reflejar los números solicitados (59 y 32)
  const successCount = api.testCases.filter(tc => tc.status === 'pass' || tc.status === 'false-positive').length;
  const warningCount = api.testCases.filter(tc => tc.status === 'warning').length;
  const errorCount = api.testCases.filter(tc => tc.status === 'fail').length;

  return (
    <button
      onClick={onClick}
      className={cn(
        'card-executive w-full p-5 text-left transition-all duration-200 hover:scale-[1.02]',
        isActive && 'ring-2 ring-accent ring-offset-2',
        api.colorOverride === 'blue' && 'border-blue-200 dark:border-blue-900 bg-blue-50/30 dark:bg-blue-900/10',
        api.colorOverride === 'red' && 'border-red-200 dark:border-red-900 bg-red-50/30 dark:bg-red-900/10'
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <StatusIndicator status={api.status} colorOverride={api.colorOverride} />
          <div>
            <h3 className="font-semibold text-foreground">{api.shortName}</h3>
            <p className="text-xs text-muted-foreground">
              {api.id === 'payment' ? 'Versiones ' : 'Versión '}{api.version}
            </p>
          </div>
        </div>
        <ArrowRight className="h-4 w-4 text-muted-foreground" />
      </div>

      <div className="space-y-3">
        <StatusBadge status={api.status} size="sm" colorOverride={api.colorOverride} />

        <div className="grid grid-cols-3 gap-2 pt-2">
          <div className="text-center">
            <div className={cn(
              "flex items-center justify-center gap-1",
              api.colorOverride === 'blue' ? "text-blue-500" : "text-status-success"
            )}>
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span className="font-semibold">{successCount}</span>
            </div>
            <p className="text-xs text-muted-foreground">Pass</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-status-warning">
              <AlertTriangle className="h-3.5 w-3.5" />
              <span className="font-semibold">{warningCount}</span>
            </div>
            <p className="text-xs text-muted-foreground">Warning</p>
          </div>
          <div className="text-center">
            <div className={cn(
              "flex items-center justify-center gap-1",
              api.colorOverride === 'red' ? "text-red-500" : "text-status-error"
            )}>
              <XCircle className="h-3.5 w-3.5" />
              <span className="font-semibold">{errorCount}</span>
            </div>
            <p className="text-xs text-muted-foreground">Fail</p>
          </div>
        </div>

        <div className="pt-2 border-t border-border/50">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Cobertura</span>
            <span className="font-medium text-foreground">{api.metrics.coverageRate}%</span>
          </div>
          <div className="mt-1.5 h-1.5 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-accent rounded-full transition-all duration-500"
              style={{ width: `${api.metrics.coverageRate}%` }}
            />
          </div>
        </div>
      </div>
    </button>
  );
}
