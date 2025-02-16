import { Component, input } from '@angular/core';

@Component({
  selector: 'app-sidebar-button',
  imports: [],
  templateUrl: './sidebar-button.component.html',
  styleUrl: './sidebar-button.component.scss',
})
export class SidebarButtonComponent {
  readonly text = input<string>('button text');
  readonly type = input<string>('');
  readonly bg = input<string>('bg-black');
  readonly color = input<string>('text-white');
  readonly textHidden = input<boolean>(false);
  readonly disabled = input<boolean>(false);
  readonly selected = input<boolean>(false);
  readonly font = input<string>('font-semibold');
}
