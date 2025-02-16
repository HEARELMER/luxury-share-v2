import { Component } from '@angular/core';
import { DashboardService } from '../../../core/services/dashbaord.service';
import { ChartBarComponent } from '../../../shared/components/charts/chart-bar/chart-bar.component';
import { ChartLineComponent } from '../../../shared/components/charts/chart-line/chart-line.component';
import { ButtonComponent } from '../../../shared/components/ui/button/button.component';
import { CardHomeComponent } from '../../../shared/components/ui/card-home/card-home.component';
 
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CardHomeComponent, 
    ChartLineComponent,
    ChartBarComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
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
  constructor(private dashboardService: DashboardService) {}
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
      this.topServices = data.data.topSellingServices.map((item:any, index:any) => {
        return {
          label: item.servicename,
          color: this.COLORS[index],
          quantity: item.soldquantity,
        };
      });
      this.topPackages = data.data.topSellingPackages.map((item:any, index:any) => {
        return {
          label: item.packagename,
          color: this.COLORS[index],
          quantity: item.soldquantity,
        };
      });
      this.totalSalesByBranch = data.data.totalSalesByBranch.map(
        (item:any, index:any) => {
          return {
            label: item.address,
            color: this.COLORS[index],
            quantity: item.totalsales,
          };
        }
      );
    });
  }
}
