import { Component, inject, model, output, signal } from '@angular/core';
import { InputFormComponent } from '../../../shared/components/forms/input-form/input-form.component';
import { ModalComponent } from '../../../shared/components/ui/modal/modal.component';
import { SelectComponent } from '../../../shared/components/forms/select/select.component';
import { ButtonComponent } from '../../../shared/components/ui/button/button.component';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Toast } from 'primeng/toast';
import { StepperModule } from 'primeng/stepper';
import { ADD_SALES_STEPS } from '../constants/add-sales.constant';
import { Button } from 'primeng/button';
import { DatePipe, JsonPipe, NgClass } from '@angular/common';
import { Tag } from 'primeng/tag';
import { ServicesPackagesSaleFormComponent } from '../templates/services-packages-sale-form/services-packages-sale-form.component';
@Component({
  selector: 'app-form-sale',
  imports: [
    InputFormComponent,
    SelectComponent,
    ButtonComponent,
    Toast,
    StepperModule,
    Button,
    FormsModule,
    ReactiveFormsModule,
    ServicesPackagesSaleFormComponent,
    ModalComponent
],
  templateUrl: './form-sale.component.html',
  styleUrl: './form-sale.component.scss',
})
export class FormSaleComponent {
  // Inyección de dependencias
  private readonly _fb = inject(FormBuilder);

  // Signals,variables constantes y outputs
  addSaleSteps = ADD_SALES_STEPS;
  showModal = model<boolean>(false);
  refreshData = output<void>();

  // forms
  clientForm = this._fb.group({
    documentType: ['', [Validators.required]],
    documentNumber: ['', [Validators.minLength(8), Validators.maxLength(20)]],
    name: ['', [Validators.required]],
    firstLastname: ['', [Validators.required]],
    secondLastname: ['', [Validators.required]],
    email: ['', [Validators.email]],
    cellphone: ['', [Validators.required, Validators.minLength(9)]],
    birthDate: [''],
  });

  closeModal() {
    this.showModal.set(false);
  }
}
