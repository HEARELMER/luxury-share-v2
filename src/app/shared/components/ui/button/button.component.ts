import { NgClass } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [NgClass],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
})
export class ButtonComponent {
  readonly text = input<string>('button text');
  readonly moreClasses = input<string>('');
  readonly icon = input<string>('');
  readonly disabled = input<boolean>(false);
  readonly bgColor = input<string>('bg-black');
  readonly textColor = input<string>('text-white');
  readonly textHidden = input<boolean>(false);
  readonly selected = input<boolean>(false);
  readonly font = input<string>('font-semibold');
  readonly width = input<string>('');
}
