import { HttpEvent, HttpRequest, HttpHandlerFn, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, Observable, switchMap, throwError } from 'rxjs'; 
import { AuthService } from '../services/auth-services/auth.service';
 
export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {
  const authService = inject(AuthService); // Correctamente inyecta AuthService

  return next(req).pipe( // Ajusta la llamada a `next` para pasar `req` directamente
    // catchError((error) => {
    //   if (error.status === 401) {
    //     // Manejo del error 401
    //     return authService.refreshToken().pipe(
    //       switchMap(() => {
    //         // Intenta nuevamente la solicitud original después de refrescar el token
    //         return next(req);
    //       }),
    //       catchError((refreshError) => {
    //         // Si falla la renovación del token, propaga el error original
    //         return throwError(() => error);
    //       })
    //     );
    //   }
    //   // Propaga cualquier otro error
    //   return throwError(() => error);
    // })
  );
};