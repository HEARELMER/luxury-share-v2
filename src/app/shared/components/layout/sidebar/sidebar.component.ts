import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MENU_OPTIONS, MenuNode } from '../../../config/menu_options';
import { TooltipModule } from 'primeng/tooltip';
import { SidebarButtonComponent } from '../../ui/sidebar-button/sidebar-button.component';
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
  MENU_OPTIONS: MenuNode[] = MENU_OPTIONS;

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
