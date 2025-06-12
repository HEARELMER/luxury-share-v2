import {
  Component,
  ElementRef,
  input,
  OnChanges,
  OnInit,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartModule, UIChart } from 'primeng/chart';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    fill: boolean;
    tension: number;
    borderColor: string;
  }[];
}

@Component({
  selector: 'app-chart-line',
  imports: [CommonModule, ChartModule, ButtonModule, TooltipModule],
  templateUrl: './chart-line.component.html',
  styleUrl: './chart-line.component.scss',
})
export class ChartLineComponent implements OnInit, OnChanges {
  readonly title = input<string>('');
  readonly subtitle = input<string>('');
  readonly chartData = input<ChartData>({} as ChartData); 
  @ViewChild('chart') chartRef!: UIChart;
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
    const textColor =
      documentStyle.getPropertyValue('--text-color') || '#333333';
    const textColorSecondary =
      documentStyle.getPropertyValue('--text-color-secondary') || '#6c757d';
    const surfaceBorder =
      documentStyle.getPropertyValue('--surface-border') || '#e5e7eb';

    this.data = {
      labels: this.chartData().labels,
      datasets: this.chartData().datasets,
    };

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
          borderWidth: 1,
        },
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

  downloadChart(format: 'png' | 'jpg' = 'png'): void {
    if (!this.chartRef || !this.chartRef.chart) {
      return;
    }

    const canvas = this.chartRef.chart.canvas;
    if (!canvas) {
      return;
    }

    const imageType = format === 'png' ? 'image/png' : 'image/jpeg';
    const imageQuality = format === 'png' ? 1 : 0.95;

    try {
      const imageUrl = canvas.toDataURL(imageType, imageQuality);

      const link = document.createElement('a');
      const chartTitle = this.title() || 'grafico';
      const fileName = `${chartTitle
        .toLowerCase()
        .replace(/\s+/g, '-')}.${format}`;

      link.download = fileName;
      link.href = imageUrl;
      link.click();
    } catch (error) {
      console.error('Error al generar la imagen:', error);
    }
  }
}
