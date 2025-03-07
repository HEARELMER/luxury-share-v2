import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { BadgeModule } from 'primeng/badge';
import { TableModule } from 'primeng/table';
import { Skeleton } from 'primeng/skeleton';
import { Tooltip } from 'primeng/tooltip';
import { PaginatorModule } from 'primeng/paginator';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../../../shared/components/ui/button/button.component';
import { PopoverModule } from 'primeng/popover';
import { InputFormComponent } from '../../../shared/components/forms/input-form/input-form.component';
import { TagModule } from 'primeng/tag';
import { BranchService } from '../../../core/services/braches-services/branch.service';
import { BRANCH_TABLE_COLS } from '../constants/table-branches.constant';
import { SelectComponent } from '../../../shared/components/forms/select/select.component';
import { AddBranchComponent } from '../add-branch/add-branch.component';
import { Toast } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { Branch } from '../interfaces/branch.interface';
@Component({
  selector: 'app-users',
  imports: [
    TieredMenuModule,
    CommonModule,
    BadgeModule,
    ButtonComponent,
    TableModule,
    CommonModule,
    Skeleton,
    Tooltip,
    PaginatorModule,
    FormsModule,
    ButtonComponent,
    PopoverModule,
    InputFormComponent,
    TagModule,
    SelectComponent,
    AddBranchComponent,
    Toast,
  ],
  templateUrl: './branches.component.html',
  styleUrl: './branches.component.scss',
})
export class BranchesComponent {
  private readonly _branchService = inject(BranchService);
  private readonly _messageService = inject(MessageService);
  // Signals
  branches = signal<Branch[]>([]);
  loading = signal<boolean>(false);
  showModal = signal<boolean>(false);
  showBranchModal = signal<boolean>(false);
  filters = signal<{ key: string; value: string }[]>([]);
  selectedBranch = signal<Branch | null>(null);

  // Configuración de tabla
  cols = BRANCH_TABLE_COLS;
  currentPage = 1;
  pageSize = 5;
  totalRecords = 0;
  rowsPerPageOptions = [5, 10, 20, 50];
  first = 0;
  rows = 5;

  filterValue = signal<string>('');

  ngOnInit() {
    this.loadBranches();
  }

  onPageChange(event: any) {
    this.currentPage = event.page + 1;
    this.rows = event.rows;
    this.first = event.first;
    this.loadBranches();
  }

  loadBranches(): void {
    this.loading.set(true);

    this._branchService
      .getBranches(this.currentPage, this.rows, this.filters())
      .subscribe({
        next: (response) => {
          this.branches.set(response.data.branches);
          this.totalRecords = response.data.total;
          this.loading.set(false);
        },
        error: (error) => {
          this.loading.set(false);
        },
      });
  }

  setFilter() {
    if (this.filterValue()) {
      this.filters.set([{ key: 'status', value: this.filterValue() }]);
      this.loadBranches();
    }
  }

  clearFilters() {
    this.filterValue.set('');
    this.filters.set([]);
    this.loadBranches();
  }

  exportData() {
    this.showModal.set(true);
  }

  editBranch(branch: Branch) {
    this.selectedBranch.set(branch);
    this.showBranchModal.set(true);
  }

  openBranchModal() {
    this.selectedBranch.set(null);
    this.showBranchModal.set(true);
  }

  handleRefreshData() {
    this.loadBranches();
  }

  toggle(event: any) {}
}
