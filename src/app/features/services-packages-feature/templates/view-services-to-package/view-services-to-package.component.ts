import {
  Component,
  computed,
  inject,
  input,
  model,
  output,
  WritableSignal,
} from '@angular/core';
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
  dataTable = model<any>(null);
  servicesCols = input<any>(SERVICE_TABLE_COLS);

  serviceRemoved = output<{
    success: boolean;
    newPrice?: number;
    message?: string;
  }>();
  formatDataInput = computed(() => {
    if (!this.dataTable() == null) return [];

    return (
      this.dataTable()?.services.map(
        ({
          service,
          packageId,
        }: {
          service: { priceUnit: number };
          packageId: string;
        }) => ({
          ...service,
          packageId,
        })
      ) || []
    );
  });

  deleteService(service: any): void {
    const packagePrice = this.dataTable()?.priceUnit || 0;
    const servicePrice = service.priceUnit || 0;
    const newPrice = Math.max(0, packagePrice - servicePrice);
    const ref = this.dialogService.open(DialogComponent, {
      header: 'Eliminar servicio del paquete',
      modal: true,
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      breakpoints: {
        '960px': '65vw',
        '640px': '60vw',
      },
      data: {
        type: 'success',
        message: `¿Estás seguro de eliminar el servicio "${service.name}"? El precio del paquete se actualizará a ${newPrice}`,
        confirmText: 'Eliminar',
        showCancel: false,
      },
    });
    ref.onClose.subscribe((result: boolean) => {
      if (result) {
        const data = {
          serviceIds: [service.serviceId],
          newPrice: newPrice,
        };

        this._packageService
          .removeServiceFromPackage(service.packageId, data)
          .subscribe({
            next: (response) => {
              // Notificar éxito al padre
              this.serviceRemoved.emit({
                success: true,
                newPrice: newPrice,
                message: response.message.message,
              });

              // Actualizar la lista local
              this.dataTable.update((current: any) => ({
                ...current,
                priceUnit: newPrice,
                services: current.services.filter(
                  (s: any) => s.service.serviceId !== service.serviceId
                ),
              }));
            },
            error: (error) => { 
              this.serviceRemoved.emit({
                success: false,
                message: error.error.message,
              }); 
            },
          });
      } else {
        // Usuario canceló
      }
    });
  }
}
