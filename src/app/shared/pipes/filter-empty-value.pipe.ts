import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterEmptyValues',
})
export class FilterEmptyValuesPipe implements PipeTransform {
  transform(value: any): any {
    if (!value || typeof value !== 'object') {
      return value;
    }

    return Object.keys(value)
      .filter((key) => value[key] !== null && value[key] !== '')
      .reduce((obj: any, key) => {
        obj[key] = value[key];
        return obj;
      }, {});
  }
}