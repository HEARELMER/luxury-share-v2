import { Component, input, OnChanges, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartModule } from 'primeng/chart';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
@Component({
  selector: 'app-chart-line',
  imports: [CommonModule, ChartModule, ButtonModule, TooltipModule],
  templateUrl: './chart-line.component.html',
  styleUrl: './chart-line.component.scss'
})
export class ChartLineComponent implements OnInit, OnChanges {
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
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary') || '#6c757d';
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border') || '#e5e7eb';

    // Default data
    this.data = {
      labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
      datasets: [
        {
          label: 'Ventas 2023',
          data: [65, 59, 80, 81, 56, 55, 40, 38, 45, 60, 70, 75],
          fill: false,
          tension: 0.4,
          borderColor: '#4338ca',
        },
        {
          label: 'Ventas 2024',
          data: [70, 65, 85, 89, 60, 60, 45, 42, 50, 65, 75, 80],
          fill: false,
          tension: 0.4,
          borderColor: '#16a34a',
        }
      ],
    };

    if (this.chartData()) {
      this.updateChartWithData(this.chartData());
    }

    this.options = {
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: textColor,
          },
        },
        tooltip: {
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          titleColor: textColor,
          bodyColor: textColorSecondary,
          borderColor: surfaceBorder,
          borderWidth: 1
        }
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            display: false,
          },
        },
        y: {
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: 'rgba(0, 0, 0, 0.1)',
          },
        },
      },
    };
  }

  private updateChartWithData(chartData: any) {
    if (chartData) {
      this.data = chartData;
    }
  }
}