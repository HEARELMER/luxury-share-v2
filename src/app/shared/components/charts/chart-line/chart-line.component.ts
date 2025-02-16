import { Component, input, Input, OnInit } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { ButtonComponent } from '../../ui/button/button.component';
import { NgStyle } from '@angular/common';

@Component({
  selector: 'app-chart-line',
  standalone: true,
  imports: [ChartModule, ButtonComponent, NgStyle],
  templateUrl: './chart-line.component.html',
  styleUrl: './chart-line.component.scss',
})
export class ChartLineComponent implements OnInit {
  data: any;
  @Input() title: string = 'Chart Title';

  options: any;

  ngOnInit() {
    this.chartLine();
  }
  chartLine() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue(
      '--text-color-secondary'
    );
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    this.data = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [
        {
          label: 'First Dataset',
          data: [65, 59, 80, 81, 56, 55, 40],
          fill: false,
          tension: 0.4,
          borderColor: documentStyle.getPropertyValue('--purple-500'),
        },
        {
          label: 'Second Dataset',
          data: [28, 48, 40, 19, 86, 27, 90],
          fill: false,
          borderDash: [5, 5],
          tension: 0.4,
          borderColor: documentStyle.getPropertyValue('--teal-500'),
        },
        {
          label: 'Third Dataset',
          data: [12, 51, 62, 33, 21, 62, 45],
          fill: false,
          borderColor: documentStyle.getPropertyValue('--orange-500'),
          tension: 0.4,
        },
      ],
    };

    this.options = {
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        legend: {
          labels: {
            color: textColor,
          },
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
}
