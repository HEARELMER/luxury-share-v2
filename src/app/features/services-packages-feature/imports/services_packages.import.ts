import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tooltip } from 'chart.js';
import { BadgeModule } from 'primeng/badge';
import { PaginatorModule } from 'primeng/paginator';
import { PopoverModule } from 'primeng/popover';
import { Skeleton } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { Toast } from 'primeng/toast';
import { InputFormComponent } from '../../../shared/components/forms/input-form/input-form.component';
import { SelectComponent } from '../../../shared/components/forms/select/select.component';
import { ExportExcelComponent } from '../../../shared/components/layout/export-excel/export-excel.component';
import { ButtonComponent } from '../../../shared/components/ui/button/button.component';
import { AddPackageComponent } from '../add-package/add-package.component';
import { AddServiceComponent } from '../add-service/add-service.component';

export const SERVICES_PACKAGES_IMPORTS = [
  TieredMenuModule,
  CommonModule,
  BadgeModule,
  TableModule,
  CommonModule,
  Skeleton, 
  PaginatorModule,
  FormsModule,
  ButtonComponent,
  PopoverModule,
  ExportExcelComponent,
  InputFormComponent,
  TagModule,
  SelectComponent,
  AddServiceComponent,
  AddPackageComponent,
  Toast,
];
