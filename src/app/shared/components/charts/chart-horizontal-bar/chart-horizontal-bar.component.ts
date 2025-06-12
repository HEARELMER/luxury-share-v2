import { Component, input, OnChanges, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartModule } from 'primeng/chart';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
@Component({
  selector: 'app-chart-horizontal-bar',
  imports: [CommonModule, ChartModule, ButtonModule, TooltipModule],
  templateUrl: './chart-horizontal-bar.component.html',
  styleUrl: './chart-horizontal-bar.component.scss',
})
export class ChartHorizontalBarComponent implements OnInit, OnChanges {
  readonly title = input<string>('');
  readonly subtitle = input<string>('');
  readonly icon = input<string>('pi pi-bars');
  readonly iconBg = input<string>('bg-primary-50');
  readonly chartData = input<any>(null);
  readonly labels = input<
    {
      label: string;
      color: string;
      quantity: number;
    }[]
  >([]);
  
  // Nueva propiedad: paleta de colores personalizada
  readonly colorPalette = input<string[]>([
    '#4338ca', // Indigo
    '#16a34a', // Green
    '#ea580c', // Orange
    '#0ea5e9', // Sky blue
    '#8b5cf6', // Purple
    '#ef4444', // Red
    '#f59e0b', // Amber
    '#06b6d4', // Cyan
    '#ec4899', // Pink
    '#10b981'  // Emerald
  ]);
  
  // Nueva propiedad: opción para barras con gradiente
  readonly useGradient = input<boolean>(false);

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
    const defaultData = {
      labels: ['Juan Pérez', 'María García', 'Carlos López', 'Ana Silva', 'Jorge Rodriguez'],
      datasets: [
        {
          label: 'Ventas (S/.)',
          data: [45000, 38000, 32000, 28000, 21000],
          backgroundColor: this.generateBackgroundColors(5),
        }
      ]
    };

    if (this.chartData()) {
      this.data = this.chartData();
      // Aplicar colores personalizados si no están definidos
      this.applyCustomColors();
    } else {
      this.data = defaultData;
    }
    
    // Generar labels efectivos
    if (this.labels() && this.labels().length > 0) {
      // Si ya tenemos labels proporcionados, no hacemos nada
    } else if (this.data && this.data.datasets && this.data.datasets.length > 0) {
      // Generar labels desde los datos
      const dataset = this.data.datasets[0];
      const backgroundColor = Array.isArray(dataset.backgroundColor) 
        ? dataset.backgroundColor 
        : Array(this.data.labels.length).fill(dataset.backgroundColor || '#4338ca');
        
      this._effectiveLabels = this.data.labels.map((label: string, index: number) => {
        return {
          label: label,
          color: backgroundColor[index] || backgroundColor[0] || '#4338ca',
          quantity: dataset.data[index]
        };
      });
    }

    this.options = {
      indexAxis: 'y', // Esto hace que las barras sean horizontales
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          enabled: true,
          callbacks: {
            label: (context: any) => {
              return `S/. ${context.raw.toLocaleString('es-PE')}`;
            },
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary,
            callback: (value: number) => {
              return `S/. ${value.toLocaleString('es-PE')}`;
            },
          },
          grid: {
            color: 'rgba(0, 0, 0, 0.1)',
          },
        },
        y: {
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            display: false,
          },
        },
      },
    };
  }

  // Método para generar colores de fondo
  private generateBackgroundColors(count: number): string[] | object[] {
    if (this.useGradient()) {
      // Crear gradientes para cada barra
      return Array(count).fill(0).map((_, i) => {
        const baseColor = this.getColor(i);
        return {
          type: 'linear',
          start: '0%',
          end: '100%',
          stops: [
            { offset: '0%', color: this.lightenColor(baseColor, 20) },
            { offset: '100%', color: baseColor }
          ]
        };
      });
    } else {
      // Usar colores planos de la paleta
      return Array(count).fill(0).map((_, i) => this.getColor(i));
    }
  }
  
  // Método para obtener un color de la paleta
  private getColor(index: number): string {
    const palette = this.colorPalette();
    // Si no hay paleta, usar un color predeterminado
    if (!palette || palette.length === 0) {
      return '#4338ca';
    }
    // Usar módulo para ciclar por los colores disponibles
    return palette[index % palette.length];
  }
  
  // Método para aclarar un color (para gradientes)
  private lightenColor(color: string, percent: number): string {
    const num = parseInt(color.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    
    return '#' + (
      0x1000000 +
      (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
      (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
      (B < 255 ? (B < 1 ? 0 : B) : 255)
    ).toString(16).slice(1);
  }
  
  // Aplicar colores personalizados a los datasets
  private applyCustomColors() {
    if (!this.data || !this.data.datasets || this.data.datasets.length === 0) return;
    
    const dataset = this.data.datasets[0];
    // Solo aplicar colores si no están ya definidos
    if (!dataset.backgroundColor || 
        (typeof dataset.backgroundColor === 'string' && dataset.backgroundColor === '#4338ca')) {
      dataset.backgroundColor = this.generateBackgroundColors(this.data.labels.length);
    }
  }

  private updateChartWithData(chartData: any) {
    if (chartData) {
      this.data = chartData;
      // Aplicar colores personalizados
      this.applyCustomColors();
      
      // Actualizar labels cuando cambian los datos
      if (this.data && this.data.datasets && this.data.datasets.length > 0 && !this.labels().length) {
        const dataset = this.data.datasets[0];
        const backgroundColor = Array.isArray(dataset.backgroundColor) 
          ? dataset.backgroundColor 
          : Array(this.data.labels.length).fill(dataset.backgroundColor || '#4338ca');
          
        this._effectiveLabels = this.data.labels.map((label: string, index: number) => {
          // Para los gradientes, usar el color base
          const color = typeof backgroundColor[index] === 'object' 
            ? backgroundColor[index].stops[1].color 
            : backgroundColor[index] || backgroundColor[0] || '#4338ca';
            
          return {
            label: label,
            color: color,
            quantity: dataset.data[index]
          };
        });
      }
    }
  }
}