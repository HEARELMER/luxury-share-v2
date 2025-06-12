import { Component, inject, signal } from '@angular/core';
import { DashboardService } from '../../../core/services/dashboard-services/dashbaord.service';
import { ChartBarComponent } from '../../../shared/components/charts/chart-bar/chart-bar.component';
import { ChartLineComponent } from '../../../shared/components/charts/chart-line/chart-line.component';
import { CardHomeComponent } from '../../../shared/components/ui/card-home/card-home.component';
import { DragDropService } from '../../../core/ui-services/drapg-drop.service';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDragPreview,
  CdkDropList,
} from '@angular/cdk/drag-drop';
import { DatePickerModule } from 'primeng/datepicker';
import { ReportsService } from '../../../core/services/reports-services/reports.service';
import { toSignal } from '@angular/core/rxjs-interop';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CardHomeComponent,
    ChartLineComponent,
    ChartBarComponent,
    CdkDrag,
    CdkDragPreview,
    CdkDropList,
    DatePickerModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  private readonly dashboardService = inject(DashboardService);
  private readonly dragDropService = inject(DragDropService);
  private readonly reportsService = inject(ReportsService);
  countsData = toSignal(this.reportsService.loadDashboardData());
  constructor() {
    const savedCards =
      this.dragDropService.loadOrderFromLocalStorage('dashboard-cards');
    if (savedCards) {
      this.cards.set(savedCards);
    }
  }
  countPackages = 0;
  countServices = 0;
  totalAdmins = 0;
  totalGerents = 0;
  totalSellers = 0;
  totalUsers = 0;
  salesData = [];
  totalSales = 0;

  topServices: any[] = [];
  topPackages: any[] = [];
  totalSalesByBranch: any[] = [];

  ngOnInit(): void {}

  dateRange: Date[] = [];

  setDateRange(period: 'week' | 'month') {
    const today = new Date();
    const start = new Date();

    if (period === 'week') {
      start.setDate(today.getDate() - 7);
    } else {
      start.setMonth(today.getMonth() - 1);
    }

    this.dateRange = [start, today];
  }

  getSelectedDateRange(): string {
    if (!this.dateRange?.length) return '';

    const formatDate = (date: Date) => {
      return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'short',
      });
    };

    if (this.dateRange.length === 2) {
      return `${formatDate(this.dateRange[0])} - ${formatDate(
        this.dateRange[1]
      )}`;
    }

    return '';
  }

  onDrop(event: CdkDragDrop<any[]>) {
    const currentCards = [...this.cards()];
    const newOrder = this.dragDropService.updateOrder(
      currentCards,
      event.previousIndex,
      event.currentIndex
    );
    this.cards.set(newOrder);
    // Guardar el nuevo orden en localStorage
    this.dragDropService.saveOrderToLocalStorage('dashboard-cards', newOrder);
  }

  // simalciones
  comparativaVentas = {
    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
    datasets: [
      {
        label: '2023',
        data: [6500, 5900, 8000, 8100, 7200, 7500],
        backgroundColor: ['#4361EE'],
        borderRadius: 6,
        barPercentage: 0.5,
      },
      {
        label: '2024',
        data: [7200, 6800, 9100, 9500, 8300, 8800],
        backgroundColor: ['#F72585'],
        borderRadius: 6,
        barPercentage: 0.5,
      },
    ],
  };
  // Para Top Paquetes
  topPaquetesChartData = [
    {
      label: 'Paquete A',
      quantity: 1500,
      color: '#3A0CA3',
    },
    {
      label: 'Paquete B',
      quantity: 1200,
      color: '#7209B7',
    },
    {
      label: 'Paquete C',
      quantity: 900,
      color: '#F72585',
    },
    {
      label: 'Paquete D',
      quantity: 700,
      color: '#560BAD',
    },
    {
      label: 'Paquete E',
      quantity: 600,
      color: '#4361EE',
    },
  ];

  // Para Top Servicios
  topServiciosChartData = [
    {
      label: 'Servicioaffffffffffffffffff A',
      quantity: 1200,
      color: '#3A0CA3',
    },
    {
      label: 'Servicio B',
      quantity: 950,
      color: '#7209B7',
    },
    {
      label: 'Servicio C',
      quantity: 800,
      color: '#F72585',
    },
    {
      label: 'Servicio D',
      quantity: 600,
      color: '#560BAD',
    },
    {
      label: 'Servicio E',
      quantity: 500,
      color: '#4361EE',
    },
  ];
  ventasPorSucursal = [
    { label: 'Miraflores', quantity: 15200, color: '#4361EE' },
    { label: 'San Isidro', quantity: 12800, color: '#3A0CA3' },
    { label: 'La Molina', quantity: 9500, color: '#7209B7' },
    { label: 'San Borja', quantity: 8700, color: '#F72585' },
    { label: 'Surco', quantity: 7600, color: '#560BAD' },
  ];
  cards = signal<any[]>([
    {
      id: 'sellers',
      title: 'Vendedores',
      number: 0,
      bg: 'bg-purple-400',
      buttonBg: 'bg-purple-500',
      routerLink: 'sellers',
    },
    {
      id: 'admins',
      title: 'Administradores',
      number: 0,
      bg: 'bg-green-400',
      buttonBg: 'bg-green-500',
      routerLink: 'admins',
    },
    {
      id: 'services',
      title: 'Total de Servicios',
      number: 0,
      bg: 'bg-orange-400',
      buttonBg: 'bg-orange-500',
      routerLink: 'services_packages',
    },
    {
      id: 'branches',
      title: 'Sucursales',
      number: 0,
      bg: 'bg-blue-400',
      buttonBg: 'bg-blue-500',
      routerLink: 'branches',
    },
    {
      id: 'packages',
      title: 'Total de Paquetes',
      number: 0,
      color: 'text-orange-700',
      bg: 'bg-red-400',
      routerLink: 'services_packages',
      buttonBg: 'bg-red-500',
    },
  ]);
}
