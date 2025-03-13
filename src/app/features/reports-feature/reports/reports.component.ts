import { Component, inject, signal, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { SelectComponent } from '../../../shared/components/forms/select/select.component';
import { Skeleton } from 'primeng/skeleton';
import {
  SaleReport,
  SalesTableComponent,
  TableState,
} from '../sales-table/sales-table.component';
import { ChartsPanelComponent } from '../charts-panel/charts-panel.component';
import { KpiCardsComponent, KpiData } from '../kpi-cards/kpi-cards.component';
import { Select } from 'primeng/select';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { ButtonComponent } from '../../../shared/components/ui/button/button.component';
import { Popover } from 'primeng/popover';
import { DatePickerComponent } from '../../../shared/components/forms/date-picker/date-picker.component';
import { DatePickerModule } from 'primeng/datepicker';
import { MessageService } from 'primeng/api';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-reports',
  imports: [
    ButtonModule,
    ReactiveFormsModule,
    FormsModule,
    SelectComponent,
    Skeleton,
    SalesTableComponent,
    KpiCardsComponent,
    ChartsPanelComponent,
    ToggleSwitchModule,
    Select,
    ButtonModule,
    ButtonComponent,
    Popover,
    DatePickerModule,
    DatePipe,
  ],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.scss',
})
export class ReportsComponent {
  private readonly _fb = inject(FormBuilder);
  private readonly _messageService = inject(MessageService);
  showFilters = signal<boolean>(false);
  activeFiltersCount = signal<number>(0);
  lastUpdate = signal<Date>(new Date());

  updateActiveFiltersCount() {
    const values = this.filtersForm.value;
    const count = Object.values(values).filter((v) => v && v !== 'all').length;
    this.activeFiltersCount.set(count);
  }

  // Método para cargar datos
  loadData(tableState: TableState) {
    this.loading.set(true);
    // Aquí irá la llamada al servicio
    // Por ahora simulamos datos
    setTimeout(() => {
      this.salesData.set([]); // Datos del servicio
      this.loading.set(false);
    }, 1000);
  }

  // Datos simulados para KPIs
  kpiData = signal<KpiData>({
    totalSales: 156,
    totalIncome: 45678.9,
    averageTickets: 12,
    growthRate: 23.5,
    topSeller: {
      name: 'Juan Pérez',
      sales: 45,
    },
  });

  // Método para exportar
  onExport(type: 'excel' | 'csv' | 'pdf') {
    console.log(`Exportando en formato: ${type}`);
  }

  filtersForm = this._fb.group({
    dateRange: [''],
    customDateStart: [''],
    customDateEnd: [''],
    serviceType: [''],
    service: [''],
    package: [''],
    seller: [''],
  });
  // Datos simulados para gráficas
  chartData = signal({
    sales: {
      labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
      datasets: [
        {
          label: 'Ventas 2024',
          data: [65, 59, 80, 81, 56, 55],
          fill: false,
          borderColor: '#4338ca',
        },
      ],
    },
    distribution: {
      labels: ['Tours', 'Hoteles', 'Paquetes'],
      datasets: [
        {
          data: [300, 150, 200],
          backgroundColor: ['#4338ca', '#16a34a', '#ea580c'],
        },
      ],
    },
  });

  loading = signal<boolean>(false);
  totalRecords = signal<number>(100);

  // Opciones para selects
  serviceTypeOptions = [
    { label: 'Todos', value: 'all' },
    { label: 'Tours', value: 'tours' },
    { label: 'Hoteles', value: 'hotels' },
    { label: 'Transporte', value: 'transport' },
  ];

  packageOptions = [
    { label: 'Todos', value: 'all' },
    { label: 'Paquete 1', value: '1' },
    { label: 'Paquete 2', value: '2' },
    { label: 'Paquete 3', value: '3' },
  ];

  serviceOptions = [
    { label: 'Todos', value: 'all' },
    { label: 'Tour 1', value: '1' },
    { label: 'Tour 2', value: '2' },
    { label: 'Tour 3', value: '3' },
  ];

  sellersOptions = [
    { label: 'Juan Pérez', value: '1' },
    { label: 'María García', value: '2' },
    { label: 'Pedro Lopez', value: '3' },
  ];

  dateRangeOptions = [
    { label: 'Hoy', value: 'today' },
    { label: 'Ayer', value: 'yesterday' },
    { label: 'Última semana', value: 'last-week' },
    { label: 'Último mes', value: 'last-month' },
    { label: 'Último año', value: 'last-year' },
    { label: 'Personalizado', value: 'custom' },
  ];

  getDateRangeText(): string {
    const dateRange = this.filtersForm.get('dateRange')?.value;
    const customStart = this.filtersForm.get('customDateStart')?.value;
    const customEnd = this.filtersForm.get('customDateEnd')?.value;

    switch (dateRange) {
      case 'today':
        return 'Hoy';
      case 'yesterday':
        return 'Ayer';
      case 'last-week':
        return 'Última semana';
      case 'last-month':
        return 'Último mes';
      case 'last-year':
        return 'Último año';
      case 'custom':
        if (customStart && customEnd) {
          return `Del ${new Date(
            customStart
          ).toLocaleDateString()} al ${new Date(
            customEnd
          ).toLocaleDateString()}`;
        }
        return 'Rango personalizado';
      default:
        return 'Todos los períodos';
    }
  }

  // Método para manejar el cambio de rango de fechas
  onDateRangeChange(value: string) {
    this.filtersForm.patchValue({ dateRange: value });
    if (value !== 'custom') {
      this.filtersForm.patchValue({
        customDateStart: null,
        customDateEnd: null,
      });
    }
    this.updateActiveFiltersCount();
  }

  // Método para manejar fechas personalizadas
  onCustomDateChange() {
    const start = this.filtersForm.get('customDateStart')?.value;
    const end = this.filtersForm.get('customDateEnd')?.value;

    if (start && end) {
      this.updateActiveFiltersCount();
    }
  }

  updateReport() {
    this.loading.set(true);
    // Simulamos la actualización
    setTimeout(() => {
      this.lastUpdate.set(new Date());
      this.loading.set(false);

      this._messageService.add({
        severity: 'success',
        summary: 'Reporte actualizado',
        detail: 'Los datos han sido actualizados correctamente',
      });
    }, 1500);
  }

  salesData = signal<SaleReport[]>([
    {
      id: 'VNT-001',
      saleDate: new Date(),
      client: 'Carlos Rodriguez',
      service: 'Tour Machu Picchu',
      seller: 'Juan Pérez',
      quantity: 2,
      unitPrice: 250.00,
      discount: 25.00,
      total: 475.00
    },
    {
      id: 'VNT-002',
      saleDate: new Date(),
      client: 'María López',
      service: 'Hotel Cusco Premium',
      seller: 'Ana García',
      quantity: 1,
      unitPrice: 350.00,
      discount: 0,
      total: 350.00
    }
  ]);
}
