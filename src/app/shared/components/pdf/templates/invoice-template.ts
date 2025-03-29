// templates/invoice-template.ts
import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import { PdfService } from '../../../../core/services/pdf-services/pdf.service';

@Injectable({
  providedIn: 'root',
})
export class InvoicePdfTemplate {
  constructor(private pdfService: PdfService) {}

  generateInvoicePdf(data: InvoiceData): jsPDF {
    // Crear PDF
    const doc = this.pdfService.createPdf({ orientation: 'portrait' });

    // Añadir encabezado
    this.pdfService.addHeader(doc, {
      title: 'FACTURA',
      logo: data.companyLogo,
      companyName: data.companyName,
    });

    // Información de factura
    doc.setFontSize(11);
    doc.text(`Factura N°: ${data.invoiceNumber}`, 14, 50);
    doc.text(`Fecha: ${data.date}`, 14, 55);
    doc.text(`Cliente: ${data.clientName}`, 14, 60);
    doc.text(`RUC/DNI: ${data.clientId}`, 14, 65);

    // Añadir tabla de productos/servicios
    const tableHeaders = ['Descripción', 'Cantidad', 'Precio Unit.', 'Total'];
    const tableRows = data.items.map((item) => [
      item.description,
      item.quantity.toString(),
      `S/. ${item.unitPrice.toFixed(2)}`,
      `S/. ${(item.quantity * item.unitPrice).toFixed(2)}`,
    ]);

    this.pdfService.addTable(doc, {
      headers: tableHeaders,
      rows: tableRows,
      startY: 75,
    });

    // Añadir totales
    const finalY = (doc as any).lastAutoTable.finalY + 10;
    doc.text(`Subtotal: S/. ${data.subtotal.toFixed(2)}`, 120, finalY);
    doc.text(`IGV (18%): S/. ${data.tax.toFixed(2)}`, 120, finalY + 5);
    doc.text(`Total: S/. ${data.total.toFixed(2)}`, 120, finalY + 10);

    // Pie de página
    this.pdfService.addFooter(
      doc,
      `${data.companyName} - RUC: ${data.companyId}`
    );

    return doc;
  }
}

export interface InvoiceData {
  invoiceNumber: string;
  date: string;
  clientName: string;
  clientId: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  companyName: string;
  companyId: string;
  companyLogo?: string;
}

export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
}
