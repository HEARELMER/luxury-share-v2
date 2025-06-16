import { Injectable } from '@angular/core';
import { environmentDev } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { DashboardData } from '../../../shared/interfaces/dashboard';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private api = environmentDev.apiUrl;
  constructor(private http: HttpClient) {}

  getDashboardData(): Observable<DashboardData> {
    return this.http
      .get<DashboardData>(`${this.api}reports/dashboard`, {
        withCredentials: true,
      })
      .pipe(map((response: any) => response.data));
  }
}
