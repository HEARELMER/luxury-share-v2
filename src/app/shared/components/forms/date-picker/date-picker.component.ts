import {
  ChangeDetectionStrategy,
  Component,
  input,
  model,
  output,
  LOCALE_ID,
  inject
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { PrimeNG } from 'primeng/config';


registerLocaleData(localeEs);
@Component({
  selector: 'app-date-picker',
  imports: [FormsModule, DatePickerModule],
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: LOCALE_ID, useValue: 'es-ES' }],
})
export class DatePickerComponent {
  private primeNGConfig = inject(PrimeNG);
  // Inputs
  label = input<string>('Rango de fechas');
  placeholder = input<string>('Seleccionar fechas');
  showWeek = input<boolean>(true);
  inline = input<boolean>(true);
  disabled = input<boolean>(false);

  // Model value
  selectedDates = model<Date[]>([]);

  // Output events
  dateRangeChange = output<{ start: Date; end: Date }>();
  ngOnInit() {
    this.configurePrimeNGCalendar();
  }

  private configurePrimeNGCalendar(): void {
    this.primeNGConfig.setTranslation({
      dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
      dayNamesShort: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
      dayNamesMin: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
      monthNames: [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
      ],
      monthNamesShort: [
        'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
        'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
      ],
      today: 'Hoy',
      clear: 'Limpiar',
      firstDayOfWeek: 1
    });
  }

  // Método para formatear fechas en español
  formatDate(date: Date): string {
    return date.toLocaleDateString('es', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }

  // Método para obtener el rango formateado
  getFormattedRange(): string {
    if (!this.selectedDates() || this.selectedDates().length !== 2) return '';
    const [start, end] = this.selectedDates();
    return `${this.formatDate(start)} - ${this.formatDate(end)}`;
  }

 

  selectPreset(type: 'week' | 'month' | 'year'): void {
    const end = new Date();
    const start = new Date();

    if (type === 'week') {
      start.setDate(end.getDate() - 7);
    } else if (type === 'month') {
      start.setMonth(end.getMonth() - 1);
    } else {
      start.setFullYear(end.getFullYear() - 1);
    }

    this.selectedDates.set([start, end]);
    this.applySelection();
  }

  clearSelection(): void {
    this.selectedDates.set([]);
  }

  isValidRange(): boolean {
    return this.selectedDates()?.length === 2;
  }

  applySelection(): void {
    if (this.isValidRange()) {
      const [start, end] = this.selectedDates();
      this.dateRangeChange.emit({ start, end });
    }
  }

  onRangeSelect(event: any): void {
    if (this.selectedDates()?.length === 2) {
      this.applySelection();
    }
  }
}
