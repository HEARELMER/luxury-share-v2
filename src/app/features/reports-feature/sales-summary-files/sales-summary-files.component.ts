import { Component, inject, input, signal } from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CardReportComponent } from '../card-report/card-report.component';
import { ReportsComponent } from '../reports/reports.component';
import { ReportsService } from '../../../core/services/reports-services/reports.service';
import { ExportFilesService } from '../../../core/services/files-services/export-files.service';
import { MessageService } from 'primeng/api';
import {
  HEADERS_FOR_REPORT_OF_SALES,
  SELECTED_COLUMNS_FOR_REPORT_OF_SALES,
} from '../constants/export-files.constant';

@Component({
  selector: 'app-sales-summary-files',
  imports: [CardReportComponent],
  templateUrl: './sales-summary-files.component.html',
  styleUrl: './sales-summary-files.component.scss',
  providers: [DialogService],
})
export class SalesSummaryFilesComponent {
  title = input.required<string>();
  public readonly dialogService = inject(DialogService);
  private readonly _reportsService = inject(ReportsService);
  private readonly _reportsComponent = inject(ReportsComponent);
  private readonly _exportFilesService = inject(ExportFilesService);
  private readonly _messageService = inject(MessageService);
  ref: DynamicDialogRef | undefined;
  loading = signal<boolean>(false);

  // Métodos para generar reportes
  generateExcelReport(): void {
    this.loading.set(true);
    const payload = this._reportsComponent.getReportPayload();

    this._reportsService.getDataForFile(payload).subscribe({
      next: (response) => {
        if (response?.status === 'success' && response?.data?.data?.items) {
          // Definir las columnas que queremos exportar
          const selectedColumns = SELECTED_COLUMNS_FOR_REPORT_OF_SALES;
          // Mapear los nombres de columnas para el encabezado del Excel
          const headers = HEADERS_FOR_REPORT_OF_SALES;
          // Formatear fechas y valores monetarios
          const formattedData = response.data.data.items.map((item: any) => {
            return {
              ...item,
              date: new Date(item.date).toLocaleDateString(),
              departureDate: item.departureDate
                ? new Date(item.departureDate).toLocaleDateString()
                : 'N/A',
              subtotal: `S/ ${item.subtotal}`,
              discount: `S/ ${item.discount}`,
              total: `S/ ${item.total}`,
            };
          });

          // Exportar a Excel usando el servicio
          this._exportFilesService.exportToExcel(
            formattedData,
            headers,
            selectedColumns,
            'Reporte_Ventas'
          );

          // Mensaje de éxito
          this._messageService.add({
            severity: 'success',
            summary: 'Exportación exitosa',
            detail: 'El reporte de ventas se ha descargado correctamente',
          });
        }
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error al generar reporte Excel:', error);
        this._messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo generar el reporte. Intente nuevamente.',
        });
        this.loading.set(false);
      },
    });
  }

  generatePdfReport(): void {
    const payload = this._reportsComponent.getReportPayload(); // Reutilizar el filtro
    this._reportsService.getDataForFile(payload).subscribe({
      next: (response) => {
        console.log('Excel Report Response:', response);
      },
      error: (error) => {
        console.error('Error generating Excel report:', error);
      },
    });
  }

  // Métodos para descargar reportes
  downloadSalesReport(format: 'excel' | 'pdf'): void {}

  downloadPackagesReport(format: 'excel' | 'pdf'): void {
    // Implementación similar para reportes de paquetes/servicios
  }

  downloadBranchesReport(format: 'excel' | 'pdf'): void {
    // Implementación similar para reportes de sucursales
  }
}
