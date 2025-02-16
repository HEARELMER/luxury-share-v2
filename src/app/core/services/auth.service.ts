import { Injectable } from '@angular/core';

import { Router } from '@angular/router';
import { HttpClient, HttpResponse, HttpBackend } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';
import { environmentDev } from '../../environments/environment.development';
import { UserAccessing } from '../../shared/interfaces/user';
import { MessageAlert } from '../../shared/interfaces/messageAlert';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private router: Router, private httpClient: HttpClient) {}
  private isLogged = false;
  private api_url: string = environmentDev.apiUrl + 'auth/';

  refreshToken(): Observable<any> {
    return this.httpClient.get(this.api_url + 'refresh', {
      withCredentials: true,
    });
  }

  response_login: MessageAlert = {} as MessageAlert;
  login(user: UserAccessing): Promise<boolean> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        this.httpClient
          .post<any>(this.api_url + 'login', user, {
            observe: 'response',
            withCredentials: true,
          })
          .subscribe(
            (res: HttpResponse<any>) => {
              console.log(res);
              if (res.status === 200) {
                this.response_login = {
                  type: 'success',
                  title: '¡Inicio de sesión exitoso!',
                  message: 'Has iniciado sesión en el sistema exitosamente.',
                };

                this.isLogged = true;
                localStorage.setItem('isLogged', 'true');
                sessionStorage.setItem('user', JSON.stringify(res.body.user));
                sessionStorage.setItem('branchLoad', 'true');
                resolve(true);
              } else {
                console.log(
                  'The request was successfull but is other status: ' +
                    res.status
                );
              }
            },
            (error) => {
              console.error(error);
              console.log('An error occurred');

              this.response_login = {
                type: 'error',
                title: '¡Inicio de sesión fallido!',
                message: 'Por favor, ingrese su usuario y contraseña.',
              };

              this.isLogged = false;
              resolve(false);
            }
          );
      }, 1000);
    });
  }

  verifyToken(): boolean {
    if (localStorage.getItem('isLogged') === 'true') {
      this.isLogged = true;
    } else {
      this.isLogged = false;
    }
    return this.isLogged;
  }

  validateEmailForPasswordRecovery(email: string): Observable<MessageAlert> {
    return this.httpClient
      .post<any>(
        this.api_url + 'validate-email',
        { email },
        { observe: 'response', withCredentials: true }
      )
      .pipe(
        map((res: HttpResponse<any>) => {
          if (res.status === 200) {
            return {
              type: 'success',
              title: 'Validación exitosa',
              message: 'El correo ha sido validado correctamente.',
            } as MessageAlert;
          } else {
            return {
              type: 'warning',
              title: 'Error',
              message:
                'Revisa si ingresaste bien tu correo, si estás seguro que está correcto comunícate con el administrador.',
            } as MessageAlert;
          }
        }),
        catchError((error) => {
          return of({
            type: 'warning',
            title: 'Error',
            message:
              'Revisa si ingresaste bien tu correo, si estás seguro que está correcto comunícate con el administrador.',
          } as MessageAlert);
        })
      );
  }

  validateCodeForPasswordRecovery(data: { email: string; code: string }): Observable<MessageAlert> {
    return this.httpClient
      .post<any>(this.api_url + 'validate-code', data, { observe: 'response', withCredentials: true })
      .pipe(
        map((res: HttpResponse<any>) => {
          if (res.status === 200) {
            return {
              type: 'success',
              title: 'Código validado',
              message: 'El código ha sido validado correctamente.',
            } as MessageAlert;
          } else {
            return {
              type: 'warning',
              title: 'Error',
              message: 'El código ingresado es incorrecto.',
            } as MessageAlert;
          }
        }),
        catchError((error) => {
          return of({
            type: 'warning',
            title: 'Error',
            message: 'El código ingresado es incorrecto.',
          } as MessageAlert);
        })
      );
  }

   

  passwordRecovery(numDni: string, newPassword: string): Observable<boolean> {
    return this.httpClient
      .post<any>(
        this.api_url + 'password-recovery',
        { numDni, newPassword },
        { observe: 'response', withCredentials: true }
      )
      .pipe(
        map((res: HttpResponse<any>) => {
          return res.status === 200;
        }),
        catchError((error) => {
          return of(false);
        })
      );
  }

  logOut(): void {
    this.httpClient
      .get(this.api_url + 'logout', { withCredentials: true })
      .subscribe();
    this.response_login = {
      type: 'success',
      title: '¡Cierre de sesión exitoso!',
      message: 'Has cerrado sesión en el sistema exitosamente.',
    };
    localStorage.setItem('isLogged', 'false');
    this.isLogged = false;
    sessionStorage.clear();

    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 3000);

    return;
  }
}
