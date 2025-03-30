import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ChartModule } from 'primeng/chart';
import { TooltipModule } from 'primeng/tooltip';
import { TabViewModule } from 'primeng/tabview';
import { ChartLineComponent } from '../charts/chart-line/chart-line.component';
import { ChartBarComponent } from '../charts/chart-bar/chart-bar.component';
import { ChartHorizontalBarComponent } from '../charts/chart-horizontal-bar/chart-horizontal-bar.component';
import { ChartPieComponent } from '../charts/chart-pie/chart-pie.component';
import { ChartDounghnutComponent } from '../charts/chart-dounghnut/chart-dounghnut.component';
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
    ChartPieComponent,
    ChartHorizontalBarComponent,
    ChartDounghnutComponent,
  ],
  templateUrl: './charts-panel.component.html',
  styleUrl: './charts-panel.component.scss',
})
export class ChartsPanelComponent {
  readonly data = input.required<any>();
}
