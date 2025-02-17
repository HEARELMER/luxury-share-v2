import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';

@Injectable({
  providedIn: 'root',
})
export class ExportFilesService {
  exportToExcel<T>(
    data: T[],
    headers: { [key: string]: string },
    selectedColumns: string[],
    fileName: string
  ): void {
    // Transformar los datos según las columnas seleccionadas
    const transformedData = data.map((item) => {
      const newItem: any = {};
      selectedColumns.forEach((col) => {
        newItem[headers[col]] = item[col as keyof T];
      });
      return newItem;
    });

    // Crear el libro de trabajo
    const worksheet = XLSX.utils.json_to_sheet(transformedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    // Generar el archivo
    XLSX.writeFile(workbook, `${fileName}_${new Date().toISOString()}.xlsx`);
  }
}
