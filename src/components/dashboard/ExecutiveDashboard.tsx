import { KpiCard } from './KpiCard';
import { ApiHealthCard } from './ApiHealthCard';
import { ApiStatusDistribution, TestCasesSummaryChart } from './Charts';
import { RecommendationList } from './RecommendationCard';
import { allApis, dashboardMetrics, topRecommendations } from '@/data/apiData';
import { cn } from '@/lib/utils';
import {
  TestTube2,
  Target,
  Server,
  CalendarDays,
  TrendingUp,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';

interface ExecutiveDashboardProps {
  onApiSelect: (apiId: string) => void;
}

export function ExecutiveDashboard({ onApiSelect }: ExecutiveDashboardProps) {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* KPIs principales */}
      <section>
        <h2 className="section-header mb-4">Indicadores Principales</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard
            title="Total Pruebas Ejecutadas"
            value={dashboardMetrics.totalTests}
            subtitle="Across all APIs"
            icon={<TestTube2 className="h-5 w-5" />}
            variant="info"
          />
          <KpiCard
            title="Tasa de Éxito Global"
            value={`${dashboardMetrics.averageSuccessRate}%`}
            subtitle="HTTP responses OK"
            icon={<TrendingUp className="h-5 w-5" />}
            variant="success"
          />
          <KpiCard
            title="APIs Evaluadas"
            value={<span className="text-xl sm:text-2xl whitespace-nowrap">4 APIs con 43 Endpoints</span>}
            subtitle={
              <ul className="mt-2 space-y-1 text-xs font-medium text-muted-foreground border-t border-border/50 pt-2">
                <li className="flex justify-between"><span>Clientes</span><span>16 endpoints</span></li>
                <li className="flex justify-between"><span>Productos</span><span>19 endpoints</span></li>
                <li className="flex justify-between"><span>Payment</span><span>5 endpoints</span></li>
                <li className="flex justify-between"><span>Pensión</span><span>3 endpoints</span></li>
              </ul>
            }
            icon={<Server className="h-5 w-5" />}
          />
          <KpiCard
            title="Fecha del Informe"
            value={dashboardMetrics.reportDate}
            subtitle="Ambiente QA"
            icon={<CalendarDays className="h-5 w-5" />}
          />
        </div>
      </section>

      {/* Estado de Salud por API */}
      <section>
        <h2 className="section-header mb-4 flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-accent" />
          Estado de Salud por API
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {allApis.map((api) => (
            <ApiHealthCard
              key={api.id}
              api={api}
              onClick={() => onApiSelect(api.id)}
            />
          ))}
        </div>
      </section>

      {/* Resumen de casos de prueba por API (mismos datos que los TABS Casos de prueba) */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card-executive p-6 lg:col-span-2">
          <h3 className="section-header">Resumen de Casos de Prueba por API</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Total de casos y estados por API: Clientes, Payment, Productos, Pensión (Todos · Pass · Warning · Fail · No Probados)
          </p>
          <TestCasesSummaryChart />
        </div>
      </section>

      {/* Recomendaciones críticas */}
      <section>
        <div className="card-executive p-6">
          <h3 className="section-header flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-status-warning" />
            Recomendaciones Prioritarias
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Las 5 recomendaciones más importantes identificadas durante el análisis
          </p>
          <RecommendationList recommendations={topRecommendations} />
        </div>
      </section>

      {/* Distribución de estados */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card-executive p-6">
          <h3 className="section-header">Estado de APIs</h3>
          <ApiStatusDistribution />
        </div>
        <div className="card-executive p-6 lg:col-span-2">
          <h3 className="section-header">Métricas de Calidad por API</h3>
          <div className="overflow-x-auto">
            <table className="table-executive">
              <thead>
                <tr>
                  <th>API</th>
                  <th>Pruebas</th>
                  <th>Éxito HTTP</th>
                  <th>Cobertura</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {allApis.map((api) => (
                  <tr key={api.id}>
                    <td className="font-medium">{api.shortName}</td>
                    <td>{api.metrics.totalTests}</td>
                    <td>{api.metrics.successRate}%</td>
                    <td>{api.metrics.coverageRate}%</td>
                    <td>
                      <span className={cn(
                        "px-2 py-1 rounded text-xs font-semibold",
                        api.colorOverride === 'blue' ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" :
                          api.colorOverride === 'red' ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" :
                            api.status === 'go' || api.status === 'go-observaciones' ? 'bg-status-success/15 text-status-success' :
                              api.status === 'condicionada' ? 'bg-status-warning/15 text-status-warning' :
                                'bg-status-pending/15 text-status-pending'
                      )}>
                        {api.statusLabel}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
