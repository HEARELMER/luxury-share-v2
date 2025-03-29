import { Inject, Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import { PdfService } from '../../../../core/services/pdf-services/pdf.service';
import {
  PDF_CONFIG,
  PdfGeneratorConfig,
} from '../../../../core/services/pdf-services/pdf-generator.config';

@Injectable({
  providedIn: 'root',
})
export class ReportPdfTemplate {
  constructor(
    private pdfService: PdfService,
    @Inject(PDF_CONFIG) private config: PdfGeneratorConfig
  ) {}

  generateReportPdf(data: ReportData): jsPDF {
    // Crear PDF con la configuración global
    const doc = this.pdfService.createPdf({
      orientation: data.orientation || this.config.document.defaultOrientation,
      unit: this.config.document.defaultUnit,
      format: this.config.document.defaultFormat,
    });

    // Añadir encabezado
    this.pdfService.addHeader(doc, {
      title: data.title,
      logo: data.companyLogo || this.config.branding.logo,
      companyName: data.companyName || this.config.branding.companyName,
    });

    // Configurar colores de texto
    const [r, g, b] = this.config.branding.textColor;
    doc.setTextColor(r, g, b);

    // Información básica del reporte
    doc.setFontSize(this.config.fonts.normalSize || 11);
    doc.text(`Fecha de emisión: ${data.date}`, 14, 50);
    let nextY = 55;

    if (data.period) {
      doc.text(`Período: ${data.period}`, 14, nextY);
      nextY += 5;
    }

    if (data.subtitle) {
      doc.setFontSize(this.config.fonts.subtitleSize);
      doc.setFont(this.config.fonts.default, 'bold');
      doc.text(data.subtitle, doc.internal.pageSize.width / 2, nextY + 5, {
        align: 'center',
      });
      doc.setFont(this.config.fonts.default, 'normal');
      nextY += 10;
    }

    let yPos = nextY + 5;
    const lineHeight = 5;

    // Añadir secciones del reporte
    for (const section of data.sections) {
      // Título de sección
      doc.setFontSize(this.config.fonts.subtitleSize - 2);
      doc.setFont(this.config.fonts.default, 'bold');
      doc.text(section.title, 14, yPos);
      doc.setFont(this.config.fonts.default, 'normal');
      yPos += 7;

      // Contenido de sección según tipo
      if (section.type === 'text' && Array.isArray(section.content)) {
        for (const line of section.content) {
          if (!line) {
            yPos += lineHeight;
            continue;
          }

          const wrappedLines = doc.splitTextToSize(
            line,
            doc.internal.pageSize.width - 30
          );
          doc.text(wrappedLines, 14, yPos);
          yPos += wrappedLines.length * lineHeight;
        }
        
        // Espacio después de sección de texto
        yPos += 5;
      } else if (section.type === 'table' && section.tableData) {
        this.pdfService.addTable(doc, {
          headers: section.tableData.headers,
          rows: section.tableData.rows,
          startY: yPos,
        });
        
        // Actualizar posición después de la tabla
        yPos = (doc as any).lastAutoTable.finalY + 15;
      }

      // Nueva página si es necesario
      if (yPos > doc.internal.pageSize.height - 40) {
        doc.addPage();
        yPos = 20;
      }
    }

    // Añadir resumen si existe
    if (data.summary && data.summary.length > 0) {
      doc.setFontSize(this.config.fonts.normalSize);
      doc.setFont(this.config.fonts.default, 'bold');
      doc.text('Resumen', 14, yPos);
      doc.setFont(this.config.fonts.default, 'normal');
      yPos += 7;

      for (const line of data.summary) {
        if (!line) {
          yPos += lineHeight;
          continue;
        }

        const summaryLines = doc.splitTextToSize(
          line,
          doc.internal.pageSize.width - 30
        );
        doc.text(summaryLines, 14, yPos);
        yPos += summaryLines.length * lineHeight;
      }
    }

    // Pie de página
    this.pdfService.addFooter(doc, data.footerText || this.config.footer.text);

    // Metadatos
    doc.setProperties({
      title: data.title,
      subject: data.subtitle || '',
      author: data.author || this.config.metadata.author,
      creator: this.config.metadata.creator,
      keywords: this.config.metadata.keywords || '',
    });

    return doc;
  }
}

export interface ReportData {
  title: string;
  subtitle?: string;
  date: string;
  period?: string;
  companyName?: string;
  companyLogo?: string;
  footerText?: string;
  orientation?: 'portrait' | 'landscape';
  sections: ReportSection[];
  summary?: string[];
  author?: string;
}

export interface ReportSection {
  title: string;
  type: 'text' | 'table' | 'chart';
  content?: string[] | string;
  tableData?: {
    headers: string[];
    rows: string[][];
  };
  chartImage?: string;
  chartWidth?: number;
  chartHeight?: number;
}