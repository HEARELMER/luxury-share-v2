import { Component } from '@angular/core';
import { Router } from 'express';
import { AuthService } from '../core/services/auth.service';
import { BranchService } from '../core/services/branch.service';
import { LocalstorageService } from '../core/services/localstorage.service';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { ListboxModule } from 'primeng/listbox';
import { HeaderComponent } from '../shared/components/layout/header/header.component';
import { SidebarComponent } from '../shared/components/layout/sidebar/sidebar.component';
import { AlertComponent } from '../shared/components/ui/alert/alert.component';
import { ButtonComponent } from '../shared/components/ui/button/button.component';
 
@Component({
  selector: 'app-main',
  imports: [ButtonComponent,
    AlertComponent,
    SidebarComponent,
    HeaderComponent,
    RouterOutlet,
    ListboxModule,
    FormsModule],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent {
 activeModalSelectBranch: boolean = false;
  branches: any[] = [];
  selectedBranch: any;

  constructor(
    private authService: AuthService,
    private router: Router,
    private localStorageService: LocalstorageService,
    private branchService: BranchService
  ) {}

  ngOnInit(): void {
    this.loadModal();
    this.branchService.getBranches().subscribe((data) => {
      console.log(this.branches);
      this.branches = data;
      console.log(data);
    });
  }

  loadModal() {
    console.log(this.localStorageService.getBranchLoad());
    if (this.localStorageService.getBranchLoad()) {
      this.activeModalSelectBranch = true;
    } else {
      this.activeModalSelectBranch = false;
    }
  }

  active: boolean = false;
  activeAlert() {
    this.active = !this.active;
  }

  confirmBranch() {
    if (this.selectedBranch !== undefined) {
      this.localStorageService.setBranchLoad(false);
      this.localStorageService.setBranchId(this.selectedBranch.sucursalId);
      this.activeModalSelectBranch = false;
    }
  }

  logOut() {
    alert('Logout...');
    this.authService.logOut();
  }
}
