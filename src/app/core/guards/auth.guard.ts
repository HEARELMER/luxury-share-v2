import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from '../services/auth-services/auth.service';
import { VerifiedRolesService } from '../services/auth-services/verified-roles.service';

export const publicGuard: CanActivateFn = async () => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const isAuthenticated = authService.isAuthenticated;
  if (isAuthenticated) {
    router.navigate(['/luxury']);
  }

  return !isAuthenticated;
};

export const authGuardAdmin: CanActivateFn = async () => {
  const router = inject(Router);

  const verifiedRoles = inject(VerifiedRolesService);
  const authService = inject(AuthService);
  const isAuthenticated = authService.isAuthenticated;
  const isAdmin = verifiedRoles.isAdmin;
  if (!isAuthenticated && !isAdmin) {
    router.navigate(['/auth/login']);
  }

  return !!(isAuthenticated && isAdmin);
};

export const authGuardSeller: CanActivateFn = () => {
  const router = inject(Router);
  const verifiedRoles = inject(VerifiedRolesService);
  const authService = inject(AuthService);
  const isAuthenticated = authService.isAuthenticated;
  const isSeller = verifiedRoles.isSeller;
  if (!isAuthenticated && !isSeller) {
    router.navigate(['/auth/login']);
  }

  return !!(isAuthenticated && isSeller);
};

export const authGuardGerent: CanActivateFn = () => {
  const router = inject(Router);
  const verifiedRoles = inject(VerifiedRolesService);
  const authService = inject(AuthService);
  
  const isAuthenticated = authService.isAuthenticated;
  const isGerent = verifiedRoles.isGerent;

  if (!isAuthenticated && !isGerent) {
    router.navigate(['/auth/login']);
  }
  return !!(isAuthenticated && isGerent);
};
