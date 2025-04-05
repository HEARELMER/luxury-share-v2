import { GoalTypeOption } from '../interfaces/goal.interface';

export const GOAL_TYPES: GoalTypeOption[] = [
  {
    label: 'Ventas',
    value: 'sales',
  },
  {
    label: 'Productividad',
    value: 'productivity',
  },
  {
    label: 'Satisfacción',
    value: 'satisfaction',
  },
  {
    label: 'Calidad',
    value: 'quality',
  },
  {
    label: 'Financiero',
    value: 'financial',
  },
  {
    label: 'Otro',
    value: 'other',
  },
];

export const GOAL_COLS_TABLE = [
  { field: 'name', header: 'Nombre', sortable: true },
  // { field: 'description', header: 'Descripción', sortable: true },
  { field: 'type', header: 'Tipo', sortable: true },
  { field: 'priority', header: 'Prioridad', sortable: true },
  { field: 'targetValue', header: 'Valor Objetivo', sortable: true },
  { field: 'currentValue', header: 'Valor Actual', sortable: true },
  // { field: 'unit', header: 'Unidad', sortable: true },
  // { field: 'startDate', header: 'Fecha de Inicio', sortable: true },
  // { field: 'endDate', header: 'Fecha de Fin', sortable: true },
  // { field: 'icon', header: 'Icono', sortable: true },
  { field: 'status', header: 'Estado', sortable: true },
  { field: 'registeredBy', header: 'Registrado por', sortable: true },
  // { field: 'createdAt', header: 'Fecha de Creación', sortable: true },
  // { field: 'updatedAt', header: 'Fecha de Modificación', sortable: true },
  { field: 'actions', header: 'Acciones', sortable: false },
];
