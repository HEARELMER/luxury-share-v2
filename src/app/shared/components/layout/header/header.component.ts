import {
  Component,
  ElementRef,
  HostListener,
  inject,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { UserMenuComponent } from '../user-menu/user-menu.component';
import { UserAuthorized } from '../../../interfaces/user';
import { LocalstorageService } from '../../../../core/services/localstorage-services/localstorage.service';
import { Option } from '../../forms/select/select.component';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, UserMenuComponent],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  private localStorageService = inject(LocalstorageService);
  private elementRef = inject(ElementRef); //nos permite acceder al DOM
  viewMenu = signal(false);
  branchSelected = toSignal(this.localStorageService.getBranchId()); //obtiene el id de la sucursal seleccionada
  branches = toSignal<Option[]>(
    this.localStorageService.getBranches().pipe(
      map((branches: any) =>
        branches.map((item: any) => ({
          label: item.address,
          value: item.branchId,
        }))
      )
    )
  );
  admin = signal<UserAuthorized>({} as UserAuthorized);
  constructor() {
    this.admin.set(this.localStorageService.getUserAuthorized());
  }

  @HostListener('document:click', ['$event']) //escucha el evento click en el documento, dentro y fuera del componente
  clickOutside(event: Event): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.viewMenu.update(() => false);
    }
  }

  viewMoreInfo(event: Event): void {
    event.stopPropagation(); //evita que el evento se propague a otros elementos
    this.viewMenu.update((prev) => !prev);
  }
}
