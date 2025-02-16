import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function departureDateValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // Establece la hora a 00:00:00 para comparar solo la fecha
    const departureDate = new Date(control.value);

    if (departureDate < currentDate) {
      const formattedDate = new Date().toISOString().slice(0, 16); // Formato correcto para datetime-local
      control.setValue(formattedDate, { emitEvent: false });
      return { invalidDate: true };
    }
    return null;
  };
}
