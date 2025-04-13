import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environmentDev } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class LocalstorageService {
  constructor() {}

  getUserAuthorized(): any {
    const user = localStorage.getItem('user');
    if (user) {
      return JSON.parse(user);
    }
  }

  getUserDni(): string {
    const user = this.getUserAuthorized();
    return user.numDni;
  }

  getUserId(): string {
    const user = this.getUserAuthorized();
    return user.userId;
  }

  getBranchLoad(): boolean {
    const branchLoad = localStorage.getItem('branchId');
    if (branchLoad) {
      return JSON.parse(branchLoad);
    } else {
      return false;
    }
  }

  getIsAuthenticated(): boolean {
    return (
      localStorage.getItem(environmentDev.authStateKey) ===
      environmentDev.authStateValue
    );
  }

  getBranchId(): Observable<string> {
    return of(localStorage.getItem('branchId') || '');
  }

  setBranchLoad(value: boolean) {
    sessionStorage.setItem('branchLoad', JSON.stringify(value));
  }

  setBranchId(sucursalId: any) {
    sessionStorage.setItem('sucursalId', sucursalId);
  }
}
