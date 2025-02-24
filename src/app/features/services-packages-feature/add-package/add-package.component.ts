import {
  ChangeDetectorRef,
  Component,
  effect,
  inject,
  input,
  model,
  output,
  signal,
} from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';
import { ServicesService } from '../../../core/services/services_packages-services/services.service';
import { InputFormComponent } from '../../../shared/components/forms/input-form/input-form.component';
import { SelectComponent } from '../../../shared/components/forms/select/select.component';
import { ButtonComponent } from '../../../shared/components/ui/button/button.component';
import { ModalComponent } from '../../../shared/components/ui/modal/modal.component';
import {
  SERVICE_FILTER_BY_TYPE,
  SERVICE_TYPES,
} from '../constants/service-types.contant';
import { CommonModule } from '@angular/common';
import { PickListModule } from 'primeng/picklist';
import { Tag } from 'primeng/tag';
import { PickList } from 'primeng/picklist';
import { PaginatorModule } from 'primeng/paginator';
@Component({
  selector: 'app-add-package',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    ButtonComponent,
    InputFormComponent,
    ModalComponent,
    Toast,
    SelectComponent,
    PickListModule,
    CommonModule,
    Tag,
    PickList,
    PaginatorModule,
  ],
  templateUrl: './add-package.component.html',
  styleUrl: './add-package.component.scss',
})
export class AddPackageComponent {
  private readonly _fb = inject(FormBuilder);
  private readonly _serviceService = inject(ServicesService);
  private readonly _messageService = inject(MessageService);
  private readonly _cdr = inject(ChangeDetectorRef);

  sourceServices = signal<any[]>([]);
  targetServices = signal<any[]>([]);
  loading = signal<boolean>(false);
  currentPage = 1;
  pageSize = 5;
  totalRecords = 0;
  filterServiceByType = SERVICE_FILTER_BY_TYPE;

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
    registeredBy: ['', Validators.minLength(8)],
  });

  constructor() {
    effect(() => {
      if (this.showModal()) {
        this.loadServices();
      }
      if (this.showModal() && this.serviceToEdit()) {
        this.isEditing.set(true);
        this.serviceForm.patchValue(this.serviceToEdit());
      } else {
        this.isEditing.set(false);
        this.serviceForm.reset();
      }
    });
  }

  loadServices() {
    this.loading.set(true);
    this._serviceService
      .getServices(1, 100, { value: status, key: 'true' })
      .subscribe({
        next: (response) => {
          this.sourceServices.set(response.data.services);
          this.loading.set(false);
          this._cdr.markForCheck();
        },
        error: (error) => {
          this._messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al cargar servicios',
          });
          this.loading.set(false);
        },
      });
  }

  formatValues() {
    this.serviceForm.patchValue({
      registeredBy: '34855749',
      priceUnit: parseFloat(this.serviceForm.value.priceUnit),
    });
  }

  onSubmit() {
    if (!this.serviceForm.valid) return;
    this.formatValues();
    if (this.isEditing()) {
      this.update(this.serviceForm.value);
    } else {
      this.save(this.serviceForm.value);
    }
  }

  update(data: any) {
    this.isSubmitting.set(true);
    data.serviceId = this.serviceToEdit()?.serviceId;
    this._serviceService.updateService(data).subscribe({
      next: () => {
        this._messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Servicio actualizado correctamente',
        });
        this.closeModal();
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
    this.refreshData.emit();
    this.isSubmitting.set(false);
  }

  updateSelectedServices() {
    const selectedServices = this.targetServices();
    this.serviceForm.patchValue({
      services: selectedServices.map((service) => service.serviceId),
    });

    // Calcular precio total (opcional)
    const totalPrice = selectedServices.reduce(
      (sum, service) => sum + (service.priceUnit || 0),
      0
    );
    this.serviceForm.patchValue({
      priceUnit: totalPrice,
    });
  }

  // Modificar el método save para incluir los servicios
  save(data: any) {
    this.isSubmitting.set(true);
    const payload = {
      ...data,
      services: this.targetServices().map((service) => service.serviceId),
    };

    // ... rest of save logic ...
  }

  calculateTotalPrice(): number {
    return this.targetServices().reduce(
      (sum, service) => sum + (parseFloat(service.priceUnit) || 0),
      0
    );
  }

  onPageChange(event: any) {
    this.currentPage = event.page + 1;
    this.pageSize = event.rows;
    this.loadServices();
  }
}
