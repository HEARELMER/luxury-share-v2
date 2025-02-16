// import { ChangeDetectionStrategy, Component } from '@angular/core';
// import { FormsModule } from '@angular/forms';
// import { CalendarModule } from 'primeng/calendar';
// import { PrimeNGConfig } from 'primeng/api';

// @Component({
//   selector: 'app-date-picker',
//   standalone: true,
//   imports: [FormsModule, CalendarModule],
//   templateUrl: './date-picker.component.html',
//   styleUrls: ['./date-picker.component.scss'],
//   changeDetection: ChangeDetectionStrategy.OnPush,
// })
// export class DatePickerComponent {
//   date: Date[] | undefined;

//   constructor(private primengConfig: PrimeNGConfig) {}

//   ngOnInit() {
//     this.primengConfig.setTranslation({
//       dayNames: ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"],
//       dayNamesShort: ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"],
//       dayNamesMin: ["D", "L", "M", "M", "J", "V", "S"],
//       monthNames: ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"],
//       monthNamesShort: ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"],
//       today: 'Hoy',
//       clear: 'Limpiar'
//     });
//   }
// }