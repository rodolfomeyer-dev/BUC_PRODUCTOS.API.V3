import { TestCase } from '@/data/apiData';
import { 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  MinusCircle,
  Clock,
  FileText
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface TestCasesTableProps {
  testCases: TestCase[];
}

const statusIcons = {
  pass: CheckCircle2,
  warning: AlertTriangle,
  fail: XCircle,
  'not-tested': MinusCircle,
  'false-positive': CheckCircle2
};

const statusColors = {
  pass: 'text-status-success',
  warning: 'text-status-warning',
  fail: 'text-status-error',
  'not-tested': 'text-muted-foreground',
  'false-positive': 'text-status-info'
};

const statusLabels = {
  pass: 'Pass',
  warning: 'Warning',
  fail: 'Fail',
  'not-tested': 'No Probado',
  'false-positive': 'Falso Positivo'
};

const priorityColors = {
  critical: 'bg-status-error/10 text-status-error border-status-error/30',
  high: 'bg-orange-500/10 text-orange-600 border-orange-500/30',
  medium: 'bg-status-warning/10 text-status-warning border-status-warning/30',
  low: 'bg-muted text-muted-foreground border-border'
};

const priorityLabels = {
  critical: 'Crítica',
  high: 'Alta',
  medium: 'Media',
  low: 'Baja'
};

type FilterStatus = 'all' | 'pass' | 'warning' | 'fail' | 'not-tested';

export function TestCasesTable({ testCases }: TestCasesTableProps) {
  const [filter, setFilter] = useState<FilterStatus>('all');
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const filteredCases = filter === 'all' 
    ? testCases 
    : testCases.filter(tc => {
        if (filter === 'pass') return tc.status === 'pass' || tc.status === 'false-positive';
        return tc.status === filter;
      });

  const passCount = testCases.filter(tc => tc.status === 'pass' || tc.status === 'false-positive').length;
  const warningCount = testCases.filter(tc => tc.status === 'warning').length;
  const failCount = testCases.filter(tc => tc.status === 'fail').length;
  const notTestedCount = testCases.filter(tc => tc.status === 'not-tested').length;

  const totalCasos = testCases.length;

  return (
    <div className="space-y-4">
      {/* Total de casos (dato del tab Todos) */}
      <div className="flex items-center gap-2 py-2 px-3 rounded-md bg-muted/50 border border-border w-fit">
        <span className="text-sm font-medium text-muted-foreground">Total de casos:</span>
        <span className="text-lg font-bold text-foreground">{totalCasos}</span>
      </div>
      {/* Header con resumen */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-accent" />
          <h4 className="font-semibold text-foreground">
            Matriz de Casos de Prueba ({testCases.length} casos)
          </h4>
        </div>
        
        {/* Resumen rápido */}
        <div className="flex items-center gap-4 text-sm">
          <span className="flex items-center gap-1 text-status-success">
            <CheckCircle2 className="h-4 w-4" />
            {passCount}
          </span>
          <span className="flex items-center gap-1 text-status-warning">
            <AlertTriangle className="h-4 w-4" />
            {warningCount}
          </span>
          <span className="flex items-center gap-1 text-status-error">
            <XCircle className="h-4 w-4" />
            {failCount}
          </span>
          <span className="flex items-center gap-1 text-muted-foreground">
            <MinusCircle className="h-4 w-4" />
            {notTestedCount}
          </span>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilter('all')}
          className={cn(
            'px-3 py-1.5 text-sm rounded-full border transition-colors',
            filter === 'all' 
              ? 'bg-accent text-accent-foreground border-accent' 
              : 'bg-secondary/50 text-muted-foreground border-border hover:bg-secondary'
          )}
        >
          Todos ({testCases.length})
        </button>
        <button
          onClick={() => setFilter('pass')}
          className={cn(
            'px-3 py-1.5 text-sm rounded-full border transition-colors',
            filter === 'pass' 
              ? 'bg-status-success/20 text-status-success border-status-success/50' 
              : 'bg-secondary/50 text-muted-foreground border-border hover:bg-secondary'
          )}
        >
          Pass ({passCount})
        </button>
        <button
          onClick={() => setFilter('warning')}
          className={cn(
            'px-3 py-1.5 text-sm rounded-full border transition-colors',
            filter === 'warning' 
              ? 'bg-status-warning/20 text-status-warning border-status-warning/50' 
              : 'bg-secondary/50 text-muted-foreground border-border hover:bg-secondary'
          )}
        >
          Warning ({warningCount})
        </button>
        <button
          onClick={() => setFilter('fail')}
          className={cn(
            'px-3 py-1.5 text-sm rounded-full border transition-colors',
            filter === 'fail' 
              ? 'bg-status-error/20 text-status-error border-status-error/50' 
              : 'bg-secondary/50 text-muted-foreground border-border hover:bg-secondary'
          )}
        >
          Fail ({failCount})
        </button>
        <button
          onClick={() => setFilter('not-tested')}
          className={cn(
            'px-3 py-1.5 text-sm rounded-full border transition-colors',
            filter === 'not-tested' 
              ? 'bg-muted text-foreground border-muted-foreground/50' 
              : 'bg-secondary/50 text-muted-foreground border-border hover:bg-secondary'
          )}
        >
          No Probados ({notTestedCount})
        </button>
      </div>

      {/* Tabla de casos */}
      <div className="overflow-x-auto">
        <table className="table-executive">
          <thead>
            <tr>
              <th className="w-24">ID</th>
              <th>Caso de Prueba</th>
              <th className="w-24">Prioridad</th>
              <th className="w-24">Estado</th>
              <th className="w-32">Resultado</th>
            </tr>
          </thead>
          <tbody>
            {filteredCases.map((testCase) => {
              const StatusIcon = statusIcons[testCase.status];
              const isExpanded = expandedRow === testCase.id;
              
              return (
                <>
                  <tr 
                    key={testCase.id}
                    onClick={() => setExpandedRow(isExpanded ? null : testCase.id)}
                    className="cursor-pointer hover:bg-secondary/50"
                  >
                    <td className="font-mono text-xs text-accent">{testCase.id}</td>
                    <td>
                      <div className="font-medium text-foreground">{testCase.name}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{testCase.category}</div>
                    </td>
                    <td>
                      <span className={cn(
                        'px-2 py-0.5 text-xs rounded-full border',
                        priorityColors[testCase.priority]
                      )}>
                        {priorityLabels[testCase.priority]}
                      </span>
                    </td>
                    <td>
                      <div className={cn('flex items-center gap-1.5', statusColors[testCase.status])}>
                        <StatusIcon className="h-4 w-4" />
                        <span className="text-sm">{statusLabels[testCase.status]}</span>
                      </div>
                    </td>
                    <td className="text-sm text-muted-foreground">
                      {testCase.httpCode || '-'}
                    </td>
                  </tr>
                  {isExpanded && (
                    <tr key={`${testCase.id}-expanded`} className="bg-secondary/30">
                      <td colSpan={5} className="p-4">
                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="font-medium text-foreground mb-1">Descripción:</p>
                            <p className="text-muted-foreground">{testCase.description}</p>
                          </div>
                          <div>
                            <p className="font-medium text-foreground mb-1">Resultado Esperado:</p>
                            <p className="text-muted-foreground">{testCase.expectedResult}</p>
                          </div>
                          {testCase.actualResult && (
                            <div>
                              <p className="font-medium text-foreground mb-1">Resultado Obtenido:</p>
                              <p className="text-muted-foreground">{testCase.actualResult}</p>
                            </div>
                          )}
                          {testCase.observations && (
                            <div>
                              <p className="font-medium text-foreground mb-1">Observaciones:</p>
                              <p className="text-muted-foreground">{testCase.observations}</p>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              );
            })}
          </tbody>
        </table>
      </div>

      {filteredCases.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No hay casos de prueba con el filtro seleccionado
        </div>
      )}
    </div>
  );
}