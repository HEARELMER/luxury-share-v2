import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';

interface GeneratedManifest {
  id: string;
  manifestId: string;
  serviceName: string;
  description: string;
  type: string;
  branch: string;
  branchId: string;
  date: Date;
  sales: any[];
  totalPassengers: number;
  passengers: any[];
}

@Component({
  selector: 'app-step3-manifest-form',
  imports: [CommonModule, FormsModule, ButtonModule, TagModule],
  templateUrl: './step3-manifest-form.component.html',
  styleUrl: './step3-manifest-form.component.scss',
})
export class Step3ManifestFormComponent {
  generatedManifests = input.required<GeneratedManifest[]>();

  restart = output<void>();
  close = output<void>();

  /**
   * Restart the manifest generation process
   */
  restartProcess(): void {
    this.restart.emit();
  }

  /**
   * Close the dialog and return to the main screen
   */
  closeDialog(): void {
    this.close.emit();
  }
}
