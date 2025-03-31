import { Component, input, model, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ProgressBarModule } from 'primeng/progressbar';
import { TagModule } from 'primeng/tag';
interface SuggestedManifest {
  id: string;
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
  selector: 'app-step2-manifest-form',
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    ProgressBarModule,
    TagModule,
  ],
  templateUrl: './step2-manifest-form.component.html',
  styleUrl: './step2-manifest-form.component.scss',
})
export class Step2ManifestFormComponent {
  selectedDate = model<Date>(new Date());
  suggestedManifests = model<SuggestedManifest[]>([]);
  selectedManifests = model<SuggestedManifest[]>([]);

  goBack = output<void>();
  generateSelection = output<void>();
  viewDetails = output<SuggestedManifest>();

  /**
   * Checks if there are any selected manifests
   */
  get hasSelectedManifests(): boolean {
    return this.selectedManifests().length > 0;
  }

  /**
   * Go back to date and branch selection
   */
  goBackToDateSelection(): void {
    this.goBack.emit();
  }

  /**
   * Generate manifests with the selected options
   */
  generateManifests(): void {
    if (this.hasSelectedManifests) {
      this.generateSelection.emit();
    }
  }

  /**
   * Show details of a manifest
   */
  showManifestDetails(manifest: SuggestedManifest): void {
    this.viewDetails.emit(manifest);
  }
}
