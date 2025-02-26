import { Component, inject } from '@angular/core';
import { profilePageConfig } from '../../../shared/config/data.config';
import { LocalstorageService } from '../../../core/services/localstorage-services/localstorage.service';
import { ButtonComponent } from '../../../shared/components/ui/button/button.component';
import { InputFormComponent } from "../../../shared/components/forms/input-form/input-form.component";
import { PhotoProfileComponent } from "../../../shared/components/layout/photo-profile/photo-profile.component"; 
import { Badge } from 'primeng/badge'
import { TabsModule } from 'primeng/tabs';
import { USER_PROFILE_CONFIG } from '../constants/user.profile-config.constant';
@Component({
  selector: 'app-user-profile',
  imports: [ButtonComponent, InputFormComponent, PhotoProfileComponent, Badge,TabsModule],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss',
})
export class UserProfileComponent {
  private localStorageService = inject(LocalstorageService);
  userInfo: any = {};
  menuOptions = USER_PROFILE_CONFIG
  getMenuIcon(item: string): string {
    const icons: { [key: string]: string } = {
      'Perfil': 'pi-user',
      'Seguridad': 'pi-lock',
      'Notificaciones': 'pi-bell',
      'Preferencias': 'pi-cog'
    };
    return icons[item] || 'pi-circle';
  }
  ngOnInit(): void {
    this.userInfo = this.localStorageService.getUserAuthorized();
    console.log(this.userInfo);
  }
}
