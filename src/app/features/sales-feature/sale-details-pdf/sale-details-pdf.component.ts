import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  signal,
} from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { PdfControlsComponent } from '../../../shared/components/pdf/pdf-controls.component';
import { PdfViewerComponent } from '../../../shared/components/pdf/pdf-viewer.component';
import jsPDF from 'jspdf';
import { ReportSalePdfTemplate } from '../../../shared/components/pdf/templates/report-sale-template';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { SalesService } from '../../../core/services/sales-services/sales.service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-sale-details-pdf',
  imports: [
    CommonModule,
    PdfViewerComponent,
    PdfControlsComponent,
    ButtonModule,
    ProgressSpinnerModule,
  ],
  templateUrl: './sale-details-pdf.component.html',
  styleUrl: './sale-details-pdf.component.scss',
})
export class SaleDetailsPdfComponent {
  private readonly _config = inject(DynamicDialogConfig);
  private readonly _salesService = inject(SalesService);
  private readonly _dialogRef = inject(DynamicDialogRef);
  private readonly _destroyRef = inject(DestroyRef);
  private readonly _messageService = inject(MessageService);

  private readonly reportSaleTemplate = inject(ReportSalePdfTemplate);

  // Signals
  loading = signal<boolean>(false);
  saleData = signal<any>(null);
  saleNotFound = signal<boolean>(false);
  pdfDoc: jsPDF | null = null;
  // Computed values
  dialogData = computed(() => this._config.data?.codeSale);

  constructor() {
    // Generar PDF automáticamente cuando tengamos datos
    effect(() => {
      const data = this.saleData();
      if (data) {
        this.generateSaleDetailsPdf();
      }
    });
  }

  ngOnInit(): void {
    if (this.dialogData()) {
      this.fetchSaleData();
    }
  }

  fetchSaleData(): void {
    this.loading.set(true);
    this._salesService
      .getSaleByCodeSale(this.dialogData())
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (response) => {
          this.loading.set(false);
          if (response) {
            this.saleData.set(response);
          } else {
            this.saleNotFound.set(true);
          }
        },
        error: (error) => {
          this.loading.set(false);
          this.saleNotFound.set(true);
        },
      });
  }

  enrichSaleData(data: any): any {
    // Asegurarse que los detalles existan y tengan descripción
    if (data.details && Array.isArray(data.details)) {
      data.details = data.details.map((item: any) => {
        // Si no hay descripción, usar el nombre del servicio o paquete
        if (!item.description) {
          if (item.service && item.service.name) {
            item.description = item.service.name;
          } else if (item.serviceId) {
            item.description = 'Servicio';
          } else if (item.package && item.package.name) {
            item.description = item.package.name;
          } else if (item.packageId) {
            item.description = 'Paquete';
          } else {
            item.description = 'Ítem sin descripción';
          }
        }
        return item;
      });
    }
    return data;
  }

  generateSaleDetailsPdf(): void {
    const saleData = this.saleData();
    if (!saleData) return;

    // Formatear los datos de items para la tabla
    const tableItems = saleData.details.map((item: any) => [
      item.description || item.service?.name || 'Servicio',
      item.quantity,
      `S/ ${Number(item.unitPrice).toFixed(2)}`,
      `S/ ${(Number(item.quantity) * Number(item.unitPrice)).toFixed(2)}`,
      item.startDate
        ? new Date(item.startDate).toLocaleDateString('es-PE', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
          })
        : 'No especificado',
      item.endDate
        ? new Date(item.endDate).toLocaleDateString('es-PE', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
          })
        : 'No especificado',
    ]);

    const reportData = {
      title: 'DETALLE DE VENTA',
      subtitle: `Venta - ${saleData.codeSale.toUpperCase()}`,
      date: new Date().toLocaleDateString(),
      sections: [
        {
          title: 'Información de la Venta',
          type: 'text',
          content: [
            `Fecha de venta: ${new Date(
              saleData.dateSale
            ).toLocaleDateString()}`,
            `Fecha de salida: ${new Date(
              saleData.departureDate
            ).toLocaleDateString()}`,
            `Método de pago: ${saleData.paymentMethod}`,
            `Estado: ${saleData.status}`,
            `Sucursal: ${saleData.branch?.address || 'Principal'}`,
            saleData.observations
              ? `Observaciones: ${saleData.observations}`
              : null,
          ].filter(Boolean),
        },
        {
          title: 'Datos del Cliente',
          type: 'text',
          content: [
            `Nombre: ${saleData.client?.name || ''} ${
              saleData.client?.firstLastname || ''
            } ${saleData.client?.secondLastname || ''}`.trim(),
            `DNI: ${saleData.client?.numberDocument || 'No especificado'}`,
            `Teléfono: ${saleData.client?.phone || 'No especificado'}`,
            saleData.client?.email ? `Email: ${saleData.client.email}` : null,
          ].filter(Boolean),
        },
        {
          title: 'Detalle de Servicios',
          type: 'table',
          tableData: {
            headers: [
              'Descripción',
              'Cantidad',
              'Precio Unitario',
              'Total',
              'Fecha Inicio',
              'Fecha Fin',
            ],
            rows: tableItems,
          },
        },
      ],
      summary: [
        `Subtotal: S/ ${Number(saleData.total).toFixed(2)}`,
        saleData.discount
          ? `Descuento: S/ ${Number(saleData.discount).toFixed(2)}`
          : null,
        `Total: S/ ${(
          Number(saleData.total) - Number(saleData.discount || 0)
        ).toFixed(2)}`,
        '',
        `Venta registrada por: ${
          saleData.registeredByUser
            ? `${saleData.registeredByUser.name || ''} ${
                saleData.registeredByUser.firstLastname || ''
              } ${saleData.registeredByUser.secondLastname || ''}`.trim()
            : 'Sistema'
        }`,
      ].filter(Boolean),
    };

    const pdf = this.reportSaleTemplate.generateReportSalePdf(
      reportData as any
    );
    this.pdfDoc = pdf;
  }

  onEmail(event: any): void {
    this._messageService.add({
      severity: 'info',
      summary: 'Enviando correo...',
      detail: 'Por favor, espere un momento.',
    });
    if (!this.pdfDoc) {
      return;
    }

    if (this.saleData().email) {
      this._messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'No se ha proporcionado un correo electrónico para el cliente.',
      });
      return;
    }
    const pdfBlob = this.pdfDoc.output('blob');

    this._salesService
      .sendSaleToEmail(
        this.saleData().codeSale,
        'codeosamashare@gmail.com',
        pdfBlob
      )
      .subscribe({
        next: (response) => {
          this._messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: response.message,
          });
        },
      });
  }

  close(): void {
    this._dialogRef.close();
  }
}
