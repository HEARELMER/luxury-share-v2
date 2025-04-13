import { Component, inject, signal } from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { SelectComponent } from '../../../shared/components/forms/select/select.component';

import { ChartsPanelComponent } from '../charts-panel/charts-panel.component';
import { KpiCardsComponent, KpiData } from '../kpi-cards/kpi-cards.component';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { DatePickerModule } from 'primeng/datepicker';
import { MenuItem, MessageService } from 'primeng/api';
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
import { ScheduleReportDialogComponent } from '../schedule-report-dialog/schedule-report-dialog.component';
import {
  Goal,
  GoalsPanelComponent,
} from '../goals-panel/goals-panel.component';
@Component({
  selector: 'app-reports',
  imports: [
    ButtonModule,
    ReactiveFormsModule,
    FormsModule,
    SelectComponent,
    KpiCardsComponent,
    ChartsPanelComponent,
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
    ScheduleReportDialogComponent,
    GoalsPanelComponent,
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
  // Opciones para el menú de exportación
  exportOptions: MenuItem[] = [
    {
      label: 'Excel (.xlsx)',
      icon: 'pi pi-file-excel',
      command: () => this.onExport('excel'),
    },
    {
      label: 'CSV',
      icon: 'pi pi-file',
      command: () => this.onExport('csv'),
    },
    {
      label: 'PDF',
      icon: 'pi pi-file-pdf',
      command: () => this.onExport('pdf'),
    },
  ];
  updateActiveFiltersCount() {
    const values = this.filtersForm.value;
    const count = Object.values(values).filter((v) => v && v !== 'all').length;
    this.activeFiltersCount.set(count);
  }
  // Mostrar/ocultar datos detallados
  showDetailedData = signal<boolean>(false);

  // Datos simulados para tabla detallada
  detailedData = signal<any[]>([
    {
      date: new Date(2024, 2, 15),
      seller: 'Juan Pérez',
      type: 'Tour',
      service: 'Valle Sagrado',
      customer: 'Carlos Martínez',
      amount: 450,
      status: 'Completado',
    },
    {
      date: new Date(2024, 2, 14),
      seller: 'María García',
      type: 'Hotel',
      service: 'Marriott',
      customer: 'Ana López',
      amount: 320,
      status: 'Completado',
    },
    {
      date: new Date(2024, 2, 12),
      seller: 'Carlos López',
      type: 'Paquete',
      service: 'Cusco Completo',
      customer: 'Jorge González',
      amount: 1200,
      status: 'Completado',
    },
    {
      date: new Date(2024, 2, 10),
      seller: 'Ana Silva',
      type: 'Transporte',
      service: 'Transfer Aeropuerto',
      customer: 'Laura Ramírez',
      amount: 45,
      status: 'Completado',
    },
    {
      date: new Date(2024, 2, 9),
      seller: 'Juan Pérez',
      type: 'Tour',
      service: 'Machu Picchu',
      customer: 'Roberto Díaz',
      amount: 580,
      status: 'Completado',
    },
    {
      date: new Date(2024, 2, 8),
      seller: 'María García',
      type: 'Hotel',
      service: 'Casa Andina',
      customer: 'Elena Castro',
      amount: 290,
      status: 'Cancelado',
    },
    {
      date: new Date(2024, 2, 7),
      seller: 'Carlos López',
      type: 'Paquete',
      service: 'Puno y Lago Titicaca',
      customer: 'Javier Herrera',
      amount: 870,
      status: 'Completado',
    },
    {
      date: new Date(2024, 2, 5),
      seller: 'Jorge Rodriguez',
      type: 'Tour',
      service: 'City Tour Cusco',
      customer: 'Patricia Vargas',
      amount: 120,
      status: 'Completado',
    },
    {
      date: new Date(2024, 2, 4),
      seller: 'Ana Silva',
      type: 'Transporte',
      service: 'Bus Turístico',
      customer: 'Miguel Soto',
      amount: 65,
      status: 'Cancelado',
    },
    {
      date: new Date(2024, 2, 3),
      seller: 'Juan Pérez',
      type: 'Tour',
      service: 'Montaña 7 Colores',
      customer: 'Claudia Torres',
      amount: 320,
      status: 'Completado',
    },
  ]);

  // Método para obtener la severidad de las etiquetas (tags)
  getSeverity(status: string): string {
    switch (status) {
      case 'Completado':
        return 'success';
      case 'Pendiente':
        return 'warning';
      case 'Cancelado':
        return 'danger';
      default:
        return 'info';
    }
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
  // Reportes guardados
  savedReports = signal<any[]>([
    {
      name: 'Reporte mensual de ventas',
      id: 1,
      config: { dateRange: 'last-month', serviceType: 'all' },
    },
    {
      name: 'Ventas tours último trimestre',
      id: 2,
      config: { dateRange: 'custom', serviceType: 'tours' },
    },
    {
      name: 'Rendimiento por vendedor 2024',
      id: 3,
      config: { dateRange: 'last-year', seller: '1' },
    },
  ]);

  // Método para guardar el reporte actual
  saveCurrentReport() {
    // Mostrar diálogo para guardar
    this.showSaveReportDialog.set(true);
  }

  // Control de diálogo de programación
  showScheduleDialog = signal<boolean>(false);

  // Opciones para frecuencia
  scheduleFrequencies = [
    { label: 'Diario', value: 'daily' },
    { label: 'Semanal', value: 'weekly' },
    { label: 'Mensual', value: 'monthly' },
    { label: 'Trimestral', value: 'quarterly' },
  ];

  // Opciones para formatos de exportación
  exportFormats = [
    { label: 'Excel', value: 'excel' },
    { label: 'PDF', value: 'pdf' },
    { label: 'CSV', value: 'csv' },
  ];

  // Método para programar un reporte
  scheduleReport() {
    // Implementación simulada
    this._messageService.add({
      severity: 'info',
      summary: 'Reporte programado',
      detail: 'El reporte ha sido programado correctamente',
    });
    this.showScheduleDialog.set(false);
  }

  // Propiedad para controlar diálogo de guardar reporte
  showSaveReportDialog = signal<boolean>(false);
  newReportName = signal<string>('');

  // Método para guardar realmente el reporte
  confirmSaveReport() {
    if (this.newReportName()) {
      const newReport = {
        name: this.newReportName(),
        id: this.savedReports().length + 1,
        config: { ...this.filtersForm.value },
      };

      // Añadir al listado
      this.savedReports.update((reports) => [...reports, newReport]);

      // Mostrar mensaje de éxito
      this._messageService.add({
        severity: 'success',
        summary: 'Reporte guardado',
        detail: `El reporte "${this.newReportName()}" ha sido guardado`,
      });

      // Cerrar diálogo y limpiar
      this.showSaveReportDialog.set(false);
      this.newReportName.set('');
    }
  }

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

  // Añade estas propiedades
  selectedRecipients: string[] = ['carlos.lopez@empresa.com'];

  // Usuarios sugeridos para enviar reportes
  suggestedUsers = [
    {
      name: 'María García',
      email: 'maria.garcia@empresa.com',
      avatar: 'https://randomuser.me/api/portraits/women/12.jpg',
    },
    {
      name: 'Juan Pérez',
      email: 'juan.perez@empresa.com',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    },
    {
      name: 'Ana Silva',
      email: 'ana.silva@empresa.com',
      avatar: 'https://randomuser.me/api/portraits/women/65.jpg',
    },
    {
      name: 'Roberto Torres',
      email: 'roberto.torres@empresa.com',
      avatar: 'https://randomuser.me/api/portraits/men/41.jpg',
    },
    {
      name: 'Elena Salazar',
      email: 'elena.salazar@empresa.com',
      avatar: 'https://randomuser.me/api/portraits/women/33.jpg',
    },
  ];

  // Método para añadir un destinatario desde las sugerencias
  addRecipient(email: string): void {
    if (!this.selectedRecipients.includes(email)) {
      this.selectedRecipients.push(email);
    }
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
  goalsData = signal<Goal[]>([
    {
      id: 1,
      title: 'Ventas mensuales',
      icon: 'pi-dollar',
      target: 150000,
      current: 117000,
      percentage: 78,
      formatTarget: 'S/. 150,000',
      formatCurrent: 'S/. 117,000',
    },
    {
      id: 2,
      title: 'Nuevos clientes',
      icon: 'pi-users',
      target: 50,
      current: 31,
      percentage: 62,
      formatTarget: '50',
      formatCurrent: '31',
    },
    {
      id: 3,
      title: 'Retención',
      icon: 'pi-heart-fill',
      target: 80,
      current: 73.5,
      percentage: 92,
      formatTarget: '80%',
      formatCurrent: '73.5%',
    },
  ]);

  // En el componente
  compareOptions = [
    { label: 'Sin comparación', value: 'none' },
    { label: 'Mismo período año anterior', value: 'last-year' },
    { label: 'Período anterior', value: 'previous-period' },
    { label: 'Promedio histórico', value: 'historical-avg' },
  ];
}
