import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ChartModule } from 'primeng/chart';
import { TooltipModule } from 'primeng/tooltip';
import { TabViewModule } from 'primeng/tabview';
import { ChartLineComponent } from '../../../shared/components/charts/chart-line/chart-line.component';
@Component({
  selector: 'app-charts-panel',
  imports: [
    CommonModule,
    ChartModule,
    TabViewModule,
    ButtonModule,
    TooltipModule,
    ChartLineComponent, 
],
  templateUrl: './charts-panel.component.html',
  styleUrl: './charts-panel.component.scss',
})
export class ChartsPanelComponent {
  readonly data = input.required<any>();
}
