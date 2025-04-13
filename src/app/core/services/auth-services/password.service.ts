import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environmentDev } from '../../../environments/environment.development';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PasswordService {
  private readonly _http = inject(HttpClient);
  private readonly _apiUrl = environmentDev.apiUrl;

  validateEmailAndNumDni(data: {
    email: string;
    numDni: string;
  }): Observable<any> {
    return this._http.post<any>(
      `${this._apiUrl}auth/password-recovery/validate-email-numdni`,
      data,
      { withCredentials: true }
    );
  }

  validateCode(code: string): Observable<any> {
    return this._http
      .post<any>(
        `${this._apiUrl}auth/password-recovery/validate-code`,
        {
          code,
        },
        {
          withCredentials: true,
          observe: 'response',
        }
      );
  }

  passwordRecovery(newPassword: string, email: string): Observable<any> {
    return this._http.post<any>(
      `${this._apiUrl}auth/password-recovery/confirm`,
      {
        newPassword,
        email,
      },
      {
        withCredentials: true,
      }
    );
  }
}
