// sale-pdf.service.ts
import { Injectable, inject } from '@angular/core';
import { ReportSalePdfTemplate } from '../../../shared/components/pdf/templates/report-sale-template';
import jsPDF from 'jspdf';
import { SalesService } from './sales.service';

@Injectable({
  providedIn: 'root',
})
export class SalePdfService {
  private readonly reportSaleTemplate = inject(ReportSalePdfTemplate);
  private readonly _salesService = inject(SalesService);

  /**
   * Genera un PDF con los detalles de una venta
   */
  generateSaleDetailsPdf(saleData: any): jsPDF {
    if (!saleData)
      throw new Error('Sale data is required to generate the PDF.');

    // Formatear los datos de items para la tabla
    const tableItems =
      saleData.details?.map((item: any) => [
        item.description || item.service?.name || 'Servicio',
        item.quantity,
        `S/ ${Number(item.unitPrice).toFixed(2)}`,
        `S/ ${(Number(item.quantity) * Number(item.unitPrice)).toFixed(2)}`,
      ]) || [];

    const reportData = {
      title: 'DETALLE DE VENTA',
      subtitle: `Venta - ${saleData.codeSale?.toUpperCase()}`,
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

    return this.reportSaleTemplate.generateReportSalePdf(reportData as any);
  }

  /**
   * Descarga un PDF con los detalles de una venta
   */
  downloadSaleDetailsPdf(codeSale: string): void {
    const saleData = this._salesService
      .getSaleByCodeSale(codeSale)
      .subscribe((saleData) => {
        if (!saleData) {
          console.error('No se encontró la venta con el código proporcionado.');
          return;
        }

        const pdf = this.generateSaleDetailsPdf(saleData);
        if (pdf) {
          pdf.save(
            `detalle-venta-${saleData.codeSale?.toUpperCase() || 'nuevo'}.pdf`
          );
        }
      });
  }

  /**
   * Envía por correo un PDF con los detalles de una venta
   */
  sendSaleDetailsPdfByEmail(saleData: any, email?: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      try {
        const pdf = this.generateSaleDetailsPdf(saleData);
        if (!pdf) {
          reject('No se pudo generar el PDF');
          return;
        }

        const pdfBase64 = pdf.output('datauristring');
        const recipientEmail = email || saleData.client?.email;

        if (!recipientEmail) {
          reject('No se especificó un correo electrónico');
          return;
        }

        // Aquí iría la lógica para enviar el email con el PDF adjunto
        // usando tu API o servicio de correo

        // Simulación del envío:
        setTimeout(() => {
          console.log(`Email sent to ${recipientEmail} with PDF attached`);
          resolve(true);
        }, 1000);
      } catch (error) {
        reject(error);
      }
    });
  }
}
