import {
  Component,
  effect,
  inject,
  input,
  model,
  output,
  signal,
} from '@angular/core';
import { ModalComponent } from '../../../shared/components/ui/modal/modal.component';
import { InputFormComponent } from '../../../shared/components/forms/input-form/input-form.component';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { LocalstorageService } from '../../../core/services/localstorage-services/localstorage.service';
import { ADD_CLIENT_DOCUMENT_TYPE } from '../constants/add-client.constant';
import { SelectComponent } from '../../../shared/components/forms/select/select.component';
import { DatePipe, JsonPipe, NgClass } from '@angular/common';
import { SalesService } from '../../../core/services/sales-services/sales.service';
import { MessageService } from 'primeng/api';
import { ButtonComponent } from '../../../shared/components/ui/button/button.component';
import { ClientsService } from '../../../core/services/clients-services/clients.service';

@Component({
  selector: 'app-edit-form-sale',
  imports: [
    ModalComponent,
    InputFormComponent,
    ReactiveFormsModule,
    FormsModule,
    SelectComponent,
    DatePipe,
    NgClass,
    ButtonComponent,
  ],
  templateUrl: './edit-form-sale.component.html',
  styleUrl: './edit-form-sale.component.scss',
})
export class EditFormSaleComponent {
  private readonly _fb = inject(FormBuilder);
  private readonly _saleService = inject(SalesService);
  private readonly _messageService = inject(MessageService);
  private readonly _clientsService = inject(ClientsService);

  // originalClientData = signal<any>(null);
  showModal = model<boolean>(false);
  codeSale = input<any>(null);
  refreshData = output<void>();
  isCompleted = signal<boolean>(false);
  documentTypes = ADD_CLIENT_DOCUMENT_TYPE;
  saleData = signal<any>(null);
  loading = signal<boolean>(false);
  clientId = signal<string | null>(null);

  clientForm = this._fb.group({
    typeDocument: ['', [Validators.required]],
    numberDocument: ['', [Validators.minLength(8), Validators.maxLength(20)]],
    name: [
      '',
      [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/)],
    ],
    firstLastname: [
      '',
      [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/)],
    ],
    secondLastname: [
      '',
      [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/)],
    ],
    email: ['', [Validators.email]],
    phone: ['', [Validators.required, Validators.minLength(9)]],
    birthDate: ['', [Validators.required]],
    // updatedBy: [this._localStorageService.getUserId()],
    nationality: [
      '',
      [
        Validators.minLength(3),
        Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/),
      ],
    ],
  });

  constructor() {
    effect(() => {
      if (this.showModal()) {
        this.loadSaleData();
      }
    });
  }

  closeModal() {
    this.showModal.set(false);
    if (this.isCompleted()) {
      this.refreshData.emit();
    }
  }

  loadSaleData() {
    this._saleService.getSaleByCodeSale(this.codeSale()).subscribe({
      next: (sale) => {
        if (sale) {
          this.clientForm.patchValue(sale.client);
          // this.originalClientData.set(sale.client);
          this.clientForm.markAsPristine();
          this.clientId.set(sale.client.clientId);
          this.saleData.set(sale);
          this.isCompleted.set(true);
        }
      },
      error: (error) => {
        this._messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo cargar la información de la venta.',
        });
        this.isCompleted.set(false);
      },
    });
  }

  updateStatusSale(saleId: string) {
    const status = 'PAGADO';
    this.loading.set(true);
    this._saleService.updateSaleStatus(saleId, status).subscribe({
      next: () => {
        this._messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: `Venta actualizada a estado ${status}.`,
        });
        this.isCompleted.set(true);
        this.loading.set(false);
        this.saleData.set(null);
        this.clientForm.reset();
        this.closeModal();
      },
      error: (error) => {
        this._messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo actualizar el estado de la venta.',
        });
        this.loading.set(false);
      },
    });
  }

  updateClientForm() {
    if (this.clientForm.valid) {
      const clientData = this.clientForm.value;
      this._clientsService
        .updateClient(this.clientId() as string, clientData)
        .subscribe({
          next: () => {
            this._messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Información del cliente actualizada correctamente.',
            });
            this.isCompleted.set(true);
            this.closeModal();
          },
          error: (error) => {
            this._messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'No se pudo actualizar la información del cliente.',
            });
          },
        });
    } else {
      this._messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Por favor, complete todos los campos requeridos.',
      });
    }
  }
}
