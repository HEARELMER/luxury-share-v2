import { Component, inject, signal } from '@angular/core';
import { LocalstorageService } from '../core/services/localstorage-services/localstorage.service';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { ListboxModule } from 'primeng/listbox';
import { HeaderComponent } from '../shared/components/layout/header/header.component';
import { SidebarComponent } from '../shared/components/layout/sidebar/sidebar.component';
import { BranchService } from '../core/services/braches-services/branch.service';
import { ModalComponent } from '../shared/components/ui/modal/modal.component';
import { toSignal } from '@angular/core/rxjs-interop';
import { ButtonComponent } from '../shared/components/ui/button/button.component';
import { BranchesForSelectedComponent } from '../features/branches-feature/branches-for-selected/branches-for-selected.component';

@Component({
  selector: 'app-main',
  imports: [
    SidebarComponent,
    HeaderComponent,
    RouterOutlet,
    BranchesForSelectedComponent,
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
})
export class MainComponent {}
