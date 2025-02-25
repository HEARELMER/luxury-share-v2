import { CommonModule } from '@angular/common';
import { Component, inject, signal, ViewChild } from '@angular/core';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { BadgeModule } from 'primeng/badge';
import { TableModule } from 'primeng/table';
import { Skeleton } from 'primeng/skeleton';
import { Tooltip } from 'primeng/tooltip';
import { PaginatorModule } from 'primeng/paginator';
import { FormsModule } from '@angular/forms';
import { USER_TABLE_COLS } from '../../users-feature/constants/table-users.constant';
import { UserService } from '../../../core/services/users-services/user.service';
import { ButtonComponent } from '../../../shared/components/ui/button/button.component';
import { User } from '../../../shared/interfaces/user';
import { Popover } from 'primeng/popover';
import { PopoverModule } from 'primeng/popover';
import { ExportExcelComponent } from '../../../shared/components/layout/export-excel/export-excel.component';
import { InputFormComponent } from '../../../shared/components/forms/input-form/input-form.component';
import { TagModule } from 'primeng/tag';
import { AddUserComponent } from '../../users-feature/add-user/add-user.component';
import { BranchService } from '../../../core/services/braches-services/branch.service';
import { BRANCH_TABLE_COLS } from '../constants/table-branches.constant';
import { SelectComponent } from "../../../shared/components/forms/select/select.component";
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
    ExportExcelComponent,
    InputFormComponent,
    TagModule,
    SelectComponent
],
  templateUrl: './branches.component.html',
  styleUrl: './branches.component.scss',
})
export class BranchesComponent {
  private readonly _branchService = inject(BranchService);
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

  // Filtros
  filterName = '';
  filterStatus = '';

  constructor() {
    // Constructor vacío
  }

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

    this._branchService.getBranches(this.currentPage, this.rows).subscribe({
      next: (response) => {
        this.branches.set(response.data.branches);
        this.totalRecords = response.data.total;
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error cargando sucursales:', error);
        this.loading.set(false);
      },
    });
  }

  setFilter() {
    if (this.filterName) {
      this.filters.set([{ key: 'name', value: this.filterName }]);
      this.loadBranches();
    }
  }

  clearFilters() {
    this.filterName = '';
    this.filterStatus = '';
    this.filters.set([]);
    this.loadBranches();
  }

  exportData() {
    this.showModal.set(true);
  }

  handleExport(quantity: number) {
    // this..exportToExcel(this.currentPage, quantity).subscribe({
    //   next: () => {
    //     console.log('Exportación completada');
    //     this.showModal.set(false);
    //   },
    //   error: (error) => {
    //     console.error('Error en la exportación:', error);
    //   },
    // });
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

  toggle(event:any){
    
  }
}
interface Branch {
  sucursalId: string;
  name: string;
  address: string;
  status: boolean;
  createdAt: Date;
  updatedAt: Date;
}
