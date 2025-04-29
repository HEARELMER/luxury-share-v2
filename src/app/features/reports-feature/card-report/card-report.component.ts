import { Component, input, output } from '@angular/core';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-card-report',
  imports: [ButtonModule],
  templateUrl: './card-report.component.html',
  styleUrl: './card-report.component.scss',
})
export class CardReportComponent {
  title = input.required<string>();
  icon = input.required<string>();
  description = input<string>('');
  loading = input<boolean>(false);
  details = input<any>([]);
  borderColor = input<string>('border-gray-300');
  onPdf = output<void>();
  onExcel = output<void>();

  onPdfClick(): void {
    this.onPdf.emit();
  }

  onExcelClick(): void {
    this.onExcel.emit();
  }
}
