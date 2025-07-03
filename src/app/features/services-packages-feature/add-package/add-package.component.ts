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
import { FilterEmptyValuesPipe } from '../../../shared/pipes/filter-empty-value.pipe';
import { LocalstorageService } from '../../../core/services/localstorage-services/localstorage.service';

@Component({
  selector: 'app-add-package',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    ButtonComponent,
    InputFormComponent,
    ModalComponent,
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
  private readonly _filterEmptyValuesPipe = inject(FilterEmptyValuesPipe);
  private readonly _localStorageService = inject(LocalstorageService);

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
  addService = signal<boolean>(false);
  packageForm: FormGroup = this._fb.group({
    name: ['', Validators.required],
    description: ['', Validators.required],
    priceUnit: ['', [Validators.required, Validators.min(0)]],
    registeredBy: [Validators.required],
    services: [[]],
    status: [true],
    packageId: [''],
    duration: ['', [Validators.required, Validators.min(1)]],
  });

  // Guarda los servicios originales del paquete en edición
  private originalServices: any[] = [];
  private originalPrice: number = 0;

  constructor() {
    effect(() => {
      if (this.showModal() && !this.packageDataToEdit()) {
        this.isEditing.set(false);
        this.packageForm.reset();
        this.targetServices.set([]);
        this.originalServices = [];
        this.originalPrice = 0;
        this.loadServices();
        this.packageForm.patchValue({
          registeredBy: this._localStorageService.getUserId(),
        });
      } else if (this.showModal() && this.packageDataToEdit()) {
        this.isEditing.set(true);
        this.packageForm.patchValue(this.packageDataToEdit());
        // Cargar servicios originales y precio original
        const services = this.packageDataToEdit().servicesData || [];
        this.targetServices.set(services);
        this.originalServices = [...services];
        this.originalPrice = this.packageDataToEdit().priceUnit || 0;
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
    this.selectedType.set(option);
    this.currentPage = 1;
    this.loadServices();
  }

  formatValues() {
    this.packageForm.patchValue({
      priceUnit: parseFloat(this.packageForm.value.priceUnit),
      duration: parseFloat(this.packageForm.value.duration),
    });
  }

  onSubmit() {
    if (!this.packageForm.valid) return;

    this.formatValues();
    const filteredValues = this._filterEmptyValuesPipe.transform(
      this.packageForm.value
    );
    if (this.isEditing()) {
      this.update(filteredValues);
    } else {
      this.save(filteredValues);
    }
  }

  update(data: any) {
    if (
      !Array.isArray(data.services) ||
      !data.services.every((item: any) => typeof item === 'string')
    ) {
      data.services = [];
    }

    this.isSubmitting.set(true);
    this._packagesService.updatePackage(data.packageId, data).subscribe({
      next: (response) => {
        this._messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: response.message,
        });
        this.closeModal();
        this.refreshData.emit();
      },
      error: (error) => {
        this._messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.message.message || 'Error al actualizar el paquete',
        });
        this.isSubmitting.set(false);
      },
    });
  }

  closeModal() {
    this.showModal.set(false);
    this.packageForm.reset();
    this.isEditing.set(false);
    this.isSubmitting.set(false);
    this.targetServices.set([]);
    this.originalServices = [];
    this.originalPrice = 0;
  }

  updateSelectedServices() {
    const selectedServices = this.targetServices();
    this.packageForm.patchValue({
      services: selectedServices.map((service) => service.serviceId),
    });

    // Si está en modo edición, sumar solo los precios de los servicios nuevos
    if (this.isEditing()) {
      // Servicios originales (por id)
      const originalIds = new Set(
        this.originalServices.map((s) => s.serviceId)
      );
      // Servicios nuevos agregados
      const newServices = selectedServices.filter(
        (s) => !originalIds.has(s.serviceId)
      );
      // Servicios eliminados
      const removedServices = this.originalServices.filter(
        (s) => !selectedServices.some((sel) => sel.serviceId === s.serviceId)
      );
      // Calcular nuevo precio
      let newPrice = this.originalPrice;

      // Sumar precios de servicios nuevos
      newServices.forEach((s) => {
        newPrice += parseFloat(s.priceUnit) || 0;
      });

      // Restar precios de servicios eliminados
      removedServices.forEach((s) => {
        newPrice -= parseFloat(s.priceUnit) || 0;
      });

      // Evitar negativos
      if (newPrice < 0) newPrice = 0;

      this.packageForm.patchValue({
        priceUnit: newPrice,
      });
    } else {
      // En modo creación, sumar todos los precios
      const totalPrice = selectedServices.reduce(
        (sum, service) => sum + (parseFloat(service.priceUnit) || 0),
        0
      );
      this.packageForm.patchValue({
        priceUnit: totalPrice,
      });
    }
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
        this.refreshData.emit();
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

  onServiceRemoved(event: {
    success: boolean;
    newPrice?: number;
    message?: string;
  }) {
    if (event.success && event.newPrice !== undefined) {
      this.packageForm.patchValue({
        priceUnit: event.newPrice,
      });
      this.refreshData.emit();
      this._messageService.add({
        severity: 'success',
        summary: 'Servicio eliminado',
        detail:
          event.message || 'El servicio se eliminó correctamente del paquete',
      });
    } else {
      this._messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: event.message || 'No se pudo eliminar el servicio del paquete',
      });
    }
  }

  onPageChange(event: any) {
    this.currentPage = event.page + 1;
    this.pageSize = event.rows;
    this.loadServices();
  }
}
