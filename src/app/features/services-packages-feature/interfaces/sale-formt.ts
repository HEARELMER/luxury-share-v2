export interface TableState {
  first: number;
  rows: number;
  sortField?: string;
  sortOrder?: number;
  filters?: any[]
}
export interface ColumnDef {
  field: string;
  header: string;
}

export interface SaleItem {
  name: string;
  type?: string;
  priceUnit: number;
  quantity: number;
  description?: string;
  status?: boolean;
  serviceId?: string;
  packageId?: string;
  startDate?: Date;
  endDate?: Date;
}