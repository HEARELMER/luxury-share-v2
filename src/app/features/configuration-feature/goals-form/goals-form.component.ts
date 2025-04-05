import { Component, inject, signal } from '@angular/core';
import { DatePickerModule } from 'primeng/datepicker';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonComponent } from '../../../shared/components/ui/button/button.component';
import { InputFormComponent } from '../../../shared/components/forms/input-form/input-form.component';
import { SelectComponent } from '../../../shared/components/forms/select/select.component';
import { GOAL_TYPES } from '../constants/configurations.consant';
import { ICONS_FORM } from '../constants/icons-form.constant';
import { GoalService } from '../../../core/services/goals-services/goals.service';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Goal } from '../interfaces/goal.interface';

@Component({
  selector: 'app-goals-form',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    ButtonComponent,
    InputFormComponent,
    SelectComponent,
    DatePickerModule,
  ],
  templateUrl: './goals-form.component.html',
  styleUrl: './goals-form.component.scss',
})
export class GoalsFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly goalsService = inject(GoalService);
  private readonly messageService = inject(MessageService);
  private readonly dialogConfig = inject(DynamicDialogConfig);
  private readonly dialogRef = inject(DynamicDialogRef);
  selectedIcon = signal<string>('pi pi-chart');
  previewProgress = signal<number>(0);
  iconsForm = ICONS_FORM;
  isEditMode = signal<boolean>(false);
  saving = signal<boolean>(false);
  goalId = signal<string>(' ');

  goalForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    description: ['', [Validators.minLength(10)]],
    type: ['sales', Validators.required],
    priority: ['medium', Validators.required],
    targetValue: [0, [Validators.required, Validators.min(0)]],
    currentValue: [0, [Validators.min(0)]],
    unit: ['%', Validators.required],
    startDate: [new Date(), Validators.required],
    endDate: [
      new Date(new Date().setMonth(new Date().getMonth() + 3)),
      Validators.required,
    ],
    icon: ['pi pi-chart'],
    registeredBy: [''],
  });

  goalTypes = GOAL_TYPES;
  // Opciones para las unidades
  unitOptions = [
    { label: 'Porcentaje (%)', value: '%' },
    { label: 'Euros (€)', value: '€' },
    { label: 'Dólares ($)', value: '$' },
    { label: 'Unidades', value: 'units' },
  ];
  ngOnInit(): void {
    this.loadGoalData();
    this.updateProgress();
  }

  /**
   * Carga datos del objetivo si estamos en modo edición
   */
  loadGoalData(): void {
    const goalData = this.dialogConfig.data?.goal as Goal;

    if (goalData && goalData.id) {
      this.isEditMode.set(true);
      this.goalId.set(goalData.id);
      this.goalForm.patchValue({
        name: goalData.name,
        description: goalData.description,
        type: goalData.type,
        priority: goalData.priority,
        targetValue: goalData.targetValue,
        currentValue: goalData.currentValue,
        unit: goalData.unit,
        startDate: new Date(goalData.startDate),
        endDate: new Date(goalData.endDate),
        icon: goalData.icon || 'pi pi-chart',
      });

      this.selectedIcon.set(goalData.icon || 'pi pi-chart');
      this.updateProgress();
    }
  }
  /**
   * Selecciona un icono
   */
  selectIcon(icon: string): void {
    this.selectedIcon.update(() => icon);
    this.goalForm.patchValue({ icon });
  }
  /**
   * Guarda o actualiza el objetivo según el modo
   */
  saveGoal(): void {
    if (!this.goalForm.valid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Por favor complete todos los campos requeridos',
      });
      return;
    }

    this.saving.set(true);
    this.goalForm.patchValue({
      registeredBy: '73464945', // Idealmente este valor vendría del servicio de autenticación
      icon: this.selectedIcon(),
    });

    const goalData = this.goalForm.value;
    goalData.currentValue = Number(goalData.currentValue) || 0;
    goalData.targetValue = Number(goalData.targetValue) || 0;

    // Determinar si es creación o actualización
    if (this.isEditMode()) {
      this.goalsService.updateGoal(this.goalId(), goalData).subscribe({
        next: (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: response.message,
          });
          this.saving.set(false);
          this.closeDialog();
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo actualizar el objetivo',
          });
          this.saving.set(false);
        },
      });
    } else {
      this.goalsService.createGoal(goalData).subscribe({
        next: (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: response.message,
          });
          this.saving.set(false);
          this.closeDialog();
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo crear el objetivo',
          });
          this.saving.set(false);
        },
      });
    }
  }

  /**
   * Actualiza la barra de progreso basado en los valores del formulario
   */
  updateProgress(): void {
    const targetValue = this.goalForm.get('targetValue')?.value;
    const currentValue = this.goalForm.get('currentValue')?.value || 0;

    if (targetValue && targetValue > 0) {
      const progress = (currentValue / targetValue) * 100;
      this.previewProgress.set(Math.min(100, Math.max(0, progress)));
    } else {
      this.previewProgress.set(0);
    }
  }

  /**
   * Obtiene el color de la barra de progreso según el porcentaje
   */
  getProgressColor(): string {
    if (this.previewProgress() < 25) return 'bg-red-500';
    if (this.previewProgress() < 50) return 'bg-yellow-500';
    if (this.previewProgress() < 75) return 'bg-blue-500';
    return 'bg-green-500';
  }

  /**
   * Cierra el diálogo y devuelve el objetivo
   */
  closeDialog(): void {
    this.dialogRef.close();
  }

  /**
   * Obtiene el mensaje de progreso
   */
  getProgressText(): string {
    if (this.previewProgress() < 25) return 'Inicio';
    if (this.previewProgress() < 50) return 'En progreso';
    if (this.previewProgress() < 75) return 'Avanzado';
    if (this.previewProgress() < 100) return 'Casi completo';
    return 'Completado';
  }

  /**
   * Obtiene el color del texto de progreso
   */
  getProgressTextColor(): string {
    if (this.previewProgress() < 25) return 'text-red-600';
    if (this.previewProgress() < 50) return 'text-yellow-600';
    if (this.previewProgress() < 75) return 'text-blue-600';
    return 'text-green-600';
  }

  /**
   * Comprueba si la fecha de fin es válida (posterior a fecha de inicio)
   */
  isEndDateValid(): boolean {
    const start = this.goalForm.get('startDate')?.value;
    const end = this.goalForm.get('endDate')?.value;

    if (start && end) {
      return new Date(end) > new Date(start);
    }

    return true;
  }
}
