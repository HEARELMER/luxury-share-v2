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
import { MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ButtonComponent,
    RouterLink,
    FormsModule,
    NgClass,
    ReactiveFormsModule,
    Toast,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  providers: [MessageService],
})
export class LoginComponent {
  private readonly _formBuilder = inject(FormBuilder);
  private readonly _authService = inject(AuthService);
  private readonly _messageService = inject(MessageService);
  passwordVisible: boolean = false;
  loading: boolean = false;
  confirmLogin: boolean = false;

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
        next: ({ success, message }) => {
          if (!success) {
            this.loading = false;
            this._messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: message || 'Credenciales incorrectas',
            });
            return;
          } else if (success) {
            this.loading = false;
            this._messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Inicio de sesión exitoso',
            });
          }
        },
        error: (error) => {
          this.loading = false;
          this._messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error.message || 'Credenciales incorrectas',
          });
        },
      });

      this.confirmLogin = true;
    }
  }
}
