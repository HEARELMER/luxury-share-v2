import { inject, Injectable } from '@angular/core';
import { environmentDev } from '../../../environments/environment.development';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Filter } from '../../interfaces/api/filters';

@Injectable({
  providedIn: 'root',
})
export class ServicesService {
  private readonly _api = environmentDev.apiUrl;
  private readonly _httpclient = inject(HttpClient);
 
  getServices(page: number, size: number, filter?: Filter): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', size.toString());

    return this._httpclient.get(`${this._api}services`, { params });
  }

  createService(data: any): Observable<any> {
    return this._httpclient.post(`${this._api}services`, data);
  }

  updateService(data: any): Observable<any> {
    return this._httpclient.put(`${this._api}services`, data);
  }
}
