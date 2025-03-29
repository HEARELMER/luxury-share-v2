import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { PdfOptions, HeaderData, TableData } from './interfaces/pdf-service.interface';

@Injectable({
  providedIn: 'root',
})
export class PdfService {
  constructor() {}

  /**
   * Crear documento PDF con opciones básicas
   */
  createPdf(options: PdfOptions = {}): jsPDF {
    const { orientation = 'portrait', unit = 'mm', format = 'a4' } = options;
    return new jsPDF(orientation, unit, format);
  }

  /**
   * Añadir encabezado con logo
   */
  addHeader(doc: jsPDF, headerData: HeaderData): void {
    const { title, logo, companyName } = headerData;

    // Añadir logo si existe
    if (logo) {
      doc.addImage(logo, 'PNG', 14, 10, 30, 30);
    }

    // Añadir título
    doc.setFontSize(20);
    doc.setTextColor(40, 40, 40);
    doc.text(title, doc.internal.pageSize.width / 2, 20, { align: 'center' });

    // Añadir nombre de compañía
    if (companyName) {
      doc.setFontSize(12);
      doc.text(companyName, doc.internal.pageSize.width / 2, 30, {
        align: 'center',
      });
    }

    // Línea separadora
    doc.setLineWidth(0.5);
    doc.line(10, 38, doc.internal.pageSize.width - 10, 38);
  }

  /**
   * Añadir tabla de datos
   */
  addTable(doc: jsPDF, tableData: TableData): void {
    autoTable(doc, {
      head: [tableData.headers],
      body: tableData.rows,
      startY: tableData.startY || 45,
      theme: 'striped',
      headStyles: { fillColor: [41, 128, 185], textColor: 255 },
      margin: { top: 40 },
    });
  }

  /**
   * Añadir pie de página
   */
  addFooter(doc: jsPDF, footerText: string = ''): void {
    const pageCount = doc.getNumberOfPages();

    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.setTextColor(100);

      // Texto personalizado
      if (footerText) {
        doc.text(
          footerText,
          doc.internal.pageSize.width / 2,
          doc.internal.pageSize.height - 10,
          { align: 'center' }
        );
      }

      // Número de página
      doc.text(
        `Página ${i} de ${pageCount}`,
        doc.internal.pageSize.width - 20,
        doc.internal.pageSize.height - 10
      );
    }
  }

  /**
   * Guardar el PDF con nombre específico
   */
  savePdf(doc: jsPDF, fileName: string = 'documento.pdf'): void {
    doc.save(fileName);
  }

  /**
   * Abrir PDF en nueva ventana
   */
  openPdf(doc: jsPDF): void {
    const blob = doc.output('blob');
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  }
}
