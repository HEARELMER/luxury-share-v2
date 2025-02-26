import { Component, inject, signal } from '@angular/core';
import { profilePageConfig } from '../../../shared/config/data.config';
import { LocalstorageService } from '../../../core/services/localstorage-services/localstorage.service';
import { ButtonComponent } from '../../../shared/components/ui/button/button.component';
import { InputFormComponent } from '../../../shared/components/forms/input-form/input-form.component';
import { PhotoProfileComponent } from '../../../shared/components/layout/photo-profile/photo-profile.component';
import { Badge } from 'primeng/badge';
import { TabsModule } from 'primeng/tabs';
import { USER_PROFILE_CONFIG } from '../constants/user.profile-config.constant';
import { RecoveryPasswordComponent } from '../../auth-feature/recovery-password/recovery-password.component';
import { PasswordRecoveryComponent } from "../../../password-recovery/password-recovery.component";
@Component({
  selector: 'app-user-profile',
  imports: [
    ButtonComponent,
    InputFormComponent,
    PhotoProfileComponent,
    Badge,
    TabsModule,
    RecoveryPasswordComponent,
    PasswordRecoveryComponent
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
    console.log(this.userInfo);
  }

  viewPasswordRecoveryForm = signal<boolean>(false);
  OpenpasswordRecovery() {
    this.viewPasswordRecoveryForm.set(true);
  }
}
