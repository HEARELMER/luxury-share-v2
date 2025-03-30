import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgressBarModule } from 'primeng/progressbar';

export interface Goal {
  id: string | number;
  title: string;
  icon: string;
  target: number;
  current: number;
  percentage: number;
  formatTarget: string;
  formatCurrent: string;
}

@Component({
  selector: 'app-goals-panel',
  imports: [CommonModule, ProgressBarModule],
  templateUrl: './goals-panel.component.html',
  styleUrl: './goals-panel.component.scss',
})
export class GoalsPanelComponent {
  readonly title = input<string>('Objetivos y cumplimiento');
  readonly goals = input<Goal[]>([]);

  getProgressBarStyleClass(value: number): string {
    if (value >= 75) {
      return 'progress-success';
    } else if (value >= 50) {
      return 'progress-warning';
    } else {
      return 'progress-danger';
    }
  }
}
