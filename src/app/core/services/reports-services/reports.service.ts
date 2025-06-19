import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable, of, tap } from 'rxjs';
import { environmentDev } from '../../../environments/environment.development';
import { LocalstorageService } from '../localstorage-services/localstorage.service';
import { Filter } from '../../interfaces/api/filters';

@Injectable({
  providedIn: 'root',
})
export class ReportsService {
  private readonly _api = environmentDev.apiUrl;
  private readonly _httpclient = inject(HttpClient);
  private readonly _localStorageService = inject(LocalstorageService);

  loadReports(filters: any, forceRefresh: boolean = false): Observable<any> {
    if (!forceRefresh) {
      const reports = this._localStorageService.getReportsFromCache('reports');
      const lastUpdate =
        this._localStorageService.getReportsFromCache('reports').data.metadata
          .lastGenerated;
      if (reports) {
        return of({
          response: reports,
          lastUpdate: new Date(lastUpdate),
        });
      }
    }

    return this._httpclient
      .post<any>(`${this._api}reports/data`, filters, {
        withCredentials: true,
      })
      .pipe(
        tap((response) => {
          this._localStorageService.setReportsToCache('reports', response);
        }),
        map((response) => {
          return {
            response: response,
            lastUpdate: new Date(response.data.metadata.lastGenerated),
          };
        })
      );
  }

  getDataOfSales(filters: any): Observable<any> {
    return this._httpclient.post<any>(`${this._api}reports/sales`, filters, {
      withCredentials: true,
    });
  }
  getDataOfServicesAndPackages(filters: any): Observable<any> {
    return this._httpclient.post<any>(
      `${this._api}reports/services-and-packages`,
      filters,
      {
        withCredentials: true,
      }
    );
  }
  getDataOfBranches(filters: any): Observable<any> {
    return this._httpclient.post<any>(`${this._api}reports/branches`, filters, {
      withCredentials: true,
    });
  }

  getReportsHistory(
    page: number,
    size: number,
    filters?: Filter[]
  ): Observable<any> {
    let url = `${this._api}reports/history`;
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

    return this._httpclient.get(url, { params, withCredentials: true });
  }
}
