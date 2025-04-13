import { Component, Input } from '@angular/core';
import { AlertComponent } from '../../ui/alert/alert.component';
import { FormsModule, NgModel } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NgClass } from '@angular/common';
import { SidebarButtonComponent } from '../../ui/sidebar-button/sidebar-button.component';
import { AuthService } from '../../../../core/services/auth-services/auth.service';

@Component({
  selector: 'app-user-menu',
  imports: [SidebarButtonComponent, AlertComponent, NgClass, RouterLink],
  templateUrl: './user-menu.component.html',
  styleUrl: './user-menu.component.scss',
})
export class UserMenuComponent {
  @Input() textHidden: boolean = false;
  messageLogin: any = {
    title: '',
    message: '',
    type: '',
  };

  confirm: boolean = false;
  constructor(private authService: AuthService, private router: Router) {}
  logOut() {
    this.authService.signOut().subscribe({
      next: (res: any) => {
        this.confirm = true;
        this.messageLogin = {
          title: 'Cerrar sesión',
          message: res.message,
          type: 'success',
        };
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 3000);
      },
    });
  }
  darkMode() {
    this.confirm = true;
    this.messageLogin = {
      title: 'Modo Oscuro',
      message: 'Funcionalidad en desarrollo',
      type: 'info',
    };
    setTimeout(() => {
      this.confirm = false;
    }, 3000);
  }
}
