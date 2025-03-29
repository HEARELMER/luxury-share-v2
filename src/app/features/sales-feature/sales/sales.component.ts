import { Component, inject, signal } from '@angular/core';
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
import { FilterOptions } from '../../../core/interfaces/api/filters';
import { MessageService } from 'primeng/api';
import { SaleDetailsPdfComponent } from '../sale-details-pdf/sale-details-pdf.component';
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
  ],
  templateUrl: './sales.component.html',
  styleUrl: './sales.component.scss',
  providers: [DialogService],
})
export class SalesComponent {
  public readonly dialogService = inject(DialogService);
  private readonly _salesService = inject(SalesService);
  private readonly _messageService = inject(MessageService);
  constructor() {
    this.loadSales();
  }
  // signlas
  showModalAddSale = signal<boolean>(false);
  loading = signal<boolean>(false);
  filterSaleByCodeSale = signal<string>('');
  sales = signal<any[]>([]);
  filters = signal<{ key: string; value: string }[]>([]);

  // Configuración de tabla
  salesTableColumns = SALES_TABLE_COLUMNS;
  currentPage = 1;
  pageSize = 5;
  totalRecords = 0;
  rowsPerPageOptions = [5, 10, 20, 50];
  first = 0;
  rows = 5;
  openAddSaleModal() {
    this.showModalAddSale.set(true);
  }

  searchSale() {
    if (this.filterSaleByCodeSale()) {
      this.filters.set([
        { key: 'saleCode', value: this.filterSaleByCodeSale() },
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
          updatedBy: '73464945',
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
}
