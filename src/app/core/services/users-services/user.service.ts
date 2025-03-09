import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environmentDev } from '../../../environments/environment.development';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { NewAdmin } from '../../../shared/interfaces/user';
import { ExportFilesService } from '../files-services/export-files.service';
import { response } from 'express';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly url = environmentDev.apiUrl;
  private readonly httpClient = inject(HttpClient);
  private readonly _exportFilesService = inject(ExportFilesService);

  paginateUserByDni(dni: string): Observable<any> {
    const params = new HttpParams()
      .set('page', '1')
      .set('limit', '10')
      .set('filters[numDni]', dni);

    return this.httpClient.get<any>(`${this.url}users`, {
      params,
    });
  }

  paginateUsers(
    page: number,
    size: number,
    filterNumDni?: string,
    filterRoles?: string
  ): Observable<any> {
    if (filterNumDni) {
      return this.paginateUserByDni(filterNumDni);
    } else {
      const params = new HttpParams()
        .set('page', page.toString())
        .set('limit', size.toString());

      return this.httpClient.get<any>(
        `${this.url}users${filterRoles ? '/' + filterRoles : ''}`,
        {
          params,
        }
      );
    }
  }

  createUser(user: any): Observable<any> {
    return this.httpClient.post(`${this.url}users`, user);
  }

  updateUser(user: any): Observable<any> {
    return this.httpClient.put(`${this.url}users/${user.userId}`, user);
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

  findUserById(userId: string): Observable<any> {
    // Validamos que userId sea un valor válido
    if (!userId) {
      return throwError(() => new Error('ID de usuario no válido'));
    }

    // Aseguramos que el ID sea una cadena
    const id = userId.toString();

    return this.httpClient.get(`${this.url}users/${id}`).pipe(
      map((response: any) => {
        return response.data;
      })
    );
  }

  exportToExcel(page: number, size: number): Observable<any> {
    return this.paginateUsers(page, size).pipe(
      map((response) => {
        const selectedColumns = ['name', 'email', 'numDni', 'phone'];
        const headers = {
          name: 'Nombre',
          email: 'Correo',
          numDni: 'DNI',
          phone: 'Teléfono',
        };

        this._exportFilesService.exportToExcel(
          response.data.users,
          headers,
          selectedColumns,
          'usuarios'
        );

        return response;
      })
    );
  }
}
