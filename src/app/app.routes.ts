import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth-feature/login/login.component';
import { RecoveryPasswordComponent } from './features/auth-feature/recovery-password/recovery-password.component';
import { UsersComponent } from './features/users-feature/users/users.component';
import { MainComponent } from './main/main.component';
import { HomeComponent } from './features/dashboard-feature/home/home.component';

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
    ],
  },
];
