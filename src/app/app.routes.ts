import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth-feature/login/login.component';
import { UsersComponent } from './features/users-feature/users/users.component';
import { MainComponent } from './main/main.component';
import { HomeComponent } from './features/dashboard-feature/home/home.component';
import { MainServicesPackagesComponent } from './features/services-packages-feature/main-services-packages/main-services-packages.component';
import { UserProfileComponent } from './features/users-feature/user-profile/user-profile.component';
import { BranchesComponent } from './features/branches-feature/branches/branches.component';
import { SalesComponent } from './features/sales-feature/sales/sales.component';
import { ClientsComponent } from './features/clients-feature/clients/clients.component';
import { ReportsComponent } from './features/reports-feature/reports/reports.component';
import { PasswordRecoveryComponent } from './features/auth-feature/password-recovery/password-recovery.component';
import { ConfigurationsComponent } from './features/configuration-feature/configurations/configurations.component';
import { ManifestsComponent } from './features/manifests-feature/manifests/manifests.component';
import {
  authGuardAdmin,
  authGuardGerent,
  authGuardSeller,
  publicGuard,
} from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },
  {
    path: 'auth',
    canActivate: [publicGuard],
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: 'login', component: LoginComponent },
      { path: 'recovery-password', component: PasswordRecoveryComponent },
    ],
  },
  {
    path: 'luxury',
    component: MainComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      {
        path: 'home',
        component: HomeComponent,
        canActivate: [authGuardAdmin],
      },
      {
        path: 'users',
        component: UsersComponent,
        canActivate: [authGuardAdmin],
      },
      {
        path: 'profile',
        component: UserProfileComponent,
        canActivate: [authGuardAdmin],
      },
      {
        path: 'services_packages',
        component: MainServicesPackagesComponent,
        canActivate: [authGuardAdmin],
      },
      {
        path: 'branches',
        component: BranchesComponent,
        canActivate: [authGuardAdmin],
      },
      {
        path: 'sales',
        component: SalesComponent,
        canActivate: [authGuardAdmin],
      },
      {
        path: 'clients',
        component: ClientsComponent,
        canActivate: [authGuardAdmin],
      },
      {
        path: 'reports',
        component: ReportsComponent,
        canActivate: [authGuardAdmin],
      },
      {
        path: 'manifests',
        component: ManifestsComponent,
        canActivate: [authGuardAdmin],
      },
      // {
      //   path: 'configurations',
      //   component: ConfigurationsComponent,
      //   canActivate: [authGuardAdmin],
      // },
    ],
  },
];
