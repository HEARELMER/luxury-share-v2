import { Component, inject, signal } from '@angular/core';
import { LocalstorageService } from '../../../core/services/localstorage-services/localstorage.service';
import { ButtonComponent } from '../../../shared/components/ui/button/button.component';
import { InputFormComponent } from '../../../shared/components/forms/input-form/input-form.component';
import { PhotoProfileComponent } from '../../../shared/components/layout/photo-profile/photo-profile.component';
import { TabsModule } from 'primeng/tabs';
import { USER_PROFILE_CONFIG } from '../constants/user.profile-config.constant';
import { PasswordRecoveryComponent } from '../../auth-feature/password-recovery/password-recovery.component';
@Component({
  selector: 'app-user-profile',
  imports: [
    ButtonComponent,
    InputFormComponent,
    PhotoProfileComponent,
    TabsModule,
    PasswordRecoveryComponent,
  ],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss',
})
export class UserProfileComponent {
  private localStorageService = inject(LocalstorageService);
  userInfo: any = {};
  menuOptions = USER_PROFILE_CONFIG;

  ngOnInit(): void {
    this.userInfo = this.localStorageService.getUserAuthorized();
  }

  viewPasswordRecoveryForm = signal<boolean>(false);
  OpenpasswordRecovery() {
    this.viewPasswordRecoveryForm.set(true);
  }
}
