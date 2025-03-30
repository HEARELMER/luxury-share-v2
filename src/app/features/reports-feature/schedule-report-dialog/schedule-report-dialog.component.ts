import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { ChipModule } from 'primeng/chip';
import { ButtonModule } from 'primeng/button';
import { SelectButtonModule } from 'primeng/selectbutton';
import { InputFormComponent } from '../../../shared/components/forms/input-form/input-form.component';

@Component({
  selector: 'app-schedule-report-dialog',
  imports: [
    CommonModule,
    FormsModule,
    DialogModule,
    DropdownModule,
    ChipModule,
    ChipModule,
    ButtonModule,
    SelectButtonModule,
    InputFormComponent,
  ],
  templateUrl: './schedule-report-dialog.component.html',
})
export class ScheduleReportDialogComponent {
  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() save = new EventEmitter<any>();

  selectedFrequency: any;
  selectedRecipients: string[] = ['carlos.lopez@empresa.com'];
  selectedFormat: string = 'pdf';
  newRecipient: string = '';

  // Usuarios sugeridos para enviar reportes
  suggestedUsers = [
    {
      name: 'María García',
      email: 'maria.garcia@empresa.com',
      avatar: 'https://randomuser.me/api/portraits/women/12.jpg',
    },
    {
      name: 'Juan Pérez',
      email: 'juan.perez@empresa.com',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    },
    {
      name: 'Ana Silva',
      email: 'ana.silva@empresa.com',
      avatar: 'https://randomuser.me/api/portraits/women/65.jpg',
    },
    {
      name: 'Roberto Torres',
      email: 'roberto.torres@empresa.com',
      avatar: 'https://randomuser.me/api/portraits/men/41.jpg',
    },
    {
      name: 'Elena Salazar',
      email: 'elena.salazar@empresa.com',
      avatar: 'https://randomuser.me/api/portraits/women/33.jpg',
    },
  ];

  // Opciones para frecuencia
  scheduleFrequencies = [
    { label: 'Diario', value: 'daily' },
    { label: 'Semanal', value: 'weekly' },
    { label: 'Mensual', value: 'monthly' },
    { label: 'Trimestral', value: 'quarterly' },
  ];

  // Opciones para formatos de exportación
  exportFormats = [
    { label: 'Excel', value: 'excel' },
    { label: 'PDF', value: 'pdf' },
  ];

  // Añadir un nuevo destinatario desde el input
  addRecipient(event?: any): void {
    if (event) {
      event.preventDefault();
    }

    const email = this.newRecipient.trim();

    if (email && this.isValidEmail(email) && !this.isSelected(email)) {
      this.selectedRecipients.push(email);
      this.newRecipient = '';
    }
  }

  // Eliminar un destinatario
  removeRecipient(email: string): void {
    const index = this.selectedRecipients.indexOf(email);
    if (index !== -1) {
      this.selectedRecipients.splice(index, 1);
    }
  }

  // Método para añadir o quitar un destinatario desde las sugerencias
  toggleRecipient(email: string): void {
    const index = this.selectedRecipients.indexOf(email);
    if (index === -1) {
      // No está en la lista, añadirlo
      this.selectedRecipients.push(email);
    } else {
      // Ya está en la lista, quitarlo
      this.selectedRecipients.splice(index, 1);
    }
  }

  // Verificar si un email está seleccionado
  isSelected(email: string): boolean {
    return this.selectedRecipients.includes(email);
  }

  // Validar formato de email
  isValidEmail(email: string): boolean {
    if (!email) return false;
    const pattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/i;
    return pattern.test(email);
  }

  // Verificar si el formulario es válido
  isFormValid(): boolean {
    return this.selectedFrequency && this.selectedRecipients.length > 0;
  }

  // Cerrar el diálogo
  cancel(): void {
    this.visible = false;
    this.visibleChange.emit(this.visible);
  }

  // Guardar y cerrar
  saveReport(): void {
    const reportConfig = {
      frequency: this.selectedFrequency,
      recipients: this.selectedRecipients,
      format: this.selectedFormat,
    };

    this.save.emit(reportConfig);
    this.visible = false;
    this.visibleChange.emit(this.visible);
  }

  // Manejador para el evento onHide del diálogo
  onHide(): void {
    this.visibleChange.emit(false);
  }
}
