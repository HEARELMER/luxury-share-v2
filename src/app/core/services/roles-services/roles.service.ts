import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environmentDev } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class RolesService {
  private readonly _api = environmentDev.apiUrl;
  private readonly _httpclient = inject(HttpClient);

  getRoles(): Observable<any> {
    return this._httpclient.get(`${this._api}roles`);
  }
}
