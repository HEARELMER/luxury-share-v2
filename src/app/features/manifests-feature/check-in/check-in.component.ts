import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressBarModule } from 'primeng/progressbar';
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
import { ToggleSwitch } from 'primeng/toggleswitch';
import { InputSwitchModule } from 'primeng/inputswitch';
interface Passenger {
  id: string;
  name: string;
  lastName: string;
  docType: string;
  docNumber: string;
  checkedIn: boolean;
  seatNumber?: string;
  observations?: string;
}

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
    ProgressBarModule,
    SelectButtonModule,
    TooltipModule,
    ConfirmDialogModule,
    PaginatorModule,
    InputFormComponent,
    ButtonComponent,
    InputSwitchModule,
  ],
  templateUrl: './check-in.component.html',
  styleUrl: './check-in.component.scss',
})
export class CheckInComponent {
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);
  private readonly manifestService = inject(ManifestsService);
  private dialogRef = inject(DynamicDialogRef);
  private dialogConfig = inject(DynamicDialogConfig);
  manifestId = signal<string>('');
  response = signal<any>({});
  clients = signal<any[]>([]);
  checkInTableCols = CHECK_IN_TABLE_COLS;
  checkedIn = signal<boolean>(false);
  loading = signal<boolean>(false);
  // Datos estáticos para el manifiesto
  manifestData = {
    id: 'MNF-20250407-001',
    title: 'Tour Valle Sagrado',
    date: new Date(),
    status: 'pendiente',
    branch: 'Ayacucho',
    totalPassengers: 15,
  };

  // Datos estáticos de pasajeros
  passengers: Passenger[] = [];
  selectedPassengers: Passenger[] = [];
  checkedInCount = 0;

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
    // Generar datos de pasajeros aleatorios
    this.generatePassengers();
    this.updateCheckedInCount();
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

  generatePassengers() {
    const names = [
      'Juan',
      'María',
      'Carlos',
      'Ana',
      'Luis',
      'Sofia',
      'Pedro',
      'Laura',
    ];
    const lastNames = [
      'García',
      'Pérez',
      'Rodríguez',
      'López',
      'Martínez',
      'González',
      'Torres',
      'Sánchez',
    ];

    this.passengers = Array.from(
      { length: this.manifestData.totalPassengers },
      (_, i) => {
        const randomName = names[Math.floor(Math.random() * names.length)];
        const randomLastName =
          lastNames[Math.floor(Math.random() * lastNames.length)];
        const randomChecked = Math.random() > 0.6;

        return {
          id: `PAS-${i + 1}`,
          name: randomName,
          lastName: randomLastName,
          docType: 'DNI',
          docNumber: `${40000000 + Math.floor(Math.random() * 9000000)}`,
          checkedIn: randomChecked,
          seatNumber: `A${i + 1}`,
        };
      }
    );
  }

  updateCheckedInCount() {
    this.checkedInCount = this.passengers.filter((p) => p.checkedIn).length;
  }

  calculateProgress(): number {
    return (this.checkedInCount / this.manifestData.totalPassengers) * 100;
  }

  completeCheckIn() {
    this.confirmationService.confirm({
      message: '¿Está seguro que desea finalizar el check-in del servicio?',
      accept: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Check-In Completado',
          detail: `Se han registrado ${this.checkedInCount} de ${this.manifestData.totalPassengers} pasajeros`,
        });
        setTimeout(() => {
          this.dialogRef.close({ success: true });
        }, 1500);
      },
    });
  }
}
