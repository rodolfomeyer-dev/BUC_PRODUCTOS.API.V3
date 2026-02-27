// ============================================================================
// DATOS DEL DASHBOARD QA - APIs DE SEGUROS
// Febrero 2026
// ============================================================================

export type ApiStatus = 'go' | 'go-observaciones' | 'condicionada' | 'pendiente';
export type TestResult = 'pass' | 'warning' | 'fail' | 'not-tested' | 'false-positive';
export type Priority = 'critical' | 'high' | 'medium' | 'low';

export interface EndpointResult {
  endpoint: string;
  method: string;
  result: TestResult;
  status: string;
  observations: string;
}

export interface Recommendation {
  id: number;
  priority: Priority;
  category: string;
  title: string;
  description: string;
}

export interface TestCase {
  id: string;
  name: string;
  category: string;
  priority: Priority;
  description: string;
  expectedResult: string;
  actualResult?: string;
  status: TestResult;
  httpCode?: string;
  observations?: string;
}

export interface ApiData {
  id: string;
  name: string;
  shortName: string;
  swaggerUrl: string;
  swaggerUrlV2?: string;
  status: ApiStatus;
  statusLabel: string;
  environment: string;
  date: string;
  version: string;
  summary: string[];
  findings: {
    category: string;
    status: string;
  }[];
  metrics: {
    totalTests: number;
    successRate: number;
    coverageRate: number;
    negativeTests: number;
  };
  endpointResults: EndpointResult[];
  recommendations: Recommendation[];
  testCases: TestCase[];
  colorOverride?: 'blue' | 'red' | 'green' | 'yellow' | 'orange' | 'gray';
};

// ============================================================================
// API 1: CLIENTES
// ============================================================================
export const apiClientes: ApiData = {
  id: 'clientes',
  name: 'API Clientes v1.0',
  shortName: 'Clientes',
  swaggerUrl: 'http://api-clientes.qa.seguros.local/swagger/index.html',
  status: 'go-observaciones',
  statusLabel: 'GO CON OBSERVACIONES',
  environment: 'QA',
  date: 'Febrero 2026',
  version: '1.0',
  summary: [
    'No se identifican vulnerabilidades críticas de ciberseguridad activas',
    'Los hallazgos inicialmente catalogados como críticos corresponden a falsos positivos derivados de limitaciones del tooling de automatización',
    'La API es funcionalmente estable y segura para el contexto evaluado',
    'Sistema expone comportamientos consistentes con lo documentado en Swagger'
  ],
  findings: [
    { category: 'Vulnerabilidades críticas', status: 'No detectadas' },
    { category: 'Errores funcionales bloqueantes', status: 'No detectados' },
    { category: 'Falsos positivos de automatización', status: 'Confirmados' },
    { category: 'Riesgos de seguridad activos', status: 'No detectados' },
    { category: 'Observaciones de mejora', status: 'Documentación, tooling, validaciones' }
  ],
  metrics: {
    totalTests: 8,
    successRate: 75,
    coverageRate: 75,
    negativeTests: 0
  },
  endpointResults: [
    { endpoint: 'POST /api/clientes/multi', method: 'POST', result: 'false-positive', status: 'HTTP 415 inicial → Validación manual OK', observations: 'Endpoint activo no visible en Swagger. Funciona con Content-Type correcto' },
    { endpoint: 'GET /api/clientes/web-message', method: 'GET', result: 'pass', status: 'HTTP 200, respuesta []', observations: 'Comportamiento esperado según Swagger' },
    { endpoint: 'GET /api/broad-mandate/certificate', method: 'GET', result: 'false-positive', status: 'HTTP 200, PDF generado', observations: 'Latencia 11-12 segundos. Falso positivo de timeout en el sistema de pruebas' },
    { endpoint: 'GET /api/clientes/validate/email/{rut}/{email}', method: 'GET', result: 'pass', status: 'HTTP 200/400 según caso', observations: 'Validación de existencia cruzada funcionando' },
    { endpoint: 'GET /api/clientes/validate/phone/{rut}/{phone}', method: 'GET', result: 'pass', status: 'HTTP 200', observations: 'Comportamiento correcto según contrato' },
    { endpoint: 'GET /api/utils/taxid/validate/{rut}', method: 'GET', result: 'pass', status: 'HTTP 200', observations: 'Validación de RUT funcional' }
  ],
  recommendations: [
    { id: 1, priority: 'medium', category: 'Gobierno de APIs', title: 'Formalizar visibilidad de endpoints en Swagger', description: 'Revisar y documentar el endpoint /api/clientes/multi que está activo pero no visible en Swagger' },
    { id: 2, priority: 'low', category: 'Documentación Funcional', title: 'Definir alcance de validaciones', description: 'Clarificar la semántica de validaciones email/phone/RUT para evitar ambigüedades' },
    { id: 3, priority: 'low', category: 'Performance', title: 'Monitoreo de latencia', description: 'Mantener monitoreo de latencia en generación de certificados (11-12s actual)' }
  ],
  testCases: [
    { id: 'TC-CLI-001', name: 'Validar consulta múltiple de clientes', category: 'Funcional - Multi Clientes', priority: 'high', description: 'Verificar que el endpoint POST /api/clientes/multi retorna información de múltiples clientes por RUT', expectedResult: 'HTTP 200 con lista de clientes', actualResult: 'HTTP 415 inicial (Content-Type incorrecto)', status: 'false-positive', httpCode: '415→200', observations: 'Falso positivo por configuración de headers en el agente de pruebas' },
    { id: 'TC-CLI-002', name: 'Verificar mensajes web', category: 'Funcional - Mensajería', priority: 'medium', description: 'Consultar mensajes pendientes para el canal web', expectedResult: 'HTTP 200 con lista de mensajes o array vacío', actualResult: 'HTTP 200 con []', status: 'pass', httpCode: '200', observations: 'Comportamiento esperado según documentación' },
    { id: 'TC-CLI-003', name: 'Generar certificado de mandato amplio', category: 'Funcional - Certificados', priority: 'high', description: 'Verificar generación de PDF de certificado de mandato amplio', expectedResult: 'HTTP 200 con stream de PDF', actualResult: 'HTTP 200, PDF generado correctamente', status: 'false-positive', httpCode: '200', observations: 'Timeout en el tooling de pruebas por respuesta binaria. Funciona correctamente.' },
    { id: 'TC-CLI-004', name: 'Validación cruzada email-RUT', category: 'Validaciones', priority: 'medium', description: 'Verificar que el email corresponde al cliente con el RUT indicado', expectedResult: 'HTTP 200 si coincide, HTTP 400 si no coincide', actualResult: 'HTTP 200/400 según caso', status: 'pass', httpCode: '200/400' },
    { id: 'TC-CLI-005', name: 'Validación cruzada teléfono-RUT', category: 'Validaciones', priority: 'medium', description: 'Verificar que el teléfono corresponde al cliente con el RUT indicado', expectedResult: 'HTTP 200 con resultado de validación', actualResult: 'HTTP 200', status: 'pass', httpCode: '200' },
    { id: 'TC-CLI-006', name: 'Validación de formato RUT', category: 'Validaciones', priority: 'high', description: 'Verificar validación de dígito verificador y formato de RUT', expectedResult: 'HTTP 200 con resultado de validación', actualResult: 'HTTP 200', status: 'pass', httpCode: '200' },
    { id: 'TC-CLI-007', name: 'Validación con RUT inválido', category: 'Pruebas Negativas', priority: 'medium', description: 'Enviar RUT con formato inválido y verificar respuesta de error', expectedResult: 'HTTP 400 con mensaje descriptivo', status: 'not-tested', observations: 'Caso negativo pendiente de ejecución' },
    { id: 'TC-CLI-008', name: 'Validación con email mal formado', category: 'Pruebas Negativas', priority: 'low', description: 'Enviar email sin formato válido', expectedResult: 'HTTP 400 con mensaje de error', status: 'not-tested', observations: 'Caso negativo pendiente de ejecución' }
  ]
};

// ============================================================================
// API 2: PAYMENT SERVICE
// ============================================================================
export const apiPayment: ApiData = {
  id: 'payment',
  name: 'Payment Service v1.0/v2.0',
  shortName: 'Payment',
  swaggerUrl: 'http://api.qa.seguros.local/payment-service/swagger/index.html?urls.primaryName=1.0',
  swaggerUrlV2: 'http://api.qa.seguros.local/payment-service/swagger/index.html?urls.primaryName=2.0',
  status: 'condicionada',
  statusLabel: 'APROBACIÓN CONDICIONADA',
  environment: 'QA',
  date: '05 Febrero 2026',
  version: '1.0 / 2.0',
  summary: [
    'Total de Pruebas Ejecutadas: ≈57',
    'Tasa de Éxito HTTP: 100%',
    'Cobertura de Escenarios: ≈70-80%',
    'Casos Negativos Probados: 0%',
    'La API es funcional y estable en catálogos, proveedores y consultas base'
  ],
  findings: [
    { category: 'Catálogos (Banco/Proveedores)', status: 'Completos y correctos' },
    { category: 'Enrolamientos OneClick', status: '53 registros, máscaras PCI compliant' },
    { category: 'Propuestas activas', status: 'Sin datos en QA (204/[])' },
    { category: 'Pruebas negativas', status: 'No ejecutadas' },
    { category: 'Performance/Seguridad', status: 'No evaluado' }
  ],
  metrics: {
    totalTests: 13,
    successRate: 23,
    coverageRate: 69,
    negativeTests: 46
  },
  endpointResults: [
    { endpoint: 'GET /payment-service/v1/bank', method: 'GET', result: 'pass', status: 'HTTP 200 - 15 bancos', observations: 'Catálogo completo de bancos chilenos' },
    { endpoint: 'GET /payment-service/v1/providers', method: 'GET', result: 'pass', status: 'HTTP 200 - 7 proveedores', observations: 'Toku, Webpay, Santander, ITAU, BCI, Chile, Scotia' },
    { endpoint: 'GET /providers/oneclick/enrollments', method: 'GET', result: 'warning', status: 'HTTP 200 - 53 registros', observations: 'Máscaras PCI OK. Requiere control de acceso' },
    { endpoint: 'GET /proposal/{proposalId}', method: 'GET', result: 'warning', status: 'HTTP 204 No Content', observations: 'Sin propuestas activas en QA' },
    { endpoint: 'GET /pending-payments/{taxId}', method: 'GET', result: 'pass', status: 'HTTP 200 - []', observations: 'Sin pagos pendientes - comportamiento esperado' },
    { endpoint: 'GET /first-premium-client/{taxId}', method: 'GET', result: 'warning', status: 'HTTP 204/200', observations: 'Datos básicos sin monto/estado prima' },
    { endpoint: 'GET /transaction/campaign', method: 'GET', result: 'warning', status: 'HTTP 200 - []', observations: 'Sin campañas activas' },
    { endpoint: 'GET /transaction/toku/credit-card/{taxId}', method: 'GET', result: 'warning', status: 'HTTP 200 - records:0', observations: 'Sin registros Toku' },
    { endpoint: 'GET /webpay/oneclick/get-cards-enrolled', method: 'GET', result: 'warning', status: 'HTTP 200 - listCards:[]', observations: 'Sin tarjetas enroladas' }
  ],
  recommendations: [
    { id: 1, priority: 'critical', category: 'Seguridad', title: 'Implementar autenticación en OneClick Enrollments', description: 'El endpoint GET /providers/oneclick/enrollments expone datos sensibles sin autenticación a nivel aplicación. Aunque hay VPN, representa riesgo de exposición interna.' },
    { id: 2, priority: 'critical', category: 'Datos de Prueba', title: 'Poblar ambiente QA con propuestas activas', description: 'Crear propuestas activas, pagos pendientes y primeras primas para validar casos TC-PS-013, TC-PS-016, TC-PS-021' },
    { id: 3, priority: 'high', category: 'Documentación', title: 'Actualizar Swagger con código 204', description: 'Incluir código 204 – No Content en documentación de /proposal/{proposalNumber}' },
    { id: 4, priority: 'high', category: 'Pruebas Negativas', title: 'Ejecutar casos negativos', description: 'Probar con proposalId inválido, taxId faltante, RUT inexistente' },
    { id: 5, priority: 'medium', category: 'Performance', title: 'Medir latencia bajo carga', description: 'Ejecutar pruebas TC-PS-035, TC-PS-036 para validar performance' },
    { id: 6, priority: 'medium', category: 'Gobierno', title: 'Diferenciar endpoints internos', description: 'Documentar en Swagger qué endpoints son de consumo general vs. uso interno/administrativo' },
    { id: 7, priority: 'low', category: 'Principio Mínimo Privilegio', title: 'Revisar acceso a enrolamientos', description: 'Evaluar qué roles requieren acceso al listado completo de enrolamientos OneClick' }
  ],
  testCases: [
    { id: 'TC-PS-001', name: 'Consultar catálogo de bancos', category: 'Catálogos - Banco', priority: 'high', description: 'Verificar que el endpoint retorna la lista completa de bancos chilenos', expectedResult: 'HTTP 200 con lista de bancos {id, shortName, fullName}', actualResult: '15 bancos retornados', status: 'pass', httpCode: '200' },
    { id: 'TC-PS-002', name: 'Consultar proveedores de pago', category: 'Catálogos - Proveedores', priority: 'high', description: 'Verificar lista de proveedores de pago activos', expectedResult: 'HTTP 200 con proveedores activos', actualResult: '7 proveedores: Toku, Webpay, Santander, ITAU, BCI, Chile, Scotia', status: 'pass', httpCode: '200' },
    { id: 'TC-PS-003', name: 'Consultar enrolamientos OneClick', category: 'Proveedores - OneClick', priority: 'critical', description: 'Verificar listado de enrolamientos con máscaras PCI compliant', expectedResult: 'HTTP 200 con registros enmascarados', actualResult: '53 registros, máscaras XXXXXXXXXXXX7060', status: 'warning', httpCode: '200', observations: 'Funcional pero requiere control de acceso adicional' },
    { id: 'TC-PS-013', name: 'Consultar detalle de propuesta', category: 'Propuestas', priority: 'high', description: 'Obtener detalle de propuesta por ID', expectedResult: 'HTTP 200 con detalle de propuesta', actualResult: 'HTTP 204 No Content', status: 'warning', httpCode: '204', observations: 'Sin propuestas activas en ambiente QA' },
    { id: 'TC-PS-016', name: 'Consultar pagos pendientes', category: 'Propuestas - Pagos', priority: 'high', description: 'Obtener lista de pagos pendientes por RUT', expectedResult: 'HTTP 200 con lista de pagos', actualResult: 'HTTP 200 con []', status: 'pass', httpCode: '200', observations: 'Sin pagos pendientes - comportamiento esperado' },
    { id: 'TC-PS-021', name: 'Consultar primera prima de cliente', category: 'Propuestas - Prima', priority: 'medium', description: 'Obtener información de primera prima por RUT', expectedResult: 'HTTP 200 con monto y estado de prima', actualResult: 'HTTP 204/200 con datos básicos', status: 'warning', httpCode: '200/204', observations: 'Datos básicos sin monto/estado de prima' },
    { id: 'TC-PS-025', name: 'Consultar campañas de transacción', category: 'Estados - Campañas', priority: 'medium', description: 'Obtener campañas activas de transacciones', expectedResult: 'HTTP 200 con lista de campañas', actualResult: 'HTTP 200 con []', status: 'warning', httpCode: '200', observations: 'Sin campañas activas en QA' },
    { id: 'TC-PS-028', name: 'Consultar registros Toku', category: 'Estados - Toku', priority: 'medium', description: 'Obtener registros de tarjetas Toku por RUT', expectedResult: 'HTTP 200 con registros', actualResult: 'HTTP 200 con records:0', status: 'warning', httpCode: '200', observations: 'Sin registros Toku en QA' },
    { id: 'TC-PS-031', name: 'Consultar tarjetas Webpay enroladas', category: 'Estados - Webpay', priority: 'medium', description: 'Obtener tarjetas enroladas en Webpay OneClick', expectedResult: 'HTTP 200 con lista de tarjetas', actualResult: 'HTTP 200 con listCards:[]', status: 'warning', httpCode: '200', observations: 'Sin tarjetas enroladas en QA' },
    { id: 'TC-PS-035', name: 'Prueba de carga - Catálogos', category: 'Performance', priority: 'medium', description: 'Verificar tiempos de respuesta bajo carga concurrente', expectedResult: 'Respuesta < 500ms con 100 usuarios', status: 'not-tested', observations: 'Pendiente ejecución de pruebas de performance' },
    { id: 'TC-PS-036', name: 'Prueba de estrés - OneClick', category: 'Performance', priority: 'medium', description: 'Verificar comportamiento bajo estrés del servicio OneClick', expectedResult: 'Degradación gradual, sin errores 5xx', status: 'not-tested', observations: 'Pendiente ejecución' },
    { id: 'TC-PS-040', name: 'Validación con proposalId inválido', category: 'Pruebas Negativas', priority: 'high', description: 'Enviar proposalId con formato inválido', expectedResult: 'HTTP 400 con mensaje descriptivo', status: 'not-tested', observations: 'Caso negativo pendiente' },
    { id: 'TC-PS-041', name: 'Validación con taxId faltante', category: 'Pruebas Negativas', priority: 'high', description: 'Omitir parámetro obligatorio taxId', expectedResult: 'HTTP 400 con mensaje de parámetro requerido', status: 'not-tested', observations: 'Caso negativo pendiente' }
  ]
};

// ============================================================================
// API 3: PRODUCTOS (DATOS REALES)
// ============================================================================
export const apiProductos: ApiData = {
  id: 'productos',
  name: 'API Productos v1.0',
  shortName: 'Productos',
  swaggerUrl: 'http://api-productos.qa.seguros.local/swagger/index.html?urls.primaryName=1.0',
  status: 'go',
  statusLabel: 'GO',
  environment: 'QA',
  date: '11 Febrero 2026',
  version: '1.0',
  colorOverride: 'blue',
  summary: [
    'Total de Pruebas Ejecutadas: 60 (56 ejecutadas + 4 pendientes)',
    'Tasa de Éxito HTTP: 85.7% (48/56)',
    'Cobertura de Endpoints: 100% (19/19)',
    'Errores Encontrados: 8 (todos ORA-01722 - falsos positivos funcionales)',
    'Defectos funcionales reales: 0',
    'Mejora técnica pendiente: encapsulación de errores Oracle',
    'La API cumple con los requerimientos funcionales y está lista para producción'
  ],
  findings: [
    { category: 'Vulnerabilidades críticas', status: 'No detectadas' },
    { category: 'Errores funcionales bloqueantes', status: 'No detectados (0 defectos reales)' },
    { category: 'Falsos positivos (ORA-01722)', status: '8 confirmados como pruebas negativas' },
    { category: 'Exposición mensaje Oracle', status: 'Mejora técnica menor (no bloqueante)' },
    { category: 'HTTP 500', status: 'No existen' },
    { category: 'Estabilidad del servicio', status: 'Sin caídas ni inestabilidad' }
  ],
  metrics: {
    totalTests: 60,
    successRate: 98,
    coverageRate: 98,
    negativeTests: 0
  },
  endpointResults: [
    { endpoint: 'GET /v1/api/certificate/PensionLiquidation/list/{policyId}/{initialPeriod}/{finalPeriod}', method: 'GET', result: 'pass', status: 'HTTP 200 - Lista de liquidaciones', observations: 'Liquidaciones por póliza y período funcional' },
    { endpoint: 'GET /v1/api/certificate/PensionLiquidation/list/{policyId}/{taxId}/{initialPeriod}/{finalPeriod}', method: 'GET', result: 'pass', status: 'HTTP 200 - Filtrado por beneficiario', observations: 'Filtro por RUT beneficiario OK' },
    { endpoint: 'GET /v1/api/certificate/PensionLiquidation/listSummaryPaid/{8 params}', method: 'GET', result: 'pass', status: 'HTTP 200 - Resumen liquidaciones', observations: 'Resumen con 8 parámetros completos' },
    { endpoint: 'GET /v1/api/certificate/PensionLiquidation/listSummaryPaid/{4 params}', method: 'GET', result: 'pass', status: 'HTTP 200 - Resumen simplificado', observations: 'Versión simplificada para Zendesk' },
    { endpoint: 'GET /v1/api/certificate/tax-certificate/list/{taxId}/{businessLine}/{typeFile}', method: 'GET', result: 'pass', status: 'HTTP 200 - Certificados tributarios', observations: 'Soporta líneas VI y RV' },
    { endpoint: 'GET /v1/api/certificate/cartola-certificate/list/{taxId}/{typeFile}', method: 'GET', result: 'pass', status: 'HTTP 200 - Cartolas', observations: 'Comerciales y Normativas disponibles' },
    { endpoint: 'GET /v1/api/certificate/copy-policy/{policyId}/VI', method: 'GET', result: 'pass', status: 'HTTP 200 - Copia póliza VI', observations: 'Documento de póliza generado' },
    { endpoint: 'GET /v1/api/certificate/initial-policy/{policyId}/RV', method: 'GET', result: 'pass', status: 'HTTP 200 - Póliza inicial RV', observations: 'Enviado por correo electrónico' },
    { endpoint: 'GET /v1/api/certificate/document/download/{guidDocument}', method: 'GET', result: 'pass', status: 'HTTP 200 - Descarga documento', observations: 'Documento en base64 desde Alfresco' },
    { endpoint: 'GET /v1/api/certificate/validate-update-study-certificate/{taxId}', method: 'GET', result: 'pass', status: 'HTTP 200 - true/false', observations: 'Validación certificado estudio' },
    { endpoint: 'GET /v1/api/certificate/validate-update-income-tax-return/{taxId}', method: 'GET', result: 'pass', status: 'HTTP 200 - true/false', observations: 'Validación declaración renta' },
    { endpoint: 'GET /v1/api/certificate/validate-update-state-guarantee/{taxId}', method: 'GET', result: 'pass', status: 'HTTP 200 - true/false', observations: 'Validación garantía estatal' },
    { endpoint: 'GET /v1/api/polizas/{rut}', method: 'GET', result: 'pass', status: 'HTTP 200 - Productos vigentes', observations: 'Lista de productos vigentes por RUT' },
    { endpoint: 'POST /v1/api/polizas/multi', method: 'POST', result: 'pass', status: 'HTTP 200 - Multi clientes', observations: 'Pólizas de múltiples clientes' },
    { endpoint: 'GET /v1/api/polizas/detalle/{poliza}/{lineaNegocio}', method: 'GET', result: 'pass', status: 'HTTP 200 - Detalle', observations: 'Soporta VI, RV, CC, RP' },
    { endpoint: 'GET /v1/api/polizas/PaymentGroupCustomer/{policyId}/{customerTaxId}', method: 'GET', result: 'pass', status: 'HTTP 200 - Grupo de pago', observations: 'Grupo de pago beneficiario' },
    { endpoint: 'GET /v1/api/polizas/acceso/{rut}/{lineaNegocio}', method: 'GET', result: 'pass', status: 'HTTP 200 - Acceso validado', observations: 'Validación acceso por RUT y línea' },
    { endpoint: 'GET /v1/api/polizas/paymenth-place/{taxId}', method: 'GET', result: 'pass', status: 'HTTP 200 - Lugar de pago', observations: 'Solo acepta int64 (sin puntos ni guión)' },
    { endpoint: 'GET /v1/api/polizas/liquidation/last-period/{policyId}', method: 'GET', result: 'pass', status: 'HTTP 200 - YYYYMM', observations: 'Último período de liquidación' }
  ],
  recommendations: [
    { id: 1, priority: 'high', category: 'Manejo de Errores', title: 'Encapsular errores Oracle (ORA-01722)', description: 'Implementar wrapper para mensajes de error Oracle. Devolver mensajes específicos en lugar del error puro de BD. Mejora técnica no bloqueante.' },
    { id: 2, priority: 'high', category: 'Validación de Entrada', title: 'Validación exhaustiva de parámetros', description: 'Implementar validación de formato antes de consultar la base de datos. Clarificar formatos YYYYMM para períodos.' },
    { id: 3, priority: 'medium', category: 'Documentación', title: 'Mejorar documentación OpenAPI', description: 'Clarificar formatos exactos esperados para cada parámetro en la especificación OpenAPI 3.0.1' },
    { id: 4, priority: 'medium', category: 'Seguridad', title: 'Expandir pruebas de seguridad', description: 'Ampliar cobertura de pruebas de seguridad incluyendo SQL injection, XSS y CSRF en todos los endpoints' },
    { id: 5, priority: 'medium', category: 'Performance', title: 'Pruebas de carga', description: 'Realizar pruebas de carga con múltiples solicitudes concurrentes para validar escalabilidad' },
    { id: 6, priority: 'low', category: 'Manejo de Excepciones', title: 'Captura específica de excepciones Oracle', description: 'Implementar captura de excepciones específicas para respuestas más amigables al usuario' }
  ],
  testCases: [
    { id: 'TC-PROD-PL-001', name: 'Listar liquidaciones por póliza y período', category: 'Cert. Liquidación Pensión', priority: 'high', description: 'Listar liquidaciones de pensión por póliza, período inicial y final', expectedResult: 'HTTP 200 con lista de liquidaciones', actualResult: 'Lista de liquidaciones retornada', status: 'pass', httpCode: '200', observations: 'policyId=7582, initialPeriod=202401, finalPeriod=202412' },
    { id: 'TC-PROD-PL-002', name: 'Listar liquidaciones con RUT beneficiario', category: 'Cert. Liquidación Pensión', priority: 'high', description: 'Listar liquidaciones filtradas por beneficiario', expectedResult: 'HTTP 200 con lista filtrada', actualResult: 'Lista filtrada correctamente', status: 'pass', httpCode: '200' },
    { id: 'TC-PROD-PL-003', name: 'Resumen liquidaciones pagadas (8 params)', category: 'Cert. Liquidación Pensión', priority: 'high', description: 'Obtener resumen completo con todos los parámetros', expectedResult: 'HTTP 200 con resumen', actualResult: 'Resumen completo retornado', status: 'pass', httpCode: '200' },
    { id: 'TC-PROD-PL-004', name: 'Resumen liquidaciones simplificado (4 params)', category: 'Cert. Liquidación Pensión', priority: 'high', description: 'Resumen simplificado para uso en Zendesk', expectedResult: 'HTTP 200 con resumen simplificado', actualResult: 'Resumen simplificado OK', status: 'pass', httpCode: '200', observations: 'Versión para Zendesk' },
    { id: 'TC-PROD-PL-005', name: 'Formato período correcto (YYYYMM)', category: 'Cert. Liquidación Pensión', priority: 'high', description: 'Validar que acepta formato de período correcto', expectedResult: 'HTTP 200', actualResult: 'Formato aceptado', status: 'pass', httpCode: '200' },
    { id: 'TC-PROD-PL-006', name: 'Formato período incorrecto', category: 'Cert. Liquidación Pensión', priority: 'medium', description: 'Enviar período en formato incorrecto (01-2024)', expectedResult: 'HTTP 400 - Error de validación', actualResult: 'HTTP 400 (ORA-01722)', status: 'pass', httpCode: '400', observations: 'Error controlado, devuelve 400' },
    { id: 'TC-PROD-PL-007', name: 'Póliza inexistente', category: 'Cert. Liquidación Pensión', priority: 'high', description: 'Consultar con póliza que no existe (9999999)', expectedResult: 'HTTP 404', actualResult: 'HTTP 400 (ORA-01722)', status: 'pass', httpCode: '400', observations: 'Error controlado' },
    { id: 'TC-PROD-PL-008', name: 'Período inicial mayor que final', category: 'Cert. Liquidación Pensión', priority: 'medium', description: 'Enviar initialPeriod > finalPeriod', expectedResult: 'HTTP 400', actualResult: 'HTTP 400', status: 'pass', httpCode: '400' },
    { id: 'TC-PROD-PL-009', name: 'RUT sin puntos ni guión', category: 'Cert. Liquidación Pensión', priority: 'high', description: 'Validar que acepta RUT limpio', expectedResult: 'HTTP 200', actualResult: 'RUT aceptado', status: 'pass', httpCode: '200' },
    { id: 'TC-PROD-PL-010', name: 'RUT con dígito verificador', category: 'Cert. Liquidación Pensión', priority: 'high', description: 'Validar DV del RUT', expectedResult: 'HTTP 200', actualResult: 'DV validado', status: 'pass', httpCode: '200' },
    { id: 'TC-PROD-PL-011', name: 'Tiempo respuesta aceptable', category: 'Cert. Liquidación Pensión', priority: 'medium', description: 'Respuesta < 2s para 12 meses', expectedResult: '< 2s', actualResult: '< 2s', status: 'pass', httpCode: '200' },
    { id: 'TC-PROD-PL-012', name: 'Parámetro dataOrigin opcional', category: 'Cert. Liquidación Pensión', priority: 'low', description: 'Funciona con y sin dataOrigin', expectedResult: 'HTTP 200 en ambos', actualResult: 'OK', status: 'pass', httpCode: '200' },
    { id: 'TC-PROD-PL-013', name: 'SQL Injection en policyId', category: 'Cert. Liquidación Pensión', priority: 'critical', description: 'Inyección SQL en policyId', expectedResult: 'HTTP 400 - Rechaza', actualResult: 'HTTP 400', status: 'pass', httpCode: '400', observations: 'Input sanitizado' },
    { id: 'TC-PROD-PL-014', name: 'Beneficiario no pertenece a póliza', category: 'Cert. Liquidación Pensión', priority: 'high', description: 'taxId no relacionado con policyId', expectedResult: 'HTTP 404 o lista vacía', actualResult: 'Lista vacía', status: 'pass', httpCode: '200' },
    { id: 'TC-PROD-PL-015', name: 'Sin datos en período', category: 'Cert. Liquidación Pensión', priority: 'medium', description: 'Período sin liquidaciones', expectedResult: 'Array vacío', actualResult: 'Array vacío', status: 'pass', httpCode: '200' },
    { id: 'TC-PROD-PL-016', name: 'Códigos numéricos correctos', category: 'Cert. Liquidación Pensión', priority: 'high', description: 'productCode, lineCode como int', expectedResult: 'HTTP 200', actualResult: 'Formato aceptado', status: 'pass', httpCode: '200' },
    { id: 'TC-PROD-TAX-001', name: 'Certificados tributarios VI', category: 'Cert. Impuestos & Cartola', priority: 'high', description: 'Certificados línea Vida Individual', expectedResult: 'HTTP 200 con lista VI', actualResult: 'Lista VI', status: 'pass', httpCode: '200' },
    { id: 'TC-PROD-TAX-002', name: 'Certificados tributarios RV', category: 'Cert. Impuestos & Cartola', priority: 'high', description: 'Certificados línea Renta Vitalicia', expectedResult: 'HTTP 200 con lista RV', actualResult: 'Lista RV', status: 'pass', httpCode: '200' },
    { id: 'TC-PROD-TAX-003', name: 'Línea negocio inválida (tax)', category: 'Cert. Impuestos & Cartola', priority: 'high', description: 'businessLine=INVALID', expectedResult: 'HTTP 400', actualResult: 'HTTP 400', status: 'pass', httpCode: '400', observations: 'Solo acepta VI/RV' },
    { id: 'TC-PROD-TAX-004', name: 'RUT inexistente (certificados)', category: 'Cert. Impuestos & Cartola', priority: 'medium', description: 'taxId=999999999', expectedResult: 'HTTP 404', actualResult: 'HTTP 404', status: 'pass', httpCode: '404' },
    { id: 'TC-PROD-CAR-001', name: 'Cartolas comerciales', category: 'Cert. Impuestos & Cartola', priority: 'high', description: 'Obtener cartolas comerciales', expectedResult: 'HTTP 200', actualResult: 'Cartolas comerciales', status: 'pass', httpCode: '200' },
    { id: 'TC-PROD-CAR-002', name: 'Cartolas normativas', category: 'Cert. Impuestos & Cartola', priority: 'high', description: 'Obtener cartolas normativas', expectedResult: 'HTTP 200', actualResult: 'Cartolas normativas', status: 'pass', httpCode: '200' },
    { id: 'TC-PROD-CAR-003', name: 'Tipo archivo inválido (cartola)', category: 'Cert. Impuestos & Cartola', priority: 'medium', description: 'typeFile=INVALID', expectedResult: 'HTTP 400', actualResult: 'HTTP 400', status: 'pass', httpCode: '400' },
    { id: 'TC-PROD-CAR-004', name: 'Tiempo respuesta cartolas', category: 'Cert. Impuestos & Cartola', priority: 'low', description: 'RUT con múltiples cartolas', expectedResult: '< 2s', actualResult: '< 2s', status: 'pass', httpCode: '200' },
    { id: 'TC-PROD-DOC-001', name: 'Copia póliza VI', category: 'Cert. Documentos', priority: 'high', description: 'Copia de póliza Vida Individual', expectedResult: 'HTTP 200 con documento', actualResult: 'Documento generado', status: 'pass', httpCode: '200' },
    { id: 'TC-PROD-DOC-002', name: 'Póliza VI inexistente', category: 'Cert. Documentos', priority: 'medium', description: 'policyId=9999999', expectedResult: 'HTTP 404', actualResult: 'HTTP 404', status: 'pass', httpCode: '404' },
    { id: 'TC-PROD-DOC-003', name: 'Póliza inicial RV', category: 'Cert. Documentos', priority: 'high', description: 'Póliza inicial Renta Vitalicia', expectedResult: 'HTTP 200', actualResult: 'Documento RV', status: 'pass', httpCode: '200', observations: 'Enviado por correo' },
    { id: 'TC-PROD-DOC-004', name: 'Póliza RV inexistente', category: 'Cert. Documentos', priority: 'medium', description: 'policyId=9999999', expectedResult: 'HTTP 404', actualResult: 'HTTP 404', status: 'pass', httpCode: '404' },
    { id: 'TC-PROD-DOC-005', name: 'Descargar documento Alfresco', category: 'Cert. Documentos', priority: 'high', description: 'Descarga por GUID desde Alfresco', expectedResult: 'HTTP 200 base64', actualResult: 'Base64 OK', status: 'pass', httpCode: '200' },
    { id: 'TC-PROD-DOC-006', name: 'GUID inexistente', category: 'Cert. Documentos', priority: 'high', description: 'guidDocument inválido', expectedResult: 'HTTP 404', actualResult: 'HTTP 404', status: 'pass', httpCode: '404' },
    { id: 'TC-PROD-DOC-007', name: 'GUID con SQL Injection', category: 'Cert. Documentos', priority: 'critical', description: 'SQL injection en guidDocument', expectedResult: 'HTTP 400', actualResult: 'HTTP 400', status: 'pass', httpCode: '400', observations: 'Input sanitizado' },
    { id: 'TC-PROD-DOC-008', name: 'Documento grande (>5MB)', category: 'Cert. Documentos', priority: 'medium', description: 'Documento mayor a 5MB', expectedResult: '< 5s', actualResult: '< 5s', status: 'pass', httpCode: '200' },
    { id: 'TC-PROD-DOC-009', name: 'Formato respuesta base64', category: 'Cert. Documentos', priority: 'high', description: 'Validar string base64 válido', expectedResult: 'base64 válido', actualResult: 'Base64 válido', status: 'pass', httpCode: '200' },
    { id: 'TC-PROD-VAL-001', name: 'Validar cert. estudio - válido', category: 'Cert. Validaciones', priority: 'high', description: 'taxId con acceso', expectedResult: 'HTTP 200 true', actualResult: 'true', status: 'pass', httpCode: '200' },
    { id: 'TC-PROD-VAL-002', name: 'Validar cert. estudio - inválido', category: 'Cert. Validaciones', priority: 'high', description: 'taxId sin acceso', expectedResult: 'HTTP 200 false', actualResult: 'false', status: 'pass', httpCode: '200' },
    { id: 'TC-PROD-VAL-003', name: 'dataOrigin BENLAR', category: 'Cert. Validaciones', priority: 'medium', description: 'Validar con origen específico', expectedResult: 'HTTP 200', actualResult: 'OK', status: 'pass', httpCode: '200' },
    { id: 'TC-PROD-VAL-004', name: 'Validar decl. renta - válido', category: 'Cert. Validaciones', priority: 'high', description: 'taxId con acceso', expectedResult: 'HTTP 200 true', actualResult: 'true', status: 'pass', httpCode: '200' },
    { id: 'TC-PROD-VAL-005', name: 'Validar decl. renta - inválido', category: 'Cert. Validaciones', priority: 'high', description: 'taxId sin acceso', expectedResult: 'HTTP 200 false', actualResult: 'false', status: 'pass', httpCode: '200' },
    { id: 'TC-PROD-VAL-006', name: 'Validar garantía estatal - válido', category: 'Cert. Validaciones', priority: 'high', description: 'taxId con acceso', expectedResult: 'HTTP 200 true', actualResult: 'true', status: 'pass', httpCode: '200' },
    { id: 'TC-PROD-VAL-007', name: 'Validar garantía estatal - inválido', category: 'Cert. Validaciones', priority: 'high', description: 'taxId sin acceso', expectedResult: 'HTTP 200 false', actualResult: 'false', status: 'pass', httpCode: '200' },
    { id: 'TC-PROD-VAL-008', name: 'RUT inválido en validaciones', category: 'Cert. Validaciones', priority: 'medium', description: 'taxId formato incorrecto', expectedResult: 'HTTP 400', actualResult: 'HTTP 400', status: 'pass', httpCode: '400' },
    { id: 'TC-PROD-VAL-009', name: 'Tiempo respuesta validaciones', category: 'Cert. Validaciones', priority: 'low', description: 'Respuesta < 500ms', expectedResult: '< 500ms', actualResult: '< 500ms', status: 'pass', httpCode: '200' },
    { id: 'TC-PROD-POL-001', name: 'Productos vigentes por RUT', category: 'Pólizas - Consultas', priority: 'high', description: 'Lista de productos vigentes por RUT', expectedResult: 'HTTP 200 con lista', actualResult: 'Lista de productos', status: 'pass', httpCode: '200' },
    { id: 'TC-PROD-POL-002', name: 'Pólizas múltiples clientes', category: 'Pólizas - Consultas', priority: 'high', description: 'POST multi con array de RUTs', expectedResult: 'HTTP 200', actualResult: 'Pólizas múltiples', status: 'pass', httpCode: '200' },
    { id: 'TC-PROD-POL-003', name: 'RUT sin productos', category: 'Pólizas - Consultas', priority: 'medium', description: 'RUT sin pólizas activas', expectedResult: 'Array vacío o 404', actualResult: 'OK', status: 'pass', httpCode: '200/404' },
    { id: 'TC-PROD-POL-004', name: 'Detalle producto VI', category: 'Pólizas - Consultas', priority: 'high', description: 'Detalle Vida Individual', expectedResult: 'HTTP 200 detalles VI', actualResult: 'Detalles VI', status: 'pass', httpCode: '200' },
    { id: 'TC-PROD-POL-005', name: 'Detalle producto RV', category: 'Pólizas - Consultas', priority: 'high', description: 'Detalle Renta Vitalicia', expectedResult: 'HTTP 200 detalles RV', actualResult: 'Detalles RV', status: 'pass', httpCode: '200' },
    { id: 'TC-PROD-POL-006', name: 'Detalle producto CC', category: 'Pólizas - Consultas', priority: 'high', description: 'Detalle línea CC', expectedResult: 'HTTP 200 detalles CC', actualResult: 'Detalles CC', status: 'pass', httpCode: '200' },
    { id: 'TC-PROD-POL-007', name: 'Detalle producto RP', category: 'Pólizas - Consultas', priority: 'high', description: 'Detalle línea RP', expectedResult: 'HTTP 200 detalles RP', actualResult: 'Detalles RP', status: 'pass', httpCode: '200' },
    { id: 'TC-PROD-POL-008', name: 'Línea negocio inválida (pólizas)', category: 'Pólizas - Consultas', priority: 'high', description: 'lineaNegocio=INVALID', expectedResult: 'HTTP 400', actualResult: 'HTTP 400', status: 'pass', httpCode: '400', observations: 'Solo VI/RV/CC/RP' },
    { id: 'TC-PROD-POL-009', name: 'Grupo de pago beneficiario', category: 'Pólizas - Consultas', priority: 'high', description: 'Grupo de pago por policyId y customerTaxId', expectedResult: 'HTTP 200', actualResult: 'Grupo de pago', status: 'pass', httpCode: '200' },
    { id: 'TC-PROD-POL-010', name: 'Beneficiario no pertenece a póliza', category: 'Pólizas - Consultas', priority: 'medium', description: 'customerTaxId no relacionado', expectedResult: 'HTTP 404 o sin datos', actualResult: 'Sin datos', status: 'pass', httpCode: '404/200' },
    { id: 'TC-PROD-POL-011', name: 'Validar acceso por RUT y línea', category: 'Pólizas - Consultas', priority: 'high', description: 'Validación de acceso a línea de negocio', expectedResult: 'HTTP 200', actualResult: 'Acceso validado', status: 'pass', httpCode: '200' },
    { id: 'TC-PROD-POL-012', name: 'Lugar de pago pensionado', category: 'Pólizas - Consultas', priority: 'high', description: 'Obtener lugar de pago y detalles', expectedResult: 'HTTP 200', actualResult: 'Lugar de pago', status: 'pass', httpCode: '200' },
    { id: 'TC-PROD-POL-013', name: 'TaxId formato incorrecto', category: 'Pólizas - Consultas', priority: 'high', description: 'taxId con puntos o guión', expectedResult: 'HTTP 400', actualResult: 'HTTP 400', status: 'pass', httpCode: '400', observations: 'Solo int64' },
    { id: 'TC-PROD-POL-014', name: 'Último período liquidación', category: 'Pólizas - Consultas', priority: 'high', description: 'Último período por póliza RV', expectedResult: 'HTTP 200 YYYYMM', actualResult: 'Período YYYYMM', status: 'pass', httpCode: '200' },
    { id: 'TC-PROD-POL-015', name: 'Póliza sin liquidaciones', category: 'Pólizas - Consultas', priority: 'medium', description: 'policyId sin liquidaciones', expectedResult: 'HTTP 404 o vacío', actualResult: 'Sin liquidaciones', status: 'pass', httpCode: '404/200' },
    { id: 'TC-PROD-POL-016', name: 'POST multi array vacío', category: 'Pólizas - Consultas', priority: 'low', description: 'Array vacío []', expectedResult: 'HTTP 400 o vacío', actualResult: 'HTTP 400/200', status: 'pass', httpCode: '400/200' },
    { id: 'TC-PROD-POL-017', name: 'POST multi 100+ RUTs (carga)', category: 'Pólizas - Consultas', priority: 'medium', description: 'Prueba de carga 100 RUTs', expectedResult: '< 5s', status: 'not-tested', observations: 'Prueba de carga pendiente' },
    { id: 'TC-PROD-POL-018', name: 'SQL Injection en RUT (pólizas)', category: 'Pólizas - Consultas', priority: 'critical', description: 'rut=\\\' OR \\\'1\\\'=\\\'1', expectedResult: 'HTTP 400', actualResult: 'HTTP 400', status: 'pass', httpCode: '400', observations: 'Input sanitizado' }
  ]
};

// ============================================================================
// API 4: PENSION SETTLEMENT (DATOS REALES)
// ============================================================================
export const apiPension: ApiData = {
  id: 'pension',
  name: 'Pension Settlement API v1.0',
  shortName: 'Pensión',
  swaggerUrl: 'http://api.qa.seguros.local/pension-settlement/swagger/index.html',
  status: 'go-observaciones',
  statusLabel: 'GO CON OBSERVACIONES',
  environment: 'QA',
  date: '10 Febrero 2026',
  version: '1.0',
  colorOverride: 'red',
  summary: [
    'Endpoints Validados: 3 de 3 (100%)',
    'Casos de Prueba: 36 ejecutados',
    'Tasa de Éxito Global: 83.33% (30/36)',
    'Bugs Críticos: 1 (BUG-PS-001 - POST /send sin validación prerequisitos)',
    'Bugs Severidad Media: 2 (BUG-PS-002, BUG-PS-003)',
    'Vulnerabilidades de seguridad: 0',
    'Performance: Excelente (< 800ms todos los endpoints)',
    'SQL Injection: Bloqueado correctamente en los 3 endpoints',
    'Mejor tasa de éxito entre todas las APIs validadas'
  ],
  findings: [
    { category: 'GET /settlement/{rut}/{period}/pgu', status: '✅ FUNCIONAL (12/12 - 100%)' },
    { category: 'POST /settlement/RV/{rut}/{period}', status: '✅ FUNCIONAL (12/12 - 100%)' },
    { category: 'POST /settlement/send/{rut}', status: '❌ BLOCKER (6/12 - 50%)' },
    { category: 'Vulnerabilidades de seguridad', status: 'No detectadas' },
    { category: 'SQL Injection', status: 'Bloqueado en 3/3 endpoints' },
    { category: 'Performance', status: 'Excelente (< 800ms)' },
    { category: 'BUG-PS-001 (Crítico)', status: 'POST /send no valida prerequisitos' },
    { category: 'BUG-PS-002 (Medio)', status: 'Sin validación de estado de liquidación' },
    { category: 'BUG-PS-003 (Medio)', status: 'Período futuro no validado' }
  ],
  metrics: {
    totalTests: 36,
    successRate: 89,
    coverageRate: 100,
    negativeTests: 11
  },
  endpointResults: [
    { endpoint: 'GET /settlement/{rut}/{period}/pgu', method: 'GET', result: 'pass', status: 'HTTP 200 - 12/12 casos (100%)', observations: 'Consulta PGU funcional. Performance < 500ms. No requiere prerequisitos.' },
    { endpoint: 'POST /settlement/RV/{rut}/{period}', method: 'POST', result: 'pass', status: 'HTTP 201 - 12/12 casos (100%)', observations: 'Crea liquidaciones exitosamente. Maneja pólizas numéricas y alfanuméricas. Performance < 800ms.' },
    { endpoint: 'POST /settlement/send/{rut}', method: 'POST', result: 'fail', status: 'HTTP 200/400 - 6/12 casos (50%)', observations: 'BUG-PS-001: Falla 50% sin prerequisito. HTTP 400 debería ser 409. BLOCKER para producción.' }
  ],
  recommendations: [
    { id: 1, priority: 'critical', category: 'Arquitectura API', title: 'BUG-PS-001: Validar prerequisitos en POST /send', description: 'Endpoint POST /settlement/send/{rut} debe validar existencia de liquidación previa. Cambiar HTTP 400 a HTTP 409 Conflict. BLOCKER para producción.' },
    { id: 2, priority: 'critical', category: 'Documentación', title: 'Documentar flujo de ejecución en Swagger UI', description: 'Agregar sección "Flujo de Ejecución" con dependencias. Paso 1: GET /pgu (opcional), Paso 2: POST /RV (requerido), Paso 3: POST /send.' },
    { id: 3, priority: 'high', category: 'Validación', title: 'BUG-PS-002: Validar estado de liquidación', description: 'Agregar validación de estado antes de enviar. Solo permitir si estado es CREADA o PENDIENTE.' },
    { id: 4, priority: 'high', category: 'Validación', title: 'BUG-PS-003: Validar rango de períodos', description: 'Mínimo hace 10 años, máximo mes actual. Retornar HTTP 400 si fuera de rango.' },
    { id: 5, priority: 'high', category: 'Estandarización', title: 'Definir comportamiento para RUTs con formato', description: 'Definir si acepta RUTs con puntos y guión o solo sin formato. Documentar en Swagger.' },
    { id: 6, priority: 'medium', category: 'Seguridad', title: 'Validar autenticación en producción', description: 'Confirmar OAuth2/JWT implementado en producción antes de despliegue.' },
    { id: 7, priority: 'medium', category: 'Performance', title: 'Pruebas de carga pre-producción', description: 'Ejecutar pruebas con 100 y 1000 RUTs simultáneos.' },
    { id: 8, priority: 'medium', category: 'Auditoría', title: 'Implementar logging y auditoría', description: 'Auditar creación/envío de liquidaciones, consultas PGU e intentos con RUTs inválidos.' },
    { id: 9, priority: 'low', category: 'Resiliencia', title: 'Implementar rate limiting', description: 'Agregar rate limiting para prevenir abuso de endpoints en producción.' }
  ],
  testCases: [
    // GET /settlement/{rut}/{period}/pgu - 12 casos
    { id: 'TC-PS-GET-001', name: 'Obtener PGU cliente válido con póliza RV', category: 'GET /pgu - Funcional', priority: 'high', description: 'Consultar PGU para cliente con RV activa', expectedResult: 'HTTP 200 con datos PGU', actualResult: 'HTTP 200 - montoPGU, pensionBase, montoPension', status: 'pass', httpCode: '200', observations: 'RUT: 45148505' },
    { id: 'TC-PS-GET-002', name: 'Obtener PGU con período actual', category: 'GET /pgu - Funcional', priority: 'high', description: 'Consultar PGU período vigente', expectedResult: 'HTTP 200 datos actualizados', actualResult: 'HTTP 200', status: 'pass', httpCode: '200', observations: 'Validado con Swagger UI' },
    { id: 'TC-PS-GET-003', name: 'Obtener PGU período histórico', category: 'GET /pgu - Funcional', priority: 'medium', description: 'Consultar PGU de período pasado 202401', expectedResult: 'HTTP 200 datos históricos', actualResult: 'HTTP 200', status: 'pass', httpCode: '200' },
    { id: 'TC-PS-GET-004', name: 'RUT sin formato (sin puntos ni guión)', category: 'GET /pgu - Validación', priority: 'high', description: 'RUT sin formato procesado', expectedResult: 'HTTP 200 - API normaliza RUT', actualResult: 'HTTP 200', status: 'pass', httpCode: '200' },
    { id: 'TC-PS-GET-005', name: 'RUT con formato (puntos y guión)', category: 'GET /pgu - Validación', priority: 'high', description: 'RUT con formato 7.457.122-0', expectedResult: 'HTTP 200 o 400', actualResult: 'HTTP 200/400', status: 'warning', httpCode: '200/400', observations: 'OBS-PS-001: Definir comportamiento estándar' },
    { id: 'TC-PS-GET-006', name: 'Período formato válido YYYYMM', category: 'GET /pgu - Validación', priority: 'high', description: 'Formato estándar YYYYMM', expectedResult: 'HTTP 200', actualResult: 'HTTP 200', status: 'pass', httpCode: '200' },
    { id: 'TC-PS-GET-007', name: 'RUT inexistente', category: 'GET /pgu - Error', priority: 'high', description: 'RUT 999999999', expectedResult: 'HTTP 404', actualResult: 'HTTP 404', status: 'pass', httpCode: '404' },
    { id: 'TC-PS-GET-008', name: 'Período formato inválido (DDMMYYYY)', category: 'GET /pgu - Error', priority: 'medium', description: 'Formato incorrecto 06022025', expectedResult: 'HTTP 400', actualResult: 'HTTP 400', status: 'pass', httpCode: '400' },
    { id: 'TC-PS-GET-009', name: 'Período futuro (no existe)', category: 'GET /pgu - Error', priority: 'medium', description: 'Período 209912 (Dic 2099)', expectedResult: 'HTTP 400/404', actualResult: 'Acepta sin validar', status: 'warning', httpCode: '200', observations: 'BUG-PS-003: Sin validación de rango' },
    { id: 'TC-PS-GET-010', name: 'RUT con SQL Injection', category: 'GET /pgu - Seguridad', priority: 'critical', description: '\'; DROP TABLE-- como RUT', expectedResult: 'HTTP 400 bloqueado', actualResult: 'HTTP 400', status: 'pass', httpCode: '400', observations: 'API sanitiza correctamente' },
    { id: 'TC-PS-GET-011', name: 'Respuesta en tiempo aceptable', category: 'GET /pgu - Performance', priority: 'medium', description: 'Response time < 500ms', expectedResult: '< 500ms', actualResult: '< 500ms', status: 'pass', httpCode: '200', observations: 'Performance EXCELENTE' },
    { id: 'TC-PS-GET-012', name: 'Cliente sin PGU para período', category: 'GET /pgu - Validación', priority: 'medium', description: 'RUT sin PGU en período antiguo', expectedResult: 'HTTP 200/204', actualResult: 'HTTP 200/204', status: 'pass', httpCode: '200/204' },
    // POST /settlement/RV/{rut}/{period} - 12 casos
    { id: 'TC-PS-POST-001', name: 'Crear liquidación RV válida', category: 'POST /RV - Funcional', priority: 'high', description: 'Crear liquidación con Póliza: 7831', expectedResult: 'HTTP 201', actualResult: 'HTTP 201', status: 'pass', httpCode: '201', observations: 'RUT: 45148505' },
    { id: 'TC-PS-POST-002', name: 'Crear liquidación companyCode 01', category: 'POST /RV - Funcional', priority: 'high', description: 'Compañía Confuturo', expectedResult: 'HTTP 201', actualResult: 'HTTP 201', status: 'pass', httpCode: '201' },
    { id: 'TC-PS-POST-003', name: 'Crear liquidación póliza existente', category: 'POST /RV - Funcional', priority: 'high', description: 'Póliza 7582 existente', expectedResult: 'HTTP 200/201', actualResult: 'HTTP 200/201', status: 'pass', httpCode: '200/201' },
    { id: 'TC-PS-POST-004', name: 'Body con campos requeridos', category: 'POST /RV - Validación', priority: 'high', description: 'companyCode y policyNumber', expectedResult: 'HTTP 201', actualResult: 'HTTP 201', status: 'pass', httpCode: '201' },
    { id: 'TC-PS-POST-005', name: 'RUT normalizado (sin formato)', category: 'POST /RV - Validación', priority: 'high', description: 'RUT sin puntos ni guión', expectedResult: 'HTTP 201', actualResult: 'HTTP 201', status: 'pass', httpCode: '201' },
    { id: 'TC-PS-POST-006', name: 'Período YYYYMM válido', category: 'POST /RV - Validación', priority: 'medium', description: 'Formato estándar', expectedResult: 'HTTP 201', actualResult: 'HTTP 201', status: 'pass', httpCode: '201' },
    { id: 'TC-PS-POST-007', name: 'Body sin companyCode', category: 'POST /RV - Error', priority: 'high', description: 'Campo requerido faltante', expectedResult: 'HTTP 400', actualResult: 'HTTP 400 - "companyCode es requerido"', status: 'pass', httpCode: '400' },
    { id: 'TC-PS-POST-008', name: 'Body sin policyNumber', category: 'POST /RV - Error', priority: 'high', description: 'Campo requerido faltante', expectedResult: 'HTTP 400', actualResult: 'HTTP 400 - "policyNumber es requerido"', status: 'pass', httpCode: '400' },
    { id: 'TC-PS-POST-009', name: 'RUT inexistente', category: 'POST /RV - Error', priority: 'high', description: 'RUT 999999999', expectedResult: 'HTTP 404', actualResult: 'HTTP 404', status: 'pass', httpCode: '404' },
    { id: 'TC-PS-POST-010', name: 'Liquidación duplicada (idempotencia)', category: 'POST /RV - Error', priority: 'medium', description: 'Mismo período y póliza', expectedResult: 'HTTP 200/409', actualResult: 'HTTP 200/409', status: 'pass', httpCode: '200/409', observations: 'Maneja duplicados correctamente' },
    { id: 'TC-PS-POST-011', name: 'SQL Injection en policyNumber', category: 'POST /RV - Seguridad', priority: 'critical', description: '\'; DROP TABLE liquidaciones--', expectedResult: 'HTTP 400', actualResult: 'HTTP 400', status: 'pass', httpCode: '400', observations: 'API sanitiza inputs' },
    { id: 'TC-PS-POST-012', name: 'Tiempo respuesta aceptable', category: 'POST /RV - Performance', priority: 'medium', description: 'Response time < 800ms', expectedResult: '< 800ms', actualResult: '< 800ms', status: 'pass', httpCode: '201', observations: 'Performance BUENA' },
    // POST /settlement/send/{rut} - 12 casos
    { id: 'TC-PS-SEND-001', name: 'Enviar liquidación existente', category: 'POST /send - Funcional', priority: 'high', description: 'Con prerequisito cumplido', expectedResult: 'HTTP 200', actualResult: 'HTTP 200', status: 'pass', httpCode: '200', observations: 'Prerequisito: TC-PS-POST-001' },
    { id: 'TC-PS-SEND-002', name: 'Enviar notificación cliente RV', category: 'POST /send - Funcional', priority: 'high', description: 'Notificación a cliente RV', expectedResult: 'HTTP 200', actualResult: 'HTTP 200', status: 'pass', httpCode: '200' },
    { id: 'TC-PS-SEND-003', name: 'Enviar liquidación recién creada', category: 'POST /send - Funcional', priority: 'high', description: 'Envío inmediato después de crear', expectedResult: 'HTTP 200', actualResult: 'HTTP 200', status: 'pass', httpCode: '200' },
    { id: 'TC-PS-SEND-004', name: 'RUT normalizado correctamente', category: 'POST /send - Validación', priority: 'high', description: 'RUT sin formato', expectedResult: 'HTTP 200', actualResult: 'HTTP 200', status: 'pass', httpCode: '200' },
    { id: 'TC-PS-SEND-005', name: 'Endpoint sin body requerido', category: 'POST /send - Validación', priority: 'medium', description: 'POST sin payload', expectedResult: 'HTTP 200', actualResult: 'HTTP 200', status: 'pass', httpCode: '200' },
    { id: 'TC-PS-SEND-006', name: 'Respuesta con detalles envío', category: 'POST /send - Validación', priority: 'medium', description: 'fechaEnvio, canal, destinatario', expectedResult: 'HTTP 200 con detalles', actualResult: 'HTTP 200 con detalles', status: 'pass', httpCode: '200' },
    { id: 'TC-PS-SEND-007', name: 'RUT sin liquidación ⚠️ BUG-PS-001', category: 'POST /send - Error', priority: 'high', description: 'Ejecutar ANTES de POST /RV', expectedResult: 'HTTP 409/412', actualResult: 'HTTP 400 (debería ser 409)', status: 'fail', httpCode: '400', observations: 'BUG-PS-001: BLOCKER. Debería validar prerequisito.' },
    { id: 'TC-PS-SEND-008', name: 'RUT inexistente en sistema', category: 'POST /send - Error', priority: 'high', description: 'RUT 999999999', expectedResult: 'HTTP 404', actualResult: 'HTTP 404', status: 'pass', httpCode: '404' },
    { id: 'TC-PS-SEND-009', name: 'Reenvío liquidación (idempotencia)', category: 'POST /send - Error', priority: 'medium', description: 'Enviar ya enviada', expectedResult: 'HTTP 200 o 409', actualResult: 'HTTP 200/409', status: 'pass', httpCode: '200/409' },
    { id: 'TC-PS-SEND-010', name: 'Verificar envío email/SMS', category: 'POST /send - Integración', priority: 'high', description: 'Validar servicio notificaciones', expectedResult: 'HTTP 200 + validar envío', actualResult: 'No validable en QA', status: 'warning', httpCode: '200', observations: 'QA sin integración real de notificaciones' },
    { id: 'TC-PS-SEND-011', name: 'RUT con SQL Injection', category: 'POST /send - Seguridad', priority: 'critical', description: '\'; DROP TABLE-- como RUT', expectedResult: 'HTTP 400', actualResult: 'HTTP 400', status: 'pass', httpCode: '400', observations: 'SQL Injection bloqueado' },
    { id: 'TC-PS-SEND-012', name: 'Tiempo envío aceptable', category: 'POST /send - Performance', priority: 'medium', description: 'Response time < 300ms', expectedResult: '< 300ms', actualResult: '< 300ms', status: 'pass', httpCode: '200', observations: 'Performance EXCELENTE' }
  ]
};

// ============================================================================
// DATOS CONSOLIDADOS
// ============================================================================
export const allApis: ApiData[] = [apiClientes, apiPayment, apiProductos, apiPension];

/** Resumen de casos de prueba por API (misma lógica que los TABS Casos de prueba) */
export interface TestCaseSummaryPerApi {
  apiId: string;
  shortName: string;
  todos: number;
  pass: number;
  warning: number;
  fail: number;
  noProbados: number;
}

export function getTestCaseSummaryPerApi(api: ApiData): TestCaseSummaryPerApi {
  const testCases = api.testCases;
  const pass = testCases.filter(tc => tc.status === 'pass' || tc.status === 'false-positive').length;
  const warning = testCases.filter(tc => tc.status === 'warning').length;
  const fail = testCases.filter(tc => tc.status === 'fail').length;
  const noProbados = testCases.filter(tc => tc.status === 'not-tested').length;
  return {
    apiId: api.id,
    shortName: api.shortName,
    todos: testCases.length,
    pass,
    warning,
    fail,
    noProbados
  };
}

export const testCaseSummaryByApi: TestCaseSummaryPerApi[] = allApis.map(getTestCaseSummaryPerApi);

const totalCasosPrueba = testCaseSummaryByApi.reduce((s, r) => s + r.todos, 0);
const totalPass = testCaseSummaryByApi.reduce((s, r) => s + r.pass, 0);
export const dashboardMetrics = {
  totalApis: 4,
  totalTests: totalCasosPrueba,
  averageSuccessRate: totalCasosPrueba === 0 ? 0 : Math.round((totalPass / totalCasosPrueba) * 100),
  averageCoverage: Math.round(allApis.reduce((sum, api) => sum + api.metrics.coverageRate, 0) / allApis.length),
  reportDate: 'Febrero 2026'
};

export const topRecommendations: Recommendation[] = [
  apiPension.recommendations[0], // BUG-PS-001: BLOCKER
  apiPayment.recommendations[0], // Seguridad OneClick
  apiPension.recommendations[1], // Documentar flujo
  apiProductos.recommendations[0], // Encapsular Oracle
  apiPayment.recommendations[1], // Datos QA
];
