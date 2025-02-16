import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonComponent } from '../../ui/button/button.component';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
})
export class TableComponent {
  @Input() headers: any[] = [];
  @Input() body: any[] = [];
  @Input() title: string = 'this is a table';
  @Output() valorEmit = new EventEmitter<object>();
  @Output() openModalEmit = new EventEmitter<any>();
  @Output() typeEmit = new EventEmitter<string>();
  @Input() hiddenFields: string[] = [];
  @Input() deleteHidden: boolean = false;

  sortField: string = '';
  isAscending: boolean = true;

  isFieldHidden(field: string): boolean {
    return this.hiddenFields.includes(field);
  }

  sortData(field: string) {
    if (this.sortField === field) {
      this.isAscending = !this.isAscending;
    } else {
      this.sortField = field;
      this.isAscending = true;
    }

    this.body.sort((a, b) => {
      const valueA = a[field];
      const valueB = b[field];

      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return this.isAscending
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      } else if (typeof valueA === 'number' && typeof valueB === 'number') {
        return this.isAscending ? valueA - valueB : valueB - valueA;
      } else {
        return 0;
      }
    });

    console.log(
      `Sorted by ${field} (${this.isAscending ? 'asc' : 'desc'}):`,
      this.body
    );
  }

  delete(data: object) {
    this.openModalEmit.emit(true);
    this.valorEmit.emit(data);
    this.typeEmit.emit('delete');
  }
  sendDataView(data: object) {
    this.valorEmit.emit(data);
    this.typeEmit.emit('view');
    this.openModalEmit.emit(true);
  }

  edit(data: object) {
    this.valorEmit.emit(data);
    this.openModalEmit.emit(true);
    this.typeEmit.emit('edit');
  }
  objectKeys(obj: any): string[] {
    return Object.keys(obj);
  }
}
