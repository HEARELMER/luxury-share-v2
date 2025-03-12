import { inject, Injectable } from '@angular/core';
import { environmentDev } from '../../../environments/environment.development';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Filter } from '../../interfaces/api/filters';
import { ExportFilesService } from '../files-services/export-files.service';

@Injectable({
  providedIn: 'root',
})
export class PackagesService {
  private readonly _api = environmentDev.apiUrl;
  private readonly _httpclient = inject(HttpClient);
  private readonly _exportFilesService = inject(ExportFilesService);

  getPackages(page: number, size: number, filters?: Filter[]): Observable<any> {
    let url = `${this._api}packages`;
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

  createPackage(data: any): Observable<any> {
    return this._httpclient.post(`${this._api}packages`, data);
  }

  addServiceToPackage(data: any): Observable<any> {
    return this._httpclient.post(`${this._api}packages/add-services`, data);
  }

  updatePackage(packageId: string, data: any): Observable<any> {
    return this._httpclient.put(`${this._api}packages/${packageId}`, data);
  }

  exportToExcel(page: number, size: number): Observable<any> {
    return this.getPackages(page, size).pipe(
      map((response) => {
        const selectedColumns = [
          'name',
          'description',
          'priceUnit',
          'createdAt',
          'updatedAt',
          'status',
        ];

        const headers = {
          name: 'Nombre',
          description: 'Descripción',
          priceUnit: 'Precio Unitario',
          createdAt: 'Fecha de Creación',
          updatedAt: 'Fecha de Modificación',
          status: 'Estado',
        };

        // Transformar los datos para el formato correcto
        const formattedData = response.data.packages.map((pkg: any) => ({
          ...pkg,
          status: pkg.status ? 'Activo' : 'Inactivo',
          createdAt: new Date(pkg.createdAt).toLocaleString(),
          updatedAt: new Date(pkg.updatedAt).toLocaleString(),
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

  removeServiceFromPackage(packageId: string, data: any): Observable<any> {
    return this._httpclient.patch(
      `${this._api}packages/${packageId}/remove-services`,
      data
    );
  }
}
