import { Component, inject, signal } from '@angular/core';
import { ButtonComponent } from '../../../shared/components/ui/button/button.component';
import { ExportExcelComponent } from '../../../shared/components/layout/export-excel/export-excel.component';
import { FormSaleComponent } from '../form-sale/form-sale.component';
import { DialogService } from 'primeng/dynamicdialog';
@Component({
  selector: 'app-sales',
  imports: [
    ExportExcelComponent,
    FormSaleComponent,
    ButtonComponent
],
  templateUrl: './sales.component.html',
  styleUrl: './sales.component.scss',
  providers: [DialogService],
})
export class SalesComponent {
  public readonly dialogService = inject(DialogService);
  showModalAddSale = signal<boolean>(false);

  openAddSaleModal() {
    this.showModalAddSale.set(true);
  }

  // metdo para cerrar el modal y limpiar los campos
  handleAddSaleModalClose() {
    this.showModalAddSale.set(false);
  }

}
