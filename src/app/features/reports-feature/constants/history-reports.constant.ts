export const HISTORY_TABLE_COLUMNS = [ 
  { field: 'reportType', header: 'Tipo de Reporte' },
  { field: 'user', header: 'Generado Por', template: true },
  { field: 'filters', header: 'Periodo', template: true },
  { field: 'generatedAt', header: 'Fecha de Generación', format: 'date' },
  { field: 'lastDownload', header: 'Última Descarga', format: 'date' },
  { field: 'format', header: 'Formato' },
  { field: 'actions', header: 'Acciones', template: true }
];