import { Component, inject, signal, ViewChild } from '@angular/core';
import { Popover, PopoverModule } from 'primeng/popover';
import { UserService } from '../../../core/services/users-services/user.service';
import { User } from '../../../shared/interfaces/user';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tooltip } from 'primeng/tooltip';
import { BadgeModule } from 'primeng/badge';
import { PaginatorModule } from 'primeng/paginator';
import { Skeleton } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { InputFormComponent } from '../../../shared/components/forms/input-form/input-form.component';
import { ExportExcelComponent } from '../../../shared/components/layout/export-excel/export-excel.component';
import { ButtonComponent } from '../../../shared/components/ui/button/button.component';
import { AddUserComponent } from '../../users-feature/add-user/add-user.component';
import { SelectComponent } from '../../../shared/components/forms/select/select.component';
import { SERVICE_TABLE_COLS } from '../constants/table-services.constant';

@Component({
  selector: 'app-main-services-packages',
  imports: [
    TieredMenuModule,
    CommonModule,
    BadgeModule,
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
    SelectComponent,
  ],
  templateUrl: './main-services-packages.component.html',
  styleUrl: './main-services-packages.component.scss',
})
export class MainServicesPackagesComponent {
  private readonly _userService = inject(UserService);
  @ViewChild('op') op!: Popover;
  USERS_DATA = [];
  users: User[] = [];
  cols = SERVICE_TABLE_COLS;
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
    this.showModal.set(true);
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
