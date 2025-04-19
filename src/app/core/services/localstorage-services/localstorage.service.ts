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

  setUserAuthorized(user: any) {
    localStorage.setItem('user', JSON.stringify(user));
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

  getBranchId(): Observable<string | null> {
    const branchStr = localStorage.getItem('branch');
    if (branchStr) {
      try {
        const branch = JSON.parse(branchStr);
        return of(branch.branchId);
      } catch (e) {
        return of(null);
      }
    }
    return of(null);
  }

  setBranch(value: any) {
    localStorage.setItem('branch', JSON.stringify(value));
  }

  setBranches(value: any) {
    localStorage.setItem('branches', JSON.stringify(value));
  }

  getBranches(): Observable<any> {
    const branches = localStorage.getItem('branches');
    if (branches) {
      return of(JSON.parse(branches));
    }
    return of(null);
  }

  getReportsFromCache(key: string): any {
    const reports = localStorage.getItem(key);
    if (reports) {
      return JSON.parse(reports);
    }
  }

  setReportsToCache(key: string, data: any) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  removeReportsFromCache(key: string) {
    localStorage.removeItem(key);
  }
}
