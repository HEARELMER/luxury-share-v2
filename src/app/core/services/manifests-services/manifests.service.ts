import { inject, Injectable } from '@angular/core';
import { environmentDev } from '../../../environments/environment.development';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Filter } from '../../interfaces/api/filters';
import { Observable } from 'rxjs';

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

    // Usar params en la llamada HTTP
    return this._http.get(`${this._api}manifests`, { params });
  }
}
