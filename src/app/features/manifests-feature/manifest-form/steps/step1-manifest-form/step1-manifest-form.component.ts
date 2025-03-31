import { Component, input, model, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { SkeletonModule } from 'primeng/skeleton';
interface Branch {
  sucursalId: string;
  name: string;
  address: string;
  city?: string;
  status: boolean;
  createdAt: Date;
  updatedAt: Date;
  selected?: boolean;
}

interface BranchForSelection extends Branch {
  selected?: boolean;
  description?: string;
}
@Component({
  selector: 'app-step1-manifest-form',
  imports: [
    CommonModule,
    FormsModule,
    CalendarModule,
    TableModule,
    ButtonModule,
    SkeletonModule,
  ],
  templateUrl: './step1-manifest-form.component.html',
  styleUrl: './step1-manifest-form.component.scss',
})
export class Step1ManifestFormComponent {
  selectedDate = model<Date>(new Date());
  branches = input<BranchForSelection[]>([]);
  selectedBranches = model<BranchForSelection[]>([]);
  loading = input<boolean>(false);
  loadingBranches = input<boolean>(false);

  selectionChange = output<BranchForSelection[]>();
  search = output<void>();

  /**
   * Updates selected branches when selection changes
   */
  onBranchSelectionChange(event: any): void {
    this.selectedBranches.set(event || []);
    this.selectionChange.emit(event);
  }

  /**
   * Checks if user can advance to next step
   */
  get canAdvance(): boolean {
    return !!this.selectedDate() && this.selectedBranches().length > 0;
  }

  /**
   * Emits search event to parent component
   */
  searchSales(): void {
    // Just emit the event, the parent will handle the actual search
    this.search.emit();
  }
}
