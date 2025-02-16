import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-card-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './card-home.component.html',
  styleUrl: './card-home.component.scss',
})
export class CardHomeComponent {
  readonly title = input<string>('');
  readonly number = input<number>(10);
  readonly color = input<string>('primary-50');
  readonly bg = input<string>('bg-primary-l-300');
  readonly buttonBg = input<string>('bg-primary-l-500');
  readonly routerLink = input<string>('home');
}
