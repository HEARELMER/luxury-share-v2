import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import jsPDF from 'jspdf';
import { PdfService } from '../../../core/services/pdf-services/pdf.service';

@Component({
  selector: 'app-pdf-controls',
  standalone: true,
  imports: [CommonModule, ButtonModule, TooltipModule],
  template: `
    <div class="flex gap-2 justify-content-{{ position() }}">
      <p-button
        *ngIf="showPreview()"
        icon="pi pi-eye"
        [label]="showLabels() ? 'Ver PDF' : ''"
        [outlined]="outlined()"
        [size]="size()"
        pTooltip="Previsualizar PDF"
        tooltipPosition="top"
        (onClick)="onPreview()"
      ></p-button>

      <p-button
        *ngIf="showDownload()"
        icon="pi pi-download"
        [label]="showLabels() ? 'Descargar' : ''"
        [outlined]="outlined()"
        [size]="size()"
        pTooltip="Descargar PDF"
        tooltipPosition="top"
        (onClick)="onDownload()"
      ></p-button>

      <p-button
        *ngIf="showPrint()"
        icon="pi pi-print"
        [label]="showLabels() ? 'Imprimir' : ''"
        [outlined]="outlined()"
        [size]="size()"
        pTooltip="Imprimir PDF"
        tooltipPosition="top"
        (onClick)="onPrint()"
      ></p-button>

      <p-button
        *ngIf="showEmail()"
        icon="pi pi-envelope"
        [label]="showLabels() ? 'Enviar' : ''"
        [outlined]="outlined()"
        [size]="size()"
        pTooltip="Enviar por email"
        tooltipPosition="top"
        (onClick)="onEmail()"
      ></p-button>
    </div>
  `,
})
export class PdfControlsComponent {
  // Inputs
  readonly pdfDocument = input.required<jsPDF | null>();
  readonly fileName = input<string>('documento.pdf');
  readonly showPreview = input<boolean>(true);
  readonly showDownload = input<boolean>(true);
  readonly showPrint = input<boolean>(true);
  readonly showEmail = input<boolean>(false);
  readonly showLabels = input<boolean>(false);
  readonly outlined = input<boolean>(false);
  readonly size = input<'small' | 'large'>('small');
  readonly position = input<'start' | 'center' | 'end'>('end');

  // Outputs
  readonly preview = output<void>();
  readonly download = output<void>();
  readonly print = output<void>();
  readonly email = output<{ pdf: jsPDF; fileName: string }>();

  constructor(private pdfService: PdfService) {}

  onPreview(): void {
    if (this.pdfDocument()) {
      this.preview.emit();
      this.pdfService.openPdf(this.pdfDocument()!);
    }
  }

  onDownload(): void {
    if (this.pdfDocument()) {
      this.download.emit();
      this.pdfService.savePdf(this.pdfDocument()!, this.fileName());
    }
  }

  onPrint(): void {
    if (this.pdfDocument()) {
      this.print.emit();
      const blob = this.pdfDocument()!.output('blob');
      const url = URL.createObjectURL(blob);

      const printWindow = window.open(url);
      if (printWindow) {
        printWindow.onload = () => {
          printWindow.print();
        };
      }
    }
  }

  onEmail(): void {
    if (this.pdfDocument()) {
      this.email.emit({
        pdf: this.pdfDocument()!,
        fileName: this.fileName(),
      });
    }
  }
}
