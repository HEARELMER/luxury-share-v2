import { Component, input, OnChanges, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';
import { ChartModule } from 'primeng/chart';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-chart-pie',
  imports: [CommonModule, ChartModule, ButtonModule, TooltipModule],
  templateUrl: './chart-pie.component.html',
  styleUrl: './chart-pie.component.scss',
})
export class ChartPieComponent implements OnInit, OnChanges {
  readonly title = input<string>('');
  readonly subtitle = input<string>('');
  readonly chartData = input<any>(null);

  options: any;
  data: any;

  ngOnInit() {
    this.initChart();
  }

  ngOnChanges() {
    if (this.chartData()) {
      this.updateChartWithData(this.chartData());
    }
  }

  private initChart() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color') || '#333333';
    
    // Default data
    this.data = {
      labels: ['Tours', 'Hoteles', 'Paquetes', 'Transporte', 'Guías'],
      datasets: [
        {
          data: [300, 150, 200, 120, 80],
          backgroundColor: ['#4338ca', '#16a34a', '#ea580c', '#0ea5e9', '#8b5cf6'],
          hoverBackgroundColor: ['#3730a3', '#15803d', '#c2410c', '#0284c7', '#7c3aed']
        }
      ]
    };

    if (this.chartData()) {
      this.updateChartWithData(this.chartData());
    }

    this.options = {
      cutout: '0%',
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: textColor
          }
        },
        tooltip: {
          callbacks: {
            label: (context: any) => {
              const label = context.label || '';
              const value = context.raw || 0;
              const total = context.chart.data.datasets[0].data.reduce((a: number, b: number) => a + b, 0);
              const percentage = Math.round((value / total) * 100);
              return `${label}: S/. ${value} (${percentage}%)`;
            }
          }
        }
      }
    };
  }

  private updateChartWithData(chartData: any) {
    if (chartData) {
      this.data = chartData;
    }
  }
}