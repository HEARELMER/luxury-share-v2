import { jsPDF } from 'jspdf';
import { TableData } from './interfaces/pdf-service.interface';

/**
 * Interfaz base para todos los templates de PDF
 */
export interface PdfTemplate {
  /**
   * Genera un documento PDF basado en datos
   * @returns Documento jsPDF generado
   */
  generate(): jsPDF;
}

/**
 * Datos comunes para todos los templates
 */
export interface BasePdfData {
  title: string;
  date: string;
  companyLogo?: string;
  companyName?: string;
  footerText?: string;
}

/**
 * Template para facturas y boletas
 */
export interface InvoiceTemplate extends PdfTemplate {
  /**
   * Configura los datos de la factura
   * @param data Datos de la factura
   */
  setData(data: InvoiceData): void;
}

/**
 * Datos específicos para facturas
 */
export interface InvoiceData extends BasePdfData {
  invoiceNumber: string;
  clientName: string;
  clientId: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  paymentMethod: string;
  dueDate?: string;
  notes?: string;
}

/**
 * Representa un ítem en una factura
 */
export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  discount?: number;
}

/**
 * Template para reportes
 */
export interface ReportTemplate extends PdfTemplate {
  /**
   * Configura los datos del reporte
   * @param data Datos del reporte
   */
  setData(data: ReportData): void;
}

/**
 * Datos específicos para reportes
 */
export interface ReportData extends BasePdfData {
  subtitle?: string;
  author?: string;
  sections: ReportSection[];
  summary?: string;
  charts?: ReportChart[];
}

/**
 * Sección de un reporte
 */
export interface ReportSection {
  title: string;
  content: string | TableData;
  type: 'text' | 'table' | 'chart';
}

/**
 * Datos para gráficos en reportes
 */
export interface ReportChart {
  title: string;
  type: 'bar' | 'line' | 'pie';
  imageData: string; // Base64 string
  width: number;
  height: number;
}
