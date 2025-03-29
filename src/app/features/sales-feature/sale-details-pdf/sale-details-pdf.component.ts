import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { PdfControlsComponent } from '../../../shared/components/pdf/pdf-controls.component';
import { PdfViewerComponent } from '../../../shared/components/pdf/pdf-viewer.component';
import jsPDF from 'jspdf';
import { ReportPdfTemplate } from '../../../shared/components/pdf/templates/report-template';

@Component({
  selector: 'app-sale-details-pdf',
  imports: [
    CommonModule,
    PdfViewerComponent,
    PdfControlsComponent,
    ButtonModule,
  ],
  templateUrl: './sale-details-pdf.component.html',
  styleUrl: './sale-details-pdf.component.scss',
})
export class SaleDetailsPdfComponent {
  pdfDoc: jsPDF | null = null;

  onEmail(event: any) {
    console.log('Email event:', event);
  }

  // Datos estáticos de muestra para una venta
  mockSaleData = {
    codeSale: 'F001-123',
    dateSale: '2025-03-28',
    departureDate: '2025-03-29',
    status: 'COMPLETADO',
    paymentMethod: 'TARJETA DE CRÉDITO',
    observations: 'Cliente solicitó atención prioritaria',
    total: 350.0,
    discount: 35.0,
    registeredBy: 'Juan Operador',
    branch: 'Sede Central',

    client: {
      name: 'María',
      firstLastname: 'García',
      secondLastname: 'López',
      numberDocument: '73464945',
      phone: '987654321',
      email: 'maria.garcia@example.com',
    },

    details: [
      {
        description: 'Tratamiento facial premium',
        serviceId: 1,
        quantity: 1,
        unitPrice: 150.0,
      },
      {
        description: 'Masaje relajante',
        serviceId: 2,
        quantity: 1,
        unitPrice: 120.0,
      },
      {
        description: 'Kit de productos dermatológicos',
        packageId: 3,
        quantity: 1,
        unitPrice: 80.0,
      },
    ],
  };

  constructor(private reportTemplate: ReportPdfTemplate) {
    // Inicializar el PDF al cargar el componente
    this.generateSaleDetailsPdf();
  }

  generateSaleDetailsPdf(): void {
    // Usar los datos de muestra
    const saleData = this.mockSaleData;

    // Formatear los datos de items para la tabla
    const tableItems = saleData.details.map((item) => [
      item.description,
      item.quantity,
      `S/ ${item.unitPrice.toFixed(2)}`,
      `S/ ${(item.quantity * item.unitPrice).toFixed(2)}`,
    ]);

    const reportData = {
      title: 'DETALLE DE VENTA',
      subtitle: `Venta - ${saleData.codeSale}`,
      date: new Date().toLocaleDateString(),

      sections: [
        {
          title: 'Información de la Venta',
          type: 'text',
          content: `
            Fecha de venta: ${new Date(saleData.dateSale).toLocaleDateString()}
            Fecha de salida: ${new Date(
              saleData.departureDate
            ).toLocaleDateString()}
            Método de pago: ${saleData.paymentMethod}
            Estado: ${saleData.status}
            Sucursal: ${saleData.branch}
            ${
              saleData.observations
                ? `Observaciones: ${saleData.observations}`
                : ''
            }
          `.trim(),
        },
        {
          title: 'Datos del Cliente',
          type: 'text',
          content: `
            Nombre: ${saleData.client.name} ${saleData.client.firstLastname} ${
            saleData.client.secondLastname
          }
            DNI: ${saleData.client.numberDocument}
            Teléfono: ${saleData.client.phone}
            ${saleData.client.email ? `Email: ${saleData.client.email}` : ''}
          `.trim(),
        },
        {
          title: 'Detalle de Productos y Servicios',
          type: 'table',
          tableData: {
            headers: ['Descripción', 'Cantidad', 'Precio Unitario', 'Total'],
            rows: tableItems,
          },
        },
      ],
      summary: `
        Subtotal: S/ ${saleData.total.toFixed(2)}
        ${
          saleData.discount
            ? `Descuento: S/ ${saleData.discount.toFixed(2)}`
            : ''
        }
        Total: S/ ${(saleData.total - saleData.discount).toFixed(2)}

        Venta registrada por: ${saleData.registeredBy}
      `.trim(),
    };

    this.pdfDoc = this.reportTemplate.generateReportPdf(reportData as any);
  }
}
