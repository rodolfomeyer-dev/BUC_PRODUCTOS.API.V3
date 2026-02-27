import { useState } from 'react';
import { allApis } from '@/data/apiData';
import { ExecutiveDashboard } from '@/components/dashboard/ExecutiveDashboard';
import { ApiDetailPanel } from '@/components/dashboard/ApiDetailPanel';
import { StatusIndicator } from '@/components/dashboard/StatusBadge';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  FileText,
  Printer,
  ChevronLeft
} from 'lucide-react';

const Index = () => {
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  const handlePrint = () => {
    window.print();
  };

  const selectedApi = allApis.find(api => api.id === activeTab);

  return (
    <div className="min-h-screen bg-background">
      {/* Header fijo */}
      <header className="sticky top-0 z-50 bg-primary text-primary-foreground shadow-lg no-print">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-accent/20 rounded-lg">
                <FileText className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Informe APIS Confuturo</h1>
                <p className="text-sm text-primary-foreground/70">
                  Informe Ejecutivo de Resultados de Pruebas • Febrero 2026
                </p>
              </div>
            </div>
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-accent/20 hover:bg-accent/30 rounded-lg transition-colors"
            >
              <Printer className="h-4 w-4" />
              <span className="hidden sm:inline">Imprimir</span>
            </button>
          </div>
        </div>
      </header>

      {/* Navegación de tabs */}
      <nav className="sticky top-[72px] z-40 bg-card border-b border-border shadow-sm no-print">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-1 py-2 overflow-x-auto">
            {/* Tab Dashboard */}
            <button
              onClick={() => setActiveTab('dashboard')}
              className={cn(
                'flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap',
                activeTab === 'dashboard'
                  ? 'bg-accent text-accent-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
              )}
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard General
            </button>

            {/* Separador */}
            <div className="w-px h-6 bg-border mx-2" />

            {/* Tabs de APIs */}
            {allApis.map((api) => (
              <button
                key={api.id}
                onClick={() => setActiveTab(api.id)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap',
                  activeTab === api.id
                    ? 'bg-accent text-accent-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                )}
              >
                <StatusIndicator status={api.status} colorOverride={api.colorOverride} />
                {api.shortName}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Breadcrumb cuando está en detalle de API */}
      {activeTab !== 'dashboard' && (
        <div className="container mx-auto px-4 py-3 no-print">
          <button
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Volver al Dashboard General
          </button>
        </div>
      )}

      {/* Contenido principal */}
      <main className="container mx-auto px-4 py-6">
        {activeTab === 'dashboard' ? (
          <ExecutiveDashboard onApiSelect={setActiveTab} />
        ) : selectedApi ? (
          <ApiDetailPanel api={selectedApi} />
        ) : null}
      </main>

      {/* Footer */}
      <footer className="bg-secondary/30 border-t border-border py-6 mt-12">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>
            <strong>Informe de Resultados de Pruebas QA</strong> • Ambiente: QA • Fecha: Febrero 2026
          </p>
          <p className="mt-1">
            Generado para Gerencia de TI y Ciberseguridad
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
