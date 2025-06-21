import { CommonModule, CurrencyPipe } from '@angular/common';
import {
  Component,
  computed,
  effect,
  inject,
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
import {
  Client,
  SaleCreationResult,
} from '../../../interfaces/sale-creation-result.interface';
import {
  PACKAGE_COLUMNS,
  SERVICE_COLUMNS,
} from '../../../constants/sale-form.constant';

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
  private readonly _filterEmptyValuesPipe = inject(FilterEmptyValuesPipe);
  private readonly _localstorageService = inject(LocalstorageService);
  private readonly _fb = inject(FormBuilder);
  constructor() {
    effect(() => {
      this.currentView();
      this.loadItems();
    });
  }
  // Estados
  readonly salesDataOfEdit = model<any>(null);
  ngOnInit() {
    if (this.salesDataOfEdit()) {
      this.formSale.patchValue({
        clientId: this.salesDataOfEdit().client.clientId,
        dateSale: this.formatDateForForm(this.salesDataOfEdit().dateSale),
        departureDate: this.formatDateForForm(
          this.salesDataOfEdit().departureDate
        ),
        registeredBy: this._localstorageService.getUserId(),
        discount: this.salesDataOfEdit().discount || 0,
        observations: this.salesDataOfEdit().observations || '',
        paymentMethod: this.salesDataOfEdit().paymentMethod || '',
      });
    }
  }
  readonly statusOfSaleCreated = output<SaleCreationResult>();
  readonly submitForm = output<void>();
  currentClientModel = model.required<Client | null>();
  clientId = computed(() =>
    this.currentClientModel() ? this.currentClientModel()!.clientId : ''
  );
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
    registeredBy: [this._localstorageService.getUserId()],
    discount: [0],
    observations: [''],
    paymentMethod: ['', [Validators.required]],
    status: ['PAGADO'],
  });

  serviceColumns: ColumnDef[] = SERVICE_COLUMNS;
  packageColumns: ColumnDef[] = PACKAGE_COLUMNS;

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
      services: (
        page: number,
        size: number,
        departureDate: Date,
        filters?: any
      ) =>
        this._servicesService.getServicesWithSoldCount(
          page,
          size,
          departureDate,
          filters
        ),
      packages: (
        page: number,
        size: number,
        departureDate: Date,
        filters?: any
      ) =>
        this._packagesService.getPackagesWithSoldCount(
          page,
          size,
          departureDate,
          filters
        ),
    }[this.currentView()];
  });

  // Metodo para cargar los items
  loadItems(departureDate: Date = new Date()): void {
    this.loading.set(true);
    const { first, rows } = this.tableState();
    const updatedFilters = [{ key: 'status', value: 'true' }];
    this.loadData()(
      first / rows + 1,
      rows,
      departureDate,
      updatedFilters
    ).subscribe({
      next: (response) => {
        this.items.set(response.data[this.currentView()]);
        this.totalRecords.set(response.data.total);
        this.loading.set(false);
      },
      error: (error) => {
        this.loading.set(false);
      },
    });
  }

  onDateChange(event: any): void {
    const value = event;
    const departureDate = value ? new Date(value) : undefined;
    this.loadItems(departureDate);
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
    this.loading.set(true);
    const details = this.formatSaleDetails(this.selectedItems());
    this.formSale.patchValue({
      clientId: this.clientId(),
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
      next: (response) => {
        this.statusOfSaleCreated.emit({
          success: true,
          message: response.message,
          codeSale: response.data.codeSale,
          saleData: response.data,
          status: 'COMPLETED',
        });
        this.submitForm.emit();
        this.clearSale();
        this.loading.set(false);
      },
      error: (error) => {
        this.statusOfSaleCreated.emit({
          success: false,
          message: error.message,
          error,
          status: 'ERROR',
        });
        this.loading.set(false);
      },
    });
  }

  reservarSale() {
    this.loading.set(true);
    const departureDate = this.formSale.value.departureDate || '';
    const today = new Date();
    const departureDateObj = new Date(departureDate);
    const timeDiff = departureDateObj.getTime() - today.getTime();
    const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    // Verificar si hay al menos 2 días de anticipación
    if (daysDiff < 2) {
      console.log(departureDate);
      console.log(daysDiff);
      this.statusOfSaleCreated.emit({
        success: false,
        message:
          'Las reservas deben realizarse con al menos 2 días de anticipación',
        status: 'ERROR',
      });
      this.loading.set(false);
      return;
    }
    const details = this.formatSaleDetails(this.selectedItems());

    const formFormated = this._filterEmptyValuesPipe.transform(
      this.formSale.value
    );
    const saleData = {
      ...formFormated,
      details,
      dateSale: new Date().toISOString(),
      status: 'RESERVADO',
      clientId: this.clientId(),
    };
    this._salesService.createSale(saleData).subscribe({
      next: (response) => {
        this.statusOfSaleCreated.emit({
          success: true,
          message: response.message,
          codeSale: response.data.codeSale,
          saleData: response.data,
          status: 'COMPLETED',
        });
        this.submitForm.emit();
        this.clearSale();
        this.loading.set(false);
      },
      error: (error) => {
        this.statusOfSaleCreated.emit({
          success: false,
          message: error.message,
          error,
          status: 'ERROR',
        });
        this.loading.set(false);
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

  // Utility function to format dates without timezone info
  private formatDateForForm(date: string | Date): string {
    if (!date) return '';

    const d = new Date(date);

    // Format as YYYY-MM-DDTHH:MM
    return (
      d.getFullYear() +
      '-' +
      ('0' + (d.getMonth() + 1)).slice(-2) +
      '-' +
      ('0' + d.getDate()).slice(-2) +
      'T' +
      ('0' + d.getHours()).slice(-2) +
      ':' +
      ('0' + d.getMinutes()).slice(-2)
    );
  }
}
