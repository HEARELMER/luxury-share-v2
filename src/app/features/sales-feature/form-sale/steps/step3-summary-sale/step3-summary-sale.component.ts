import { Component, input, output } from '@angular/core';
import { SaleCreationResult } from '../../../interfaces/sale-creation-result.interface';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
@Component({
  selector: 'app-step3-summary-sale',
  imports: [CommonModule, ButtonModule, TagModule],
  templateUrl: './step3-summary-sale.component.html',
  styleUrl: './step3-summary-sale.component.scss',
})
export class Step3SummarySaleComponent {
  saleCreationResult = input<SaleCreationResult | null>(null);
  restart = output<void>();
  close = output<void>();
  viewSale = output<string>();
  download = output<void>();
  sendEmail = output<void>();

  restartProcess() {
    this.restart.emit();
  }

  closeDialog() {
    this.close.emit();
  }

  viewSaleDetails(): void {
    if (this.saleCreationResult()?.codeSale) {
      this.viewSale.emit(this.saleCreationResult()?.codeSale || '');
    }
  }

  downloadReceipt(): void {
    this.download.emit();
  }

  sendReceiptByEmail(): void {
    this.sendEmail.emit();
  }
}
