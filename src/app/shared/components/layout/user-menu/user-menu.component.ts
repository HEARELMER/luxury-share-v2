import { Component, inject, input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NgClass } from '@angular/common';
import { SidebarButtonComponent } from '../../ui/sidebar-button/sidebar-button.component';
import { AuthService } from '../../../../core/services/auth-services/auth.service';
import { ThemeService } from '../../../../core/ui-services/theme.service';
import { LocalstorageService } from '../../../../core/services/localstorage-services/localstorage.service';

@Component({
  selector: 'app-user-menu',
  imports: [SidebarButtonComponent, NgClass, RouterLink],
  templateUrl: './user-menu.component.html',
  styleUrl: './user-menu.component.scss',
})
export class UserMenuComponent {
  readonly textHidden = input<boolean>(false);
  private readonly _themeService = inject(ThemeService);
  private readonly _authService = inject(AuthService);
  private readonly _localStorageService = inject(LocalstorageService);

  confirm: boolean = false;
  logOut() {
    this._authService.signOut().subscribe({
      next: (res: any) => {
        this.confirm = true;
      },
    });
  }

  darkMode() {
    this._themeService.toggleTheme();
  }

 
}
