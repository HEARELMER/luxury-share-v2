import { Component, inject, input, signal } from '@angular/core';
import { ButtonComponent } from '../../../shared/components/ui/button/button.component';
import { FormSaleComponent } from '../form-sale/form-sale.component';
import { DialogService } from 'primeng/dynamicdialog';
import { SALES_TABLE_COLUMNS } from '../constants/sales-table.constant';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tooltip } from 'primeng/tooltip';
import { BadgeModule } from 'primeng/badge';
import { PaginatorModule } from 'primeng/paginator';
import { PopoverModule } from 'primeng/popover';
import { Skeleton } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';
import { TagModule, Tag } from 'primeng/tag';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { InputFormComponent } from '../../../shared/components/forms/input-form/input-form.component';
import { SalesService } from '../../../core/services/sales-services/sales.service';
import { DialogComponent } from '../../../shared/components/ui/dialog/dialog.component';
import { SaleDetailsComponent } from '../sale-details/sale-details.component';
import { Filter, FilterOptions } from '../../../core/interfaces/api/filters';
import { MessageService } from 'primeng/api';
import { SaleDetailsPdfComponent } from '../sale-details-pdf/sale-details-pdf.component';
import { SALE_STATUS_FILTERS } from '../constants/sales-filters.constant';
import { SelectComponent } from '../../../shared/components/forms/select/select.component';
import { ViewUserInfoComponent } from '../../../shared/components/layout/view-user-info/view-user-info.component';
import { Toast } from 'primeng/toast';
import { LocalstorageService } from '../../../core/services/localstorage-services/localstorage.service';
import { ButtonModule } from 'primeng/button';
import { EditFormSaleComponent } from "../edit-form-sale/edit-form-sale.component";
import { CapitalizePipe } from "../../../shared/pipes/capitalize.pipe";
@Component({
  selector: 'app-sales',
  imports: [
    FormSaleComponent,
    ButtonComponent,
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
    TagModule,
    Tag,
    InputFormComponent,
    SelectComponent,
    Toast,
    ButtonModule,
    EditFormSaleComponent,
    CapitalizePipe
],
  templateUrl: './sales.component.html',
  styleUrl: './sales.component.scss',
  providers: [DialogService],
})
export class SalesComponent {
  public readonly dialogService = inject(DialogService);
  private readonly _salesService = inject(SalesService);
  private readonly _messageService = inject(MessageService);
  private readonly _localStorage = inject(LocalstorageService);

  constructor() {
    this.loadSales();
  }
  // signlas
  showModalAddSale = signal<boolean>(false);
  showModalEditSale = signal<boolean>(false);
  loading = signal<boolean>(false);
  filterSaleByCodeSale = signal<string>('');
  sales = signal<any[]>([]);
  filters = signal<{ key: string; value: string }[]>([]);
  codeSaleSelected = signal<any>(null);

  salesStatusFilters = SALE_STATUS_FILTERS;
  // Configuración de tabla
  salesTableColumns = SALES_TABLE_COLUMNS;
  currentPage = 1;
  pageSize = 10;
  totalRecords = 0;
  rowsPerPageOptions = [10, 20, 50];
  first = 0;
  rows = 10;
  openAddSaleModal() {
    this.showModalAddSale.set(true);
  }

  onFilterChange(key: string, event: any) {
    const filter = {
      key: key,
      value: event,
    };

    this.filters.update((prevFilters: Filter[]) => {
      // Verificar si ya existe un filtro con esta clave
      const existingFilterIndex = prevFilters.findIndex((f) => f.key === key);

      if (existingFilterIndex >= 0) {
        // Si existe, crear un nuevo array con el filtro actualizado
        const updatedFilters = [...prevFilters];
        updatedFilters[existingFilterIndex] = filter;
        return updatedFilters;
      } else {
        // Si no existe, agregar el nuevo filtro
        return [...prevFilters, filter];
      }
    });

    this.loadSales({ resetPage: true });
  }

  clearFilters() {
    this.filters.set([]);
    this.filterSaleByCodeSale.set('');
    this.loadSales({ resetPage: true });
  }

  searchSale() {
    if (this.filterSaleByCodeSale()) {
      this.filters.set([
        { key: 'codeSale', value: this.filterSaleByCodeSale() },
      ]);
      this.loadSales({ resetPage: true });
    }
    this.filterSaleByCodeSale.set('');
  }

  loadSales(options: FilterOptions = {}) {
    this.loading.set(true);
    if (options.resetPage) {
      this.currentPage = 1;
      this.first = 0;
    }

    this._salesService
      .getSales(this.currentPage, this.pageSize, this.filters())
      .subscribe({
        next: (response) => {
          this.sales.set(response.data.sales);
          this.totalRecords = response.data.total;
          this.loading.set(false);
        },
        error: (error) => {
          this.loading.set(false);
        },
      });
  }

  // metdo para cerrar el modal y limpiar los campos
  handleAddSaleModalClose() {
    this.showModalAddSale.set(false);
  }

  /**
   * Maneja el cambio de página
   */
  onPageChange(event: any) {
    this.currentPage = event.page + 1;
    this.rows = event.rows;
    this.first = event.first;
    this.loadSales();
  }

  /**
   * cancelar uan venta
   */
  cancelSale(sale: any): void {
    const ref = this.dialogService.open(DialogComponent, {
      header: 'Cancelar Venta',
      modal: true,
      contentStyle: { overflow: 'auto' },
      breakpoints: {
        '960px': '65vw',
        '640px': '60vw',
      },
      data: {
        type: 'warning',
        message: `¿Estás seguro de que deseas cancelar la venta con ID: ${sale.codeSale}?`,
        confirmText: 'Sí, Confirmar',
        cancelText: 'No, Cancelar',
        showCancel: true,
      },
    });

    ref.onClose.subscribe((confirmed: boolean) => {
      if (confirmed) {
        const data = {
          codeSale: sale.codeSale,
          updatedBy: this._localStorage.getUserId(),
        };
        this._salesService.cancelSale(data).subscribe({
          next: (response) => {
            this.loadSales();
            this._messageService.add({
              severity: 'success',
              summary: 'Venta Cancelada',
              detail: response.message,
            });
          },
          error: (err) => {
            this._messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: err.error?.message || 'No se pudo cancelar la venta',
              life: 3000,
            });
          },
        });
      }
    });
  }

  viewSaleDetails(sale: any): void {
    const ref = this.dialogService.open(SaleDetailsComponent, {
      header: 'Detalle de Venta',
      modal: true,
      closable: true,
      maximizable: true,
      contentStyle: { overflow: 'auto' },
      breakpoints: {
        '960px': '75vw',
        '640px': '90vw',
      },
    });
  }

  handleRefreshData() {
    this.loadSales();
  }

  viewSaleDetailsPdf(sale: any): void {
    const ref = this.dialogService.open(SaleDetailsPdfComponent, {
      header: 'Detalle de Venta PDF',
      modal: true,
      width: '50vw',
      height: 'auto',
      closable: true,
      maximizable: true,
      data: {
        codeSale: sale.codeSale,
      },
      contentStyle: { overflow: 'auto' },
      breakpoints: {
        '960px': '75vw',
        '640px': '90vw',
      },
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

  editSale(codeSale: string): void {
    if (!codeSale) {
      this._messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'No se ha seleccionado ninguna venta para editar.',
      });
      return;
    }
    this.codeSaleSelected.set(codeSale);
    this.showModalEditSale.set(true);
  }
}
