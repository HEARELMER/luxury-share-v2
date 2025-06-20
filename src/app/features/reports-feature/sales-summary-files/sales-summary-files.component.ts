import { Component, inject, input, signal } from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CardReportComponent } from '../card-report/card-report.component';
import { ReportsComponent } from '../reports/reports.component';
import { ReportsService } from '../../../core/services/reports-services/reports.service';
import { ExportFilesService } from '../../../core/services/files-services/export-files.service';
import { MessageService } from 'primeng/api';
import {
  HEADERS_FOR_REPORT_OF_BRANCHES,
  HEADERS_FOR_REPORT_OF_SALES,
  HEADERS_FOR_REPORT_OF_SERVICES,
  SELECTED_COLUMNS_FOR_REPORT_OF_BRANCHES,
  SELECTED_COLUMNS_FOR_REPORT_OF_SALES,
  SELECTED_COLUMNS_FOR_REPORT_OF_SERVICES,
} from '../constants/export-files.constant';
import { ButtonComponent } from '../../../shared/components/ui/button/button.component';
import { RouterLink } from '@angular/router';
import {
  formatSalesData,
  prepareSalesByServicesPackagesData,
  prepareSalesSummaryData,
} from '../helpers/report-export-file';

@Component({
  selector: 'app-sales-summary-files',
  imports: [CardReportComponent, ButtonComponent, RouterLink],
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
  generateExcelReportOfSales(): void {
    this.loading.set(true);
    const payload = this._reportsComponent.getReportPayload();

    this._reportsService.getDataOfSales(payload).subscribe({
      next: (response) => {
        if (response?.status === 'success' && response?.data?.data?.items) {
          // Definir las columnas que queremos exportar
          const selectedColumns = SELECTED_COLUMNS_FOR_REPORT_OF_SALES;
          // Mapear los nombres de columnas para el encabezado del Excel
          const headers = HEADERS_FOR_REPORT_OF_SALES;
          // Formatear los datos
          const formattedData = formatSalesData(response.data.data.items);
          // Preparar los datos de resumen
          const summaryData = prepareSalesSummaryData(response.data.data);

          // Exportar a Excel usando el servicio
          this._exportFilesService.exportToExcel(
            formattedData,
            headers,
            selectedColumns,
            'Reporte_Ventas',
            summaryData
          );

          // Mensaje de éxito
          this._messageService.add({
            severity: 'success',
            summary: 'Exportación exitosa',
            detail: 'El reporte de ventas se ha descargado correctamente',
            icon:'pi pi-file-excel'
          });
        } else {
          this._messageService.add({
            severity: 'warn',
            summary: 'Error',
            detail: 'No hay datos disponibles para exportar',
            icon:'pi pi-file-excel'
          });
        }

        this.loading.set(false);
      },
      error: (error) => {
        this._messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo generar el reporte. Intente nuevamente.',
        });
        this.loading.set(false);
      },
    });
  }

  generateExcelReportOfServicesAndPackages(): void {
    this.loading.set(true);
    const payload = this._reportsComponent.getReportPayload();

    this._reportsService.getDataOfServicesAndPackages(payload).subscribe({
      next: (response) => {
        if (response?.status === 'success' && response?.data?.data) {
          // Combinar servicios y paquetes en una sola lista para el reporte
          const services = response.data.data.services || [];
          const packages = response.data.data.packages || [];

          // Formatear los datos para el Excel
          const formattedServices = services.map((item: any) => {
            return {
              ...item,
              isPackage: 'No',
              revenue: `S/ ${item.revenue}`,
            };
          });

          const formattedPackages = packages.map((item: any) => {
            return {
              ...item,
              isPackage: 'Sí',
              revenue: `S/ ${item.revenue}`,
            };
          });

          // Combinar ambas listas
          const allItems = [...formattedServices, ...formattedPackages];

          // Definir las columnas que queremos exportar
          const selectedColumns = SELECTED_COLUMNS_FOR_REPORT_OF_SERVICES;

          // Mapear los nombres de columnas para el encabezado del Excel
          const headers = HEADERS_FOR_REPORT_OF_SERVICES;
          const summaryData = prepareSalesByServicesPackagesData(
            response.data.data
          );
          // Exportar a Excel usando el servicio
          this._exportFilesService.exportToExcel(
            allItems,
            headers,
            selectedColumns,
            'Reporte_Servicios_Paquetes',
            summaryData
          );

          // Mensaje de éxito
          this._messageService.add({
            severity: 'success',
            summary: 'Exportación exitosa',
            detail:
              'El reporte de servicios y paquetes se ha descargado correctamente',
          });
        } else {
          this._messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No hay datos disponibles para exportar',
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

  generateExcelReportOfBranches(): void {
    this.loading.set(true);
    const payload = this._reportsComponent.getReportPayload();

    this._reportsService.getDataOfBranches(payload).subscribe({
      next: (response) => {
        // La ruta correcta a los datos de sucursales
        if (response?.status === 'success' && response?.data?.data?.branches) {
          // Obtener datos de sucursales
          const branches = response.data.data.branches || [];

          // Formatear los datos para el Excel con la estructura correcta
          const formattedData = branches.map((branch: any) => {
            // Convertir los objetos salesByStatus y salesByPaymentMethod a formato de texto
            const salesByStatusText = Object.entries(branch.salesByStatus || {})
              .map(([key, value]) => `${key}: ${value}`)
              .join(', ');

            const salesByPaymentMethodText = Object.entries(
              branch.salesByPaymentMethod || {}
            )
              .map(([key, value]) => `${key}: ${value}`)
              .join(', ');

            // Extraer información del mejor vendedor (si existe)
            const topSeller =
              branch.topSellers && branch.topSellers.length > 0
                ? branch.topSellers[0].name
                : 'N/A';

            return {
              branchId: branch.branchId,
              name: branch.name,
              address: branch.address,
              totalSales: branch.totalSales,
              totalRevenue: `S/ ${branch.totalRevenue}`,
              salesByStatus: salesByStatusText,
              salesByPaymentMethod: salesByPaymentMethodText,
              topSeller: topSeller,
            };
          });

          // Actualizar las columnas que queremos exportar
          const selectedColumns = SELECTED_COLUMNS_FOR_REPORT_OF_BRANCHES;

          // Actualizar los encabezados para el Excel
          const headers = HEADERS_FOR_REPORT_OF_BRANCHES;

          // Exportar a Excel usando el servicio
          this._exportFilesService.exportToExcel(
            formattedData,
            headers,
            selectedColumns,
            'Reporte_Sucursales'
          );

          // Mensaje de éxito
          this._messageService.add({
            severity: 'success',
            summary: 'Exportación exitosa',
            detail: 'El reporte de sucursales se ha descargado correctamente',
          });
        } else {
          this._messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No hay datos disponibles para exportar',
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
    this._reportsService.getDataOfSales(payload).subscribe({
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
