import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { allApis, dashboardMetrics, testCaseSummaryByApi } from '@/data/apiData';

// Colors that match our design system
const COLORS = {
  success: '#22c55e',
  warning: '#f59e0b',
  error: '#ef4444',
  pending: '#3b82f6',
  muted: '#94a3b8',
};

export function GlobalResultsChart() {
  // Consolidate all endpoint results
  const allResults = allApis.flatMap(api => api.endpointResults);
  
  const data = [
    { name: 'Pass', value: allResults.filter(r => r.result === 'pass' || r.result === 'false-positive').length, color: COLORS.success },
    { name: 'Warning', value: allResults.filter(r => r.result === 'warning').length, color: COLORS.warning },
    { name: 'Fail', value: allResults.filter(r => r.result === 'fail').length, color: COLORS.error },
    { name: 'N/T', value: allResults.filter(r => r.result === 'not-tested').length, color: COLORS.pending },
  ].filter(d => d.value > 0);

  return (
    <div className="h-[280px] w-full">
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={2}
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            labelLine={{ stroke: '#94a3b8', strokeWidth: 1 }}
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.color}
                stroke="transparent"
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
            }}
            formatter={(value: number) => [`${value} pruebas`, '']}
          />
          <Legend 
            verticalAlign="bottom"
            height={36}
            formatter={(value) => <span className="text-sm text-muted-foreground">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export function ApiComparisonChart() {
  const data = allApis.map(api => ({
    name: api.shortName,
    'Tasa Éxito': api.metrics.successRate,
    'Cobertura': api.metrics.coverageRate,
  }));

  return (
    <div className="h-[280px] w-full">
      <ResponsiveContainer>
        <BarChart data={data} layout="vertical" margin={{ left: 20, right: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis 
            type="number" 
            domain={[0, 100]}
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
            tickFormatter={(value) => `${value}%`}
          />
          <YAxis 
            type="category" 
            dataKey="name"
            tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }}
            width={80}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
            }}
            formatter={(value: number) => [`${value}%`, '']}
          />
          <Bar dataKey="Tasa Éxito" fill={COLORS.success} radius={[0, 4, 4, 0]} />
          <Bar dataKey="Cobertura" fill={COLORS.pending} radius={[0, 4, 4, 0]} />
          <Legend 
            verticalAlign="top"
            height={36}
            formatter={(value) => <span className="text-sm text-muted-foreground">{value}</span>}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

/** Gráfico resumen: casos de prueba por API y estado (mismos datos que los TABS Casos de prueba) */
export function TestCasesSummaryChart() {
  const totalCasos = testCaseSummaryByApi.reduce((s, r) => s + r.todos, 0);
  const chartData = testCaseSummaryByApi.map(row => ({
    name: row.shortName,
    Pass: row.pass,
    Warning: row.warning,
    Fail: row.fail,
    'No Probados': row.noProbados,
  }));

  const maxTotal = Math.max(...testCaseSummaryByApi.map(r => r.todos), 1);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 py-3 px-4 rounded-lg bg-accent/10 border-2 border-accent shadow-sm">
        <span className="text-base font-semibold text-foreground">Total de casos de prueba:</span>
        <span className="text-2xl font-bold text-accent tabular-nums">{totalCasos}</span>
      </div>
      <div className="h-[260px] w-full test-cases-summary-chart">
        <ResponsiveContainer>
          <BarChart data={chartData} layout="vertical" margin={{ left: 8, right: 20, top: 8, bottom: 8 }} cursor={false}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              type="number"
              domain={[0, maxTotal]}
              tick={{ fill: 'hsl(var(--foreground))', fontSize: 13, fontWeight: 500 }}
            />
            <YAxis
              type="category"
              dataKey="name"
              width={128}
              tick={(props) => {
                const { x, y, payload } = props;
                const name = (payload?.value ?? payload) as string;
                const row = testCaseSummaryByApi.find(r => r.shortName === name);
                const total = row?.todos ?? 0;
                return (
                  <g transform={`translate(${x},${y})`}>
                    <text x={0} y={0} dy={4} textAnchor="end" fill="hsl(var(--foreground))" fontSize={14} fontWeight={600} style={{ fontFamily: 'inherit' }}>
                      {name}
                    </text>
                    <text x={0} y={0} dy={4} dx={5} textAnchor="start" fill="hsl(var(--accent))" fontSize={14} fontWeight={700} style={{ fontFamily: 'inherit' }}>
                      ({total})
                    </text>
                  </g>
                );
              }}
            />
            <Tooltip
              cursor={false}
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '2px solid hsl(var(--accent))',
                borderRadius: 'var(--radius)',
                boxShadow: 'var(--shadow-lg)',
                padding: '14px 18px',
                fontFamily: 'inherit',
                fontSize: '14px',
                fontWeight: 500,
              }}
              labelStyle={{ fontWeight: 600, fontSize: '15px', marginBottom: '8px', color: 'hsl(var(--foreground))' }}
              formatter={(value: number, name: string) => [`${value}`, name]}
              labelFormatter={(label) => {
                const row = testCaseSummaryByApi.find(r => r.shortName === label);
                const total = row?.todos ?? 0;
                return `API: ${label} · Total: ${total}`;
              }}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              formatter={(value) => <span className="text-sm font-medium text-foreground">{value}</span>}
            />
            <Bar dataKey="Pass" stackId="a" fill={COLORS.success} radius={[0, 0, 0, 0]} name="Pass" activeBar={false} />
            <Bar dataKey="Warning" stackId="a" fill={COLORS.warning} radius={[0, 0, 0, 0]} name="Warning" activeBar={false} />
            <Bar dataKey="Fail" stackId="a" fill={COLORS.error} radius={[0, 0, 0, 0]} name="Fail" activeBar={false} />
            <Bar dataKey="No Probados" stackId="a" fill={COLORS.muted} radius={[0, 4, 4, 0]} name="No Probados" activeBar={false} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="overflow-x-auto">
        <table className="table-executive">
          <thead>
            <tr>
              <th>API</th>
              <th>Todos</th>
              <th>Pass</th>
              <th>Warning</th>
              <th>Fail</th>
              <th>No Probados</th>
            </tr>
          </thead>
          <tbody>
            {testCaseSummaryByApi.map((row) => (
              <tr key={row.apiId}>
                <td className="font-medium">{row.shortName}</td>
                <td>{row.todos}</td>
                <td className="text-status-success">{row.pass}</td>
                <td className="text-status-warning">{row.warning}</td>
                <td className="text-status-error">{row.fail}</td>
                <td className="text-muted-foreground">{row.noProbados}</td>
              </tr>
            ))}
            <tr className="border-t-2 border-border font-semibold bg-muted/30">
              <td className="font-medium">Total</td>
              <td>{testCaseSummaryByApi.reduce((s, r) => s + r.todos, 0)}</td>
              <td className="text-status-success">{testCaseSummaryByApi.reduce((s, r) => s + r.pass, 0)}</td>
              <td className="text-status-warning">{testCaseSummaryByApi.reduce((s, r) => s + r.warning, 0)}</td>
              <td className="text-status-error">{testCaseSummaryByApi.reduce((s, r) => s + r.fail, 0)}</td>
              <td className="text-muted-foreground">{testCaseSummaryByApi.reduce((s, r) => s + r.noProbados, 0)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function ApiStatusDistribution() {
  const statusCounts = {
    'GO': allApis.filter(api => api.status === 'go' || api.status === 'go-observaciones').length,
    'Condicionada': allApis.filter(api => api.status === 'condicionada').length,
    'Pendiente': allApis.filter(api => api.status === 'pendiente').length,
  };

  const data = [
    { name: 'GO/Observaciones', value: statusCounts['GO'], color: COLORS.success },
    { name: 'Condicionada', value: statusCounts['Condicionada'], color: COLORS.warning },
    { name: 'Pendiente', value: statusCounts['Pendiente'], color: COLORS.pending },
  ].filter(d => d.value > 0);

  return (
    <div className="h-[200px] w-full">
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={40}
            outerRadius={70}
            paddingAngle={3}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
            }}
          />
          <Legend 
            verticalAlign="bottom"
            formatter={(value) => <span className="text-xs text-muted-foreground">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
