import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
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
  ],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.scss',
})
export class ReportsComponent {
  private readonly _fb = inject(FormBuilder);

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

  // Formulario de filtros
  filtersForm = this._fb.group({
    dateRange: [''],
    serviceType: [''],
    seller: [''],
    branch: [''],
    clientType: [''],
    customDateStart: [''],
    customDateEnd: [''],
  });

  // Datos simulados para la tabla
  salesData = signal<SaleReport[]>([
    {
      id: 'VNT-001',
      saleDate: new Date(),
      client: 'Carlos Rodriguez',
      service: 'Tour Machu Picchu',
      seller: 'Juan Pérez',
      quantity: 2,
      unitPrice: 250.0,
      discount: 25.0,
      total: 475.0,
    },
    // ... más datos simulados
  ]);
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

  // Estado y filtros existentes
  activeTab = signal<'sales' | 'performance' | 'clients'>('sales');
  loading = signal<boolean>(false);
  totalRecords = signal<number>(100);

  // Opciones para selects
  serviceTypeOptions = [
    { label: 'Todos', value: 'all' },
    { label: 'Tours', value: 'tours' },
    { label: 'Hoteles', value: 'hotels' },
    { label: 'Paquetes', value: 'packages' },
  ];

  sellersOptions = [
    { label: 'Juan Pérez', value: '1' },
    { label: 'María García', value: '2' },
    { label: 'Pedro Lopez', value: '3' },
  ];

  dateRangeOptions = [
    { label: 'Hoy', value: 'today' },
    { label: 'Esta semana', value: 'week' },
    { label: 'Este mes', value: 'month' },
    { label: 'Este año', value: 'year' },
    { label: 'Personalizado', value: 'custom' },
  ];
}
