import {
  Component,
  effect,
  inject,
  input,
  model,
  output,
  signal,
} from '@angular/core';
import { CommonModule, JsonPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { SkeletonModule } from 'primeng/skeleton';
import { ServicesService } from '../../../../../core/services/services_packages-services/services.service';
import { DatePickerModule } from 'primeng/datepicker';
import { PaginatorModule } from 'primeng/paginator';
import {
  Option,
  SelectComponent,
} from '../../../../../shared/components/forms/select/select.component';
import { SERVICE_TABLE_COLS_MANIFESTS } from '../../../../sales-feature/constants/manifest-form.constant';

@Component({
  selector: 'app-step1-manifest-form',
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    SkeletonModule,
    DatePickerModule,
    SelectComponent,
    PaginatorModule,JsonPipe
  ],
  templateUrl: './step1-manifest-form.component.html',
  styleUrl: './step1-manifest-form.component.scss',
})
export class Step1ManifestFormComponent {
  private readonly _servicesService = inject(ServicesService);
  selectedDate = model<Date>(new Date());
  branches = input<Option[] | undefined>([]);
  loading = signal<boolean>(false);
  services = signal<any>([]);
  serviciosTableCols = SERVICE_TABLE_COLS_MANIFESTS;
  currentPage = 1;
  pageSize = 5;
  totalRecords = 0;
  rowsPerPageOptions = [5, 10, 20, 50];
  first = 0;
  rows = 5;
  // Cambio: de array a objeto único
  selectedBranch = model<any | null>(null);
  loadingBranches = input<boolean>(false);

  // Cambio: ahora emite un solo objeto
  selectionChange = output<any | null>();
  search = output<void>();

  constructor() {
    effect(() => {
      this.loadServices();
    });
  }

  loadServices(): void {
    this.loading.set(true);
    this._servicesService.getServices(this.currentPage, this.rows).subscribe({
      next: (res) => {
        this.services.set(res.data.services)
        this.totalRecords = res.data.totalRecords;
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }

  onPageChange(event: any) {
    this.currentPage = event.page + 1;
    this.rows = event.rows;
    this.first = event.first;
    this.loadServices();
  }

  /**
   * Updates selected branch when selection changes
   */
  onBranchSelectionChange(event: any): void {
    this.selectedBranch.set(event);
    this.selectionChange.emit(event);
  }

  /**
   * Checks if user can advance to next step
   */
  get canAdvance(): boolean {
    return !!this.selectedDate() && !!this.selectedBranch();
  }

  /**
   * Emits search event to parent component
   */
  searchSales(): void {
    // Just emit the event, the parent will handle the actual search
    this.search.emit();
  }
}
