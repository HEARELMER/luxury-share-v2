export const SELECTED_COLUMNS_FOR_REPORT_OF_SALES = [
  'codeSale',
  'date',
  'departureDate',
  'client',
  'documentNumber',
  'documentType',
  'serviceName',
  'packageName',
  'quantity',
  'subtotal',
  'discount',
  'total',
  'status',
  'paymentMethod',
  'branch',
  'seller',
];

export const HEADERS_FOR_REPORT_OF_SALES = {
  codeSale: 'Código de Venta',
  date: 'Fecha',
  departureDate: 'Fecha de Salida',
  client: 'Cliente',
  documentNumber: 'Número de Documento',
  documentType: 'Tipo de Documento',
  serviceName: 'Servicio',
  packageName: 'Paquete',
  quantity: 'Cantidad',
  subtotal: 'Subtotal',
  discount: 'Descuento',
  total: 'Total',
  status: 'Estado',
  paymentMethod: 'Método de Pago',
  branch: 'Sucursal',
  seller: 'Vendedor',
  observations: 'Observaciones',
};

// Constantes para Servicios y Paquetes
export const SELECTED_COLUMNS_FOR_REPORT_OF_SERVICES = [
  'name',
  'type',
  'quantitySold',
  'revenue',
  'salesCount',
  'isPackage',
  'averageQuantityPerSale',
];

export const HEADERS_FOR_REPORT_OF_SERVICES = {
  name: 'Nombre',
  type: 'Tipo',
  quantitySold: 'Cantidad Vendida',
  revenue: 'Ingresos',
  salesCount: 'Número de Ventas',
  isPackage: 'Es Paquete',
  averageQuantityPerSale: 'Promedio por Venta',
};

// Constantes para Sucursales
export const SELECTED_COLUMNS_FOR_REPORT_OF_BRANCHES = [
  'branchId',
  'name',
  'address',
  'totalSales',
  'totalRevenue',
  'salesByStatus',
  'salesByPaymentMethod',
  'topSeller',
];

export const HEADERS_FOR_REPORT_OF_BRANCHES = {
  branchId: 'ID de Sucursal',
  name: 'Nombre',
  address: 'Dirección',
  totalSales: 'Total de Ventas',
  totalRevenue: 'Ingresos Totales',
  salesByStatus: 'Ventas por Estado',
  salesByPaymentMethod: 'Ventas por Método de Pago',
  topSeller: 'Mejor Vendedor',
};
