import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MENU_OPTIONS, MenuNode } from '../../../config/menu_options';
import { TooltipModule } from 'primeng/tooltip';
import { SidebarButtonComponent } from '../../ui/sidebar-button/sidebar-button.component';
import { VerifiedRolesService } from '../../../../core/services/auth-services/verified-roles.service';
@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    NgClass,
    RouterLink,
    FormsModule,
    SidebarButtonComponent,
    TooltipModule,
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  private readonly _verifiedRolesService = inject(VerifiedRolesService);
  isAdmin = signal<boolean>(this._verifiedRolesService.isAdmin);
  isSeller = signal<boolean>(this._verifiedRolesService.isSeller);
  isGerent = signal<boolean>(this._verifiedRolesService.isGerent);
  restrictedForSellers = ['users', 'branches', 'reports','home'];
  MENU_OPTIONS: MenuNode[] = MENU_OPTIONS;
  filteredMenu = computed(() => {
    if (this.isAdmin() || this.isGerent()) {
      return MENU_OPTIONS;
    } else if (this.isSeller()) {
      return MENU_OPTIONS.filter(
        (option) => !this.restrictedForSellers.includes(option.key)
      );
    } else {
      return MENU_OPTIONS.filter((option) => option.key === 'home');
    }
  });

  ismenuVisible = signal<boolean>(true);
  selectedButton = signal<string>('');

  ngOnInit(): void {}

  toggleMenu(): void {
    this.ismenuVisible.update(() => !this.ismenuVisible());
  }

  selectButton(button: string): void {
    this.selectedButton.update(() => button);
  }
}
