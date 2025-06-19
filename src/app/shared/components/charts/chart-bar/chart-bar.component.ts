import { NgStyle } from '@angular/common';
import {
  Component,
  Input,
  input,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { ChartModule, UIChart } from 'primeng/chart'; 
import {
  ChartBarData,
  ChartBarItem,
} from '../../../interfaces/ui/chart-bar.interface';

@Component({
  selector: 'app-chart-bar',
  standalone: true,
  imports: [ChartModule ],
  templateUrl: './chart-bar.component.html',
  styleUrl: './chart-bar.component.scss',
})
export class ChartBarComponent {
  @ViewChild('chart') chartRef!: UIChart;

  data: any;
  options: any;
  private _orientation: 'x' | 'y' = 'x';

  // Inputs para configuración básica
  readonly title = input<string>('');
  readonly subtitle = input<string>('');
  readonly icon = input<string>('');
  readonly iconBg = input<string>('');

  readonly chartData = input<ChartBarData | null>(null); // Opción 2: Datos estructurados (similar a ChartLine)
  readonly chartItems = input<ChartBarItem[]>([]);

  @Input() set orientation(value: string) {
    this._orientation = value?.toLowerCase() === 'y' ? 'y' : 'x';
    if (this.data) {
      this.updateChartOptions();
    }
  }

  get orientation(): 'x' | 'y' {
    return this._orientation;
  }

  ngOnInit() {
    this.initChart();
  }

  ngOnChanges(changes: SimpleChanges) {
    // Actualizar cuando cambie cualquiera de las dos fuentes de datos
    if (
      (changes['chartData'] || changes['chartItems']) &&
      (this.chartData() || this.chartItems().length > 0)
    ) {
      this.updateChartData();
    }
  }

  private initChart() {
    this.updateChartData();
    this.updateChartOptions();
  }

  private updateChartData() {
    // Dar prioridad a chartData si está disponible
    if (this.chartData()) {
      this.data = this.chartData();
    } else if (this.chartItems() && this.chartItems().length > 0) {
      const items = this.chartItems();
      this.data = {
        labels: items.map((item) => item.label),
        datasets: [
          {
            label: this.title() || 'Datos',
            data: items.map((item) => item.quantity),
            backgroundColor: items.map((item) => item.color),
            borderRadius: 8,
            barPercentage: 0.6,
          },
        ],
      };
    } else {
      // Si no hay datos, crear estructura vacía
      this.data = {
        labels: [],
        datasets: [
          {
            label: this.title() || 'Datos',
            data: [],
            backgroundColor: [],
            borderRadius: 8,
            barPercentage: 0.6,
          },
        ],
      };
    }
  }

  private updateChartOptions() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor =
      documentStyle.getPropertyValue('--text-color') || '#333333';
    const textColorSecondary =
      documentStyle.getPropertyValue('--text-color-secondary') || '#6B7280';

    this.options = {
      responsive: true,
      indexAxis: this._orientation,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display:
            this.data && this.data.datasets && this.data.datasets.length > 1,
          position: 'bottom',
          labels: {
            color: textColor,
          },
        },
        tooltip: {
          enabled: true,
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          titleColor: textColor,
          bodyColor: textColorSecondary,
          callbacks: {
            label: function (tooltipItem: any) {
              return ` ${tooltipItem.raw}`;
            },
          },
        },
      },
      scales: {
        x: {
          grid: {
            display: false,
          },
          ticks: {
            color: textColorSecondary,
          },
        },
        y: {
          grid: {
            display: false,
          },
          ticks: {
            color: textColorSecondary,
            display: this._orientation === 'y', // Mostrar solo para barras horizontales
          },
        },
      },
    };
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
      const chartTitle = this.title() || 'grafico-barras';
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
