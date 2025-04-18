import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environmentDev } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class ReportsService {
  private readonly _api = environmentDev.apiUrl;
  private readonly _httpclient = inject(HttpClient);

  loadReports(filters: any): Observable<any> {
    return this._httpclient.post<any>(`${this._api}reports/data`, filters, {
      withCredentials: true,
    });
  }

  loadDashboardData(): Observable<any> {
    return this._httpclient.get<any>(`${this._api}reports/totals`, {
      withCredentials: true,
    });
  }
}
