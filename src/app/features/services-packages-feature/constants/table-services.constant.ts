export const USER_TABLE_COLS = [
  { field: 'photoUrl', header: 'Foto', sortable: false },
  { field: 'numDni', header: 'Nombre', sortable: true },
  { field: 'name', header: 'Descripción', sortable: true },
  { field: 'email', header: 'Estado', sortable: true },
  { field: 'phone', header: 'Precio Unitario', sortable: true },
  { field: 'address', header: 'Tipo', sortable: true },
  { field: 'birthDate', header: 'Fecha de Crea.', sortable: true },
  { field: 'role', header: 'Fecha de Modif.', sortable: true },
  { field: 'actions', header: 'Acciones', sortable: false },
];
export const SERVICE_TABLE_COLS = [
  // { field: 'photoUrl', header: 'Foto', sortable: false },
  { field: 'name', header: 'Nombre', sortable: true },
  { field: 'description', header: 'Descripción', sortable: true },
  { field: 'status', header: 'Estado', sortable: true },
  { field: 'priceUnit', header: 'Precio Unitario', sortable: true },
  { field: 'type', header: 'Tipo', sortable: true },
  { field: 'createdAt', header: 'Fecha de Crea.', sortable: true },
  { field: 'updatedAt', header: 'Fecha de Modif.', sortable: true },
  { field: 'actions', header: 'Acciones', sortable: false },
];
export const PACKAGE_TABLE_COLS = [
  { field: 'photoUrl', header: 'Foto', sortable: false },
  { field: 'name', header: 'Nombre', sortable: true },
  { field: 'description', header: 'Descripción', sortable: true },
  { field: 'status', header: 'Estado', sortable: true },
  { field: 'priceUnit', header: 'Precio', sortable: true }, 
  { field: 'createdAt', header: 'Fecha de Crea.', sortable: true },
  { field: 'updatedAt', header: 'Fecha de Modif.', sortable: true },
  { field: 'actions', header: 'Acciones', sortable: false },
];