import { CommonModule } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { BadgeModule } from 'primeng/badge';
import { TableModule } from 'primeng/table';
import { Skeleton } from 'primeng/skeleton';
import { Tooltip } from 'primeng/tooltip';
import { PaginatorModule } from 'primeng/paginator';
import { FormsModule } from '@angular/forms';
import { USER_TABLE_COLS } from '../constants/table-users.constant';
import { UserService } from '../../../core/services/user.service';
import { ButtonComponent } from '../../../shared/components/ui/button/button.component';
import { User } from '../../../shared/interfaces/user';
import { Popover } from 'primeng/popover';
import { PopoverModule } from 'primeng/popover';
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
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
})
export class UsersComponent {
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

  onPageChange(event: any) {
    this.currentPage = event.page + 1; // Usa el índice de página del evento directamente
    this.rows = event.rows; // Actualiza el tamaño de página
    this.first = event.first; // Actualiza el desplazamiento inicial
    this.loadUsersLazy();
    console.log(
      'Página actual:',
      this.currentPage,
      'Tamaño de página:',
      this.rows
    );
  }

  loadUsersLazy(): void {
    this.loading = true;
    this._userService.paginateUsers(this.currentPage, this.rows).subscribe({
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

  toggle(event:Event) {
    this.op.toggle(event);
  }
}
