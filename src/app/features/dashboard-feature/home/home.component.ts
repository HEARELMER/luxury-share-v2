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

  constructor() {
    const savedCards =
      this.dragDropService.loadOrderFromLocalStorage('dashboard-cards');
    if (savedCards) {
      this.cards.set(savedCards);
    }
  }

  ngOnInit(): void {
    this.loadDataDashboard();
  }
  dateRange: Date[] = [];
  summary = signal<any>({});
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
      this.comparativeSalesChartData.set(data.charts.comparativeSales || null);
      this.topPackagesChartData.set(data.charts.topPackagesChartData || []);
      this.topServicesChartData.set(data.charts.topServicesChartData || []);
      this.salesByBranchChartData.set(data.charts.salesBySucursal || []);
      this.summary.set(data.summary || {});
      this.updateCardNumbers();
    });
  }

  updateCardNumbers(): void {
    this.cards.update((cards) =>
      cards.map((card) => {
        switch (card.id) {
          case 'branches':
            card.number = this.summary()?.totalBranches || 0;
            break;
          case 'admins':
            card.number = this.summary()?.users?.admins || 0;
            break;
          case 'sellers':
            card.number = this.summary()?.users?.sellers || 0;
            break;
          case 'services':
            card.number = this.summary()?.services || 0;
            break;
          case 'packages':
            card.number = this.summary()?.packages || 0;
            break;
        }
        return card;
      })
    );
  }

  cards = signal<any[]>([
    {
      id: 'sellers',
      title: 'Vendedores',
      number: 0,
      bg: 'bg-purple-400',
      buttonBg: 'bg-purple-500',
      routerLink: 'users',
    },
    {
      id: 'admins',
      title: 'Administradores',
      number: 0,
      bg: 'bg-green-400',
      buttonBg: 'bg-green-500',
      routerLink: 'users',
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
      color: 'text-orange-700',
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
