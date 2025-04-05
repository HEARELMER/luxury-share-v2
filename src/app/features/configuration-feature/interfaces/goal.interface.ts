export interface Goal {
  goalId?: string;
  name: string;
  description: string;
  type: GoalType;
  priority: GoalPriority;
  targetValue: number;
  currentValue: number;
  startDate: Date;
  endDate: Date; 
  unit: string;
  trend?: number;
  icon?: string;
}

export type GoalType =
  | 'sales'
  | 'productivity'
  | 'satisfaction'
  | 'quality'
  | 'financial'
  | 'other';

export type GoalPriority = 'low' | 'medium' | 'high';

export interface GoalTypeOption {
  label: string;
  value: GoalType;
  icon?: string;
  description?: string;
}
