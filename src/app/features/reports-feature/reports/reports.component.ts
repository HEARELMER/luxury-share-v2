import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { SelectComponent } from '../../../shared/components/forms/select/select.component';
import { KpiCardsComponent } from '../kpi-cards/kpi-cards.component';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { DatePickerModule } from 'primeng/datepicker';
import { MessageService } from 'primeng/api';
import { DatePipe } from '@angular/common';
import { ProgressBarModule } from 'primeng/progressbar';
import { MenuModule } from 'primeng/menu';
import { DialogModule } from 'primeng/dialog';
import { ChipModule } from 'primeng/chip';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TagModule } from 'primeng/tag';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { ReportsService } from '../../../core/services/reports-services/reports.service';
import { SalesSummaryFilesComponent } from '../sales-summary-files/sales-summary-files.component';
import { FilterEmptyValuesPipe } from '../../../shared/pipes/filter-empty-value.pipe';
import {
  DATE_RANGE_OPTIONS,
  filtersByServiceType,
} from '../constants/reports.constant';
import { ChartsPanelComponent } from '../charts-panel/charts-panel.component';
import { PackagesService } from '../../../core/services/services_packages-services/packages.service';
import { UserService } from '../../../core/services/users-services/user.service';
import { SelectModule } from 'primeng/select';
import { finalize } from 'rxjs';
import { LocalstorageService } from '../../../core/services/localstorage-services/localstorage.service';
@Component({
  selector: 'app-reports',
  imports: [
    ButtonModule,
    ReactiveFormsModule,
    FormsModule,
    SelectComponent,
    KpiCardsComponent,
    ToggleSwitchModule,
    ButtonModule,
    DatePickerModule,
    DatePipe,
    ProgressBarModule,
    ToastModule,
    MenuModule,
    DialogModule,
    ChipModule,
    SelectButtonModule,
    TagModule,
    DropdownModule,
    InputTextModule,
    SalesSummaryFilesComponent,
    ChartsPanelComponent,
    SelectModule,
  ],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.scss',
})
export class ReportsComponent {
  private readonly _fb = inject(FormBuilder);
  private readonly _messageService = inject(MessageService);
  private readonly _reportsService = inject(ReportsService);
  private readonly _filterEmptyValuesPipe = inject(FilterEmptyValuesPipe);
  private readonly _packagesService = inject(PackagesService);
  private readonly _usersService = inject(UserService);
  private readonly _localStorageService = inject(LocalstorageService);
  // Signals
  kpisData = signal<any[]>([]);
  chartsData = signal<any[]>([]);
  loading = signal<boolean>(false);
  lastUpdate = signal<any>(new Date());
  showFilters = signal<boolean>(false);

  // Formulario de filtros
  filtersForm = this._fb.group({
    dateRange: [''],
    customDateStart: [''],
    customDateEnd: [''],
    serviceType: [''],
    package: [''],
    seller: [''],
  });

  serviceTypeOptions = filtersByServiceType;

  packageOptions = [
    { label: 'Todos los paquetes', value: '' },
    { label: 'Paquete A', value: 'package-a' },
    { label: 'Paquete B', value: 'package-b' },
  ];

  sellersOptions = [
    { label: 'Todos los vendedores', value: '' },
    { label: 'Vendedor A', value: 'seller-a' },
    { label: 'Vendedor B', value: 'seller-b' },
  ];

  // Signals para el manejo de paquetes
  displayedPackages = signal<any[]>([
    { label: 'Todos los paquetes', value: '' },
  ]);
  packagesLoading = signal<boolean>(false);
  packagesPage = signal<number>(1);
  packagesHasMore = signal<boolean>(true);
  packagesPageSize = 20; // Número de elementos por página

  // Método para cargar paquetes desde la API
  loadPackages(page: number, reset: boolean = false): void {
    if (!this.packagesHasMore() && !reset) return;

    this.packagesLoading.set(true);

    this._packagesService
      .getPackages(page, this.packagesPageSize)
      .pipe(finalize(() => this.packagesLoading.set(false)))
      .subscribe({
        next: (response) => {
          // Transformar los datos al formato esperado por p-select
          const formattedPackages = response.data.packages.map((pkg: any) => ({
            label: pkg.name,
            value: pkg.oackageId,
          }));

          if (reset) {
            // Si es un reset, reemplazar todo excepto la opción "Todos los paquetes"
            this.displayedPackages.set([
              { label: 'Todos los paquetes', value: '' },
              ...formattedPackages,
            ]);
          } else {
            // Añadir a los existentes
            this.displayedPackages.update((current) => [
              ...current,
              ...formattedPackages,
            ]);
          }

          // Actualizar página y verificar si hay más datos
          this.packagesPage.set(page);
          this.packagesHasMore.set(
            formattedPackages.length === this.packagesPageSize
          );
        },
        error: (error) => {
          this._messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudieron cargar los paquetes',
          });
        },
      });
  }

  // Método que se llama cuando el usuario hace scroll
  onPackagesLazyLoad(event: any): void {
    // Calcular la página basada en el primer índice visible
    const page = Math.floor(event.first / this.packagesPageSize) + 1;

    // Cargar si es una nueva página
    if (page > this.packagesPage()) {
      this.loadPackages(page);
    }
  }

  // Signals para el manejo de vendedores
  displayedSellers = signal<any[]>([
    { label: 'Todos los vendedores', value: '' },
  ]);
  sellersLoading = signal<boolean>(false);
  sellersPage = signal<number>(1);
  sellersHasMore = signal<boolean>(true);
  sellersPageSize = 20;

  loadSellers(page: number, reset: boolean = false): void {
    if (!this.sellersHasMore() && !reset) return;

    this.sellersLoading.set(true);

    this._usersService
      .paginateUsers(page, this.sellersPageSize)
      .pipe(finalize(() => this.sellersLoading.set(false)))
      .subscribe({
        next: (response) => {
          const formattedSellers = response.data.users.map((user: any) => ({
            label: `${user.name} ${user.firstLastname}`,
            value: user.id,
          }));

          if (reset) {
            this.displayedSellers.set([
              { label: 'Todos los vendedores', value: '' },
              ...formattedSellers,
            ]);
          } else {
            this.displayedSellers.update((current) => [
              ...current,
              ...formattedSellers,
            ]);
          }

          this.sellersPage.set(page);
          this.sellersHasMore.set(
            formattedSellers.length === this.sellersPageSize
          );
        },
        error: (error) => {
          this._messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudieron cargar los vendedores',
          });
        },
      });
  }

  onSellersLazyLoad(event: any): void {
    const page = Math.floor(event.first / this.sellersPageSize) + 1;
    if (page > this.sellersPage()) {
      this.loadSellers(page);
    }
  }

  // Opciones de filtros
  dateRangeOptions = DATE_RANGE_OPTIONS;
  activeFiltersCount(): number {
    const formValues = this.filtersForm.value;
    // Filtrar los valores que no están vacíos, nulos o indefinidos
    const activeFilters = Object.values(formValues).filter(
      (value) => value !== null && value !== undefined && value !== ''
    );
    return activeFilters.length;
  }
  ngOnInit() {
    this.updateReport();
    this.updateReport();
    this.loadPackages(1, true); // Cargar la primera página de paquetes
    this.loadSellers(1, true); // Cargar la primera página de vendedores
  }

  // Método principal para actualizar el reporte
  updateReport(forceRefresh: boolean = false) {
    this.loading.set(true);
    const payload = this.buildReportPayload();
    try {
      this._reportsService.loadReports(payload, forceRefresh).subscribe({
        next: ({ response, lastUpdate }) => {
          this.kpisData.set(response?.data?.keyMetrics || []);
          this.chartsData.set(response?.data?.chartData || []);
          this.lastUpdate.set(lastUpdate);
          this._messageService.add({
            severity: 'success',
            summary: 'Reporte actualizado',
            detail: 'Los datos del reporte han sido actualizados correctamente',
          });
          this.loading.set(false);
        },
        error: (error) => {
          this._messageService.add({
            severity: 'error',
            summary: 'Error',
            detail:
              'No se pudieron cargar los datos del reporte. Intente nuevamente.',
          });
          this.loading.set(false);
        },
        complete: () => this.loading.set(false),
      });
    } catch (error) {
      this.loading.set(false);
    }
  }

  // Construir el payload para la API
  private buildReportPayload() {
    const formValues = this.filtersForm.value;
    const periodConfig = this.configurePeriod(formValues.dateRange || '');
    return this._filterEmptyValuesPipe.transform({
      period: periodConfig,
      serviceType: formValues.serviceType,
      packageType: formValues.package,
      sellerId: formValues.seller,
      userId: this._localStorageService.getUserId(),
    });
  }

  getReportPayload(): any {
    return this.buildReportPayload();
  }
  // Configurar el período según el rango seleccionado
  private configurePeriod(dateRange: string): any {
    const today = new Date();
    switch (dateRange) {
      case 'today':
        return this.createPeriod(today, today, 'Hoy');
      case 'yesterday':
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        return this.createPeriod(yesterday, yesterday, 'Ayer');
      case 'last-week':
        const lastWeek = new Date(today);
        lastWeek.setDate(today.getDate() - 7);
        return this.createPeriod(lastWeek, today, 'Última semana');
      case 'last-month':
        const firstDayLastMonth = new Date(
          today.getFullYear(),
          today.getMonth() - 1,
          1
        );
        const lastDayLastMonth = new Date(
          today.getFullYear(),
          today.getMonth(),
          0
        );
        return this.createPeriod(
          firstDayLastMonth,
          lastDayLastMonth,
          'Último mes'
        );
      case 'last-year':
        const firstDayLastYear = new Date(today.getFullYear() - 1, 0, 1);
        const lastDayLastYear = new Date(today.getFullYear() - 1, 11, 31);
        return this.createPeriod(
          firstDayLastYear,
          lastDayLastYear,
          'Último año'
        );
      case 'custom':
        const customStart = this.filtersForm.get('customDateStart')?.value;
        const customEnd = this.filtersForm.get('customDateEnd')?.value;

        // Validar que las fechas no sean nulas o indefinidas
        if (customStart && customEnd) {
          return this.createPeriod(
            new Date(customStart),
            new Date(customEnd),
            'Rango personalizado'
          );
        } else {
          return null; // Manejo de error si las fechas no son válidas
        }
      case 'this-week':
        const firstDayThisWeek = new Date(today);
        firstDayThisWeek.setDate(today.getDate() - today.getDay() + 1);
        return this.createPeriod(firstDayThisWeek, today, 'Esta semana');
      case 'this-year':
        const firstDayThisYear = new Date(today.getFullYear(), 0, 1);
        return this.createPeriod(firstDayThisYear, today, 'Este año');
      case 'this-month':
        const firstDayThisMonth1 = new Date(
          today.getFullYear(),
          today.getMonth(),
          1
        );
        return this.createPeriod(firstDayThisMonth1, today, 'Este mes');
      default:
        const firstDayThisMonth = new Date(
          today.getFullYear(),
          today.getMonth(),
          1
        );
        return this.createPeriod(firstDayThisMonth, today, 'Mes actual');
    }
  }
  // Crear un objeto de período
  private createPeriod(start: Date, end: Date, label: string) {
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);
    return {
      type: 'custom',
      from: start.toISOString(),
      to: end.toISOString(),
      label,
    };
  }
}
