import { inject, Injectable } from '@angular/core';
import { environmentDev } from '../../../environments/environment.development';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Filter } from '../../interfaces/api/filters';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ManifestsService {
  private readonly _api = environmentDev.apiUrl;
  private readonly _http = inject(HttpClient);

  getManifests(
    page: number,
    size: number,
    filters?: Filter[]
  ): Observable<any> {
    let url = `${this._api}manifests`;
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

    return this._http.get(url, { params, withCredentials: true });
  }

  recommendManifests(
    page: number = 1,
    size: number = 10,
    filters?: Filter[]
  ): Observable<any> {
    let url = `${this._api}sales/find-sales-for-manifests`;
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

    return this._http.get(url, { params, withCredentials: true });
  }

  createManifest(manifest: any): Observable<any> {
    return this._http.post(`${this._api}manifests`, manifest, {
      withCredentials: true,
    });
  }

  findManifestById(id: string): Observable<any> {
    return this._http
      .get(`${this._api}manifests/${id}`, { withCredentials: true })
      .pipe(map((response: any) => response.data));
  }

  removeManifest(id: string): Observable<any> {
    return this._http.delete(`${this._api}manifests/${id}`, {
      withCredentials: true,
    });
  }

  checkInPartcipants(
    manifestId: string,
    participants: any[],
    updatedBy: string
  ): Observable<any> {
    const body = {
      manifestId,
      participants,
      updatedBy,
    };
    return this._http.patch(
      `${this._api}manifests/participants/check-in`,
      body,
      { withCredentials: true }
    );
  }

  removeParticipant(
    manifestId: string,
    participantId: string,
    saleId: string,
    updatedBy?: string
  ): Observable<any> {
    return this._http.patch(
      `${this._api}manifests/${manifestId}/participants/${participantId}`,
      { updatedBy, saleId },
      { withCredentials: true }
    );
  }

  completeManifest(manifestId: string): Observable<any> {
    return this._http.patch(
      `${this._api}manifests/${manifestId}`,
      {},
      {
        withCredentials: true,
      }
    );
  }
}
