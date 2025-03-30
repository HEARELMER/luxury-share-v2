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
    // Datos adicionales para los nuevos KPIs
    conversionRate: 68.2, // Tasa de conversión
    customerRetention: 73.5, // Retención de clientes
    averageValue: 1950.45, // Valor promedio de venta
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

  // Datos simulados para los gráficos
  chartData = signal({
    sales: {
      labels: [
        'Ene',
        'Feb',
        'Mar',
        'Abr',
        'May',
        'Jun',
        'Jul',
        'Ago',
        'Sep',
        'Oct',
        'Nov',
        'Dic',
      ],
      datasets: [
        {
          label: 'Ventas 2023',
          data: [65, 59, 80, 81, 56, 55, 40, 38, 45, 60, 70, 75],
          fill: false,
          tension: 0.4,
          borderColor: '#4338ca',
        },
        {
          label: 'Ventas 2024',
          data: [70, 65, 85, 89, 60, 60, 45, 42, 50, 65, 75, 80],
          fill: false,
          tension: 0.4,
          borderColor: '#16a34a',
        },
      ],
    },

    profitMargin: {
      labels: [
        'Ene',
        'Feb',
        'Mar',
        'Abr',
        'May',
        'Jun',
        'Jul',
        'Ago',
        'Sep',
        'Oct',
        'Nov',
        'Dic',
      ],
      datasets: [
        {
          label: 'Margen (%)',
          data: [25, 27, 30, 32, 28, 29, 31, 33, 35, 36, 34, 38],
          fill: false,
          borderColor: '#16a34a',
        },
      ],
    },

    yearComparison: {
      labels: ['Q1', 'Q2', 'Q3', 'Q4'],
      datasets: [
        {
          label: '2023',
          data: [540, 620, 710, 790],
          backgroundColor: '#94a3b8',
        },
        {
          label: '2024',
          data: [650, 750, 830, 920],
          backgroundColor: '#4338ca',
        },
      ],
    },

    topSellers: {
      labels: [
        'Juan Pérez',
        'María García',
        'Carlos López',
        'Ana Silva',
        'Jorge Rodriguez',
      ],
      datasets: [
        {
          label: 'Ventas (S/.)',
          data: [45000, 38000, 32000, 28000, 21000],
          backgroundColor: '#4338ca',
        },
      ],
    },

    distribution: {
      labels: ['Tours', 'Hoteles', 'Paquetes', 'Transporte', 'Guías'],
      datasets: [
        {
          data: [300, 150, 200, 120, 80],
          backgroundColor: [
            '#4338ca',
            '#16a34a',
            '#ea580c',
            '#0ea5e9',
            '#8b5cf6',
          ],
        },
      ],
    },

    regionSales: {
      labels: ['Cusco', 'Lima', 'Arequipa', 'Puno', 'Otros'],
      datasets: [
        {
          data: [450, 230, 180, 120, 215],
          backgroundColor: [
            '#4338ca',
            '#16a34a',
            '#ea580c',
            '#0ea5e9',
            '#8b5cf6',
          ],
        },
      ],
    },

    branchPerformance: {
      labels: [
        'Ventas',
        'Atención',
        'Satisfacción',
        'Tiempo de respuesta',
        'Calidad',
      ],
      datasets: [
        {
          label: 'Sucursal Cusco',
          backgroundColor: 'rgba(67, 56, 202, 0.2)',
          borderColor: '#4338ca',
          pointBackgroundColor: '#4338ca',
          pointBorderColor: '#fff',
          data: [85, 90, 88, 76, 92],
        },
        {
          label: 'Sucursal Lima',
          backgroundColor: 'rgba(22, 163, 74, 0.2)',
          borderColor: '#16a34a',
          pointBackgroundColor: '#16a34a',
          pointBorderColor: '#fff',
          data: [78, 85, 91, 88, 85],
        },
      ],
    },

    monthlyGrowth: {
      labels: [
        'Ene',
        'Feb',
        'Mar',
        'Abr',
        'May',
        'Jun',
        'Jul',
        'Ago',
        'Sep',
        'Oct',
      ],
      datasets: [
        {
          label: 'Crecimiento (%)',
          data: [5.2, 3.8, 7.1, -2.3, 4.5, 6.2, 1.8, 3.5, 8.2, 4.7],
          backgroundColor: (context: any) => {
            const value = context.dataset.data[context.dataIndex];
            return value >= 0 ? '#16a34a' : '#ef4444';
          },
        },
      ],
    },
  });
}
