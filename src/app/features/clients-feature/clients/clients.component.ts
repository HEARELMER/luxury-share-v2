import { Component, inject, signal } from '@angular/core';
import { ClientsService } from '../../../core/services/clients-services/clients.service';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CLIENT_TABLE_COLS } from '../constants/table-clients.constant';
import { FilterOptions } from '../../../core/interfaces/api/filters';
import { DialogComponent } from '../../../shared/components/ui/dialog/dialog.component';
import { ViewUserInfoComponent } from '../../../shared/components/layout/view-user-info/view-user-info.component';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tooltip } from 'primeng/tooltip';
import { BadgeModule } from 'primeng/badge';
import { PaginatorModule } from 'primeng/paginator';
import { PopoverModule } from 'primeng/popover';
import { Skeleton } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';
import { TagModule, Tag } from 'primeng/tag';
import { InputFormComponent } from '../../../shared/components/forms/input-form/input-form.component';
import { ButtonComponent } from '../../../shared/components/ui/button/button.component';
import { FormClientComponent } from '../form-client/form-client.component';
import { Toast } from 'primeng/toast';
import { SelectComponent } from '../../../shared/components/forms/select/select.component';
import { LocalstorageService } from '../../../core/services/localstorage-services/localstorage.service';

@Component({
  selector: 'app-clients',
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
    Tag,
    FormClientComponent,
    Toast,
    SelectComponent,
  ],
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.scss',
  providers: [DialogService],
})
export class ClientsComponent {
  private readonly _clientsService = inject(ClientsService);
  private readonly _messageService = inject(MessageService);
  public readonly dialogService = inject(DialogService);
  private readonly _localStorageService = inject(LocalstorageService);
  ref: DynamicDialogRef | undefined;

  constructor() {
    this.loadClients();
  }

  // Signals
  clients = signal<any[]>([]);
  loading = signal<boolean>(false);
  showModal = signal<boolean>(false);
  showClientModal = signal<boolean>(false);
  filters = signal<{ key: string; value: string }[]>([]);
  selectedClient = signal<any | null>(null);
  filterClientByDocumentNumber = signal<string>('');
  filterValue = signal<string>('');
  selectedRow: any;
  // Configuración de tabla
  cols = CLIENT_TABLE_COLS;
  currentPage = 1;
  pageSize = 10;
  totalRecords = 0;
  rowsPerPageOptions = [10, 20, 50];
  first = 0;
  rows = 10;

  /**
   * Maneja el cambio de página
   */
  onPageChange(event: any) {
    this.currentPage = event.page + 1;
    this.rows = event.rows;
    this.first = event.first;
    this.loadClients();
  }

  /**
   * Carga los clientes con los filtros aplicados
   */
  loadClients(options: FilterOptions = {}): void {
    this.loading.set(true);

    // Resetear página si es necesario
    if (options.resetPage) {
      this.currentPage = 1;
      this.first = 0;
    }

    // Resetear filtros si es necesario
    if (options.resetFilters) {
      this.filterValue.set('');
      this.filterClientByDocumentNumber.set('');
      this.filters.set([]);
    }

    this._clientsService
      .getClients(this.currentPage, this.rows, this.filters())
      .subscribe({
        next: (response) => {
          this.clients.set(response.data.clients);
          this.totalRecords = response.data.total;
          this.loading.set(false);
        },
        error: (error) => {
          this.loading.set(false);
          this._messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo cargar los clientes',
          });
        },
      });
  }

  /**
   * Busca clientes por dirección
   */
  searchClient() {
    if (this.filterClientByDocumentNumber()) {
      this.filters.set([
        { key: 'numberDocument', value: this.filterClientByDocumentNumber() },
      ]);
      this.loadClients({ resetPage: true });
    }
    this.filterClientByDocumentNumber.set('');
  }

  /**
   * Aplica filtro por estado
   */
  setFilter(): void {
    if (this.filterValue()) {
      this.filters.set([{ key: 'status', value: this.filterValue() }]);
      this.loadClients({ resetPage: true });
    }
  }

  /**
   * Limpia todos los filtros aplicados
   */
  clearFilters(): void {
    this.loadClients({ resetPage: true, resetFilters: true });
  }

  /**
   * Elimina un cliente
   */
  deleteClient(client: any): void {
    const ref = this.dialogService.open(DialogComponent, {
      header: 'Eliminar cliente',
      modal: true,
      contentStyle: { overflow: 'auto' },
      breakpoints: {
        '960px': '65vw',
        '640px': '60vw',
      },
      data: {
        type: 'success',
        message: `¿Estás seguro de eliminar el cliente?`,
        confirmText: 'Continuar',
        showCancel: false,
      },
    });
    ref.onClose.subscribe((result: boolean) => {
      if (result) {
        const data = {
          id: client.clientId,
          updatedBy: this._localStorageService.getUserId(),
        };
        this._clientsService.deleteClient(data).subscribe({
          next: (response) => {
            this._messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: response.message,
            });
            this.loadClients({ resetPage: true });
          },
          error: (error) => {
            this._messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'No se pudo eliminar el cliente',
            });
          },
        });
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
    const ref = this.dialogService.open(ViewUserInfoComponent, {
      header: 'Información del usuario',
      modal: true,
      closable: true,
      dismissableMask: true,
      breakpoints: {
        '960px': '65vw',
        '640px': '80vw',
      },
      data: userId,
    });
  }

  /**
   * Manejo de modales y acciones
   */
  exportData(): void {
    this.showModal.set(true);
  }

  editClient(client: any): void {
    this.selectedClient.set(client);
    this.showClientModal.set(true);
  }

  openClientModal(): void {
    this.selectedClient.set(null);
    this.showClientModal.set(true);
  }

  handleRefreshData(): void {
    this.loadClients();
  }
}
