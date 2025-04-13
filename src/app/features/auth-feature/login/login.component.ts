import { Router, RouterLink } from '@angular/router';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ButtonComponent } from '../../../shared/components/ui/button/button.component';
import { UserAccessing } from '../../../shared/interfaces/user';
import { AuthService } from '../../../core/services/auth-services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ButtonComponent,
    RouterLink,
    FormsModule,
    NgClass,
    ReactiveFormsModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private readonly _formBuilder = inject(FormBuilder);
  private readonly _authService = inject(AuthService);
  private readonly _router = inject(Router);
  passwordVisible: boolean = false;
  loading: boolean = false;
  confirmLogin: boolean = false;

  messageLogin: any = {
    title: '',
    message: '',
    type: '',
  };

  form = this._formBuilder.group({
    userId: [
      '',
      [
        Validators.minLength(8),
        Validators.maxLength(8),
        Validators.pattern('^[0-9]*$'),
        Validators.required,
      ],
    ],
    password: ['', [Validators.required]],
  });

  showPassword() {
    this.passwordVisible = !this.passwordVisible;
  }

  async login() {
    if (this.form.valid) {
      this.loading = true;

      const user: UserAccessing = {
        userId: this.form.value.userId as string,
        password: this.form.value.password as string,
      };

      this._authService.signIn(user).subscribe({
        next: (response) => {
          this.loading = false;
        },
        error: (error) => {
          this.loading = false;
          this.messageLogin = {
            title: 'Error',
            message: 'Usuario o contraseña incorrectos',
            type: 'error',
          };
        },
      });

      this.confirmLogin = true;
    }
  }
}
