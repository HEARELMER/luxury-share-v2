import { Component, inject, model, output } from '@angular/core';
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
import { Button, ButtonModule } from 'primeng/button';
import { ServicesPackagesSaleFormComponent } from '../templates/services-packages-sale-form/services-packages-sale-form.component';
import { SalesService } from '../../../core/services/sales-services/sales.service';
import { ClientsService } from '../../../core/services/clients-services/clients.service';
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
    ModalComponent, ButtonModule
  ],
  templateUrl: './form-sale.component.html',
  styleUrl: './form-sale.component.scss',
})
export class FormSaleComponent {
  // Inyección de dependencias
  private readonly _fb = inject(FormBuilder);
  private readonly _salesService = inject(SalesService);
  private readonly _clientsService = inject(ClientsService);

  // Signals,variables constantes y outputs
  addSaleSteps = ADD_SALES_STEPS;
  showModal = model<boolean>(false);
  refreshData = output<void>();

  // 90942334 :dni primer cliente creado
  // forms
  clientForm = this._fb.group({
    typeDocument: ['', [Validators.required]],
    numberDocument: ['', [Validators.minLength(8), Validators.maxLength(20)]],
    name: ['', [Validators.required]],
    firstLastname: ['', [Validators.required]],
    secondLastname: ['', [Validators.required]],
    email: ['', [Validators.email]],
    phone: ['', [Validators.required, Validators.minLength(9)]],
    birthDate: [''],
    registeredBy: [''],
    clientId:['']
  });

  closeModal() {
    this.showModal.set(false);
  }

  createClient() {
    if (this.clientForm.valid) {
      this.clientForm.patchValue({
        registeredBy: '34203588',
      });
      this._clientsService.createClient(this.clientForm.value).subscribe(() => {
        console.log('Cliente creado');
      });
    }
  }

  searchClientByDni() {
    const dni = this.clientForm.get('numberDocument')?.value;
    if (dni) {
      this._clientsService.searchClientByDniOnlyForSales(dni).subscribe((client) => {
        if (client) {
          console.log(client);
          this.clientForm.patchValue({
            name: client.name,
            firstLastname: client.firstLastname,
            secondLastname: client.secondLastname,
            email: client.email,
            phone: client.phone,
            birthDate: client.birthDate,
          });
        } else {
          console.log('Cliente no encontrado');
        }
      });
    }
  }
}
