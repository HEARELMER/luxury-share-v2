import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
export interface KpiData {
  totalSales: number;
  totalIncome: number;
  averageTickets: number;
  growthRate: number;
  topSeller: {
    name: string;
    sales: number;
  };
}
@Component({
  selector: 'app-kpi-cards',
  imports: [CommonModule, ButtonModule, TooltipModule],
  templateUrl: './kpi-cards.component.html',
  styleUrl: './kpi-cards.component.scss',
})
export class KpiCardsComponent {
  data = input.required<KpiData>();
}
