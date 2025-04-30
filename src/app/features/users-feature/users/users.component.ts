import { CommonModule } from '@angular/common';
import { Component, inject, signal, ViewChild } from '@angular/core';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { BadgeModule } from 'primeng/badge';
import { TableModule } from 'primeng/table';
import { Skeleton } from 'primeng/skeleton';
import { Tooltip } from 'primeng/tooltip';
import { PaginatorModule } from 'primeng/paginator';
import { FormsModule } from '@angular/forms';
import { USER_TABLE_COLS } from '../constants/table-users.constant';
import { UserService } from '../../../core/services/users-services/user.service';
import { ButtonComponent } from '../../../shared/components/ui/button/button.component';
import { User } from '../../../shared/interfaces/user';
import { Popover } from 'primeng/popover';
import { PopoverModule } from 'primeng/popover';
import { ExportExcelComponent } from '../../../shared/components/layout/export-excel/export-excel.component';
import { InputFormComponent } from '../../../shared/components/forms/input-form/input-form.component';
import { TagModule } from 'primeng/tag';
import { AddUserComponent } from '../add-user/add-user.component';
import { VerifiedRolesService } from '../../../core/services/auth-services/verified-roles.service';
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
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
})
export class UsersComponent {
  private readonly _userService = inject(UserService);
  private readonly _verifiedRolesService = inject(VerifiedRolesService);
  @ViewChild('op') op!: Popover;
  USERS_DATA = [];
  users: User[] = [];
  cols = USER_TABLE_COLS;
  items: any[] | undefined;
  currentPage: number = 1;
  pageSize: number = 10; // Inicializado para coincidir con el valor inicial de rows
  totalRecords: number = 0;
  rowsPerPageOptions = [10, 20, 50];
  first: number = 0;
  rows: number = 10;
  virtualUsers: User[] = [];
  loading: boolean = false;
  selectedRow: any;
  showModal = signal<boolean>(false);
  showModalUser = signal<boolean>(false);
  filters = signal<{ key: string; value: string }[]>([]);
  filterNumDni = '';
  filterRoles = '';
  selectedRole = signal<string>('');
  isGerent = this._verifiedRolesService.isGerent;
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
    if (!this.isGerent) {
      this.filterRoles = 'sellers';
    }
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
    this.showModal.set(true);
  }

  handleExport(quantity: number) {
    this._userService.exportToExcel(1, quantity).subscribe({
      next: () => {
        this.showModal.set(false);
      },
      error: (error) => {
        this.showModal.set(false);
      },
    });
  }

  editUser(user: any) {
    this.selectedRole.set(user.role.roleName);
    this.showModalUser.set(true);
    this.selectedRow = user;
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
