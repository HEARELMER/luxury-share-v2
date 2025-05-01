import {
  Component,
  effect,
  inject,
  input,
  model,
  output,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ClientsService } from '../../../core/services/clients-services/clients.service';
import { InputFormComponent } from '../../../shared/components/forms/input-form/input-form.component';
import { ButtonComponent } from '../../../shared/components/ui/button/button.component';
import { SelectComponent } from '../../../shared/components/forms/select/select.component';
import { ModalComponent } from '../../../shared/components/ui/modal/modal.component';
import { ButtonModule } from 'primeng/button';
import { LocalstorageService } from '../../../core/services/localstorage-services/localstorage.service';
import { FilterEmptyValuesPipe } from '../../../shared/pipes/filter-empty-value.pipe';
import { ADD_CLIENT_DOCUMENT_TYPE } from '../constants/add-client.constant';

@Component({
  selector: 'app-form-client',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    InputFormComponent,
    ButtonComponent,
    SelectComponent,
    ModalComponent,
    ButtonModule,
  ],
  templateUrl: './form-client.component.html',
  styleUrl: './form-client.component.scss',
})
export class FormClientComponent {
  private readonly _messageService = inject(MessageService);
  private readonly _fb = inject(FormBuilder);
  private readonly _clientsService = inject(ClientsService);
  private readonly _localStorageService = inject(LocalstorageService);
  private readonly _filterEmptyValues = inject(FilterEmptyValuesPipe);
  showModal = model<boolean>(false);
  isEditing = signal<boolean>(false);
  clientToEdit = input<any>(null);
  refreshData = output<void>();
  loading = signal<boolean>(false);
  documentTypes = ADD_CLIENT_DOCUMENT_TYPE;

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
    registeredBy: [this._localStorageService.getUserId()],
    clientId: [''],
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
      if (this.clientToEdit() !== null) {
        this.isEditing.set(true);
        this.clientForm.patchValue(this.clientToEdit());
      }
    });
  }

  createClient() {
    this.loading.set(true);
    const filteredValues = this._filterEmptyValues.transform(
      this.clientForm.value
    );
    this._clientsService.createClient(filteredValues).subscribe({
      next: (response: any) => {
        this._messageService.add({
          severity: 'success',
          summary: 'Cliente creado',
          detail: response.message,
        });
        this.closeModal();
        this.refreshData.emit();
        this.loading.set(false);
      },
      error: (error) => {
        this._messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error.message,
        });
        this.loading.set(false);
      },
    });
  }

  updateClient() {
    this.loading.set(true);
    //el bakcned no acpeta estos campos lo ponemos como vacio para no enviar nada
    const clientId = this.clientForm.get('clientId')?.value || '';
    this.clientForm.patchValue({
      registeredBy: null,
      clientId: null,
    });
    const filteredValues = this._filterEmptyValues.transform(
      this.clientForm.value
    );
    this._clientsService.updateClient(clientId, filteredValues).subscribe({
      next: (response: any) => {
        this._messageService.add({
          severity: 'success',
          summary: 'Cliente actualizado',
          detail: response.message,
        });
        this.closeModal();
        this.refreshData.emit();
        this.loading.set(false);
      },
      error: (error) => {
        this._messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error.message,
        });
        this.loading.set(false);
      },
      
    });
  }

  onSubmit() {
    if (this.clientForm.valid) {
      if (this.isEditing()) {
        this.updateClient();
      } else {
        this.createClient();
      }
    }
  }

  searchClientByDni() {
    const dni = this.clientForm.get('numberDocument')?.value;
    if (dni) {
      this._clientsService
        .searchClientByDniApiExternal(dni)
        .subscribe((client) => {
          console.log(client);
          if (client) {
            this.clientForm.patchValue(client);
          }
        });
    }
  }

  closeModal() {
    this.showModal.set(false);
    this.clientForm.reset();
    this.isEditing.set(false);
  }
}
