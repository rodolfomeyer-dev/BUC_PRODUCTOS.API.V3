import { EndpointResult } from '@/data/apiData';
import { StatusBadge } from './StatusBadge';

interface EndpointTableProps {
  endpoints: EndpointResult[];
}

export function EndpointTable({ endpoints }: EndpointTableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border/50">
      <table className="table-executive">
        <thead>
          <tr>
            <th>Endpoint</th>
            <th>Método</th>
            <th>Estado</th>
            <th>Resultado</th>
            <th>Observaciones</th>
          </tr>
        </thead>
        <tbody>
          {endpoints.map((endpoint, index) => (
            <tr key={index} className="animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
              <td className="font-mono text-xs text-foreground">{endpoint.endpoint}</td>
              <td>
                <span className={`
                  px-2 py-1 rounded text-xs font-semibold
                  ${endpoint.method === 'GET' ? 'bg-status-success/15 text-status-success' : ''}
                  ${endpoint.method === 'POST' ? 'bg-status-pending/15 text-status-pending' : ''}
                  ${endpoint.method === 'PUT' ? 'bg-status-warning/15 text-status-warning' : ''}
                  ${endpoint.method === 'DELETE' ? 'bg-status-error/15 text-status-error' : ''}
                `}>
                  {endpoint.method}
                </span>
              </td>
              <td className="text-sm text-muted-foreground">{endpoint.status}</td>
              <td>
                <StatusBadge status={endpoint.result} size="sm" />
              </td>
              <td className="text-sm text-muted-foreground max-w-xs">{endpoint.observations}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
