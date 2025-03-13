import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { Skeleton } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
export interface SaleReport {
  id: string;
  saleDate: Date;
  client: string;
  service: string;
  seller: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  total: number;
}

export interface TableState {
  first: number;
  rows: number;
  sortField: string;
  sortOrder: number;
  filters: any;
}
@Component({
  selector: 'app-sales-table',
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    TagModule,
    InputTextModule,
    Skeleton
  ],
  templateUrl: './sales-table.component.html',
  styleUrl: './sales-table.component.scss',
})
export class SalesTableComponent {
  // Inputs
  data = input.required<SaleReport[]>( );
  loading = input<boolean>(false);
  totalRecords = input<number>(0);

  // Outputs
  stateChange = output<TableState>();
  export = output<'excel' | 'csv' | 'pdf'>();

  // Columnas de la tabla
  columns = [
    { field: 'id', header: 'ID', sortable: true },
    { field: 'saleDate', header: 'Fecha', sortable: true },
    { field: 'client', header: 'Cliente', sortable: true },
    { field: 'service', header: 'Servicio', sortable: true },
    { field: 'seller', header: 'Vendedor', sortable: true },
    { field: 'quantity', header: 'Cantidad', sortable: true },
    { field: 'unitPrice', header: 'Precio Unit.', sortable: true },
    { field: 'discount', header: 'Descuento', sortable: true },
    { field: 'total', header: 'Total', sortable: true },
  ];

  // Estado global de la tabla
  tableState: TableState = {
    first: 0,
    rows: 10,
    sortField: '',
    sortOrder: 1,
    filters: {},
  };

  // Método para manejar cambios en la tabla
  onTableChange(event: any) {
    this.tableState = {
      first: event.first,
      rows: event.rows,
      sortField: event.sortField,
      sortOrder: event.sortOrder,
      filters: event.filters,
    };
    this.stateChange.emit(this.tableState);
  }
}
