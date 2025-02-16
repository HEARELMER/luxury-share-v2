import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncateDecimal',
})
export class TruncateDecimalPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';

    const num = parseFloat(value);
    if (isNaN(num)) return value;

    return num.toString().replace(/(\.\d*?[1-9])0+|\.0*$/, '$1');
  }
}
