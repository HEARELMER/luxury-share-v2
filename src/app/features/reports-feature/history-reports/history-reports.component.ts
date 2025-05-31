import { Component, inject, signal } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { ReportsService } from '../../../core/services/reports-services/reports.service';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tooltip } from 'primeng/tooltip';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { PaginatorModule } from 'primeng/paginator';
import { PopoverModule } from 'primeng/popover';
import { Skeleton } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';
import { TagModule, Tag } from 'primeng/tag';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { InputFormComponent } from '../../../shared/components/forms/input-form/input-form.component';
import { ButtonComponent } from '../../../shared/components/ui/button/button.component';
import { Filter, FilterOptions } from '../../../core/interfaces/api/filters';
import { SALE_STATUS_FILTERS } from '../../sales-feature/constants/sales-filters.constant';
import { HISTORY_TABLE_COLUMNS } from '../constants/history-reports.constant';
import { HitoryDetailComponent } from '../hitory-detail/hitory-detail.component';
import {
  HEADERS_FOR_REPORT_OF_BRANCHES,
  HEADERS_FOR_REPORT_OF_SALES,
  HEADERS_FOR_REPORT_OF_SERVICES,
  SELECTED_COLUMNS_FOR_REPORT_OF_BRANCHES,
  SELECTED_COLUMNS_FOR_REPORT_OF_SALES,
  SELECTED_COLUMNS_FOR_REPORT_OF_SERVICES,
} from '../constants/export-files.constant';
import { ExportFilesService } from '../../../core/services/files-services/export-files.service';
import { LocalstorageService } from '../../../core/services/localstorage-services/localstorage.service';
import { last } from 'rxjs';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-history-reports',
  imports: [
    ButtonComponent,
    TieredMenuModule,
    CommonModule,
    BadgeModule,
    ButtonComponent,
    TableModule,
    CommonModule,
    Skeleton,
    Tooltip,
    PaginatorModule,
    FormsModule,
    ButtonComponent,
    PopoverModule,
    TagModule,
    Tag,
    InputFormComponent,
    ButtonModule,
    DatePipe,
    RouterLink
  ],
  templateUrl: './history-reports.component.html',
  styleUrl: './history-reports.component.scss',
  providers: [DialogService, MessageService],
})
export class HistoryReportsComponent {
  public readonly dialogService = inject(DialogService);
  private readonly _reportsService = inject(ReportsService);
  private readonly _messageService = inject(MessageService);
  private readonly _exportFilesService = inject(ExportFilesService);
  constructor() {
    this.loadHistory();
  }

  loading = signal<boolean>(false);
  reports = signal<any[]>([]);
  filters = signal<{ key: string; value: string }[]>([]);

  reportsStatusFilters = SALE_STATUS_FILTERS;
  // Configuración de tabla
  reportsTableColumns = HISTORY_TABLE_COLUMNS;
  currentPage = 1;
  pageSize = 10;
  totalRecords = 0;
  rowsPerPageOptions = [10, 20, 50];
  first = 0;
  rows = 10;

  onFilterChange(key: string, event: any) {
    const filter = {
      key: key,
      value: event,
    };

    this.filters.update((prevFilters: Filter[]) => {
      // Verificar si ya existe un filtro con esta clave
      const existingFilterIndex = prevFilters.findIndex((f) => f.key === key);

      if (existingFilterIndex >= 0) {
        // Si existe, crear un nuevo array con el filtro actualizado
        const updatedFilters = [...prevFilters];
        updatedFilters[existingFilterIndex] = filter;
        return updatedFilters;
      } else {
        // Si no existe, agregar el nuevo filtro
        return [...prevFilters, filter];
      }
    });

    this.loadHistory({ resetPage: true });
  }

  clearFilters() {
    this.filters.set([]);
    this.loadHistory({ resetPage: true });
  }

  loadHistory(options: FilterOptions = {}) {
    this.loading.set(true);
    if (options.resetPage) {
      this.currentPage = 1;
      this.first = 0;
    }

    this._reportsService
      .getReportsHistory(this.currentPage, this.pageSize, this.filters())
      .subscribe({
        next: (response) => {
          this.reports.set(response.data.reports);
          this.totalRecords = response.data.total;
          this.loading.set(false);
        },
        error: (error) => {
          this.loading.set(false);
        },
      });
  }

  /**
   * Maneja el cambio de página
   */
  onPageChange(event: any) {
    this.currentPage = event.page + 1;
    this.rows = event.rows;
    this.first = event.first;
    this.loadHistory();
  }

  opendReportDetail(report: any) {
    const ref = this.dialogService.open(HitoryDetailComponent, {
      header: 'Detalle del Reporte',
      modal: true,
      closable: true,
      dismissableMask: true,
      breakpoints: {
        '960px': '65vw',
        '640px': '80vw',
      },
      data: report,
    });
  }

  downloadReport(report: any) {
    const payload = {
      lastDownload: report.lastDownload,
      reportId: report.id,
      ...report.filters,
    };
    if (report.reportType == 'VENTA') {
      this.sales(payload);
    } else if (report.reportType == 'SERVICIO_PAQUETE') {
      this.servicesPackages(payload);
    } else if (report.reportType == 'SUCURSAL') {
      this.branches(payload);
    }
  }

  sales(payload: any) {
    this._reportsService.getDataOfSales(payload).subscribe({
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

  servicesPackages(payload: any) {
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

          // Exportar a Excel usando el servicio
          this._exportFilesService.exportToExcel(
            allItems,
            headers,
            selectedColumns,
            'Reporte_Servicios_Paquetes'
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

  branches(payload: any) {
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
}
