import { Component, inject, signal } from '@angular/core';
import { DashboardService } from '../../../core/services/dashbaord.service';
import { ChartBarComponent } from '../../../shared/components/charts/chart-bar/chart-bar.component';
import { ChartLineComponent } from '../../../shared/components/charts/chart-line/chart-line.component';
import { ButtonComponent } from '../../../shared/components/ui/button/button.component';
import { CardHomeComponent } from '../../../shared/components/ui/card-home/card-home.component';
import { DragDropService } from '../../../core/ui-services/drapg-drop.service';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDragHandle,
  CdkDragPlaceholder,
  CdkDragPreview,
  CdkDropList,
  DragDropModule,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
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
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  private readonly dashboardService = inject(DashboardService);
  private readonly dragDropService = inject(DragDropService);
  countPackages = 0;
  countServices = 0;
  totalAdmins = 0;
  totalGerents = 0;
  totalSellers = 0;
  totalUsers = 0;
  salesData = [];
  totalSales = 0;
  COLORS = [
    '#FABE7A',
    '#F6866A',
    '#59E6F6',
    '#7661E2',
    '#FABE7A',
    '#F6866A',
    '#59E6F6',
    '#7661E2',
  ];
  topServices: any[] = [];
  topPackages: any[] = [];
  totalSalesByBranch: any[] = [];

  ngOnInit(): void {
    this.getData();
  }

  getData() {
    this.dashboardService.getDashboardData().subscribe((data) => {
      console.log(data);
      this.countPackages = data.data.countPackages;
      this.countServices = data.data.countServices;
      this.totalAdmins = data.usersData.totalAdmins;
      this.totalGerents = data.usersData.totalGerents;
      this.totalSellers = data.usersData.totalSellers;
      this.totalSales = data.data.totalSales;
      this.topServices = data.data.topSellingServices.map(
        (item: any, index: any) => {
          return {
            label: item.servicename,
            color: this.COLORS[index],
            quantity: item.soldquantity,
          };
        }
      );
      this.topPackages = data.data.topSellingPackages.map(
        (item: any, index: any) => {
          return {
            label: item.packagename,
            color: this.COLORS[index],
            quantity: item.soldquantity,
          };
        }
      );
      this.totalSalesByBranch = data.data.totalSalesByBranch.map(
        (item: any, index: any) => {
          return {
            label: item.address,
            color: this.COLORS[index],
            quantity: item.totalsales,
          };
        }
      );
    });
  }

  onDrop(event: any) {
    const currentCards = [...this.cards()];
    moveItemInArray(currentCards, event.previousIndex, event.currentIndex);
    this.cards.set(currentCards);
    this.dragDropService.saveOrderToLocalStorage(
      'dashboard-cards',
      currentCards
    );
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
      id: 'sales',
      title: 'Ventas',
      number: 0,
      bg: 'bg-fuchsia-500',
      buttonBg: 'bg-fuchsia-600',
      routerLink: 'sales',
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
      id: 'packages',
      title: 'Total de Paquetes',
      number: 0,
      color: 'text-orange-700',
      bg: 'bg-red-400',
      routerLink: 'services_packages',
    },
  ]);
}
