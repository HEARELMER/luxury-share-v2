import { CommonModule, CurrencyPipe } from '@angular/common';
import {
  Component,
  computed,
  effect,
  inject,
  output,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Tooltip } from 'primeng/tooltip';
import { Badge } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { Paginator } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { InputFormComponent } from '../../../../../shared/components/forms/input-form/input-form.component';
import { SelectComponent } from '../../../../../shared/components/forms/select/select.component';
import { CapitalizePipe } from '../../../../../shared/pipes/capitalize.pipe';
import { toSignal } from '@angular/core/rxjs-interop';
import { MessageService } from 'primeng/api';
import { LocalstorageService } from '../../../../../core/services/localstorage-services/localstorage.service';
import { SalesService } from '../../../../../core/services/sales-services/sales.service';
import { PackagesService } from '../../../../../core/services/services_packages-services/packages.service';
import { ServicesService } from '../../../../../core/services/services_packages-services/services.service';
import { FilterEmptyValuesPipe } from '../../../../../shared/pipes/filter-empty-value.pipe';
import {
  SaleItem,
  ColumnDef,
  TableState,
} from '../../../../services-packages-feature/interfaces/sale-formt';
import { PAYMENT_METHODS } from '../../../constants/add-sales.constant';

@Component({
  selector: 'app-step2-sale-form',
  imports: [
    CommonModule,
    TableModule,
    InputTextModule,
    TagModule,
    CurrencyPipe,
    ButtonModule,
    Paginator,
    Tooltip,
    Badge,
    InputFormComponent,
    FormsModule,
    CapitalizePipe,
    ReactiveFormsModule,
    SelectComponent,
  ],
  templateUrl: './step2-sale-form.component.html',
  styleUrl: './step2-sale-form.component.scss',
})
export class Step2SaleFormComponent {
  private readonly _servicesService = inject(ServicesService);
  private readonly _packagesService = inject(PackagesService);
  private readonly _salesService = inject(SalesService);
  private readonly _messageService = inject(MessageService);
  private readonly _filterEmptyValuesPipe = inject(FilterEmptyValuesPipe);
  private readonly _localstorageService = inject(LocalstorageService);
  private readonly _fb = inject(FormBuilder);
  constructor() {
    // Efecto para recargar datos cuando cambie la vista
    effect(() => {
      this.currentView();
      this.loadItems();
    });
  }
  // Estados
  readonly submitForm = output<void>();
  selectedItems = signal<SaleItem[]>([]);
  discount = signal<any>(0);
  currentView = signal<'services' | 'packages'>('services');
  branchId = toSignal(this._localstorageService.getBranchId());
  loading = signal(false);
  items = signal<any[]>([]);
  totalRecords = signal(0);
  globalFilter = signal('');
  tableState = signal<TableState>({
    first: 0,
    rows: 10,
    sortField: 'name',
    sortOrder: 1,
  });
  // Computed values
  currentService = computed(() =>
    this.currentView() === 'services'
      ? this._servicesService
      : this._packagesService
  );

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
  paymentMethods = PAYMENT_METHODS;
  formSale = this._fb.group({
    clientId: [''],
    branchId: [this.branchId()],
    dateSale: [''],
    departureDate: [''],
    registeredBy: [''],
    discount: [0],
    observations: [''],
    paymentMethod: ['', [Validators.required]],
    status: '',
  });

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
  }

  clearSale(): void {
    this.selectedItems.set([]);
  }

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

  // createSale
  createSale() {
    const details = this.formatSaleDetails(this.selectedItems());
    this.formSale.patchValue({
      clientId: 'e234500d-5166-451f-b072-b88279cd26d1',
      registeredBy: '73464945',
      status: 'COMPLETADO',
    });
    const formFormated = this._filterEmptyValuesPipe.transform(
      this.formSale.value
    );
    const saleData = {
      ...formFormated,
      details,
      dateSale: new Date().toISOString(),
    };
    console.log(saleData);
    this._salesService.createSale(saleData).subscribe({
      next: () => {
        this._messageService.add({
          severity: 'success',
          summary: 'Venta creada con éxito',
        });
        this.submitForm.emit();
        this.clearSale();
      },
    });
  }

  reservarSale() {
    const details = this.formatSaleDetails(this.selectedItems());
    this.formSale.patchValue({
      clientId: 'e234500d-5166-451f-b072-b88279cd26d1',
      registeredBy: '73464945',
    });
    const formFormated = this._filterEmptyValuesPipe.transform(
      this.formSale.value
    );
    const saleData = {
      ...formFormated,
      details,
      dateSale: new Date().toISOString(),
    };
    this._salesService.createSale(saleData).subscribe({
      next: () => {
        this._messageService.add({
          severity: 'success',
          summary: 'Reserva Creada con éxito',
        });
        this.submitForm.emit();
        this.clearSale();
      },
    });
  }

  private formatSaleDetails(items: SaleItem[]): any[] {
    return items.map((item) => {
      // Primero crear el objeto con todas las propiedades
      const itemDetail = {
        serviceId: item.serviceId,
        packageId: item.packageId,
        quantity: Number(item.quantity),
        unitPrice: Number(item.priceUnit),
      };

      // Luego filtrar propiedades vacías
      return this._filterEmptyValuesPipe.transform(itemDetail);
    });
  }
}
