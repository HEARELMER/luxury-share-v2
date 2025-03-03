import { Component, inject, model, signal } from '@angular/core';
import { InputFormComponent } from '../../../shared/components/forms/input-form/input-form.component';
import { ModalComponent } from '../../../shared/components/ui/modal/modal.component';
import { SelectComponent } from '../../../shared/components/forms/select/select.component';
import { ButtonComponent } from '../../../shared/components/ui/button/button.component';
import { FormBuilder } from '@angular/forms';
import { Toast } from 'primeng/toast';
import { StepperModule } from 'primeng/stepper';
import { ADD_SALES_STEPS } from '../constants/add-sales.constant';
import { CommonModule } from '@angular/common';
import { Button } from 'primeng/button';
@Component({
  selector: 'app-add-sale',
  imports: [
    InputFormComponent ,
    ModalComponent,
    SelectComponent,
    ButtonComponent,
    Toast,
    StepperModule, 
    Button
  ],
  templateUrl: './add-sale.component.html',
  styleUrl: './add-sale.component.scss',
})
export class AddSaleComponent {
  private readonly _fb = inject(FormBuilder);
  addSaleSteps = ADD_SALES_STEPS;

  showModal = model<boolean>(false);

  closeModal() {
    this.showModal.set(false);
  }
}
