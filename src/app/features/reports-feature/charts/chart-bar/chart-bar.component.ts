import { Component, Input, input, OnChanges, OnInit } from '@angular/core';
import { CommonModule, NgStyle } from '@angular/common';
import { ChartModule } from 'primeng/chart';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
@Component({
  selector: 'app-chart-bar',
  imports: [CommonModule, ChartModule, ButtonModule, TooltipModule,NgStyle],
  templateUrl: './chart-bar.component.html',
  styleUrl: './chart-bar.component.scss'
})
export class ChartBarComponent implements OnInit {
  readonly title = input<string>('');
  readonly subtitle = input<string>('');
  readonly icon = input<string>('pi pi-chart-bar');
  readonly iconBg = input<string>('bg-primary-50');
  readonly chartData = input<any>(null);
  readonly labels = input<
    {
      label: string;
      color: string;
      quantity: number;
    }[]
  >([]);

  // Variable interna para almacenar labels generados o proporcionados
  private _effectiveLabels: { label: string; color: string; quantity: number }[] = [];
  
  // Getter que expone los labels para el template
  get effectiveLabels(): { label: string; color: string; quantity: number }[] {
    // Si hay labels proporcionados, los usamos
    if (this.labels() && this.labels().length > 0) {
      return this.labels();
    }
    // Si no, devolvemos los labels generados internamente
    return this._effectiveLabels;
  }

  private _orientation: string = 'x';
  @Input() set orientation(value: string) {
    if (value.toLowerCase() === 'x' || value.toLowerCase() === 'y') {
      this._orientation = value.toLowerCase();
    } else {
      this._orientation = 'x';
    }
  }

  get orientation(): string {
    return this._orientation;
  }

  data: any;
  options: any;

  ngOnInit() {
    this.initChart();
  }

  private initChart() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary') || '#6c757d';
    
    // Determinar si usamos datos de chartData o labels
    if (this.chartData()) {
      this.data = this.chartData();
      
      // Generar labels para la leyenda
      if (this.data && this.data.datasets && this.data.datasets.length > 0) {
        this._effectiveLabels = this.data.datasets.map((dataset: any, index: number) => {
          return {
            label: dataset.label || `Dataset ${index + 1}`,
            color: dataset.backgroundColor || '#4338ca',
            quantity: dataset.data.reduce((a: number, b: number) => a + b, 0)
          };
        });
      }
    } else {
      // Si no hay chartData, usar labels o defaults
      const defaultLabels = [
        { label: 'Q1', color: '#94a3b8', quantity: 540 },
        { label: 'Q2', color: '#4338ca', quantity: 620 },
        { label: 'Q3', color: '#16a34a', quantity: 710 },
        { label: 'Q4', color: '#ea580c', quantity: 790 }
      ];
      
      // Si no hay labels proporcionados, usamos los default
      if (!this.labels() || this.labels().length === 0) {
        this._effectiveLabels = defaultLabels;
      }
      
      // Determinar qué labels usar para generar datos
      const labelsToUse = this.labels() && this.labels().length > 0 ? this.labels() : this._effectiveLabels;
      
      this.data = {
        labels: labelsToUse.map(item => item.label),
        datasets: [
          {
            label: 'Datos',
            data: labelsToUse.map(item => item.quantity),
            backgroundColor: labelsToUse.map(item => item.color),
            borderRadius: 8,
            barPercentage: 0.6,
          }
        ]
      };
    }

    this.options = {
      // Configuración de opciones...
      responsive: true,
      indexAxis: this.orientation,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          enabled: true,
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
            color: '#6B7280',
          },
        },
        y: {
          grid: {
            display: false,
          },
          ticks: {
            color: '#6B7280',
          },
        },
      },
    };
  }
}