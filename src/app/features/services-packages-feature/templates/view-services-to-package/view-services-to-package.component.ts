import { Component, computed, inject, input } from '@angular/core';
import { SERVICE_TABLE_COLS } from '../../constants/table-services.constant';
import { Table, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { CommonModule } from '@angular/common';
import { Skeleton } from 'primeng/skeleton';
import { DialogComponent } from '../../../../shared/components/ui/dialog/dialog.component';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Tooltip } from 'primeng/tooltip';
import { PackagesService } from '../../../../core/services/services_packages-services/packages.service';

@Component({
  selector: 'app-view-services-to-package',
  imports: [TableModule, Skeleton, TagModule, CommonModule, Tooltip],
  templateUrl: './view-services-to-package.component.html',
  styleUrl: './view-services-to-package.component.scss',
  providers: [DialogService],
})
export class ViewServicesToPackageComponent {
  public readonly dialogService = inject(DialogService);
  private readonly _packageService = inject(PackagesService);

  ref: DynamicDialogRef | undefined;
  dataTable = input<any>(null);
  SERVICES_COLS = SERVICE_TABLE_COLS;

  formatDataInput = computed(() => {
    if (!this.dataTable() == null) return [];

    return (
      this.dataTable()?.services.map(
        ({ service }: { service: { priceUnit: number } }) => ({
          ...service,
          price: `S/. ${service.priceUnit.toFixed(2)}`,
        })
      ) || []
    );
  });

  deleteService(service: any): void {
    const ref = this.dialogService.open(DialogComponent, {
      header: 'Eliminar servcio del paquete',
      modal: true,
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      breakpoints: {
        '960px': '65vw',
        '640px': '60vw',
      },
      data: {
        type: 'success',
        message: `¿Estás seguro de eliminar el servicio del paquete?`,
        confirmText: 'Continuar',
        showCancel: false,
      },
    });
    ref.onClose.subscribe((result: boolean) => {
      if (result) {
        // Usuario confirmó
      } else {
        // Usuario canceló
      }
    });
  }
}
