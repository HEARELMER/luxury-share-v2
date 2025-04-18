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
import { DatePickerComponent } from '../../../shared/components/forms/date-picker/date-picker.component';
import { ScrollTop } from 'primeng/scrolltop';
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
    DatePickerComponent,
    ScrollTop,
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
      bg: 'bg-slate-800',
      buttonBg: 'bg-slate-950',
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
