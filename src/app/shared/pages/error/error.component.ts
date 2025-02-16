import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonComponent } from '../../components/ui/button/button.component';

@Component({
  selector: 'app-error',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './error.component.html',
  styleUrl: './error.component.scss',
})
export class ErrorComponent {
  constructor(private router: Router) {}

  goToDashboard() {
    this.router.navigate(['/login']);
  }
}
