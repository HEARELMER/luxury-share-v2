import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TabViewModule } from 'primeng/tabview';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { TextareaModule } from 'primeng/textarea';
import { SelectButtonModule } from 'primeng/selectbutton';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { InputNumberModule } from 'primeng/inputnumber';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { GoalsFormComponent } from '../goals-form/goals-form.component';
import { Goal } from '../interfaces/goal.interface';
import { GOAL_TYPES } from '../constants/configurations.consant';
import { ToastModule } from 'primeng/toast';
import { SkeletonModule } from 'primeng/skeleton';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TagModule } from 'primeng/tag';
import { TableModule } from 'primeng/table';
import { Tooltip } from 'primeng/tooltip';
@Component({
  selector: 'app-configurations',
  imports: [
    CommonModule,
    FormsModule,
    TabViewModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    TextareaModule,
    SelectButtonModule,
    CalendarModule,
    CheckboxModule,
    AutoCompleteModule,
    InputNumberModule,
    GoalsFormComponent,
    SkeletonModule,
    ToastModule,
    TagModule,
    TableModule,
    ConfirmDialogModule,
    Tooltip,
  ],
  providers: [MessageService, DialogService, ConfirmationService],
  templateUrl: './configurations.component.html',
  styleUrl: './configurations.component.scss',
})
export class ConfigurationsComponent {
  private readonly messageService = inject(MessageService);
  private readonly dialogService = inject(DialogService);
  private readonly confirmationService = inject(ConfirmationService);

  ref: DynamicDialogRef | undefined;

  // Signals
  goals = signal<Goal[]>([]);
  loading = signal<boolean>(false);
  activeFilters = signal<{ key: string; value: string }[]>([]);

  // Paginación
  rows = 10;
  first = 0;
  totalRecords = 0;
  rowsPerPageOptions = [5, 10, 25, 50];

  // Filtros
  goalTypesOptions = GOAL_TYPES;
  selectedGoalType: any = null;

  priorityOptions = [
    { label: 'Alta', value: 'high', icon: 'pi pi-arrow-up' },
    { label: 'Media', value: 'medium', icon: 'pi pi-minus' },
    { label: 'Baja', value: 'low', icon: 'pi pi-arrow-down' },
  ];
  selectedPriority: any = null;

  statusOptions = [
    { label: 'Todos', value: null },
    { label: 'En progreso', value: 'progress' },
    { label: 'Completados', value: 'completed' },
    { label: 'Vencidos', value: 'overdue' },
  ];
  selectedStatus: any = null;

  // Estadísticas
  totalGoals = 0;
  completedGoals = 0;
  inProgressGoals = 0;
  overdueGoals = 0;

  constructor() {
    this.loadGoals();
  }

  /**
   * Carga objetivos según filtros y paginación
   */
  loadGoals(event?: any): void {
    this.loading.set(true);

    // Reset page if needed
    if (event?.resetPage) {
      this.first = 0;
    }

    // Apply filters
    const filters: { key: string; value: string }[] = [];

    if (this.selectedGoalType) {
      filters.push({
        key: 'type',
        value: `${this.getGoalTypeLabel(this.selectedGoalType.value)}`,
      });
    }

    if (this.selectedPriority) {
      filters.push({
        key: 'priority',
        value: `${this.getPriorityLabel(this.selectedPriority.value)}`,
      });
    }

    if (this.selectedStatus) {
      filters.push({
        key: 'status',
        value: `${this.selectedStatus.label}`,
      });
    }

    this.activeFilters.set(filters);

    // Simular llamada a API
    setTimeout(() => {
      // Mock data - esto sería reemplazado por una llamada a un servicio real
      const mockGoals: Goal[] = [
        {
          id: '1',
          name: 'Aumentar ventas en 20%',
          description:
            'Incrementar las ventas totales en un 20% para el segundo trimestre',
          type: 'sales',
          priority: 'high',
          targetValue: 20,
          currentValue: 15,
          unit: '%',
          startDate: new Date(2023, 0, 1),
          endDate: new Date(2023, 11, 31),
          icon: 'pi pi-dollar',
        },
        {
          id: '2',
          name: 'Reducir costos operativos',
          description: 'Disminuir los costos operativos en un 10%',
          type: 'financial',
          priority: 'medium',
          targetValue: 10,
          currentValue: 3,
          unit: '%',
          startDate: new Date(2023, 0, 1),
          endDate: new Date(2023, 11, 31),
          icon: 'pi pi-wallet',
        },
        {
          id: '3',
          name: 'Mejorar satisfacción del cliente',
          description: 'Aumentar puntuación NPS de 7.5 a 8.5',
          type: 'satisfaction',
          priority: 'high',
          targetValue: 8.5,
          currentValue: 7.8,
          unit: 'units',
          startDate: new Date(2023, 0, 1),
          endDate: new Date(2023, 11, 31),
          icon: 'pi pi-thumbs-up',
        },
        {
          id: '4',
          name: 'Disminuir tiempo de espera',
          description: 'Reducir el tiempo promedio de espera en un 25%',
          type: 'productivity',
          priority: 'low',
          targetValue: 25,
          currentValue: 25,
          unit: '%',
          startDate: new Date(2023, 0, 1),
          endDate: new Date(2023, 5, 30),
          icon: 'pi pi-clock',
        },
        {
          id: '5',
          name: 'Aumentar retención',
          description: 'Mejorar la tasa de retención de clientes',
          type: 'sales',
          priority: 'medium',
          targetValue: 15,
          currentValue: 5,
          unit: '%',
          startDate: new Date(2023, 0, 1),
          endDate: new Date(2023, 3, 30),
          icon: 'pi pi-users',
        },
      ];

      // Aplicar filtros
      let filteredGoals = [...mockGoals];

      if (this.selectedGoalType?.value) {
        filteredGoals = filteredGoals.filter(
          (goal) => goal.type === this.selectedGoalType.value
        );
      }

      if (this.selectedPriority?.value) {
        filteredGoals = filteredGoals.filter(
          (goal) => goal.priority === this.selectedPriority.value
        );
      }

      if (this.selectedStatus?.value) {
        if (this.selectedStatus.value === 'completed') {
          filteredGoals = filteredGoals.filter(
            (goal) => this.getProgressPercentage(goal) >= 100
          );
        } else if (this.selectedStatus.value === 'overdue') {
          filteredGoals = filteredGoals.filter((goal) => this.isOverdue(goal));
        } else if (this.selectedStatus.value === 'progress') {
          filteredGoals = filteredGoals.filter(
            (goal) =>
              this.getProgressPercentage(goal) < 100 && !this.isOverdue(goal)
          );
        }
      }

      // Actualizar estadísticas
      this.totalGoals = mockGoals.length;
      this.completedGoals = mockGoals.filter(
        (goal) => this.getProgressPercentage(goal) >= 100
      ).length;
      this.inProgressGoals = mockGoals.filter(
        (goal) =>
          this.getProgressPercentage(goal) < 100 && !this.isOverdue(goal)
      ).length;
      this.overdueGoals = mockGoals.filter((goal) =>
        this.isOverdue(goal)
      ).length;

      // Actualizar datos y paginación
      this.totalRecords = filteredGoals.length;
      this.goals.set(filteredGoals);
      this.loading.set(false);
    }, 800);
  }

  /**
   * Limpia todos los filtros
   */
  clearFilters(): void {
    this.selectedGoalType = null;
    this.selectedPriority = null;
    this.selectedStatus = null;
    this.activeFilters.set([]);
    this.loadGoals({ resetPage: true });
  }

  /**
   * Elimina un filtro específico
   */
  removeFilter(key: string): void {
    if (key === 'type') this.selectedGoalType = null;
    if (key === 'priority') this.selectedPriority = null;
    if (key === 'status') this.selectedStatus = null;

    this.loadGoals({ resetPage: true });
  }

  /**
   * Abre formulario para crear nuevo objetivo
   */
  openGoalForm(): void {
    this.ref = this.dialogService.open(GoalsFormComponent, {
      header: 'Nuevo Objetivo',
      width: '50rem',
      contentStyle: { overflow: 'auto' },
      modal: true,
      closable: true,
      baseZIndex: 10000,
      maximizable: true,
      data: {
        // Datos iniciales si fuera necesario
      },
    });

    this.ref.onClose.subscribe((result: Goal) => {
      if (result) {
        // Añadir el nuevo objetivo a la lista
        this.goals.update((goals: Goal[]) => [
          ...goals,
          { ...result, id: Date.now().toString() },
        ]);

        // Actualizar estadísticas
        this.totalGoals++;
        if (this.getProgressPercentage(result) >= 100) {
          this.completedGoals++;
        } else if (this.isOverdue(result)) {
          this.overdueGoals++;
        } else {
          this.inProgressGoals++;
        }

        this.messageService.add({
          severity: 'success',
          summary: 'Objetivo creado',
          detail: 'El objetivo se ha creado correctamente',
        });
      }
    });
  }

  /**
   * Edita un objetivo existente
   */
  editGoal(goal: Goal): void {
    this.ref = this.dialogService.open(GoalsFormComponent, {
      header: 'Editar Objetivo',
      width: '50rem',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      maximizable: true,
      modal: true,
      closable: true,
      data: {
        goal: { ...goal },
      },
    });

    this.ref.onClose.subscribe((result: Goal) => {
      if (result) {
        // Actualizar el objetivo en la lista
        this.goals.update((goals: Goal[]) =>
          goals.map((g: Goal) =>
            g.id === goal.id ? { ...result, id: goal.id } : g
          )
        );

        this.messageService.add({
          severity: 'success',
          summary: 'Objetivo actualizado',
          detail: 'El objetivo se ha actualizado correctamente',
        });

        // Actualizar estadísticas
        this.updateStats();
      }
    });
  }

 
  /**
   * Elimina un objetivo
   */
  deleteGoal(event: Event, goal: Goal): void {
    event.stopPropagation();

    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: '¿Está seguro que desea eliminar este objetivo?',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'Cancelar',
      accept: () => {
        // Eliminar el objetivo de la lista
        this.goals.update((goals: Goal[]) =>
          goals.filter((g: Goal) => g.id !== goal.id)
        );

        this.messageService.add({
          severity: 'success',
          summary: 'Objetivo eliminado',
          detail: 'El objetivo ha sido eliminado correctamente',
        });

        // Actualizar estadísticas
        this.updateStats();
      },
    });
  }

  /**
   * Actualiza las estadísticas
   */
  updateStats(): void {
    const currentGoals = this.goals();
    this.totalGoals = currentGoals.length;
    this.completedGoals = currentGoals.filter(
      (goal: Goal) => this.getProgressPercentage(goal) >= 100
    ).length;
    this.inProgressGoals = currentGoals.filter(
      (goal: Goal) =>
        this.getProgressPercentage(goal) < 100 && !this.isOverdue(goal)
    ).length;
    this.overdueGoals = currentGoals.filter((goal: Goal) =>
      this.isOverdue(goal)
    ).length;
  }

  /**
   * Calcula el porcentaje de progreso
   */
  getProgressPercentage(goal: Goal): number {
    if (!goal.targetValue || goal.targetValue === 0) return 0;
    return Math.min(100, (goal.currentValue / goal.targetValue) * 100);
  }

  /**
   * Devuelve la clase CSS para la barra de progreso
   */
  getProgressBarClass(goal: Goal): string {
    const percentage = this.getProgressPercentage(goal);
    if (percentage < 25) return 'bg-red-500 h-2 rounded-full';
    if (percentage < 50) return 'bg-yellow-500 h-2 rounded-full';
    if (percentage < 75) return 'bg-blue-500 h-2 rounded-full';
    return 'bg-green-500 h-2 rounded-full';
  }

  /**
   * Comprueba si un objetivo está vencido
   */
  isOverdue(goal: Goal): boolean {
    return (
      new Date(goal.endDate) < new Date() &&
      this.getProgressPercentage(goal) < 100
    );
  }

  /**
   * Comprueba si un objetivo está completado
   */
  isCompleted(goal: Goal): boolean {
    return this.getProgressPercentage(goal) >= 100;
  }

  /**
   * Calcula días restantes hasta la fecha límite
   */
  getDaysRemaining(goal: Goal): number {
    const today = new Date();
    const endDate = new Date(goal.endDate);
    const diffTime = endDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  /**
   * Obtiene la etiqueta para el tipo de objetivo
   */
  getGoalTypeLabel(type: string): string {
    const typeOption = this.goalTypesOptions.find(
      (t: { value: string; label: string }) => t.value === type
    );
    return typeOption?.label || type;
  }

  /**
   * Obtiene la etiqueta para la prioridad
   */
  getPriorityLabel(priority: string): string {
    const priorityOption = this.priorityOptions.find(
      (p) => p.value === priority
    );
    return priorityOption?.label || priority;
  }

  /**
   * Obtiene el icono para la prioridad
   */
  getPriorityIcon(priority: string): string {
    switch (priority) {
      case 'high':
        return 'pi pi-arrow-up';
      case 'medium':
        return 'pi pi-minus';
      case 'low':
        return 'pi pi-arrow-down';
      default:
        return 'pi pi-minus';
    }
  }

  /**
   * Obtiene la etiqueta para el estado del objetivo
   */
  getGoalStatusLabel(goal: Goal): string {
    if (this.isCompleted(goal)) return 'Completado';
    if (this.isOverdue(goal)) return 'Vencido';
    return 'En progreso';
  }

  /**
   * Obtiene la severidad para el tag de estado
   */
  getGoalStatusSeverity(goal: Goal): 'success' | 'warn' | 'danger' | 'info' {
    if (this.isCompleted(goal)) return 'success';
    if (this.isOverdue(goal)) return 'danger';
    return 'info';
  }
}
