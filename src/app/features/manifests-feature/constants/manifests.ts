export const MANIFEST_TABLE_COLS = [
  { field: 'title', header: 'Servicio' },
  { field: 'date', header: 'Fecha/Hora' },
  { field: 'description', header: 'Descripción' },
  { field: 'serviceType', header: 'Tipo' },
  { field: 'status', header: 'Estado' },
  { field: 'checkedInCount', header: 'Clientes ✅' },
  { field: 'registeredBy', header: 'Registrado por' },
  { field: 'actions', header: 'Acciones' },
];

export const MANIFEST_STATUS = [
  { label: 'Todos', value: '' },
  { label: 'Pendiente', value: 'pending' },
  { label: 'Completado', value: 'completed' },
  { label: 'Cancelado', value: 'canceled' },
  { label: 'En Proceso', value: 'in_process' },
];
