import { Component, inject, signal } from '@angular/core';
import { LocalstorageService } from '../../../core/services/localstorage-services/localstorage.service';
import { ButtonComponent } from '../../../shared/components/ui/button/button.component';
import { InputFormComponent } from '../../../shared/components/forms/input-form/input-form.component';
import { PhotoProfileComponent } from '../../../shared/components/layout/photo-profile/photo-profile.component';
import { TabsModule } from 'primeng/tabs';
import { USER_PROFILE_CONFIG } from '../constants/user.profile-config.constant';
import { PasswordRecoveryComponent } from '../../auth-feature/password-recovery/password-recovery.component';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-user-profile',
  imports: [
    ButtonComponent,
    InputFormComponent,
    PhotoProfileComponent,
    TabsModule,
    PasswordRecoveryComponent,
    ReactiveFormsModule,
    FormsModule, 
  ],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss',
})
export class UserProfileComponent {
  private localStorageService = inject(LocalstorageService);
  private readonly _fb = inject(FormBuilder);
  userInfo = signal<any>(null);
  menuOptions = USER_PROFILE_CONFIG;

  userProfile = this._fb.group({
    name: ['', [Validators.minLength(3), Validators.required]],
    firstLastname: ['', [Validators.minLength(3), Validators.required]],
    secondLastname: ['', [Validators.minLength(3), Validators.required]],
    phone: ['', [Validators.minLength(8), Validators.required]],
    email: ['', [Validators.email, Validators.required]],
    address: ['', [Validators.minLength(3), Validators.required]],
    birthDate: ['', [Validators.required]],
  });

  ngOnInit(): void {
    this.userInfo.set(this.localStorageService.getUserAuthorized());
    this.userProfile.patchValue(this.userInfo());
  }

  viewPasswordRecoveryForm = signal<boolean>(false);
  OpenpasswordRecovery() {
    this.viewPasswordRecoveryForm.set(true);
  }

  onSubmit() {
    if (this.userProfile.valid) {
      console.log(this.userProfile.value);
    } else {
      console.log('Formulario inválido');
    }
  }
}
