import { Router, RouterLink } from '@angular/router';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgClass } from '@angular/common';
import { Component } from '@angular/core'; 
import { AuthService } from '../../../core/services/auth.service';
import { AlertComponent } from '../../../shared/components/ui/alert/alert.component';
import { ButtonComponent } from '../../../shared/components/ui/button/button.component';
import { UserAccessing } from '../../../shared/interfaces/user';
 

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ButtonComponent,
    RouterLink,
    AlertComponent,
    FormsModule,
    NgClass,
    ReactiveFormsModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  passwordVisible: boolean = false;
  loading: boolean = false;
  confirmLogin: boolean = false;

  messageLogin: any = {
    title: '',
    message: '',
    type: '',
  };

  form = this.formBuilder.group({
    userId: [
      '',
      [
        Validators.minLength(6),
        Validators.maxLength(8),
        Validators.pattern('^[0-9]*$'),
      ],
    ],
    password: ['', [Validators.minLength(8)]],
  });

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Error al mantener la sesión
    console.log(this.authService.verifyToken());

    if (this.authService.verifyToken()) {
      this.router.navigate(['/luxury/home']);
    }
  }

  showPassword() {
    this.passwordVisible = !this.passwordVisible;
  }

  refreshPrueba() {
    this.authService.refreshToken().subscribe((res) => {
      console.log(res);
    });
  }

  async login() {
    if (this.form.valid) {
      this.loading = true;

      const user: UserAccessing = {
        userId: this.form.value.userId as string,
        password: this.form.value.password as string,
      };

      const success = await this.authService.login(user);
      this.messageLogin = this.authService.response_login;
      this.confirmLogin = true;

      setTimeout(() => {
        this.loading = false;
        if (success) {
          this.router.navigate(['/dashboard']);
        } else {
          this.confirmLogin = false;
        }
      }, 3000); // Esperar 3 segundos antes de redirigir
    }
  }
}
