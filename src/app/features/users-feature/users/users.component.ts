import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
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
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
})
export class UsersComponent {
  private readonly _userService = inject(UserService);
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

  onPageChange(event: any) {
    this.currentPage = event.page + 1; // Usa el índice de página del evento directamente
    this.rows = event.rows;       // Actualiza el tamaño de página
    this.first = event.first;     // Actualiza el desplazamiento inicial
    this.loadUsersLazy();
    console.log('Página actual:', this.currentPage, 'Tamaño de página:', this.rows);
  }
  
  // Carga datos de usuarios con parámetros actualizados
  loadUsersLazy(): void {
    this.loading = true;
    this._userService.paginateUsers(this.currentPage, this.rows).subscribe({
      next: (response) => {
        this.virtualUsers = response.usuarios.data;
        this.totalRecords = response.usuarios.total;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error:', error);
        this.loading = false;
      },
    });
  }

  ngOnInit() {
    this.items = [
      {
        label: 'Usuarios',
        icon: 'pi pi-users',
        items: [
          {
            label: 'Nuevo',
            icon: 'pi pi-plus',
          },
          {
            label: 'Mostrar en tabla',
            icon: 'pi  pi-table',
          },
        ],
      },
      {
        label: 'Administradores',
        icon: 'pi pi-lock',
        items: [
          {
            label: 'Nuevo',
            icon: 'pi pi-plus',
          },
          {
            label: 'Mostrar en tabla',
            icon: 'pi  pi-table',
          },
        ],
      },
      {
        label: 'Vendedores',
        icon: 'pi pi-lock',
        items: [
          {
            label: 'Nuevo',
            icon: 'pi pi-plus',
          },
          {
            label: 'Mostrar en tabla',
            icon: 'pi  pi-table',
          },
        ],
      },
    ];
  }
}
