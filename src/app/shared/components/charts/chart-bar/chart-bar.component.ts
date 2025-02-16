import { NgStyle } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ChartModule } from 'primeng/chart';

@Component({
  selector: 'app-chart-bar',
  standalone: true,
  imports: [ChartModule, NgStyle],
  templateUrl: './chart-bar.component.html',
  styleUrl: './chart-bar.component.scss',
})
export class ChartBarComponent {
  data: any;
  private _orientation: string = 'x';
  @Input() title: string = 'Chart Title';
  @Input() labels: { label: string; color: string; quantity: number }[] = [
    { label: '', color: '', quantity: 0 },
  ];
  @Input() dataValues: number[] = [];
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

  options: any;
  

  ngOnInit() {
    this.chartBar();
  }

  formatLabels(data: any): string[] {
    return data;
  }
  chartBar() {
    
    this.data = {
      labels: this.labels.map((item) => item.label),
      datasets: [
        {
          label: 'Teams',
          data:this.labels.map((item) => item.quantity),
          backgroundColor: this.labels.map((item) => item.color),
          borderRadius: 8,
          barPercentage: 0.6,
        },
      ],
    };
    // console.log(this.data);

    this.options = {
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
            color: '#6B7280', // Color de las etiquetas del eje x
          },
        },
        y: {
          grid: {
            display: false,
          },
          ticks: {
            display: false, // Ocultar etiquetas del eje y
          },
        },
      },
    };
  }
}
