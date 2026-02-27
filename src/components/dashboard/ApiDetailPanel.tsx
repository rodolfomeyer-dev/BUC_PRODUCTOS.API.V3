import { useState } from 'react';
import { ApiData } from '@/data/apiData';
import { StatusBadge } from './StatusBadge';
import { EndpointTable } from './EndpointTable';
import { RecommendationCard } from './RecommendationCard';
import { TestCasesTable } from './TestCasesTable';
import {
  ExternalLink,
  Server,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  FileText,
  Target,
  TrendingUp,
  ClipboardList
} from 'lucide-react';

interface ApiDetailPanelProps {
  api: ApiData;
}

export function ApiDetailPanel({ api }: ApiDetailPanelProps) {
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'testcases'>('overview');

  const successCount = api.endpointResults.filter(e => e.result === 'pass' || e.result === 'false-positive').length;
  const warningCount = api.endpointResults.filter(e => e.result === 'warning').length;
  const errorCount = api.endpointResults.filter(e => e.result === 'fail').length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header de la API */}
      <div className="card-executive p-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Server className="h-6 w-6 text-accent" />
              <h2 className="text-2xl font-bold text-foreground">{api.name}</h2>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <StatusBadge status={api.status} />
              <span className="text-sm text-muted-foreground">
                Ambiente: <span className="font-medium text-foreground">{api.environment}</span>
              </span>
              <span className="text-sm text-muted-foreground">
                Versión: <span className="font-medium text-foreground">{api.version}</span>
              </span>
              <span className="text-sm text-muted-foreground">
                Fecha: <span className="font-medium text-foreground">{api.date}</span>
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <a
              href={api.swaggerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-accent hover:underline"
            >
              <ExternalLink className="h-4 w-4" />
              Swagger v1
            </a>
            {api.swaggerUrlV2 && (
              <a
                href={api.swaggerUrlV2}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-accent hover:underline"
              >
                <ExternalLink className="h-4 w-4" />
                Swagger v2
              </a>
            )}
          </div>
        </div>

        {/* Métricas rápidas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-border/50">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 text-status-success mb-1">
              <CheckCircle2 className="h-5 w-5" />
              <span className="text-2xl font-bold">{successCount}</span>
            </div>
            <p className="text-sm text-muted-foreground">Pass</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 text-status-warning mb-1">
              <AlertTriangle className="h-5 w-5" />
              <span className="text-2xl font-bold">{warningCount}</span>
            </div>
            <p className="text-sm text-muted-foreground">Warning</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 text-status-error mb-1">
              <XCircle className="h-5 w-5" />
              <span className="text-2xl font-bold">{errorCount}</span>
            </div>
            <p className="text-sm text-muted-foreground">Fail</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 text-accent mb-1">
              <Target className="h-5 w-5" />
              <span className="text-2xl font-bold">{api.metrics.coverageRate}%</span>
            </div>
            <p className="text-sm text-muted-foreground">Cobertura</p>
          </div>
        </div>
      </div>

      {/* Resumen Ejecutivo */}
      <div className="card-executive p-6">
        <h3 className="section-header flex items-center gap-2">
          <FileText className="h-5 w-5 text-accent" />
          Resumen Ejecutivo
        </h3>
        <ul className="space-y-2">
          {api.summary.map((item, index) => (
            <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
              <span className="text-accent mt-1">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>

        {/* Hallazgos */}
        <div className="mt-6">
          <h4 className="font-semibold text-foreground mb-3">Resumen de Hallazgos</h4>
          <div className="overflow-x-auto">
            <table className="table-executive">
              <thead>
                <tr>
                  <th>Categoría</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {api.findings.map((finding, index) => (
                  <tr key={index}>
                    <td className="font-medium">{finding.category}</td>
                    <td className="text-muted-foreground">{finding.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Tabs de contenido */}
      <div className="tab-nav">
        <button
          onClick={() => setActiveSubTab('overview')}
          className={activeSubTab === 'overview' ? 'tab-item-active' : 'tab-item'}
        >
          Resultados por Endpoint
        </button>
        <button
          onClick={() => setActiveSubTab('testcases')}
          className={activeSubTab === 'testcases' ? 'tab-item-active' : 'tab-item'}
        >
          <ClipboardList className="h-4 w-4 mr-1 inline" />
          Casos de Prueba
        </button>
      </div>

      {/* Contenido del tab */}
      {activeSubTab === 'overview' && (
        <div className="space-y-6">
          {/* Tabla de endpoints */}
          <div className="card-executive p-6">
            <h3 className="section-header flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-accent" />
              Resultados por Endpoint
            </h3>
            <EndpointTable endpoints={api.endpointResults} />
          </div>

          {/* Recomendaciones */}
          <div className="card-executive p-6">
            <h3 className="section-header flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-status-warning" />
              Recomendaciones
            </h3>
            <div className="grid gap-4">
              {api.recommendations.map((rec) => (
                <RecommendationCard key={rec.id} recommendation={rec} />
              ))}
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'testcases' && (
        <div className="card-executive p-6">
          <TestCasesTable testCases={api.testCases} />
        </div>
      )}
    </div>
  );
}
