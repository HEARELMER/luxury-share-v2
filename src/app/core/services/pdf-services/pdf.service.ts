import { Inject, Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
  PdfOptions,
  HeaderData,
  TableData,
} from './interfaces/pdf-service.interface';
import { PDF_CONFIG, PdfGeneratorConfig } from './pdf-generator.config';

@Injectable({
  providedIn: 'root',
})
export class PdfService {
  constructor(@Inject(PDF_CONFIG) private config: PdfGeneratorConfig) {}

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
      doc.addImage(logo, 'PNG', 16, 12, 18, 18);
    }

    // Añadir título con color primario de la configuración global
    const [r, g, b] = this.config.branding.primaryColor;
    // doc.setTextColor(r, g, b);
    doc.setFontSize(this.config.fonts.titleSize);
    doc.text(title, doc.internal.pageSize.width / 2, 20, { align: 'center' });

    // Añadir nombre de compañía
    if (companyName) {
      doc.setFontSize(this.config.fonts.subtitleSize);
      doc.text(companyName, doc.internal.pageSize.width / 2, 30, {
        align: 'center',
      });
    }

    // Restablecer color de texto
    const [textR, textG, textB] = this.config.branding.textColor;
    doc.setTextColor(textR, textG, textB);

    // Línea separadora con color secundario
    doc.setLineWidth(0.5);
    const [lineR, lineG, lineB] = this.config.branding.secondaryColor;
    doc.setDrawColor(lineR, lineG, lineB);
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
      theme: this.config.tables.theme,
      headStyles: {
        fillColor: this.config.tables.headerColors.fill,
        textColor: this.config.tables.headerColors.text,
        fontStyle: 'bold',
        fontSize: this.config.fonts.normalSize,
      },
      // Estilos para filas alternadas
      alternateRowStyles: {
        fillColor: this.config.tables.alternateRowColors[0],
      },
      // Estilos para filas normales
      bodyStyles: {
        fontSize: this.config.fonts.normalSize - 1,
      },
      // Comportamiento de la tabla
      useCss: true,
      styles: {
        font: this.config.fonts.default,
        overflow: 'linebreak',
        cellPadding: 4,
      },

      // Estilo para celdas con texto
      columnStyles: {
        text: {
          cellWidth: 'auto',
        },
      },
      margin: {
        top: 40,
        left: this.config.document.margins.left,
        right: this.config.document.margins.right,
        bottom: this.config.document.margins.bottom,
      },
    });
  }

  /**
   * Añadir pie de página
   */
  addFooter(doc: jsPDF, footerText: string = ''): void {
    const pageCount = doc.getNumberOfPages();
    const [textR, textG, textB] = this.config.branding.textColor;
    doc.setTextColor(textR, textG, textB);
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(this.config.fonts.smallSize);

      // Texto personalizado
      if (footerText) {
        doc.text(
          footerText,
          doc.internal.pageSize.width / 2,
          doc.internal.pageSize.height - 10,
          { align: 'center' }
        );
      }

      // Número de página si está habilitado en la configuración
      if (this.config.footer.includePageNumbers) {
        const pageText = this.config.footer.pageNumberFormat
          .replace('{0}', i.toString())
          .replace('{1}', pageCount.toString());

        doc.text(
          pageText,
          doc.internal.pageSize.width - 20,
          doc.internal.pageSize.height - 10
        );
      }
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
