import { Component, OnChanges, SimpleChanges, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import jsPDF from 'jspdf';
import { PdfService } from '../../../core/services/pdf-services/pdf.service';

@Component({
  selector: 'app-pdf-viewer',
  imports: [CommonModule],
  template: `
    <div class="pdf-container w-full h-full">
      <iframe
        #pdfFrame
        class="w-full h-full min-h-[500px] lg:min-h-[700px] xl:min-h-[800px] border-0"
      ></iframe>
    </div>
  `,
  styles: [],
})
export class PdfViewerComponent implements OnChanges {
  readonly pdfDocument = input.required<jsPDF>();
  readonly fileName = input<string>('documento.pdf');

  constructor(private pdfService: PdfService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['pdfDocument'] && this.pdfDocument()) {
      this.displayPdf();
    }
  }

  displayPdf(): void {
    const blob = this.pdfDocument().output('blob');
    const url = URL.createObjectURL(blob);

    const iframe = document.querySelector('iframe');
    if (iframe) {
      iframe.src = url;
    }
  }

  downloadPdf(): void {
    this.pdfService.savePdf(this.pdfDocument(), this.fileName());
  }

  printPdf(): void {
    const blob = this.pdfDocument().output('blob');
    const url = URL.createObjectURL(blob);

    // Abrir en nueva ventana e imprimir
    const printWindow = window.open(url);
    if (printWindow) {
      printWindow.onload = () => {
        printWindow.print();
      };
    }
  }
}
