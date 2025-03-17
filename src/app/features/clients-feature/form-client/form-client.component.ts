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

  showModal = model<boolean>(false);
  isEditing = signal<boolean>(false);
  clientToEdit = input<any>(null);
  refreshData = output<void>();

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
    clientId: [''],
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
    if (this.clientForm.valid) {
      this.clientForm.patchValue({
        registeredBy: '34203588',
      });
      console.log(this.clientForm.value);
      const filteredValues = this.filterEmptyValues(this.clientForm.value);
      console.log(filteredValues);
      this._clientsService.createClient(filteredValues).subscribe({
        next: (response: any) => {
          this._messageService.add({
            severity: 'success',
            summary: 'Cliente creado',
            detail: response.message,
          });
          this.closeModal();
          this.refreshData.emit();
        },
      });
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

  private filterEmptyValues(formValues: any): any {
    return Object.keys(formValues)
      .filter((key) => formValues[key] !== null && formValues[key] !== '')
      .reduce((obj: any, key) => {
        obj[key] = formValues[key];
        return obj;
      }, {});
  }

  closeModal() {
    this.showModal.set(false);
    this.clientForm.reset();
    this.isEditing.set(false);
  }
}
