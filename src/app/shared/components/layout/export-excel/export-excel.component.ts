import { CommonModule } from '@angular/common';
import { Component, EventEmitter, input, model, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonComponent } from '../../ui/button/button.component';
import { ModalComponent } from '../../ui/modal/modal.component';

@Component({
  selector: 'app-export-excel',
  imports: [
    CommonModule,
    FormsModule,
    ButtonComponent,
    ReactiveFormsModule,
    ModalComponent,
  ],
  templateUrl: './export-excel.component.html',
  styleUrl: './export-excel.component.scss',
})
export class ExportExcelComponent {
  showModal = model<boolean>(false);
  title = input<string>('Export Excel');
  total = input<number>();
  @Output() exportData = new EventEmitter<number>();
  selectedQuantity: number = 10;
  quantityOptions = [10, 20, 50, 100, -1];

  selectOption(option: number) {
    if (option === -1) {
      this.selectedQuantity = this.total() || 0;
    } else {
      this.selectedQuantity = option;
    }
  }
}
