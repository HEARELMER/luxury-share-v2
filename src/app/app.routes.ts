import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth-feature/login/login.component';
import { RecoveryPasswordComponent } from './features/auth-feature/recovery-password/recovery-password.component';
import { UsersComponent } from './features/users-feature/users/users.component';
import { MainComponent } from './main/main.component';
import { HomeComponent } from './features/dashboard-feature/home/home.component';
import { MainServicesPackagesComponent } from './features/services-packages-feature/main-services-packages/main-services-packages.component';
import { UserProfileComponent } from './features/users-feature/user-profile/user-profile.component';
import { BranchesComponent } from './features/branches-feature/branches/branches.component';
import { SalesComponent } from './features/sales-feature/sales/sales.component';
import { ClientsComponent } from './features/clients-feature/clients/clients.component';
import { ReportsComponent } from './features/reports-feature/reports/reports.component';

export const routes: Routes = [
  { path: '', redirectTo: 'auth', pathMatch: 'full' },
  {
    path: 'auth',
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: 'login', component: LoginComponent },
      { path: 'recovery-password', component: RecoveryPasswordComponent },
    ],
  },
  {
    path: 'luxury',
    component: MainComponent,
    children: [
      { path: 'home', component: HomeComponent },
      { path: 'users', component: UsersComponent },
      { path: 'profile', component: UserProfileComponent },
      { path: 'services_packages', component: MainServicesPackagesComponent },
      { path: 'branches', component: BranchesComponent },
      { path: 'sales', component: SalesComponent },
      { path: 'clients', component: ClientsComponent },
      { path: 'reports', component: ReportsComponent },
    ],
  },
];
