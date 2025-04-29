import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth-services/auth.service';
import { VerifiedRolesService } from '../services/auth-services/verified-roles.service';

export const publicGuard: CanActivateFn = async () => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const isAuthenticated = authService.isAuthenticated;
  const verifiedRoles = inject(VerifiedRolesService);
  const isSeller = verifiedRoles.isSeller;
  if (isAuthenticated) {
    if (isSeller) {
      router.navigate(['/luxury/clients']);
    } else {
      router.navigate(['/luxury/home']);
    }
  }

  return !isAuthenticated;
};

export const authGuardAdmin: CanActivateFn = async () => {
  const router = inject(Router);

  const verifiedRoles = inject(VerifiedRolesService);
  const authService = inject(AuthService);
  const isAuthenticated = authService.isAuthenticated;
  const isAdmin = verifiedRoles.isAdmin;
  const isGerent = verifiedRoles.isGerent;
  if (!isAuthenticated && !(isAdmin || isGerent)) {
    router.navigate(['/auth/login']);
  }

  return !!(isAuthenticated && (isAdmin || isGerent));
};

export const authGuardSeller: CanActivateFn = () => {
  const router = inject(Router);
  const verifiedRoles = inject(VerifiedRolesService);
  const authService = inject(AuthService);
  const isAuthenticated = authService.isAuthenticated;
  const isSeller = verifiedRoles.isSeller;
  const isAdmin = verifiedRoles.isAdmin;
  const isGerent = verifiedRoles.isGerent;
  if (!isAuthenticated && !(isSeller || isAdmin || isGerent)) {
    router.navigate(['/auth/login']);
  }

  return !!(isAuthenticated && (isSeller || isAdmin || isGerent));
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
