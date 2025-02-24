import { inject, Injectable } from '@angular/core';
import { environmentDev } from '../../../environments/environment.development';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Filter } from '../../interfaces/api/filters';
import { ExportFilesService } from '../files-services/export-files.service';

@Injectable({
  providedIn: 'root',
})
export class ServicesService {
  private readonly _api = environmentDev.apiUrl;
  private readonly _httpclient = inject(HttpClient);
  private readonly _exportFilesService = inject(ExportFilesService);

  getServices(page: number, size: number, filters?: Filter[]): Observable<any> {
    let url = `${this._api}services`;
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', size.toString());
    let filtersFormat = '';
    if (filters) {
      filters.forEach((filter) => {
        filtersFormat += `filters[${filter.key}]=${filter.value}&`;
      });
      url = `${url}?${filtersFormat}`;
    }

    return this._httpclient.get(url, { params });
  }

  createService(data: any): Observable<any> {
    return this._httpclient.post(`${this._api}services`, data);
  }

  updateService(data: any): Observable<any> {
    return this._httpclient.put(`${this._api}services`, data);
  }

  exportToExcel(page: number, size: number): Observable<any> {
    return this.getServices(page, size).pipe(
      map((response) => {
        const selectedColumns = [
          'name',
          'description',
          'priceUnit',
          'type',
          'createdAt',
          'updatedAt',
          'status',
        ];

        const headers = {
          name: 'Nombre',
          description: 'Descripción',
          priceUnit: 'Precio Unitario',
          type: 'Tipo',
          createdAt: 'Fecha de Creación',
          updatedAt: 'Fecha de Modificación',
          status: 'Estado',
        };

        // Transformar los datos para el formato correcto
        const formattedData = response.data.services.map((service: any) => ({
          ...service,
          status: service.status ? 'Activo' : 'Inactivo',
          createdAt: new Date(service.createdAt).toLocaleString(),
          updatedAt: new Date(service.updatedAt).toLocaleString(),
        }));

        this._exportFilesService.exportToExcel(
          formattedData,
          headers,
          selectedColumns,
          'servicios'
        );

        return response;
      })
    );
  }
}
