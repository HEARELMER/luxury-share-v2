import { Component, inject, input, signal } from '@angular/core';
import { DashboardService } from '../../../core/services/dashboard-services/dashbaord.service';
import { ChartBarComponent } from '../../../shared/components/charts/chart-bar/chart-bar.component';
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
  totalSales = 0;

  ngOnInit(): void {
    this.loadDataDashboard();
  }
  dateRange: Date[] = [];
  comparativeSalesChartData = signal<any>(null);
  topPackagesChartData = signal<any[]>([]);
  topServicesChartData = signal<any[]>([]);
  salesByBranchChartData = signal<any[]>([]);
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
  loadDataDashboard() {
    this.dashboardService.getDashboardData().subscribe((data: any) => {
      console.log('Dashboard data:', data);
      this.comparativeSalesChartData.set(data.charts.comparativeSales || null);
      this.topPackagesChartData.set(data.charts.topPackagesChartData || []);
      this.topServicesChartData.set(data.charts.topServicesChartData || []);
      this.salesByBranchChartData.set(data.charts.salesBySucursal || []);
    });
  }

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

  // Array de actividades recientes
  readonly recentActivities = input<any[]>([
    {
      id: 1,
      type: 'sale',
      title: 'Nuevo tour vendido',
      subtitle: 'Paquete Ayacucho Cultural',
      time: 'Hace 10 min',
      icon: 'pi pi-globe',
      iconColor: 'text-green-500',
      bgColor: 'bg-green-50 dark:bg-green-900',
      image:
        'https://explorandomaravillas.com/wp-content/uploads/mirador-acuchimay-ayacucho.jpg',
      productName: 'Tour Ayacucho Histórico 3D/2N',
      amount: '899.00',
    },
    {
      id: 2,
      type: 'user',
      title: 'Nuevos turistas registrados',
      subtitle: 'Grupo de Lima',
      time: 'Hace 45 min',
      icon: 'pi pi-users',
      iconColor: 'text-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-900',
      userImages: [
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlciUyMHByb2ZpbGV8ZW58MHx8MHx8fDA%3D',
        'https://cdn.vectorstock.com/i/1000v/51/87/student-avatar-user-profile-icon-vector-47025187.jpg',
        'https://cdn.vectorstock.com/i/1000v/51/87/student-avatar-user-profile-icon-vector-47025187.jpg',
      ],
      message: '5 nuevos turistas reservaron el tour Semana Santa Ayacucho',
    },
    {
      id: 3,
      type: 'alert',
      title: 'Cupos limitados',
      subtitle: 'Alerta de disponibilidad',
      time: 'Hace 2 horas',
      icon: 'pi pi-exclamation-triangle',
      iconColor: 'text-yellow-500',
      bgColor: 'bg-yellow-50 dark:bg-yellow-900',
      alertBg: 'bg-yellow-50 dark:bg-yellow-900/50',
      alertColor: 'text-yellow-700 dark:text-yellow-300',
      message:
        'Solo quedan 4 cupos para "Ruta Artesanal de Retablos" del 20/06',
    },
    {
      id: 4,
      type: 'stat',
      title: 'Resumen semanal',
      subtitle: 'Estadísticas de destinos',
      time: 'Hace 3 horas',
      icon: 'pi pi-chart-bar',
      iconColor: 'text-purple-500',
      bgColor: 'bg-purple-50 dark:bg-purple-900',
      stats: [
        {
          label: 'Tours',
          value: '14',
          color: 'text-blue-600 dark:text-blue-400',
        },
        {
          label: 'Ingresos',
          value: 'S/ 19,750',
          color: 'text-green-600 dark:text-green-400',
        },
        {
          label: 'Turistas',
          value: '36',
          color: 'text-indigo-600 dark:text-indigo-400',
        },
        {
          label: 'Destinos',
          value: '5',
          color: 'text-purple-600 dark:text-purple-400',
        },
      ],
    },
    {
      id: 6,
      type: 'alert',
      title: 'Festival próximo',
      subtitle: 'Alerta de eventos',
      time: 'Hace 5 horas',
      icon: 'pi pi-calendar',
      iconColor: 'text-red-500',
      bgColor: 'bg-red-50 dark:bg-red-900',
      alertBg: 'bg-red-50 dark:bg-red-900/50',
      alertColor: 'text-red-700 dark:text-red-300',
      message:
        'Festival de danzas típicas en Quinua el 25/06 - Tours especiales disponibles',
    },
  ]);
}
