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
import { AddBranchComponent } from '../add-branch/add-branch.component';
import { MessageService } from 'primeng/api';
import { Branch } from '../interfaces/branch.interface';
import { Tag } from 'primeng/tag';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DialogComponent } from '../../../shared/components/ui/dialog/dialog.component';
import { ViewUserInfoComponent } from '../../../shared/components/layout/view-user-info/view-user-info.component';
import { FilterOptions } from '../../../core/interfaces/api/filters';

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
    AddBranchComponent,
    Tag,
  ],
  templateUrl: './branches.component.html',
  styleUrl: './branches.component.scss',
  providers: [DialogService],
})
export class BranchesComponent {
  private readonly _branchService = inject(BranchService);
  private readonly _messageService = inject(MessageService);
  public readonly dialogService = inject(DialogService);
  ref: DynamicDialogRef | undefined;

  constructor() {
    this.loadBranches();
  }

  // Signals
  branches = signal<Branch[]>([]);
  loading = signal<boolean>(false);
  showModal = signal<boolean>(false);
  showBranchModal = signal<boolean>(false);
  filters = signal<{ key: string; value: string }[]>([]);
  selectedBranch = signal<Branch | null>(null);
  filterBranchByAddress = signal<string>('');
  filterValue = signal<string>('');

  // Configuración de tabla
  cols = BRANCH_TABLE_COLS;
  currentPage = 1;
  pageSize = 5;
  totalRecords = 0;
  rowsPerPageOptions = [5, 10, 20, 50];
  first = 0;
  rows = 5;

  /**
   * Maneja el cambio de página
   */
  onPageChange(event: any) {
    this.currentPage = event.page + 1;
    this.rows = event.rows;
    this.first = event.first;
    this.loadBranches();
  }

  /**
   * Carga las sucursales con los filtros aplicados
   */
  loadBranches(options: FilterOptions = {}): void {
    this.loading.set(true);

    // Resetear página si es necesario
    if (options.resetPage) {
      this.currentPage = 1;
      this.first = 0;
    }

    // Resetear filtros si es necesario
    if (options.resetFilters) {
      this.filterValue.set('');
      this.filterBranchByAddress.set('');
      this.filters.set([]);
    }

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
          this._messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo cargar las sucursales',
          });
        },
      });
  }

  /**
   * Busca sucursales por dirección
   */
  searchBranch(): void {
    if (this.filterBranchByAddress()) {
      this.filters.set([
        { key: 'address', value: this.filterBranchByAddress() },
      ]);
      this.loadBranches({ resetPage: true });
    }
    this.filterBranchByAddress.set('');
  }

  /**
   * Aplica filtro por estado
   */
  setFilter(): void {
    if (this.filterValue()) {
      this.filters.set([{ key: 'status', value: this.filterValue() }]);
      this.loadBranches({ resetPage: true });
    }
  }

  /**
   * Limpia todos los filtros aplicados
   */
  clearFilters(): void {
    this.loadBranches({ resetPage: true, resetFilters: true });
  }

  /**
   * Elimina una sucursal
   */
  deleteBranch(branch: Branch): void {
    const ref = this.dialogService.open(DialogComponent, {
      header: 'Eliminar sucursal',
      modal: true,
      contentStyle: { overflow: 'auto' },
      breakpoints: {
        '960px': '65vw',
        '640px': '60vw',
      },
      data: {
        type: 'success',
        message: `¿Estás seguro de eliminar la sucursal?`,
        confirmText: 'Continuar',
        showCancel: false,
      },
    });
    ref.onClose.subscribe((result: boolean) => {
      if (result) {
        // Usuario confirmó
      } else {
        // Usuario canceló
      }
    });
  }

  /**
   * Ver la info de un user
   * @param user
   * @returns void
   */
  viewUserDetails(userId: string) {
    console.log('User ID:', userId);
    const ref = this.dialogService.open(ViewUserInfoComponent, {
      header: 'Información del usuario',
      modal: true,
      closable: true,
      dismissableMask: true,
      breakpoints: {
        '960px': '65vw',
        '640px': '80vw',
      },
      data: {
        userId: userId,
      },
    });
  }

  /**
   * Manejo de modales y acciones
   */
  exportData(): void {
    this.showModal.set(true);
  }

  editBranch(branch: Branch): void {
    this.selectedBranch.set(branch);
    this.showBranchModal.set(true);
  }

  openBranchModal(): void {
    this.selectedBranch.set(null);
    this.showBranchModal.set(true);
  }

  handleRefreshData(): void {
    this.loadBranches();
  }
}
