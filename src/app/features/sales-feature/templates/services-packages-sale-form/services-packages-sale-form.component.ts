import { CommonModule, CurrencyPipe, JsonPipe } from '@angular/common';
import {
  Component,
  EventEmitter,
  Output,
  signal,
  input,
  inject,
  computed,
  effect,
} from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ServicesService } from '../../../../core/services/services_packages-services/services.service';
import { PackagesService } from '../../../../core/services/services_packages-services/packages.service';
import { SelectButton } from 'primeng/selectbutton';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { Paginator } from 'primeng/paginator';
import { Tooltip } from 'primeng/tooltip';
import { Badge } from 'primeng/badge';
import { InputFormComponent } from '../../../../shared/components/forms/input-form/input-form.component';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CapitalizePipe } from '../../../../shared/pipes/capitalize.pipe';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { SalesService } from '../../../../core/services/sales-services/sales.service';
import { SelectComponent } from '../../../../shared/components/forms/select/select.component';
interface TableState {
  first: number;
  rows: number;
  sortField?: string;
  sortOrder?: number;
  filters?: Record<string, any>;
}
interface ColumnDef {
  field: string;
  header: string;
}

interface SaleItem {
  name: string;
  type?: string;
  priceUnit: number;
  quantity: number;
  description?: string;
  status?: boolean;
}

@Component({
  selector: 'app-services-packages-sale-form',
  imports: [
    CommonModule,
    TableModule,
    InputTextModule,
    TagModule,
    CurrencyPipe,
    SelectButton,
    ButtonModule,
    Paginator,
    Tooltip,
    Badge,
    InputFormComponent,
    FormsModule,
    CapitalizePipe,
    ReactiveFormsModule,
    ButtonComponent,
    SelectComponent, JsonPipe
  ],
  templateUrl: './services-packages-sale-form.component.html',
  styleUrl: './services-packages-sale-form.component.scss',
})
export class ServicesPackagesSaleFormComponent {
  private readonly _servicesService = inject(ServicesService);
  private readonly _packagesService = inject(PackagesService);
  private readonly _salesService = inject(SalesService);
  private readonly _messageService = inject(MessageService);
  private readonly _fb = inject(FormBuilder);

  paymentMethods = [
    { label: 'Efectivo', value: 'Efectivo' },
    { label: 'Tarjeta de crédito', value: 'Tarjeta de crédito' },
    { label: 'Tarjeta de débito', value: 'Tarjeta de débito' },
    { label: 'Transferencia', value: 'Transferencia' },
    { label: 'Otros', value: 'otros' },
  ];
  formSale = this._fb.group({
    clientId: [''],
    branchId: [''],
    dateSale: [''],
    departureDate: [''],
    registeredBy: [''],
    discount: [0],
    // observation: [''],
    details: this._fb.array([]),
    paymentMethod: [0, [Validators.required]],
  });

  constructor() {
    // Efecto para recargar datos cuando cambie la vista
    effect(() => {
      this.currentView();
      this.loadItems();
    });
  }

  serviceColumns: ColumnDef[] = [
    { field: 'name', header: 'Nombre' },
    { field: 'type', header: 'Tipo' },
    { field: 'description', header: 'Descripción' },
    { field: 'priceUnit', header: 'Precio' },
    { field: 'status', header: 'Estado' },
    { field: 'actions', header: 'Acciones' },
  ];

  packageColumns: ColumnDef[] = [
    { field: 'name', header: 'Nombre' },
    { field: 'description', header: 'Descripción' },
    { field: 'priceUnit', header: 'Precio' },
    { field: 'status', header: 'Estado' },
    { field: 'actions', header: 'Acciones' },
  ];

  // Estados
  selectedItems = signal<SaleItem[]>([]);
  discount = signal<any>(0);
  currentView = signal<'services' | 'packages'>('services');

  // Computados
  totalAmount = computed(() =>
    this.selectedItems().reduce(
      (acc, item) => acc + item.priceUnit * item.quantity,
      0
    )
  );

  // Calcular total con descuento
  totalWithDiscount = computed(() =>
    Math.max(0, this.totalAmount() - this.discount())
  );

  // metodo para agregar un item a la venta
  addToSale(newItem: Partial<SaleItem>): void {
    this.selectedItems.update((items: any) => {
      const existingItem = items.find(
        (item: any) => item.name === newItem.name
      );
      if (existingItem) {
        existingItem.quantity += newItem.quantity || 1;
        return [...items];
      }
      return [...items, { ...newItem, quantity: newItem.quantity || 1 }];
    });
    this.updateFormDetails();
  }

  // Actualizar la cantidad de un item en la venta
  updateQuantity(index: number, event: any): void {
    this.selectedItems.update((items: any) => {
      items[index].quantity = event;
      return [...items];
    });
  }

  removeFromSale(index: number): void {
    this.selectedItems.update((items: any) => {
      items.splice(index, 1);
      return [...items];
    });

    this.updateFormDetails();
  }

  clearSale(): void {
    this.selectedItems.set([]);
    this._messageService.add({
      severity: 'info',
      summary: 'Venta reiniciada',
      detail: 'Se eliminaron los servicios',
    });
  }

  tableState = signal<TableState>({
    first: 0,
    rows: 10,
    sortField: 'name',
    sortOrder: 1,
  });

  // Estados
  loading = signal(false);
  items = signal<any[]>([]);
  totalRecords = signal(0);
  globalFilter = signal('');

  // Computed values
  currentService = computed(() =>
    this.currentView() === 'services'
      ? this._servicesService
      : this._packagesService
  );

  // Metodo para cambiar la vista
  toggleView(view: 'services' | 'packages'): void {
    if (view !== this.currentView()) {
      this.currentView.set(view);
      this.resetTable();
    }
  }

  // Metodo para resetear la tabla
  private resetTable(): void {
    this.tableState.update((state) => ({
      ...state,
      first: 0,
      filters: undefined,
    }));
    this.globalFilter.set('');
  }

  // Metodo para cargar los items
  private loadData = computed(() => {
    return {
      services: (page: number, size: number, filters?: any) =>
        this._servicesService.getServices(page, size, filters),
      packages: (page: number, size: number, filters?: any) =>
        this._packagesService.getPackages(page, size, filters),
    }[this.currentView()];
  });

  // Metodo para cargar los items
  loadItems(): void {
    this.loading.set(true);
    const { first, rows, filters } = this.tableState();

    this.loadData()(first / rows + 1, rows, filters).subscribe({
      next: (response) => {
        this.items.set(response.data[this.currentView()]);
        this.totalRecords.set(response.data.total);
        this.loading.set(false);
      },
      error: (error) => {
        this.loading.set(false);
        this._messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: `No se pudieron cargar los ${
            this.currentView() === 'services' ? 'servicios' : 'paquetes'
          }`,
        });
        console.error('Error loading items:', error);
      },
    });
  }

  // Metodo para cambiar de página
  onPageChange(event: any): void {
    this.tableState.update((state) => ({
      ...state,
      first: event.first,
      rows: event.rows,
    }));
    this.loadItems();
  }

  // Metodo para sincronizar los detalles con el formulario
private updateFormDetails(): void {
  const saleDetails = this.selectedItems().map((item) => ({
    serviceId: item.type === 'service' ? item.name : null,
    packageId: item.type === 'package' ? item.name : null,
    quantity: item.quantity,
    unitPrice: item.priceUnit,
  }));

  this.formSale.patchValue({
    details: saleDetails,
  });
}

  // createSale
  createSale() {
    console.log(this.formSale.value);
  }
}
