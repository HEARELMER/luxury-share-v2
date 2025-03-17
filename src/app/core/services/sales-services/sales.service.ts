import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
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
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', size.toString());

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
}
