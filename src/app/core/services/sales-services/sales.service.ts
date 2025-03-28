import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environmentDev } from '../../../environments/environment.development';
import { Filter } from '../../interfaces/api/filters';
import { ExportFilesService } from '../files-services/export-files.service';

@Injectable({
  providedIn: 'root',
})
export class SalesService {
  private readonly _apiUrl: String = environmentDev.apiUrl;
  private readonly _httpclient = inject(HttpClient);
  private readonly _exportFilesService = inject(ExportFilesService);

  getSales(page: number, size: number, filters?: Filter[]): Observable<any> {
    // Construir params base
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', size.toString());

    // Agregar filtros a los params en lugar de concatenar a la URL
    if (filters?.length) {
      filters.forEach((filter) => {
        params = params.append(`filters[${filter.key}]`, filter.value);
      });
    }

    return this._httpclient.get(`${this._apiUrl}sales`, { params });
  }

  createSale(sale: any): Observable<any> {
    return this._httpclient.post(`${this._apiUrl}sales`, sale);
  }

  cancelSale(data: object): Observable<any> {
    return this._httpclient.post(`${this._apiUrl}sales/cancel-sale`, data);
  }

  getSaleByCodeSale(codeSale: string): Observable<any> {
    return this._httpclient
      .get(`${this._apiUrl}sales/find-by-code-sale/${codeSale}`)
      .pipe(
        map((response: any) => {
          return response.data;
        })
      );
  }
}
