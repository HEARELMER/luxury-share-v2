import { Component, input, model, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ProgressBarModule } from 'primeng/progressbar';
import { TagModule } from 'primeng/tag';
import { SUGGESTION_TABLE_COLS_MANIFESTS } from '../../../constants/manifest-form.constant';
import { PaginatorModule } from 'primeng/paginator';
import { Badge } from 'primeng/badge';
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
  participants: any[];
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
    Badge,
    PaginatorModule,
  ],
  templateUrl: './step2-manifest-form.component.html',
  styleUrl: './step2-manifest-form.component.scss',
})
export class Step2ManifestFormComponent {
  serviceSelected = input<any | null>(null);
  selectedDate = model<Date>(new Date());
  suggestedManifests = model<SuggestedManifest[]>([]);
  selectedManifests = model<SuggestedManifest[]>([]);
  suggestedsManifestsTableCols = SUGGESTION_TABLE_COLS_MANIFESTS;
  totalItems = input<number>(0);
  pageChange = output<{ currentPage: number; rows: number }>();
  currentPage = 1;
  pageSize = 5;
  rowsPerPageOptions = [5, 10, 20, 50];
  first = 0;
  rows = 5;
  goBack = output<void>();
  generateManifest = output<void>();
  viewDetails = output<SuggestedManifest>();
  isLoading = model<boolean>(false);
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
    this.generateManifest.emit();
  }

  onPageChange(event: any) {
    this.currentPage = event.page + 1;
    this.rows = event.rows;
    this.first = event.first;

    // Emitir el evento de paginación al componente padre
    this.pageChange.emit({
      currentPage: this.currentPage,
      rows: this.rows,
    });
  }
  /**
   * Show details of a manifest
   */
  showManifestDetails(manifest: SuggestedManifest): void {
    this.viewDetails.emit(manifest);
  }
}
