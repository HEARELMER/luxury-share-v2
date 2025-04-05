import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TabViewModule } from 'primeng/tabview';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
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
import { SelectModule } from 'primeng/select';
import {
  GOAL_COLS_TABLE,
  GOAL_TYPES,
} from '../constants/configurations.consant';
import { ToastModule } from 'primeng/toast';
import { SkeletonModule } from 'primeng/skeleton';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TagModule } from 'primeng/tag';
import { TableModule } from 'primeng/table';
import { Tooltip } from 'primeng/tooltip';
import { GoalService } from '../../../core/services/goals-services/goals.service';
import { SelectComponent } from '../../../shared/components/forms/select/select.component';
@Component({
  selector: 'app-configurations',
  imports: [
    CommonModule,
    FormsModule,
    TabViewModule,
    ButtonModule,
    InputTextModule,
    TextareaModule,
    SelectButtonModule,
    CalendarModule,
    CheckboxModule,
    AutoCompleteModule,
    InputNumberModule,
    SkeletonModule,
    ToastModule,
    TagModule,
    TableModule,
    ConfirmDialogModule,
    SelectModule,
    Tooltip,
    SelectComponent,
    GoalsFormComponent,
  ],
  providers: [MessageService, DialogService, ConfirmationService],
  templateUrl: './configurations.component.html',
  styleUrl: './configurations.component.scss',
})
export class ConfigurationsComponent {
  private readonly messageService = inject(MessageService);
  private readonly dialogService = inject(DialogService);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly goalsService = inject(GoalService);

  ref: DynamicDialogRef | undefined;

  // Signals
  goals = signal<Goal[]>([]);
  loading = signal<boolean>(false);
  activeFilters = signal<{ key: string; value: string }[]>([]);
  headerColsGoals = GOAL_COLS_TABLE;
  // Paginación
  rows = 10;
  first = 0;
  totalRecords = 0;
  rowsPerPageOptions = [5, 10, 25, 50];
  selectedGoal = signal<Goal | undefined>(undefined);
  showGoalModal = signal<boolean>(false);

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
    { label: 'Todos', value: '' },
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

  handleRefreshData(): void {
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
        value: this.selectedGoalType,
      });
    }

    if (this.selectedPriority) {
      filters.push({
        key: 'priority',
        value: this.selectedPriority,
      });
    }

    if (this.selectedStatus) {
      filters.push({
        key: 'status',
        value: this.selectedStatus,
      });
    }

    this.activeFilters.set(filters);

    // Calcular la página actual basada en first y rows
    const currentPage = Math.floor(this.first / this.rows) + 1;

    // Llamar al servicio real en lugar de usar datos simulados
    this.goalsService.getGoals(currentPage, this.rows, filters).subscribe({
      next: (response) => {
        // Actualizar datos con la respuesta del servidor
        this.goals.set(response.data.goals);
        this.totalRecords = response.data.total;

        // Actualizar estadísticas
        this.totalGoals = response.data.stats?.total || 0;
        this.completedGoals = response.data.stats?.completed || 0;
        this.inProgressGoals = response.data.stats?.inProgress || 0;
        this.overdueGoals = response.data.stats?.overdue || 0;

        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading goals:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar los objetivos',
        });
        this.loading.set(false);
      },
    });
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
    this.selectedGoal.set(undefined);
    this.showGoalModal.set(true);
  }

  /**
   * Edita un objetivo existente
   */
  editGoal(goal: Goal): void {
    this.selectedGoal.set(goal);
    this.showGoalModal.set(true);
    console.log('Editando objetivo:', goal);
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
      accept: () => {},
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
