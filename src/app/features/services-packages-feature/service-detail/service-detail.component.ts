import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-service-detail',
  imports: [CommonModule, TagModule],
  templateUrl: './service-detail.component.html',
  styleUrl: './service-detail.component.scss',
})
export class ServiceDetailComponent {
  serviceData = signal<any>(null);
  private readonly _config = inject(DynamicDialogConfig);

  ngOnInit() {
    this.serviceData.set(this._config.data);
  }
}
