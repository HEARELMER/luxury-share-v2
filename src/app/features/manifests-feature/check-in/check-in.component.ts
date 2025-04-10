import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogService, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressBar } from 'primeng/progressbar';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { CHECK_IN_TABLE_COLS } from '../constants/check-in.constant';
import { PaginatorModule } from 'primeng/paginator';
import { InputFormComponent } from '../../../shared/components/forms/input-form/input-form.component';
import { ButtonComponent } from '../../../shared/components/ui/button/button.component';
import { ManifestsService } from '../../../core/services/manifests-services/manifests.service';
import { InputSwitchModule } from 'primeng/inputswitch';
import { DialogComponent } from '../../../shared/components/ui/dialog/dialog.component';
import { ManifestPdfService } from '../../../core/services/manifests-services/manifest-pdf.service';
import { ScheduleReportDialogComponent } from "../../reports-feature/schedule-report-dialog/schedule-report-dialog.component";
import { SelectComponent } from "../../../shared/components/forms/select/select.component";

@Component({
  selector: 'app-check-in',
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    CheckboxModule,
    TagModule,
    ToastModule,
    ProgressBar,
    SelectButtonModule,
    TooltipModule,
    ConfirmDialogModule,
    PaginatorModule,
    InputFormComponent,
    ButtonComponent,
    InputSwitchModule,
    ScheduleReportDialogComponent,
    SelectComponent
],
  templateUrl: './check-in.component.html',
  styleUrl: './check-in.component.scss',
})
export class CheckInComponent {
  private messageService = inject(MessageService);
  private readonly manifestService = inject(ManifestsService);
  public readonly dialogService = inject(DialogService);
  private dialogConfig = inject(DynamicDialogConfig);
  private manifestPdfService = inject(ManifestPdfService);
  manifestId = signal<string>('');
  response = signal<any>({});
  clients = signal<any[]>([]);
  checkInTableCols = CHECK_IN_TABLE_COLS;
  checkedIn = signal<boolean>(false);
  loading = signal<boolean>(false);
  clientsChecked = computed(() => {
    return this.clients().filter(
      (client) => client.checkInStatus === 'REGISTRADO'
    ).length;
  });
  searchDocNumber = signal<string>('');
  filteredClients = computed(() => {
    const search = this.searchDocNumber().trim().toLowerCase();

    if (!search || search.length < 3) {
      return this.clients(); // Si no hay búsqueda, mostrar todos
    }

    return this.clients().filter((client) => {
      // Verificar si el cliente tiene propiedad client y numberDocument
      if (client.client && client.client.numberDocument) {
        return client.client.numberDocument.toLowerCase().includes(search);
      }
      return false;
    });
  });
  selectedPassengers: any[] = [];
  calculatedProgress = computed(() => {
    const total = this.clients().length || 1;
    return parseFloat(((this.clientsChecked() / total) * 100).toFixed(0));
  });

  // Opciones para vista
  viewOptions = [
    { label: 'Todos', value: 'all' },
    { label: 'Pendientes', value: 'pending' },
    { label: 'Confirmados', value: 'confirmed' },
  ];
  selectedView: string = 'all';

  ngOnInit() {
    if (this.dialogConfig && this.dialogConfig.data?.manifestId) {
      this.manifestId.set(this.dialogConfig.data.manifestId);
    }

    // Load data
    this.loadManifestData();
  }

  loadManifestData() {
    this.loading.set(true);
    this.manifestService.findManifestById(this.manifestId()).subscribe({
      next: (res) => {
        this.response.set(res);
        this.clients.set(res.participants);
        this.loading.set(false);
      },
      error: (err) => {
        this.loading.set(false);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo cargar la información del manifiesto',
        });
      },
    });
  }

  toggleCheckIn(participant: any, isChecked: any) {
    participant.checkInStatus = isChecked.checked ? 'REGISTRADO' : 'PENDIENTE';
    const payload = {
      participants: [
        {
          participantId: participant.participantId,
          checkInStatus: participant.checkInStatus,
        },
      ],
      updatedBy: '14160945',
      manifestId: this.manifestId(),
    };

    // Llamar al servicio con los datos actualizados
    this.manifestService
      .checkInPartcipants(
        payload.manifestId,
        payload.participants,
        payload.updatedBy
      )
      .subscribe({
        next: (res) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Check-In',
            detail: `Se ha ${
              participant.checkInStatus === 'REGISTRADO'
                ? 'registrado'
                : 'cancelado'
            } el check-in de ${participant.clientName || 'cliente'}`,
          });
        },
        error: (err) => {
          // Revertir el cambio local si la llamada a la API falla
          participant.checkInStatus =
            participant.checkInStatus === 'REGISTRADO'
              ? 'PENDIENTE'
              : 'REGISTRADO';

          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo actualizar el estado del check-in',
          });
        },
      });
  }

  applyGroupCheckIn() {}

  removeParticipant(participant: any) {
    const ref = this.dialogService.open(DialogComponent, {
      header: 'Quitar participante',
      modal: true,
      contentStyle: { overflow: 'auto' },
      breakpoints: {
        '960px': '65vw',
        '640px': '60vw',
      },
      data: {
        type: 'success',
        message: `¿Estás seguro de quitar el participante?`,
        confirmText: 'Confirmar',
        showCancel: false,
      },
    });
    ref.onClose.subscribe((result: boolean) => {
      if (result) {
        this.manifestService
          .removeParticipant(this.manifestId(), participant.participantId)
          .subscribe({
            next: (res) => {
              this.messageService.add({
                severity: 'success',
                summary: 'Eliminado',
                detail: `Se ha quitado el participante ${participant.clientName}`,
              });
              this.loadManifestData();
            },
            error: (err) => {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'No se pudo eliminar el participante',
              });
            },
          });
      }
    });
  }

  onSearch(docNumber: any) {
    this.searchDocNumber.set(docNumber);
  }

  // Método para limpiar la búsqueda
  clearSearch() {
    this.searchDocNumber.set('');
  }

  exportToPdf() {
    if (!this.manifestId()) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No hay un manifiesto seleccionado para exportar.',
      });
      return;
    }

    this.loading.set(true);
    try {
      this.manifestPdfService.generateManifestPdf(this.response(), true);
      this.messageService.add({
        severity: 'success',
        summary: 'Éxito',
        detail: 'El PDF se está descargando...',
      });
    } catch (error) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudo generar el PDF.',
      });
      console.error('Error al generar PDF:', error);
    } finally {
      this.loading.set(false);
    }
  }
}
