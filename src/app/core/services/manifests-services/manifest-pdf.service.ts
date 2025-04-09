import { Injectable, inject } from '@angular/core';
import { ManifestPdfTemplate } from '../../../shared/components/pdf/templates/manifest-pdf-template';
import jsPDF from 'jspdf';
import { ManifestsService } from './manifests.service';
import { formatDate } from '@angular/common';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ManifestPdfService {
  private readonly manifestPdfTemplate = inject(ManifestPdfTemplate);
  private readonly manifestsService = inject(ManifestsService);

  /**
   * Genera un PDF con los detalles del manifiesto de check-in
   */
  generateManifestPdf(manifestData: any, download?: boolean): jsPDF {
    if (!manifestData) {
      throw new Error(
        'Los datos del manifiesto son necesarios para generar el PDF.'
      );
    }

    // Formatear los datos de participantes para la tabla
    const tableParticipants =
      manifestData.participants?.map((participant: any) => [
        participant.clientName || 'Sin nombre',
        participant.client?.numberDocument || '-',
        participant.client?.phone || '-',
        this.formatCheckInStatus(participant.checkInStatus),
        participant.checkInTime
          ? formatDate(participant.checkInTime, 'dd/MM/yyyy HH:mm', 'en-US')
          : '-',
        participant.comments || '-',
      ]) || [];

    // Calcular estadísticas de check-in
    const totalParticipants = manifestData.participants?.length || 0;
    const checkedInParticipants =
      manifestData.participants?.filter(
        (p: any) => p.checkInStatus === 'REGISTRADO'
      ).length || 0;
    const pendingParticipants = totalParticipants - checkedInParticipants;
    const checkInPercentage =
      totalParticipants > 0
        ? Math.round((checkedInParticipants / totalParticipants) * 100)
        : 0;

    // Crear datos para el PDF
    const reportData = {
      title: 'MANIFIESTO',
      subtitle: `${manifestData.title || 'Servicio'}`,
      date: formatDate(new Date(), 'dd/MM/yyyy', 'en-US'),
      serviceType: this.formatServiceType(manifestData.serviceType),
      departureDate: manifestData.participants?.[0]?.sale?.departureDate
        ? formatDate(
            manifestData.participants[0].sale.departureDate,
            'dd/MM/yyyy HH:mm',
            'en-US'
          )
        : 'No especificada',
      branch: manifestData.branch?.address || 'Principal',
      sections: [
        {
          title: 'Información del Servicio',
          type: 'text',
          content: [
            `Descripción: ${manifestData.description || 'Sin descripción'}`,
            `Estado: ${manifestData.status || 'No especificado'}`,
            `Sucursal: ${manifestData.branch?.address || 'Principal'}`,
          ],
        },
        {
          title: 'Lista de Participantes',
          type: 'table',
          tableData: {
            headers: [
              'Nombre',
              'Documento',
              'Teléfono',
              'Estado',
              'Hora Check-in',
              'Observaciones',
            ],
            rows: tableParticipants,
          },
        },
      ],
      summary: [
        `Total de participantes: ${totalParticipants}`,
        `Participantes registrados: ${checkedInParticipants}`,
        `Participantes pendientes: ${pendingParticipants}`,
        `Porcentaje de check-in: ${checkInPercentage}%`,
        '',
        `Manifiesto generado por: ${
          manifestData.registeredByUser
            ? `${manifestData.registeredByUser.name || ''} ${
                manifestData.registeredByUser.firstLastname || ''
              } ${manifestData.registeredByUser.secondLastname || ''}`.trim()
            : 'Sistema'
        }`,
      ],
    };

    const pdf = this.manifestPdfTemplate.generateManifestPdf(reportData as any);
    if (download) {
      pdf.save(
        `manifiesto-${manifestData.title || 'servicio'}-${formatDate(
          new Date(),
          'yyyyMMdd',
          'en-US'
        )}.pdf`
      );
    }
    return pdf;
  }

  /**
   * Descarga un PDF con los detalles de un manifiesto
   */
  downloadManifestPdf(manifestId: string): Observable<any> {
    return new Observable((observer) => {
      this.manifestsService.findManifestById(manifestId).subscribe({
        next: (response) => {
          if (!response) {
            return;
          }

          const manifestData = response;
          const pdf = this.generateManifestPdf(manifestData);

          if (pdf) {
            pdf.save(
              `manifiesto-${manifestData.title || 'servicio'}-${formatDate(
                new Date(),
                'yyyyMMdd',
                'en-US'
              )}.pdf`
            );
          }
          observer.next(pdf);
          observer.complete();
        },
        error: (err) => {
          observer.error(err);
        },
      });
    });
  }

  /**
   * Formatea el tipo de servicio para mostrar en el PDF
   */
  private formatServiceType(type: string): string {
    switch (type?.toLowerCase()) {
      case 'tour':
        return 'Tour';
      case 'hotel':
        return 'Hotel';
      case 'transport':
        return 'Transporte';
      default:
        return type || 'No especificado';
    }
  }

  /**
   * Formatea el estado de check-in para mostrar en el PDF
   */
  private formatCheckInStatus(status: string): string {
    switch (status) {
      case 'REGISTRADO':
        return 'Registrado';
      case 'PENDIENTE':
        return 'Pendiente';
      default:
        return status || 'Pendiente';
    }
  }
}
