import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ChartModule } from 'primeng/chart';
import { TooltipModule } from 'primeng/tooltip';
import { TabViewModule } from 'primeng/tabview';
import { ChartLineComponent } from '../../../shared/components/charts/chart-line/chart-line.component';
import { ChartBarComponent } from '../../../shared/components/charts/chart-bar/chart-bar.component';
@Component({
  selector: 'app-charts-panel',
  imports: [
    CommonModule,
    ChartModule,
    TabViewModule,
    ButtonModule,
    TooltipModule,
    ChartLineComponent,
    ChartBarComponent,
  ],
  templateUrl: './charts-panel.component.html',
  styleUrl: './charts-panel.component.scss',
})
export class ChartsPanelComponent {
  data = input.required<{
    sales: any;
    distribution: any;
  }>();
}
