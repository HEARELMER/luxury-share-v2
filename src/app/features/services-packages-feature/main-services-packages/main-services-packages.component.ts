import { Component, inject, signal, ViewChild } from '@angular/core';
import { Popover } from 'primeng/popover';
import { Tooltip } from 'primeng/tooltip';
import { ServicesService } from '../../../core/services/services_packages-services/services.service';
import {
  SERVICE_FILTER_BY_PRICE,
  SERVICE_FILTER_BY_STATUS,
  SERVICE_FILTER_BY_TYPE,
} from '../constants/service-types.contant';
import { MessageService } from 'primeng/api';
import { PackagesService } from '../../../core/services/services_packages-services/packages.service';
import {
  SERVICE_TABLE_COLS,
  PACKAGE_TABLE_COLS,
} from '../constants/table-services.constant';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PackageDetailComponent } from '../package-detail/package-detail.component';
import { ServiceDetailComponent } from '../service-detail/service-detail.component';
import { ViewUserInfoComponent } from '../../../shared/components/layout/view-user-info/view-user-info.component';
import { SERVICES_PACKAGES_IMPORTS } from '../imports/services_packages.import';
@Component({
  selector: 'app-main-services-packages',
  imports: [SERVICES_PACKAGES_IMPORTS, Tooltip],
  providers: [DialogService],
  templateUrl: './main-services-packages.component.html',
  styleUrl: './main-services-packages.component.scss',
})
export class MainServicesPackagesComponent {
  private readonly _servicesService = inject(ServicesService);
  private readonly _messagesService = inject(MessageService);
  private readonly _packagesService = inject(PackagesService);
  public readonly dialogService = inject(DialogService);
  ref: DynamicDialogRef | undefined;

  @ViewChild('op') op!: Popover;

  // Configuración de tabla y paginación
  cols = SERVICE_TABLE_COLS;
  packageCols = PACKAGE_TABLE_COLS;
  currentPage: number = 1;
  totalRecords: number = 0;
  rowsPerPageOptions = [10, 20, 50];
  first: number = 0;
  rows: number = 10;
  loading: boolean = false;

  // Vista y datos
  virtualServices = signal<any[]>([]);
  selectedService = signal<any>(null);
  showModal = signal<boolean>(false);
  showModalService = signal<boolean>(false);
  showModalPackage = signal<boolean>(false);
  currentView = signal<'services' | 'packages'>('services');

  filterName = '';
  filterStatus = '';
  filterServiceByType = SERVICE_FILTER_BY_TYPE;
  filterServiceByPrice = SERVICE_FILTER_BY_PRICE;
  filterServiceByStatus = SERVICE_FILTER_BY_STATUS;
  selectedRow = signal<any>(null);
  // Estado de filtros
  filters = signal<{ key: string; value: string }[]>([]);
  selectedType = signal<string>('');
  selectedStatus = signal<string>('');
  ngOnInit() {
    this.loadData();
  }

  onPageChange(event: any) {
    this.currentPage = event.page + 1;
    this.rows = event.rows;
    this.first = event.first;
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    const filters = this.filters();
    if (this.currentView() === 'services') {
      this._servicesService
        .getServices(this.currentPage, this.rows, filters)
        .subscribe({
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
    } else {
      this._packagesService
        .getPackages(this.currentPage, this.rows, filters)
        .subscribe({
          next: (response) => {
            this.virtualServices.set(response.data.packages);
            this.totalRecords = response.data.total;
            this.loading = false;
          },
          error: (error) => {
            console.error('Error cargando paquetes:', error);
            this.loading = false;
          },
        });
    }
  }

  changeView(view: 'services' | 'packages'): void {
    this.currentView.set(view);
    this.currentPage = 1;
    this.first = 0;
    this.loadData();
  }

  loadPackages(): void {
    this.loading = true;
  }

  setFilter() {
    if (this.filterName) {
      this.filters.set([{ key: 'name', value: this.filterName }]);
      this.loadData();
    }
  }

  setFilterStatus(status: string) {
    this.filterStatus = status;
    this.loadData();
  }

  getSeverity(status: string): string {
    const severities: { [key: string]: string } = {
      ACTIVE: 'success',
      INACTIVE: 'danger',
      PENDING: 'warning',
    };
    return severities[status] || 'info';
  }

  toggle(event: Event) {
    this.op.toggle(event);
  }

  exportData() {
    this.showModal.set(true);
  }

  handleExport(quantity: number) {
    const isServices = this.currentView() === 'services';
    const service = isServices ? this._servicesService : this._packagesService;
    const itemName = isServices ? 'servicios' : 'paquetes';

    service.exportToExcel(1, quantity).subscribe({
      next: () => {
        this._messagesService.add({
          severity: 'success',
          summary: 'Exportación completada',
          detail: `Los ${itemName} han sido exportados correctamente.`,
        });
        this.showModal.set(false);
      },
      error: (error) => {
        console.error(`Error exportando ${itemName}:`, error);
        this._messagesService.add({
          severity: 'error',
          summary: 'Error',
          detail: `Ha ocurrido un error al exportar los ${itemName}.`,
        });
        this.showModal.set(false);
      },
    });
  }

  editService(service: any) {
    if (this.currentView() === 'services') {
      this.selectedRow.set(service);
      this.showModalService.set(true);
    }
  }

  editPackage(packageData: any) {
    this.selectedRow.set(packageData);
    this.showModalPackage.set(true);
  }

  openModalService() {
    this.selectedRow.set(null);
    this.showModalService.set(true);
  }

  openmodalPackage() {
    this.selectedRow.set(null);
    this.showModalPackage.set(true);
  }

  handleRefreshData() {
    this.loadData();
  }

  viewPackageDetails(packageData: any) {
    if (this.currentView() === 'packages') {
      this.ref = this.dialogService.open(PackageDetailComponent, {
        data: packageData,
        header: 'Detalles del paquete ',
        width: '50vw',
        height: 'auto',
        modal: true,
        closable: true,
        resizable: true,
        maximizable: true,
        contentStyle: { overflow: 'auto' },
        breakpoints: {
          '960px': '75vw',
          '640px': '90vw',
        },
      });
    }
  }

  viewServicesDetails(serviceData: any) {
    if (this.currentView() === 'services') {
      this.ref = this.dialogService.open(ServiceDetailComponent, {
        data: serviceData,
        header: 'Detalles del servicio',
        width: '50vw',
        height: 'auto',
        modal: true,
        closable: true,
        resizable: true,
        maximizable: true,
        contentStyle: { overflow: 'auto' },
        breakpoints: {
          '960px': '75vw',
          '640px': '90vw',
        },
      });
    }
  }

  // Método para aplicar filtros
  applyFilters(type: string, value: any) {
    let currentFilters = this.filters();

    if (type === 'type') {
      // Actualizar filtro de tipo
      currentFilters = currentFilters.filter((f) => f.key !== 'type');
      if (value) {
        currentFilters.push({ key: 'type', value });
      }
      this.selectedType.set(value);
    }

    if (type === 'status') {
      // Actualizar filtro de estado
      currentFilters = currentFilters.filter((f) => f.key !== 'status');
      if (value) {
        currentFilters.push({ key: 'status', value });
      }
      this.selectedStatus.set(value);
    }

    this.filters.set(currentFilters);
    this.currentPage = 1;
    this.first = 0;
    this.loadData();
  }

  clearFilters() {
    this.selectedType.set('');
    this.selectedStatus.set('');
    this.filters.set([]);
    this.loadData();
  }

  onPackageChanged(event: boolean) {
    if (event) {
      this.loadData();
    }
  }

  viewUserDetails(userId: string) {
    console.log('User ID:', userId);
    const ref = this.dialogService.open(ViewUserInfoComponent, {
      header: 'Información del usuario',
      modal: true,
      closable: true,
      dismissableMask: true,
      breakpoints: {
        '960px': '65vw',
        '640px': '80vw',
      },
      data: userId,
    });
  }
}
