import { Component, inject } from '@angular/core';
import { profilePageConfig } from '../../../shared/config/data.config';
import { LocalstorageService } from '../../../core/services/localstorage-services/localstorage.service';
import { ButtonComponent } from '../../../shared/components/ui/button/button.component';

@Component({
  selector: 'app-user-profile',
  imports: [ButtonComponent],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss',
})
export class UserProfileComponent {
  private localStorageService = inject(LocalstorageService);
  userInfo: any = {};
  menuOptions = profilePageConfig;

  ngOnInit(): void {
    this.userInfo = this.localStorageService.getUserAuthorized();
    console.log(this.userInfo);
  }
}
