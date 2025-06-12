import {
  HEADERS_FOR_REPORT_OF_SALES_ADTTIONAL_HEADERS,
  HEADERS_FOR_REPORT_OF_SALES_ADTTIONAL_HEADERS_METHOD,
  HEADERS_FOR_REPORT_OF_SALES_ADTTIONAL_HEADERS_STATUS,
  HEADERS_FOR_REPORT_OF_SERVICES_ADTTIONAL,
  SELECTED_COLUMNS_FOR_REPORT_OF_SALES_ADTTIONAL,
  SELECTED_COLUMNS_FOR_REPORT_OF_SERVICES_ADTTIONAL,
} from '../constants/export-files.constant';

/**
 * Prepara los datos de resumen para el reporte de ventas
 */
export function prepareSalesSummaryData(reportData: any) {
  return {
    headers: [
      HEADERS_FOR_REPORT_OF_SALES_ADTTIONAL_HEADERS,
      HEADERS_FOR_REPORT_OF_SALES_ADTTIONAL_HEADERS_STATUS,
      HEADERS_FOR_REPORT_OF_SALES_ADTTIONAL_HEADERS_METHOD,
    ],
    selectedColumns: [
      SELECTED_COLUMNS_FOR_REPORT_OF_SALES_ADTTIONAL,
      Object.keys(reportData.salesByStatus || {}),
      Object.keys(reportData.salesByPaymentMethod || {}), // Cambiar Object.values por Object.keys
    ],
    data: [
      reportData.summary || {},
      reportData.salesByStatus || {},
      reportData.salesByPaymentMethod || {},
    ],
    titles: [
      'Resumen General',
      'Ventas por Estado',
      'Ventas por Método de Pago',
    ],
  };
}

/**
 * Formatea los datos de ventas para el reporte Excel
 */
export function formatSalesData(items: any[]) {
  return items.map((item: any) => {
    return {
      ...item,
      date: new Date(item.date).toLocaleDateString(),
      departureDate: item.departureDate
        ? new Date(item.departureDate).toLocaleDateString()
        : 'N/A',
      subtotal: `S/ ${item.subtotal}`,
      discount: `S/ ${item.discount}`,
      total: `S/ ${item.total}`,
    };
  });
}

export function prepareSalesByServicesPackagesData(reportData: any) {
  return {
    headers: [
      [HEADERS_FOR_REPORT_OF_SERVICES_ADTTIONAL], // Notice the extra array wrapper
    ],
    selectedColumns: [SELECTED_COLUMNS_FOR_REPORT_OF_SERVICES_ADTTIONAL],
    data: [reportData.summary],
    titles: ['Resumen General'],
  };
}
