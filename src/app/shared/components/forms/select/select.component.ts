import { Component, forwardRef, input, model, signal } from '@angular/core';
import { FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
export interface Option {
  value: string;
  label: string;
}

@Component({
  selector: 'app-select',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './select.component.html',
  styleUrl: './select.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true,
    },
  ],
})
export class SelectComponent {
  label = input<string>('');
  required = input<boolean>(false);
  options = input<Option[] | any>([]);
  placeholder = input<string>('Seleccione una opción');
  value = model<string>('');
  disabled = signal(false);
  showError = signal(false);
  errorMessage = signal('');
  isTouched = signal(false);
  readonly = input<boolean>(false);
  errorType = input<string>('');
  onChange: any = () => {};
  onTouch: any = () => {};

  writeValue(value: any): void {
    this.value.set(value || '');
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

  onSelect(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.value.set(select.value);
    this.onChange(select.value);
  }

  onTouched(): void {
    this.isTouched.set(true);
    this.onTouch();
    this.validateField();
  }

  private validateField(): void {
    if (this.required() && !this.value() && this.isTouched()) {
      this.showError.set(true);
      this.errorMessage.set('Este campo es requerido');
    } else {
      this.showError.set(false);
      this.errorMessage.set('');
    }
  }
}
