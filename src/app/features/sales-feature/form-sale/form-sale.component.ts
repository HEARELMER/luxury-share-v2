import { Component, inject, model, output, signal } from '@angular/core';
import { ModalComponent } from '../../../shared/components/ui/modal/modal.component';
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
import { SalesService } from '../../../core/services/sales-services/sales.service';
import { ClientsService } from '../../../core/services/clients-services/clients.service';
import { FilterEmptyValuesPipe } from '../../../shared/pipes/filter-empty-value.pipe';
import { Step1ClientFormComponent } from './steps/step1-client-form/step1-client-form.component';
import { Step2SaleFormComponent } from './steps/step2-sale-form/step2-sale-form.component';
import { SaleCreationResult } from '../interfaces/sale-creation-result.interface';
import { Step3SummarySaleComponent } from './steps/step3-summary-sale/step3-summary-sale.component';
import { SalePdfService } from '../../../core/services/sales-services/sale-pdf.service';
import { LocalstorageService } from '../../../core/services/localstorage-services/localstorage.service';
@Component({
  selector: 'app-form-sale',
  imports: [
    Toast,
    StepperModule,
    FormsModule,
    ReactiveFormsModule,
    ModalComponent,
    ButtonModule,
    Step1ClientFormComponent,
    Step2SaleFormComponent,
    Step3SummarySaleComponent,
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
  private readonly _pdfSaleService = inject(SalePdfService);
  private readonly _localStorageService = inject(LocalstorageService);
  // Signals,variables constantes y outputs
  saleCreationResult = signal<SaleCreationResult | null>(null);
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
  isCompleted = signal<boolean>(false);

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
    registeredBy: [this._localStorageService.getUserId()],
  });

  closeModal() {
    this.showModal.set(false);
    if (this.isCompleted()) {
      this.refreshData.emit();
    }
  }

  createClient(activateCallback: (step: number) => void) {
    this.loading.set(true);
    if (this.currentClient()) {
      this.stepsCompleted.update((steps) => ({ ...steps, 1: true }));
      this.loading.set(false);
      this.currentStep.set(2);
      activateCallback(2);
    } else if (this.clientForm.valid) {
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

  handleSaleCreationResult(result: any): void {
    this.saleCreationResult.set(result);
    if (result.status === 'COMPLETED') {
      this.isCompleted.set(true);
    }
    this.currentStep.set(3);
  }

  // Verificar si se puede navegar a un paso
  canActivateStep(step: number): boolean {
    // El paso 1 siempre está disponible
    if (step === 1) return true;
    // Para los demás pasos, verificar si el anterior está completado
    return this.stepsCompleted()[step - 1] === true;
  }

  downloadReceipt() {
    if (this.saleCreationResult()) {
      const code = this.saleCreationResult()?.codeSale || '';
      this._pdfSaleService.downloadSaleDetailsPdf(code);
    }
  }

  restartSale() {
    this.clientForm.reset();
    this.currentClient.set(null);
    this.saleCreationResult.set(null);
    this.stepsCompleted.update((steps) => ({ ...steps, 1: false, 2: false }));
    this.currentStep.set(1);
    this.showModal.set(false);
    this.refreshData.emit();
  }
}
