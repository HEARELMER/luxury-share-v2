import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';
import { environmentDev } from '../../../environments/environment.development';
import { LocalstorageService } from '../localstorage-services/localstorage.service';

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
          const lastUpdate = response?.data?.metadata.lastGenerated;

          return { response, lastUpdate };
        })
      );
  }

  getDataForFile(filters: any): Observable<any> {
    return this._httpclient.post<any>(`${this._api}reports/files`, filters, {
      withCredentials: true,
    });
  }

  loadDashboardData(): Observable<any> {
    return this._httpclient.get<any>(`${this._api}reports/totals`, {
      withCredentials: true,
    });
  }
}
