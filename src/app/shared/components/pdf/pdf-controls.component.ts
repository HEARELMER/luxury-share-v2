import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import jsPDF from 'jspdf';
import { PdfService } from '../../../core/services/pdf-services/pdf.service';
import { ButtonComponent } from '../ui/button/button.component';

@Component({
  selector: 'app-pdf-controls',
  imports: [CommonModule, ButtonModule, TooltipModule, ButtonComponent],
  template: `
    <div class="grid lg:grid-cols-3  gap-2">
      <app-button
        *ngIf="showPreview()"
        icon="pi pi-eye"
        text="Ver PDF"
        pTooltip="Previsualizar PDF"
        tooltipPosition="top"
        (click)="onPreview()"
        bgColor="bg-primary-500 dark:bg-primary-700"
        textColor="text-white dark:text-white"
        font=" font-normal text-sm"
        moreClasses="py-2"
      />

      <app-button
        *ngIf="showDownload()"
        icon="pi pi-download"
        text="Descargar PDF"
        pTooltip="Descargar PDF"
        tooltipPosition="top"
        (click)="onDownload()"
        bgColor="bg-primary-500 dark:bg-primary-dark-500"
        textColor="text-white dark:text-white"
        font=" font-normal text-sm"
        moreClasses="py-2"
      />

      <app-button
        *ngIf="showPrint"
        icon="pi pi-print"
        pTooltip="Imprimir PDF"
        tooltipPosition="top"
        bgColor="bg-primary-500 dark:bg-primary-dark-500"
        textColor="text-white dark:text-white"
        font=" font-normal text-sm"
        text="Imprimir"
        moreClasses="py-2"
        (click)="onPrint()"
      />

      <app-button
        *ngIf="showEmail()"
        icon="pi pi-envelope"
        pTooltip="Enviar por correo"
        tooltipPosition="top"
        text="Enviar por correo"
        bgColor="bg-primary-500 dark:bg-primary-dark-500"
        textColor="text-white dark:text-white"
        font=" font-normal text-sm"
        moreClasses="py-2"
        (click)="onEmail()"
      />
    </div>
  `,
})
export class PdfControlsComponent {
  // Inputs
  readonly pdfDocument = input.required<jsPDF | null>();
  readonly fileName = input<string>('documento.pdf');
  readonly showPreview = input<boolean>(false);
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
