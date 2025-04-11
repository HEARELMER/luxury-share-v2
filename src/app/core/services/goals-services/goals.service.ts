import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environmentDev } from '../../../environments/environment.development';
import { Filter } from '../../interfaces/api/filters';
import { ExportFilesService } from '../files-services/export-files.service';

@Injectable({
  providedIn: 'root',
})
export class GoalService {
  private readonly _apiUrl: String = environmentDev.apiUrl;
  private readonly _httpclient = inject(HttpClient);

  getGoals(page: number, size: number, filters?: Filter[]): Observable<any> {
    let url = `${this._apiUrl}goals`;
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

  createGoal(data: any): Observable<any> {
    return this._httpclient.post(`${this._apiUrl}goals`, data);
  }

  updateGoal(idGoal: string, data: any): Observable<any> {
    return this._httpclient.put(`${this._apiUrl}goals/${idGoal}`, data);
  }

  removeGoal(data: any): Observable<any> {
    return this._httpclient.delete(`${this._apiUrl}goals`, { body: data });
  }
}
