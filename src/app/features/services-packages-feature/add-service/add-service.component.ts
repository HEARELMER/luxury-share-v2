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
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ServicesService } from '../../../core/services/services_packages-services/services.service';
import { ModalComponent } from '../../../shared/components/ui/modal/modal.component';
import { ButtonComponent } from '../../../shared/components/ui/button/button.component';
import { InputFormComponent } from '../../../shared/components/forms/input-form/input-form.component';
import { Toast } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { SERVICE_TYPES } from '../constants/service-types.contant';
import { SelectComponent } from '../../../shared/components/forms/select/select.component';
import { FilterEmptyValuesPipe } from '../../../shared/pipes/filter-empty-value.pipe';
import { JsonPipe } from '@angular/common';
import { LocalstorageService } from '../../../core/services/localstorage-services/localstorage.service';
@Component({
  selector: 'app-add-service',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    ButtonComponent,
    InputFormComponent,
    ModalComponent,
    Toast,
    SelectComponent,
  ],
  templateUrl: './add-service.component.html',
  styleUrl: './add-service.component.scss',
})
export class AddServiceComponent {
  private readonly _fb = inject(FormBuilder);
  private readonly _serviceService = inject(ServicesService);
  private readonly _messageService = inject(MessageService);
  private readonly _filterEmptyValuesPipe = inject(FilterEmptyValuesPipe);
  private readonly _localStorageService = inject(LocalstorageService);

  showModal = model<boolean>(false);
  refreshData = output<void>();
  isEditing = signal<boolean>(false);
  serviceToEdit = input<any>(null);
  serviceTypeOptions = SERVICE_TYPES;
  isSubmitting = signal<boolean>(false);

  serviceForm: FormGroup = this._fb.group({
    name: ['', Validators.required],
    description: ['', Validators.required],
    priceUnit: ['', [Validators.required, Validators.min(0)]],
    type: ['', Validators.required],
    status: [true],
    registeredBy: ['', Validators.minLength(8)],
    serviceId: [''],
    duration: [24, Validators.required],
  });

  constructor() {
    effect(() => {
      if (this.showModal() && this.serviceToEdit()) {
        this.isEditing.set(true);
        this.serviceForm.patchValue(this.serviceToEdit());
      } else {
        this.isEditing.set(false);
        this.serviceForm.reset();
      }
    });
  }

  formatValues() {
    const formValues = this.serviceForm.value;
    this.serviceForm.patchValue({
      name: formValues.name?.trim(),
      description: formValues.description?.trim(),
      priceUnit: formValues.priceUnit ? parseFloat(formValues.priceUnit) : 0,
      type: formValues.type?.trim(),
      status: Boolean(formValues.status),
      registeredBy: this._localStorageService.getUserId(),
      duration: Number(formValues.duration),
    });
  }

  onSubmit() {
    if (!this.serviceForm.valid) return;
    this.formatValues();
    const filteredValues = this._filterEmptyValuesPipe.transform(
      this.serviceForm.value
    );
    if (this.isEditing()) {
      this.update(filteredValues);
    } else {
      this.save(filteredValues);
    }
  }

  save(data: any) {
    this.isSubmitting.set(true);
    this._serviceService.createService(data).subscribe({
      next: () => {
        this._messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Servicio creado correctamente',
        });
        this.closeModal();
        this.refreshData.emit();
      },
      error: (response) => {
        this._messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: response.error.message || 'Error al crear el servicio',
        });
        this.isSubmitting.set(false);
      },
    });
  }

  update(data: any) {
    this.isSubmitting.set(true);
    this._serviceService.updateService(data.serviceId, data).subscribe({
      next: () => {
        this._messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Servicio actualizado correctamente',
        });
        this.closeModal();
        this.refreshData.emit();
      },
      error: (response) => {
        this._messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: response.error.message || 'Error al actualizar el servicio',
        });
        this.isSubmitting.set(false);
      },
    });
  }

  closeModal() {
    this.showModal.set(false);
    this.serviceForm.reset();
    this.isEditing.set(false);
    this.isSubmitting.set(false);
  }
}
