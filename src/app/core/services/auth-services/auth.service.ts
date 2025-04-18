import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of, tap } from 'rxjs';
import { environmentDev } from '../../../environments/environment.development';
import { UserAccessing } from '../../../shared/interfaces/user';
import { AuthState } from '../../interfaces/api/auth';
import { LocalstorageService } from '../localstorage-services/localstorage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly _router = inject(Router);
  private readonly _http = inject(HttpClient);
  private readonly _localStorageService = inject(LocalstorageService);
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
    const user = this._localStorageService.getUserAuthorized();
    const currentBranch = this._localStorageService.getBranchId();
    const isAuthenticated = this._localStorageService.getIsAuthenticated();
    if (isAuthenticated && user) {
      this._authState.set({
        isAuthenticated,
        user,
        currentBranch: 'name',
      });
    }
  }

  get isAuthenticated(): boolean {
    return this._authState().isAuthenticated;
  }

  signIn(credentials: UserAccessing): Observable<any> {
    return this._http
      .post<any>(`${this._apiUrl}signin`, credentials, {
        withCredentials: true,
        observe: 'response',
      })
      .pipe(
        tap((response) => {
          if (response.status === 200) {
            this._authState.set({
              isAuthenticated: true,
              user: response.body.data,
              currentBranch: null,
            });

            // Guardar información en almacenamiento
            localStorage.setItem(
              environmentDev.authStateKey,
              environmentDev.authStateValue
            );
            if (
              response.body.data !== null ||
              response.body.data !== undefined
            ) {
              localStorage.setItem('user', JSON.stringify(response.body.data));
            }
            if (
              this.authState().user?.role.roleName.toLocaleLowerCase() ===
                'seller' ||
              'vendedor'
            ) {
              this._router.navigate(['/luxury/sales']);
            } else {
              this._router.navigate(['/luxury/home']);
            }
            return { success: true, message: response.body.message };
          } else {
            return { success: false, message: response.body.message };
          }
        }),
        catchError(() => {
          return of({ success: false, message: 'Error en la autenticación' });
        })
      );
  }

  signOut(): Observable<any> {
    const logout = this._http.get<any>(`${this._apiUrl}signout`, {
      withCredentials: true,
    });

    this._authState.set({
      isAuthenticated: false,
      user: null,
      currentBranch: null,
    });
    localStorage.clear();
    this._router.navigate(['/auth']);

    return logout;
  }
}
