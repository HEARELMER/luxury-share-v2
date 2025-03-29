import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import { PdfService } from '../../../../core/services/pdf-services/pdf.service';

@Injectable({
  providedIn: 'root',
})
export class ReportPdfTemplate {
  constructor(private pdfService: PdfService) {}

  generateReportPdf(data: ReportData): jsPDF {
    // Crear PDF
    const doc = this.pdfService.createPdf({
      orientation: data.orientation || 'portrait',
    });

    // Añadir encabezado
    this.pdfService.addHeader(doc, {
      title: data.title,
      logo: data.companyLogo,
      companyName: data.companyName,
    });

    // Información del reporte
    doc.setFontSize(11);
    doc.text(`Fecha: ${data.date}`, 14, 50);

    if (data.period) {
      doc.text(`Período: ${data.period}`, 14, 55);
    }

    if (data.subtitle) {
      doc.setFontSize(13);
      doc.setFont('helvetica', 'bold');
      doc.text(data.subtitle, doc.internal.pageSize.width / 2, 60, {
        align: 'center',
      });
      doc.setFont('helvetica', 'normal');
    }

    let yPos = 70;

    // Añadir secciones del reporte
    for (const section of data.sections) {
      // Título de sección
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text(section.title, 14, yPos);
      doc.setFont('helvetica', 'normal');
      yPos += 7;

      // Contenido de sección según tipo
      if (section.type === 'text') {
        doc.setFontSize(10);
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
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text('Conclusión', 14, yPos);
      doc.setFont('helvetica', 'normal');
      yPos += 7;

      doc.setFontSize(10);
      const summaryLines = doc.splitTextToSize(
        data.summary,
        doc.internal.pageSize.width - 30
      );
      doc.text(summaryLines, 14, yPos);
    }

    // Pie de página
    this.pdfService.addFooter(
      doc,
      data.footerText || `Reporte generado por ${data.companyName}`
    );

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
