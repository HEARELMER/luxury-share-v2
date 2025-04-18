import { Component, inject, input, signal } from '@angular/core';
import { PreviewSummaryComponent } from '../preview-summary/preview-summary.component';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ButtonComponent } from "../../../shared/components/ui/button/button.component";
import { CardReportComponent } from "../card-report/card-report.component";

@Component({
  selector: 'app-sales-summary-files',
  imports: [PreviewSummaryComponent, ButtonComponent, CardReportComponent],
  templateUrl: './sales-summary-files.component.html',
  styleUrl: './sales-summary-files.component.scss',
  providers: [DialogService],
})
export class SalesSummaryFilesComponent {
  title = input.required<string>();
  public readonly dialogService = inject(DialogService);
  ref: DynamicDialogRef | undefined;
  loading = signal<boolean>(false);

  // Métodos para generar reportes
  generateExcelReport(): void {}

  generatePdfReport(): void {}

  generateCsvReport(): void {}

  previewReport(): void {
    this.ref = this.dialogService.open(PreviewSummaryComponent, {
      header: 'Previsualización de Reporte',
      width: '70vw',
      height: '90vh',
      contentStyle: { 'max-height': '90vh', overflow: 'auto' },
      baseZIndex: 10000,
      modal: true,
      closable: true,
      resizable: true,
      maximizable: true,
      breakpoints: {
        '960px': '75vw',
        '640px': '90vw',
      },
    });

    this.ref.onClose.subscribe((result) => {
      if (result) {
        console.log('Report preview closed with result:', result);
      }
    });
  }

    // Métodos para descargar reportes
  downloadSalesReport(format: 'excel' | 'pdf'): void {
  }
  
  downloadPackagesReport(format: 'excel' | 'pdf'): void {
    // Implementación similar para reportes de paquetes/servicios
  }
  
  downloadBranchesReport(format: 'excel' | 'pdf'): void {
    // Implementación similar para reportes de sucursales
  }
}
