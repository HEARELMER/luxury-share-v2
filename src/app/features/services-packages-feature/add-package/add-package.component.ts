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
import { Filter } from '../../../core/interfaces/api/filters';
import { PackagesService } from '../../../core/services/services_packages-services/packages.service';
import { ViewServicesToPackageComponent } from '../templates/view-services-to-package/view-services-to-package.component';
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
    ViewServicesToPackageComponent,
  ],
  templateUrl: './add-package.component.html',
  styleUrl: './add-package.component.scss',
})
export class AddPackageComponent {
  private readonly _fb = inject(FormBuilder);
  private readonly _serviceService = inject(ServicesService);
  private readonly _messageService = inject(MessageService);
  private readonly _packagesService = inject(PackagesService);

  sourceServices = signal<any[]>([]);
  targetServices = signal<any[]>([]);
  loading = signal<boolean>(false);
  currentPage = 1;
  pageSize = 5;
  totalRecords = 0;
  filterServiceByType = SERVICE_FILTER_BY_TYPE;
  selectedType = signal<string>('');

  showModal = model<boolean>(false);
  refreshData = output<void>();
  isEditing = signal<boolean>(false);
  serviceTypeOptions = SERVICE_TYPES;
  isSubmitting = signal<boolean>(false);
  packageDataToEdit = input<any>({});
  changed = output<boolean>();

  addService = signal<boolean>(false);
  packageForm: FormGroup = this._fb.group({
    name: ['', Validators.required],
    description: ['', Validators.required],
    priceUnit: ['', [Validators.required, Validators.min(0)]],
    registeredBy: ['34855749'],
    services: [[]],
    status: [true],
  });

  constructor() {
    effect(() => {
      if (this.showModal() && !this.packageDataToEdit()) {
        this.loadServices();
      } else if (this.showModal() && this.packageDataToEdit()) {
        this.isEditing.set(true);
        this.packageForm.patchValue(this.packageDataToEdit());
        this.loadServices();
      }
    });
  }

  loadServices() {
    if (!this.showModal()) return;
    this.loading.set(true);
    const filters: Filter[] = [{ key: 'status', value: 'true' }];

    const type = this.selectedType();
    if (type) {
      filters.push({ key: 'type', value: type });
    }

    this._serviceService
      .getServices(this.currentPage, this.pageSize, filters)
      .subscribe({
        next: (response) => {
          this.sourceServices.set(response.data.services);
          this.totalRecords = response.data.total;
          this.loading.set(false);
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

  onFilterChange(option: string) {
    console.log(option);
    this.selectedType.set(option);
    this.currentPage = 1; // Reset paginación
    this.loadServices();
  }

  formatValues() {
    this.packageForm.patchValue({
      registeredBy: '34855749',
      priceUnit: parseFloat(this.packageForm.value.priceUnit),
    });
  }

  onSubmit() {
    if (!this.packageForm.valid) return;
    this.formatValues();
    if (this.isEditing()) {
      this.update(this.packageForm.value);
    } else {
      this.save(this.packageForm.value);
    }
  }

  update(data: any) {
    this.isSubmitting.set(true);
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
    this.packageForm.reset();
    this.isEditing.set(false);
    this.refreshData.emit();
    this.isSubmitting.set(false);
  }

  updateSelectedServices() {
    const selectedServices = this.targetServices();
    this.packageForm.patchValue({
      services: selectedServices.map((service) => service.serviceId),
    });
    const totalPrice = selectedServices.reduce(
      (sum, service) => sum + (service.priceUnit || 0),
      0
    );
    this.packageForm.patchValue({
      priceUnit: totalPrice,
    });
  }

  save(data: any) {
    this.isSubmitting.set(true);
    this._packagesService.createPackage(data).subscribe({
      next: (response) => {
        this._messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: response.message,
        });
        this.closeModal();
      },
      error: (error) => {
        this._messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.message.message || 'Error al crear el paquete',
        });
        this.isSubmitting.set(false);
      },
    });
  }

  calculateTotalPrice(): number {
    return this.targetServices().reduce(
      (sum, service) => sum + (parseFloat(service.priceUnit) || 0),
      0
    );
  }

  onServiceRemoved(event: { success: boolean; newPrice?: number }) {
    if (event.success && event.newPrice !== undefined) {
      // Actualizar el precio en el formulario
      this.packageForm.patchValue({
        priceUnit: event.newPrice,
      });
      this.changed.emit(true);
      this._messageService.add({
        severity: 'success',
        summary: 'Servicio eliminado',
        detail: 'El servicio se eliminó correctamente del paquete',
      });
    } else {
      this._messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudo eliminar el servicio del paquete',
      });
    }
  }

  onPageChange(event: any) {
    this.currentPage = event.page + 1;
    this.pageSize = event.rows;
    this.loadServices();
  }
}
