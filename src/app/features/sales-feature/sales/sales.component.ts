import { CommonModule } from '@angular/common';
import { Component, inject, signal, ViewChild } from '@angular/core';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { BadgeModule } from 'primeng/badge';
import { TableModule } from 'primeng/table';
import { Skeleton } from 'primeng/skeleton';
import { Tooltip } from 'primeng/tooltip';
import { PaginatorModule } from 'primeng/paginator';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../core/services/users-services/user.service';
import { ButtonComponent } from '../../../shared/components/ui/button/button.component';
import { User } from '../../../shared/interfaces/user';
import { Popover } from 'primeng/popover';
import { PopoverModule } from 'primeng/popover';
import { ExportExcelComponent } from '../../../shared/components/layout/export-excel/export-excel.component';
import { InputFormComponent } from '../../../shared/components/forms/input-form/input-form.component';
import { TagModule } from 'primeng/tag';
import { USER_TABLE_COLS } from '../../users-feature/constants/table-users.constant';
import { AddUserComponent } from '../../users-feature/add-user/add-user.component';
import { AddSaleComponent } from '../add-sale/add-sale.component';
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
    AddUserComponent,
    AddSaleComponent,
  ],
  templateUrl: './sales.component.html',
  styleUrl: './sales.component.scss',
})
export class SalesComponent {
  showModalAddSale = signal<boolean>(false);

  private readonly _userService = inject(UserService);
  @ViewChild('op') op!: Popover;
  USERS_DATA = [];
  users: User[] = [];
  cols = USER_TABLE_COLS;
  items: any[] | undefined;
  currentPage: number = 1;
  pageSize: number = 5; // Inicializado para coincidir con el valor inicial de rows
  totalRecords: number = 0;
  rowsPerPageOptions = [5, 10, 20, 50];
  first: number = 0;
  rows: number = 5;
  virtualUsers: User[] = [];
  loading: boolean = false;
  selectedRow: any;
  showModal = signal<boolean>(false);
  showModalUser = signal<boolean>(false);
  filters = signal<{ key: string; value: string }[]>([]);
  filterNumDni = '';
  filterRoles = '';
  selectedRole = signal<string>('');
  onPageChange(event: any) {
    this.currentPage = event.page + 1; // Usa el índice de página del evento directamente
    this.rows = event.rows; // Actualiza el tamaño de página
    this.first = event.first; // Actualiza el desplazamiento inicial
    this.loadUsersLazy();
  }

  setFilter() {
    if (this.filterNumDni.length == 8) {
      this.filters.set([{ key: 'numDni', value: this.filterNumDni }]);
      this.loadUsersLazy();
    }
  }

  setFilterRoles(item: any) {
    this.filterRoles = item;
    this.loadUsersLazy();
  }

  clearFilters() {
    this.filterNumDni = '';
    this.filters.set([]);
    this.loadUsersLazy();
  }

  loadUsersLazy(): void {
    this.loading = true;
    this._userService
      .paginateUsers(
        this.currentPage,
        this.rows,
        this.filterNumDni,
        this.filterRoles
      )
      .subscribe({
        next: (response) => {
          this.virtualUsers = response.data.users;
          this.totalRecords = response.data.total;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error:', error);
          this.loading = false;
        },
      });
  }

  toggle(event: Event) {
    this.op.toggle(event);
  }

  exportData() {
    this.openModal();
  }

  openModal() {
    this.showModalAddSale.set(true);
  }

  handleExport(quantity: number) {
    this._userService.exportToExcel(1, quantity).subscribe({
      next: () => {
        console.log('Exportación completada');
        this.showModal.set(false);
      },
      error: (error) => {
        console.error('Error en la exportación:', error);
      },
    });
  }

  editUser(user: any) {
    this.selectedRole.set(user.role.roleName);
    this.showModalUser.set(true);
    this.selectedRow = user;
    console.log(this.selectedRow);
  }

  openModalUser(role: string = '') {
    this.selectedRow = null;
    this.selectedRole.set(role);
    this.showModalUser.set(true);
  }

  handleRefreshData() {
    this.loadUsersLazy();
  }
}
