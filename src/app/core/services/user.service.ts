import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environmentDev } from '../../environments/environment.development';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { NewAdmin } from '../../shared/interfaces/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly url = environmentDev.apiUrl;
  private readonly httpClient = inject(HttpClient); 

  getInfoUserByDni(numDni: any) {
    console.log(numDni);
    return this.httpClient.post(`${this.url}users/search-dni`, numDni, {
      withCredentials: true,
    });
  } 

  paginateUsers(page: number, size: number): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', size.toString());

    return this.httpClient.get<any>(`${this.url}users`, {
      params
    });
  }

  getAllAdmins() {
    return this.httpClient.get(`${this.url}users/admins`, {
      withCredentials: true,
    });
  }

  createAdmin(admin: NewAdmin): Observable<any> {
    return this.httpClient
      .post(`${this.url}users/admin/create`, admin, {
        withCredentials: true,
      })
      .pipe(
        map((response: any) => {
          if (response.status === 200 || 201) {
            return {
              message: {
                type: 'success',
                title: '¡Administrador agregado con éxito!',
                message: 'El administrador se agregó correctamente al sistema.',
              },
              data: response.userId,
            };
          } else {
            return {
              message: {
                type: 'error',
                title: '¡Error al agregar el administrador!',
                message:
                  'Hubo un error al agregar el administrador al sistema.',
              },
            };
          }
        }),
        catchError((error) => {
          if (error.status === 400) {
            return of({
              message: {
                type: 'error',
                title: '¡Solicitud incorrecta!',
                message:
                  'Hubo un error en la solicitud al agregar el administrador.',
              },
            });
          }
          return throwError(error);
        })
      );
  }
}
