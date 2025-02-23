import { Injectable } from '@angular/core';
import { environmentDev } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http'; 
import { map, Observable } from 'rxjs';
import { newBranch } from '../../shared/interfaces/branch';

@Injectable({
  providedIn: 'root'
})
export class BranchService {
  apiUrl:String = environmentDev.apiUrl;
  constructor(private readonly httpClient:HttpClient) { }
  getBranches():Observable<any>{
    return this.httpClient.get(`${this.apiUrl}branches`, { withCredentials: true }).pipe();
  }

  deleteBranch(idBranch: string) {
    return this.httpClient.get(`${this.apiUrl}branches/delete/${idBranch}`, { withCredentials: true }).pipe(
      map((response: any) => {
        if (response.status === 200 || 201) {
          return {
            type: 'success',
            title: '¡Sucursal eliminada con éxito!',
            message: 'La sucursal se eliminó correctamente del sistema.',
          };
        } else {
          return {
            type: 'error',
            title: '¡Error al eliminar la sucursal!',
            message: 'Hubo un error al eliminar la sucursal del sistema.',
          };
        }
      })
    );
  }

  addBranch(data: newBranch) {
    return this.httpClient.post(`${this.apiUrl}branches/create`, data, { withCredentials: true }).pipe(
      map((response: any) => {
        if (response.status === 200 || 201) {

          return {
            type: 'success',
            title: '¡Sucursal agregada con éxito!',
            message: 'La sucursal se agregó correctamente al sistema.',
          };
        } else {
          return {
            type: 'error',
            title: '¡Error al agregar la sucursal!',
            message: 'Hubo un error al agregar la sucursal al sistema.',
          };
        }
      })
    );
  }

  updateBranch(data: any) {
    return this.httpClient.post(`${this.apiUrl}branches/update`, data, { withCredentials: true }).pipe(
      map((response: any) => {
        if (response.status === 200 || 201) {
          return {
            type: 'success',
            title: '¡Sucursal actualizada con éxito!',
            message: 'La sucursal se actualizó correctamente en el sistema.',
          };
        } else {
          return {
            type: 'error',
            title: '¡Error al actualizar la sucursal!',
            message: 'Hubo un error al actualizar la sucursal en el sistema.',
          };
        }
      })
    );
  }
  
}
