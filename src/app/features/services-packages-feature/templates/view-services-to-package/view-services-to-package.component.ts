import { Component, computed, input } from '@angular/core';
import { SERVICE_TABLE_COLS } from '../../constants/table-services.constant';
import { Table, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { CommonModule, JsonPipe } from '@angular/common';
import { Skeleton } from 'primeng/skeleton';

@Component({
  selector: 'app-view-services-to-package',
  imports: [TableModule, Skeleton, TagModule, CommonModule, JsonPipe],
  templateUrl: './view-services-to-package.component.html',
  styleUrl: './view-services-to-package.component.scss',
})
export class ViewServicesToPackageComponent {
  dataTable = input<any>(null);
  SERVICES_COLS = SERVICE_TABLE_COLS;

  formatDataInput = computed(() => {
    if (!this.dataTable()) return [];

    return this.dataTable()?.services.map(({ service }: { service: { priceUnit: number } }) => ({
      ...service,
      price: `S/. ${service.priceUnit.toFixed(2)}`,
    })) || [];
  });

    SERVICES_COLS_FORMATTED = computed(() => {
      return this.SERVICES_COLS.filter((col) => col.field !== 'actions');
    });
  }
