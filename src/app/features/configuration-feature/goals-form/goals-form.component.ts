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
  selectedIcon = signal<string>('pi pi-chart');
  previewProgress = signal<number>(0);

  goalForm = this.fb.group({
    name: [''],
    description: [''],
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
  });

  goalTypes = GOAL_TYPES;
   // Opciones para las unidades
   unitOptions = [
    { label: 'Porcentaje (%)', value: '%' },
    { label: 'Euros (€)', value: '€' },
    { label: 'Dólares ($)', value: '$' },
    { label: 'Unidades', value: 'units' }
  ];

  /**
   * Selecciona un icono
   */
  selectIcon(icon: string): void {
    this.selectedIcon.update(() => icon);
    this.goalForm.patchValue({ icon });
  }

  saveGoal(): void {
    if (this.goalForm.valid) {
      console.log('Goal saved:', this.goalForm.value);
    } else {
      console.error('Form is invalid');
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
