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
            console.error(
              'No se encontró la venta con el código proporcionado.'
            );
          }
        },
        error: (error) => {
          this.loading.set(false);
          this.saleNotFound.set(true);
          console.error('Error al obtener datos de la venta:', error);
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
            `Método de pago: ${this.formatPaymentMethod(
              saleData.paymentMethod
            )}`,
            `Estado: ${this.formatStatus(saleData.status)}`,
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
            headers: ['Descripción', 'Cantidad', 'Precio Unitario', 'Total'],
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
    this.pdfDoc = pdf; // Usar signal.set() en lugar de asignación directa
  }

  // Formatear para mejor visualización
  formatPaymentMethod(method: string): string {
    const methods: Record<string, string> = {
      CASH: 'Efectivo',
      CREDIT_CARD: 'Tarjeta de Crédito',
      DEBIT_CARD: 'Tarjeta de Débito',
      TRANSFER: 'Transferencia',
      YAPE: 'Yape',
      PLIN: 'Plin',
    };
    return methods[method] || method;
  }

  formatStatus(status: string): string {
    const statuses: Record<string, string> = {
      PENDIENTE: 'Pendiente',
      COMPLETADO: 'Completado',
      CANCELADO: 'Cancelado',
      EN_PROCESO: 'En Proceso',
    };
    return statuses[status] || status;
  }

  onEmail(event: any): void {
    console.log('Email event:', event);
    // Aquí implementarías el envío de email
  }
  close(): void {
    this._dialogRef.close();
  }
}
