import { Component, inject, signal, ViewChild } from '@angular/core';
import { SERVICE_TABLE_COLS } from '../constants/table-services.constant';
import { Popover, PopoverModule } from 'primeng/popover';
import { MessageService } from 'primeng/api';
import { ServicesService } from '../../../core/services/services_packages-services/services.service';
import {
  SERVICE_FILTER_BY_TYPE,
  SERVICE_FILTER_BY_PRICE,
  SERVICE_FILTER_BY_STATUS,
} from '../constants/service-types.contant';
import { ButtonComponent } from '../../../shared/components/ui/button/button.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BadgeModule } from 'primeng/badge';
import { PaginatorModule } from 'primeng/paginator';
import { Skeleton } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { Toast } from 'primeng/toast';
import { InputFormComponent } from '../../../shared/components/forms/input-form/input-form.component';
import { SelectComponent } from '../../../shared/components/forms/select/select.component';
import { ExportExcelComponent } from '../../../shared/components/layout/export-excel/export-excel.component';
import { AddPackageComponent } from '../add-package/add-package.component';
import { AddServiceComponent } from '../add-service/add-service.component';
import { Tooltip } from 'primeng/tooltip';

@Component({
  selector: 'app-services',
  imports: [
    ButtonComponent,
    TieredMenuModule,
    CommonModule,
    BadgeModule,
    TableModule,
    CommonModule,
    Skeleton,
    Tooltip,
    PaginatorModule,
    FormsModule,
    PopoverModule,
    TagModule,
    SelectComponent,
  ],
  templateUrl: './services.component.html',
  styleUrl: './services.component.scss',
})
export class ServicesComponent {
  private readonly _servicesService = inject(ServicesService);

  // Configuración de tabla ypaginación
  cols = SERVICE_TABLE_COLS;
  currentPage: number = 1;
  totalRecords: number = 0;
  rowsPerPageOptions = [5, 10, 20, 50];
  first: number = 0;
  rows: number = 5;
  loading: boolean = false;

  // Vista y datos

  virtualServices = signal<any[]>([]);
  selectedService = signal<any>(null);
  showModal = signal<boolean>(false);
  showModalService = signal<boolean>(false);
  showModalPackage = signal<boolean>(false);

  // Filtros
  filters = signal<{ key: string; value: string }[]>([]);
  filterName = '';
  filterStatus = '';
  selectedType = '';
  selectedPrice = '';
  selectedStatus = '';
  filterServiceByType = SERVICE_FILTER_BY_TYPE;
  filterServiceByPrice = SERVICE_FILTER_BY_PRICE;
  filterServiceByStatus = SERVICE_FILTER_BY_STATUS;

  ngOnInit() {
    this.loadServices();
  }

  onPageChange(event: any) {
    this.currentPage = event.page + 1;
    this.rows = event.rows;
    this.first = event.first;
    this.loadServices();
  }

  loadServices(): void {
    this.loading = true;
    this._servicesService.getServices(this.currentPage, this.rows).subscribe({
      next: (response) => {
        this.virtualServices.set(response.data.services);
        this.totalRecords = response.data.total;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error cargando servicios:', error);
        this.loading = false;
      },
    });
  }

  setFilter() {
    if (this.filterName) {
      this.filters.set([{ key: 'name', value: this.filterName }]);
      this.loadServices();
    }
  }

  setFilterStatus(status: string) {
    this.filterStatus = status;
    this.loadServices();
  }

  clearFilters() {
    this.filterName = '';
    this.filterStatus = '';
    this.filters.set([]);
    this.loadServices();
  }

  getSeverity(status: string): string {
    const severities: { [key: string]: string } = {
      ACTIVE: 'success',
      INACTIVE: 'danger',
      PENDING: 'warning',
    };
    return severities[status] || 'info';
  }

  editService(service: any) {
    this.selectedService.set(service);
    this.showModalService.set(true);
  }

  handleRefreshData() {
    this.loadServices();
  }
}
