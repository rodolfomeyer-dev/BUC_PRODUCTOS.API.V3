import { Recommendation, Priority } from '@/data/apiData';
import { cn } from '@/lib/utils';
import { AlertTriangle, AlertCircle, Info, ChevronRight } from 'lucide-react';

interface RecommendationCardProps {
  recommendation: Recommendation;
  compact?: boolean;
}

const priorityConfig: Record<Priority, { 
  className: string; 
  label: string; 
  icon: typeof AlertTriangle;
  badgeClass: string;
}> = {
  critical: {
    className: 'border-l-status-error',
    label: 'CRÍTICA',
    icon: AlertTriangle,
    badgeClass: 'priority-critical',
  },
  high: {
    className: 'border-l-status-warning',
    label: 'ALTA',
    icon: AlertCircle,
    badgeClass: 'priority-high',
  },
  medium: {
    className: 'border-l-status-pending',
    label: 'MEDIA',
    icon: Info,
    badgeClass: 'priority-medium',
  },
  low: {
    className: 'border-l-muted-foreground',
    label: 'BAJA',
    icon: Info,
    badgeClass: 'priority-low',
  },
};

export function RecommendationCard({ recommendation, compact = false }: RecommendationCardProps) {
  const config = priorityConfig[recommendation.priority];
  const Icon = config.icon;

  if (compact) {
    return (
      <div className={cn(
        'flex items-center gap-3 p-3 bg-secondary/30 rounded-lg border-l-4',
        config.className
      )}>
        <Icon className={cn(
          'h-4 w-4 flex-shrink-0',
          recommendation.priority === 'critical' && 'text-status-error',
          recommendation.priority === 'high' && 'text-status-warning',
          recommendation.priority === 'medium' && 'text-status-pending',
          recommendation.priority === 'low' && 'text-muted-foreground'
        )} />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground truncate">
            {recommendation.title}
          </p>
          <p className="text-xs text-muted-foreground">{recommendation.category}</p>
        </div>
        <span className={config.badgeClass}>{config.label}</span>
      </div>
    );
  }

  return (
    <div className={cn(
      'p-4 bg-card rounded-lg border border-border/50 border-l-4 space-y-2',
      config.className
    )}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <span className={config.badgeClass}>{config.label}</span>
          <span className="text-xs text-muted-foreground bg-secondary/50 px-2 py-0.5 rounded">
            {recommendation.category}
          </span>
        </div>
        <Icon className={cn(
          'h-5 w-5',
          recommendation.priority === 'critical' && 'text-status-error',
          recommendation.priority === 'high' && 'text-status-warning',
          recommendation.priority === 'medium' && 'text-status-pending',
          recommendation.priority === 'low' && 'text-muted-foreground'
        )} />
      </div>
      <h4 className="font-semibold text-foreground">{recommendation.title}</h4>
      <p className="text-sm text-muted-foreground leading-relaxed">
        {recommendation.description}
      </p>
    </div>
  );
}

export function RecommendationList({ recommendations }: { recommendations: Recommendation[] }) {
  return (
    <div className="space-y-3">
      {recommendations.map((rec) => (
        <RecommendationCard key={rec.id} recommendation={rec} compact />
      ))}
    </div>
  );
}
