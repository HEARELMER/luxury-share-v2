import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { TagModule } from 'primeng/tag';
import { ViewServicesToPackageComponent } from '../templates/view-services-to-package/view-services-to-package.component';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-package-detail',
  imports: [CommonModule, TagModule, ViewServicesToPackageComponent],
  templateUrl: './package-detail.component.html',
  styleUrl: './package-detail.component.scss',
})
export class PackageDetailComponent {
  packageData = signal<any>(null);
  private readonly _config = inject(DynamicDialogConfig);

  ngOnInit() {
    this.packageData.set(this._config.data);
  }
}
