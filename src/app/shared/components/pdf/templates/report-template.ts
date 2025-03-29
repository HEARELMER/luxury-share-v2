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

    // Añadir encabezado usando datos globales cuando no se proporcionan específicos
    this.pdfService.addHeader(doc, {
      title: data.title,
      logo: data.companyLogo || this.config.branding.logo,
      companyName: data.companyName || this.config.branding.companyName,
    });

    // Configurar colores según la configuración global
    const [r, g, b] = this.config.branding.textColor;
    doc.setTextColor(r, g, b);

    // Información del reporte
    doc.setFontSize(this.config.fonts.normalSize || 11);
    doc.text(`Fecha de emisión: ${data.date}`, 14, 50);

    if (data.period) {
      doc.text(`Período: ${data.period}`, 14, 55);
    }

    if (data.subtitle) {
      doc.setFontSize(this.config.fonts.subtitleSize);
      doc.setFont(this.config.fonts.default, 'bold');
      doc.text(data.subtitle, doc.internal.pageSize.width / 2, 60, {
        align: 'center',
      });
      doc.setFont(this.config.fonts.default, 'normal');
    }

    let yPos = 70;

    // Añadir secciones del reporte
    for (const section of data.sections) {
      // Título de sección con estilo de la configuración global
      doc.setFontSize(this.config.fonts.subtitleSize - 2); // Un poco más pequeño que los subtítulos
      doc.setFont(this.config.fonts.default, 'bold');
      doc.text(section.title, 14, yPos);
      doc.setFont(this.config.fonts.default, 'normal');
      yPos += 7;

      // Contenido de sección según tipo
      if (section.type === 'text') {
        doc.setFontSize(this.config.fonts.normalSize);
        const textLines = doc.splitTextToSize(
          section.content as string,
          doc.internal.pageSize.width - 30
        );
        doc.text(textLines, 14, yPos);
        yPos += textLines.length * 5 + 10;
      } else if (section.type === 'table' && section.tableData) {
        this.pdfService.addTable(doc, {
          headers: section.tableData.headers,
          rows: section.tableData.rows,
          startY: yPos,
        });
        // Actualizar posición Y después de la tabla
        yPos = (doc as any).lastAutoTable.finalY + 15;
      }

      // Verificar si necesitamos una nueva página
      if (yPos > doc.internal.pageSize.height - 40) {
        doc.addPage();
        yPos = 20;
      }
    }

    // Añadir resumen o conclusión
    if (data.summary) {
      doc.setFontSize(this.config.fonts.normalSize);
      doc.setFont(this.config.fonts.default, 'bold');
      doc.text('Resumen', 14, yPos);
      doc.setFont(this.config.fonts.default, 'normal');
      yPos += 7;

      doc.setFontSize(this.config.fonts.normalSize);
      const summaryLines = doc.splitTextToSize(
        data.summary,
        doc.internal.pageSize.width - 30
      );
      doc.text(summaryLines, 14, yPos);
    }

    // Pie de página con texto de la configuración global
    this.pdfService.addFooter(doc, data.footerText || this.config.footer.text);

    // Agregar metadatos del PDF
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
  companyName: string;
  companyLogo?: string;
  footerText?: string;
  orientation?: 'portrait' | 'landscape';
  sections: ReportSection[];
  summary?: string;
  author?: string;
}

export interface ReportSection {
  title: string;
  type: 'text' | 'table' | 'chart';
  content?: string;
  tableData?: {
    headers: string[];
    rows: string[][];
  };

  chartImage?: string;
  chartWidth?: number;
  chartHeight?: number;
}
