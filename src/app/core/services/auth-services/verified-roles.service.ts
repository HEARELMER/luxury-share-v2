import { inject, Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class VerifiedRolesService {
  private readonly _authService = inject(AuthService);

  get isAdmin(): boolean {
    const roleName = this._authService
      .authState()
      .user?.role.roleName.toLowerCase();
    return roleName === 'admin' || roleName === 'administrador';
  }

  get isSeller(): boolean {
    const roleName = this._authService
      .authState()
      .user?.role.roleName.toLowerCase();
    return roleName === 'seller' || roleName === 'vendedor';
  }

  get isGerent(): boolean {
    const roleName = this._authService
      .authState()
      .user?.role.roleName.toLowerCase();
    return roleName === 'gerent' || roleName === 'gerente';
  }
}
