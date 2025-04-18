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
import { DATE_RANGE_OPTIONS } from '../constants/reports.constant';
import { ChartsPanelComponent } from '../charts-panel/charts-panel.component';
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
  ],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.scss',
})
export class ReportsComponent {
  private readonly _fb = inject(FormBuilder);
  private readonly _messageService = inject(MessageService);
  private readonly _reportsService = inject(ReportsService);
  private readonly _filterEmptyValuesPipe = inject(FilterEmptyValuesPipe);

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

  serviceTypeOptions = [
    { label: 'Todos los servicios', value: '' },
    { label: 'Servicio A', value: 'service-a' },
    { label: 'Servicio B', value: 'service-b' },
  ];

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
  }

  // Método principal para actualizar el reporte
  updateReport(forceRefresh: boolean = false) {
    this.loading.set(true);
    const payload = this.buildReportPayload();

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
      },
      error: (error) => {
        this._messageService.add({
          severity: 'error',
          summary: 'Error',
          detail:
            'No se pudieron cargar los datos del reporte. Intente nuevamente.',
        });
      },
      complete: () => this.loading.set(false),
    });
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
