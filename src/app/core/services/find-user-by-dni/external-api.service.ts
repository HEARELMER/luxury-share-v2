import { inject, Injectable } from '@angular/core';
import { environmentDev } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ExternalApiService {
  private readonly _api = environmentDev.apiUrl;
  private readonly _httpClient = inject(HttpClient);

  findUserByDniApiExternal(dni: string) {
    return this._httpClient.get(`${this._api}users/search/api-dni/${dni}`);
  }
}
