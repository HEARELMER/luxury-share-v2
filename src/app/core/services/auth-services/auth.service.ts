import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of, tap } from 'rxjs';
import { environmentDev } from '../../../environments/environment.development';
import { UserAccessing } from '../../../shared/interfaces/user';
import { AuthState } from '../../interfaces/api/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly _router = inject(Router);
  private readonly _http = inject(HttpClient);
  private readonly _apiUrl = `${environmentDev.apiUrl}auth/`; 
  private readonly _authState = signal<AuthState>({
    isAuthenticated: false,
    user: null,
    currentBranch: null,
  }); 
  readonly authState = this._authState.asReadonly();

  constructor() {
    this.initAuthState();
  }

  private initAuthState(): void {
    const user = JSON.parse(sessionStorage.getItem('user') || 'null');
    const currentBranch = sessionStorage.getItem('currentBranch');
    const isAuthenticated =
      localStorage.getItem(environmentDev.authStateKey) ===
      environmentDev.authStateValue;

    if (isAuthenticated && user) {
      this._authState.set({
        isAuthenticated,
        user,
        currentBranch,
      });
    }
  }

  signIn(credentials: UserAccessing): Observable<any> {
    return this._http
      .post<any>(`${this._apiUrl}signin`, credentials, {
        withCredentials: true,
      })
      .pipe(
        tap((response) => {
          // Actualizar el estado de autenticación
          this._authState.set({
            isAuthenticated: true,
            user: response.user,
            currentBranch: null,
          });

          // Guardar información en almacenamiento
          localStorage.setItem(
            environmentDev.authStateKey,
            environmentDev.authStateValue
          );
          sessionStorage.setItem('user', JSON.stringify(response.user));
        }),
        catchError((error) => { 
          return of({ success: false, error });
        })
      );
  }

  get isAuthenticated(): boolean {
    return this._authState().isAuthenticated;
  }
}
