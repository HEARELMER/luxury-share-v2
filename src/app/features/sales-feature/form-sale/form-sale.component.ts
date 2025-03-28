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
import { Button, ButtonModule } from 'primeng/button';
import { ServicesPackagesSaleFormComponent } from '../templates/services-packages-sale-form/services-packages-sale-form.component';
import { SalesService } from '../../../core/services/sales-services/sales.service';
import { ClientsService } from '../../../core/services/clients-services/clients.service';
import { FilterEmptyValuesPipe } from '../../../shared/pipes/filter-empty-value.pipe';
import { Step1ClientFormComponent } from './steps/step1-client-form/step1-client-form.component';
import { Step2SaleFormComponent } from './steps/step2-sale-form/step2-sale-form.component';
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
    ModalComponent,
    ButtonModule,
    Step1ClientFormComponent,
    Step2SaleFormComponent,
  ],
  templateUrl: './form-sale.component.html',
  styleUrl: './form-sale.component.scss',
})
export class FormSaleComponent {
  // Inyección de dependencias
  private readonly _fb = inject(FormBuilder);
  private readonly _salesService = inject(SalesService);
  private readonly _clientsService = inject(ClientsService);
  private readonly _filterEmmptyValues = inject(FilterEmptyValuesPipe);

  // Signals,variables constantes y outputs
  currentClient = signal<any>(null);
  currentStep = signal<number>(1);
  stepsCompleted = signal<{ [key: number]: boolean }>({
    1: false,
    2: false,
    3: false,
  });
  loading = signal<boolean>(false);
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
  });

  closeModal() {
    this.showModal.set(false);
  }

  createClient(activateCallback: (step: number) => void) {
    this.loading.set(true);
    if (this.clientForm.valid) {
      this.clientForm.patchValue({
        registeredBy: '73464945',
      });
      console.log(this.clientForm.value);
      const filteredValues = this._filterEmmptyValues.transform(
        this.clientForm.value
      );
      this._clientsService.createClient(filteredValues).subscribe({
        next: (response) => {
          this.stepsCompleted.update((steps) => ({ ...steps, 1: true }));
          this.loading.set(false);
          this.currentStep.set(2);
          this.currentClient.set(response.data);
          activateCallback(2);
        },
      });
    }
  }

  confirmSale(activateCallback: (step: number) => void) {
    this.stepsCompleted.update((steps) => ({ ...steps, 2: true }));
    this.loading.set(false);
    this.currentStep.set(2);
    activateCallback(3);
  }

  searchClientByDni() {
    const dni = this.clientForm.get('numberDocument')?.value;
    if (dni) {
      this._clientsService.searchClientByDni(dni).subscribe((client) => {
        if (client) {
          this.clientForm.patchValue(client);
          this.currentClient.set(client);
        } else {
          this._clientsService
            .searchClientByDniApiExternal(dni)
            .subscribe((client) => {
              if (client) {
                this.clientForm.patchValue(client);
              }
            });
        }
      });
    }
  }

  goToPreviousStep(activateCallback: (step: number) => void): void {
    this.currentStep.set(this.currentStep() - 1);
    activateCallback(this.currentStep());
  }

  // Verificar si se puede navegar a un paso
  canActivateStep(step: number): boolean {
    // El paso 1 siempre está disponible
    if (step === 1) return true;
    // Para los demás pasos, verificar si el anterior está completado
    return this.stepsCompleted()[step - 1] === true;
  }
}
