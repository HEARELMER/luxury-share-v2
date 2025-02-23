import { Injectable } from '@angular/core';
import { UserAuthorized } from '../../../shared/interfaces/user';

@Injectable({
  providedIn: 'root',
})
export class LocalstorageService {
  constructor() {}

  getUserAuthorized(): UserAuthorized {
    const user = sessionStorage.getItem('user');
    if (user) {
      return JSON.parse(user);
    } else {
      return {
        name: 'Elmer Jesus',
        email: 'elmer1@dev.com',
        photoUrl: 'https://github.com/hearelmer.png',
        phone: '123456759',
        address: 'Calle 123',
        birthDate: '1990-01-01',
        roleId: '1aabf9b1-9255-459b-bf95-b943efaf5e02',
        numDni: '71916141',
        firstLastname: 'Huaman',
        secondLastname: 'Rojas',
        userId: '1aabf9b1-9255-459b-bf95-b943efaf5e02',
      };
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
    const branchLoad = sessionStorage.getItem('branchLoad');
    if (branchLoad) {
      return JSON.parse(branchLoad);
    } else {
      return false;
    }
  }
  getBranchId(): string {
    return sessionStorage.getItem('sucursalId') || '';
  }

  setBranchLoad(value: boolean) {
    sessionStorage.setItem('branchLoad', JSON.stringify(value));
  }

  setBranchId(sucursalId: any) {
    sessionStorage.setItem('sucursalId', sucursalId);
  }
}
