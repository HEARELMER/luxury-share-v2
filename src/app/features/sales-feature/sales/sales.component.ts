import { Component, inject, signal } from '@angular/core';
import { ButtonComponent } from '../../../shared/components/ui/button/button.component';
import { ExportExcelComponent } from '../../../shared/components/layout/export-excel/export-excel.component';
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
import { AddBranchComponent } from '../../branches-feature/add-branch/add-branch.component';
import { SalesService } from '../../../core/services/sales-services/sales.service';
import { DialogComponent } from '../../../shared/components/ui/dialog/dialog.component';
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
    Tag
],
  templateUrl: './sales.component.html',
  styleUrl: './sales.component.scss',
  providers: [DialogService],
})
export class SalesComponent {
  public readonly dialogService = inject(DialogService);
  private readonly _salesService = inject(SalesService);
  constructor(){
    this.loadSales();
  }
  showModalAddSale = signal<boolean>(false);
  sales = signal<any[]>([]);
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

  loadSales() {
    this._salesService
      .getSales(this.currentPage, this.pageSize)
      .subscribe((response) => {
        this.sales.set(response.data.sales);
        this.totalRecords = response.data.total;
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
        // this._salesService.cancelSale(sale.id).subscribe({
        // next: () => {
        //   this.loadSales();
        //   console.log(`Venta con ID: ${sale.id} cancelada exitosamente.`);
        // },
        // error: (err) => {
        //   console.error('Error al cancelar la venta:', err);
        // },
        // });
      } else {
        console.log('Cancelación de venta abortada por el usuario.');
      }
      });
    }
}
