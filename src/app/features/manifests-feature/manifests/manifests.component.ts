import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { PaginatorModule } from 'primeng/paginator';
import { MessageService } from 'primeng/api';
import { FilterOptions } from '../../../core/interfaces/api/filters';
import { ManifestsService } from '../../../core/services/manifests-services/manifests.service';
import { Manifest } from '../interfaces/manifests';
import { MANIFEST_STATUS, MANIFEST_TABLE_COLS } from '../constants/manifests';
import { Skeleton } from 'primeng/skeleton';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ManifestFormComponent } from '../manifest-form/manifest-form.component';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CheckInComponent } from '../check-in/check-in.component';
import { DialogComponent } from '../../../shared/components/ui/dialog/dialog.component';
import { ManifestPdfService } from '../../../core/services/manifests-services/manifest-pdf.service';
import { InputFormComponent } from '../../../shared/components/forms/input-form/input-form.component';
import { SelectComponent } from '../../../shared/components/forms/select/select.component';
import { ButtonComponent } from '../../../shared/components/ui/button/button.component';
@Component({
  selector: 'app-manifests',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    DialogModule,
    DropdownModule,
    CalendarModule,
    TagModule,
    ToastModule,
    TooltipModule,
    PaginatorModule,
    Skeleton,
    SelectButtonModule,
    InputFormComponent,
    SelectComponent,
    ButtonComponent,
  ],
  templateUrl: './manifests.component.html',
  styleUrl: './manifests.component.scss',
  providers: [MessageService, DialogService],
})
export class ManifestsComponent {
  private readonly _manifestService = inject(ManifestsService);
  private readonly _messageService = inject(MessageService);
  public readonly dialogService = inject(DialogService);
  private readonly _manifestPdfService = inject(ManifestPdfService);
  ref: DynamicDialogRef | undefined;

  // Signals
  manifests = signal<Manifest[]>([]);
  loading = signal<boolean>(false);
  filters = signal<{ key: string; value: string }[]>([]);
  filterByTitle = signal<string>('');

  // Configuración de tabla
  cols = MANIFEST_TABLE_COLS;
  currentPage = 1;
  pageSize = 10;
  totalRecords = 0;
  first = 0;
  rows = 10;
  rowsPerPageOptions = [10, 25, 50];
  statusService = MANIFEST_STATUS;
  // Filtros
  tiposServicio = [
    { label: 'Todos', value: '' },
    { label: 'Hotel', value: 'hotel' },
    { label: 'Tour', value: 'tour' },
    { label: 'Transporte', value: 'transporte' },
    { label: 'Comida', value: 'comida' },
    { label: 'Paquete', value: 'paquete' },
  ];

  constructor() {
    this.loadManifests();
  }

  updateFilter(key: string, value: any) {
    const index = this.filters().findIndex((filter) => filter.key === key);
    if (index > -1) {
      this.filters()[index].value = value;
    } else {
      this.filters().push({ key, value });
    }
    this.loadManifests({ resetPage: true });
  }

  /**
   * Carga manifiestos desde la API
   */
  loadManifests(options: FilterOptions = {}): void {
    this.loading.set(true);

    // Resetear página si es necesario
    if (options.resetPage) {
      this.currentPage = 1;
      this.first = 0;
    }

    // Resetear filtros si es necesario
    if (options.resetFilters) {
      this.filterByTitle.set('');
      this.filters.set([]);
    }

    this._manifestService
      .getManifests(this.currentPage, this.rows, this.filters())
      .subscribe({
        next: (response) => {
          this.manifests.set(response.data.manifests);
          this.totalRecords = response.data.total;
          this.loading.set(false);
        },
        error: (error) => {
          this.loading.set(false);
          this._messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudieron cargar los manifiestos',
          });
        },
      });
  }

  /**
   * Limpia todos los filtros aplicados
   */
  clearFilters(): void {
    this.loadManifests({ resetPage: true, resetFilters: true });
  }

  /**
   * Maneja cambio de página
   */
  onPageChange(event: any) {
    this.currentPage = event.page + 1;
    this.rows = event.rows;
    this.first = event.first;
    this.loadManifests();
  }

  /**
   * Formatea estado de manifiesto para mostrar
   */
  getEstadoLabel(estado: string): string {
    const labels: { [key: string]: string } = {
      PENDIENTE: 'Pendiente',
      EN_PROGRESO: 'En progreso',
      COMPLETADO: 'Completado',
      CANCELADO: 'Cancelado',
    };
    return labels[estado] || estado;
  }

  /**
   * Define color del estado
   */
  getEstadoSeverity(estado: string): 'info' | 'warn' | 'success' | 'danger' {
    const severities: {
      [key: string]: 'info' | 'warn' | 'success' | 'danger';
    } = {
      PENDIENTE: 'info',
      EN_PROGRESO: 'warn',
      COMPLETADO: 'success',
      CANCELADO: 'danger',
    };
    return severities[estado] || 'info';
  }

  /**
   * Abre el modal para crear o editar un manifiesto
   */
  openModal(): void {
    const ref = this.dialogService.open(ManifestFormComponent, {
      header: 'Generación Asistida de Manifiestos',
      width: '70vw',
      height: '80vh',
      contentStyle: { 'max-height': '90vh', overflow: 'auto' },
      baseZIndex: 10000,
      modal: true,
      closable: true,
      resizable: true,
      maximizable: true,

      breakpoints: {
        '960px': '75vw',
        '640px': '90vw',
      },
      data: {},
    });

    // Manejar el cierre del diálogo
    ref.onClose.subscribe((message: string) => {
      if (message) {
        this.loadManifests();

        // Mostrar mensaje de éxito
        this._messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: message,
        });
      }
    });
  }

  openManifestCheckIn(manifestId: string): void {
    const ref = this.dialogService.open(CheckInComponent, {
      header: 'Check In',
      width: '70vw',
      height: '90vh',
      contentStyle: { 'max-height': '90vh', overflow: 'auto' },
      baseZIndex: 10000,
      modal: true,
      closable: true,
      resizable: true,
      maximizable: true,
      breakpoints: {
        '960px': '75vw',
        '640px': '90vw',
      },
      data: {
        manifestId,
      },
    });
  }

  deleteManifest(manifestId: string): void {
    const ref = this.dialogService.open(DialogComponent, {
      header: 'Eliminar Manifiesto',
      modal: true,
      contentStyle: { overflow: 'auto' },
      breakpoints: {
        '960px': '65vw',
        '640px': '60vw',
      },
      data: {
        type: 'success',
        message: `¿Estás seguro de eliminar el manifiesto?`,
        confirmText: 'Confirmar',
        showCancel: false,
      },
    });
    ref.onClose.subscribe((result: boolean) => {
      if (result) {
        this._manifestService.removeManifest(manifestId).subscribe({
          next: (response) => {
            this.loadManifests({ resetPage: true });
            this._messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: response.message,
            });
          },
          error: (error) => {
            this._messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: error.error.message,
            });
          },
        });
      }
    });
  }

  downloadManifestPdf(manifestId: string): void {
    this._manifestPdfService.downloadManifestPdf(manifestId).subscribe({
      next: (response) => {
        this._messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'El PDF del manifiesto se está descargando',
        });
      },
      error: (error) => {
        this._messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo descargar el PDF del manifiesto',
        });
      },
    });
  }

  completeManifest(manifestId: string) {
    this.loading.set(true);
    this._manifestService.completeManifest(manifestId).subscribe({
      next: (res) => {
        this._messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Manifiesto completado exitosamente.',
        });
        this.loadManifests();
      },
      error: (err) => {
        this.loading.set(false);
        this._messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo completar el manifiesto.',
        });
      },
    });
  }
}
