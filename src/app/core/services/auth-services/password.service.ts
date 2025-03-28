import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environmentDev } from '../../../environments/environment.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PasswordService {
  private readonly _router = inject(Router);
  private readonly _http = inject(HttpClient);
  private readonly _apiUrl = environmentDev.apiUrl;

  validateEmailAndNumDni(data: {
    email: string;
    numDni: string;
  }): Observable<any> {
    return this._http.post<any>(
      `${this._apiUrl}auth/password-recovery/validate-email-numdni`,
      data
    );
  }

  validateCode(code: string): Observable<any> {
    return this._http.post<any>(
      `${this._apiUrl}auth/password-recovery/validate-code`,
      {
        code,
      }
    );
  }

  passwordRecovery(newPassword: string, email: string): Observable<any> {
    return this._http.post<any>(
      `${this._apiUrl}auth/password-recovery/confirm`,
      {
        newPassword,
        email,
      }
    );
  }
}
