import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx-js-style';
import { SummaryData, ExcelStyle } from '../../interfaces/sheet';

@Injectable({
  providedIn: 'root',
})
export class ExportFilesService {
  // Colores para usar en el Excel
  private readonly COLORS = {
    PRIMARY: 'ff2323', // Rojo
    SECONDARY: '70AD47', // Verde
    HEADER_TEXT: 'FFFFFF', // Blanco
    LABEL_BG: 'E0E0E0', // Gris claro
    VALUE_BG: 'F2F2F2', // Gris muy claro
  };

  /**
   * Exporta datos a un archivo Excel
   */
  exportToExcel<T>(
    data: T[],
    headers: { [key: string]: string },
    selectedColumns: string[],
    fileName: string,
    summaryData?: SummaryData
  ): void {
    try {
      // Crear libro y hoja principal
      const workbook = XLSX.utils.book_new();
      const mainWorksheet = this.createMainWorksheet(
        data,
        headers,
        selectedColumns
      );
      XLSX.utils.book_append_sheet(workbook, mainWorksheet, 'DATOS');

      // Agregar hoja de resumen si existen datos
      if (summaryData) {
        const summaryWorksheet = this.createSummaryWorksheet(summaryData);
        XLSX.utils.book_append_sheet(workbook, summaryWorksheet, 'RESUMEN');
      }

      // Generar archivo con fecha
      const dateStr = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
      XLSX.writeFile(workbook, `${fileName}_${dateStr}.xlsx`);
    } catch (error) {
      throw new Error(
        'No se pudo exportar a Excel. Por favor, intente nuevamente.'
      );
    }
  }

  /**
   * Crea la hoja principal con los datos
   */
  private createMainWorksheet<T>(
    data: T[],
    headers: { [key: string]: string },
    selectedColumns: string[]
  ): XLSX.WorkSheet {
    // Transformar los datos para el formato de Excel
    const transformedData = data.map((item) => {
      const newItem: any = {};
      selectedColumns.forEach((col) => {
        newItem[headers[col]] = item[col as keyof T];
      });
      return newItem;
    });

    // Crear hoja de cálculo
    const worksheet = XLSX.utils.json_to_sheet(transformedData);

    // Aplicar estilos a los encabezados
    this.applyHeaderStyles(worksheet);

    // Ajustar ancho de columnas
    worksheet['!cols'] = selectedColumns.map(() => ({ width: 20 }));

    return worksheet;
  }

  /**
   * Crea la hoja de resumen con los datos adicionales
   */
  private createSummaryWorksheet(summaryData: SummaryData): XLSX.WorkSheet {
    const summaryWorksheet = XLSX.utils.aoa_to_sheet([]);
    let currentRow = 0;

    // Título principal
    currentRow = this.addSectionTitle(
      summaryWorksheet,
      'RESUMEN DE DATOS',
      currentRow,
      this.COLORS.PRIMARY,
      14
    );
    currentRow += 1;

    // Procesar cada conjunto de datos
    summaryData.headers.forEach((headerSet, index) => {
      // Espacio entre secciones
      if (index > 0) currentRow += 1;

      // Título de sección (personalizado o genérico)
      const sectionTitle =
        summaryData.titles && summaryData.titles[index]
          ? summaryData.titles[index]
          : `SECCIÓN ${index + 1}`;

      currentRow = this.addSectionTitle(
        summaryWorksheet,
        sectionTitle,
        currentRow,
        this.COLORS.PRIMARY
      );

      // Obtener los encabezados y procesar datos
      const headerObj = headerSet[0] || {};

      if (this.hasValidData(summaryData, index)) {
        currentRow = this.processSummaryData(
          summaryWorksheet,
          headerObj,
          summaryData.data[index],
          summaryData.selectedColumns[index],
          currentRow
        );
      } else {
        // Mostrar solo encabezados si no hay datos
        currentRow = this.addHeadersOnly(
          summaryWorksheet,
          headerObj,
          currentRow
        );
      }
    });

    // Ajustar ancho de columnas
    summaryWorksheet['!cols'] = Array(5).fill({ width: 20 });

    return summaryWorksheet;
  }

  /**
   * Verifica si hay datos válidos para el índice dado
   */
  private hasValidData(summaryData: SummaryData, index: number): boolean {
    return !!(
      summaryData.data &&
      summaryData.data[index] &&
      summaryData.selectedColumns &&
      summaryData.selectedColumns[index]
    );
  }

  /**
   * Procesa los datos de resumen según su tipo (array u objeto)
   */
  private processSummaryData(
    worksheet: XLSX.WorkSheet,
    headerObj: { [key: string]: string },
    dataItem: any,
    selectedCols: string[],
    startRow: number
  ): number {
    let currentRow = startRow;

    if (Array.isArray(dataItem)) {
      // Datos en formato de tabla
      currentRow = this.addTableData(
        worksheet,
        headerObj,
        dataItem,
        selectedCols,
        currentRow
      );
    } else {
      // Datos en formato clave-valor
      currentRow = this.addKeyValueData(
        worksheet,
        headerObj,
        dataItem,
        selectedCols,
        currentRow
      );
    }

    return currentRow + 1; // Agregar espacio extra al final
  }

  /**
   * Añade datos en formato tabla
   */
  private addTableData(
    worksheet: XLSX.WorkSheet,
    headerObj: { [key: string]: string },
    dataItems: any[],
    selectedCols: string[],
    startRow: number
  ): number {
    let currentRow = startRow;

    // Añadir encabezados
    const headerRow = selectedCols.map((col) => headerObj[col] || col);
    XLSX.utils.sheet_add_aoa(worksheet, [headerRow], {
      origin: `A${currentRow + 1}`,
    });

    // Aplicar estilos a encabezados
    for (let i = 0; i < headerRow.length; i++) {
      const cellAddress = XLSX.utils.encode_cell({
        r: currentRow,
        c: i,
      });

      worksheet[cellAddress].s = this.getHeaderStyle(this.COLORS.SECONDARY);
    }

    currentRow += 1;

    // Añadir filas de datos
    dataItems.forEach((item) => {
      const rowValues = selectedCols.map((col) => item[col]);
      XLSX.utils.sheet_add_aoa(worksheet, [rowValues], {
        origin: `A${currentRow + 1}`,
      });
      currentRow += 1;
    });

    return currentRow;
  }

  /**
   * Añade datos en formato clave-valor
   */
  private addKeyValueData(
    worksheet: XLSX.WorkSheet,
    headerObj: { [key: string]: string },
    dataItem: any,
    selectedCols: string[],
    startRow: number
  ): number {
    let currentRow = startRow;

    // Usar solo columnas que existen en el objeto
    const validCols = selectedCols.filter((col) => dataItem[col] !== undefined);

    validCols.forEach((col) => {
      const rowValues = [headerObj[col] || col, dataItem[col]];
      XLSX.utils.sheet_add_aoa(worksheet, [rowValues], {
        origin: `A${currentRow + 1}`,
      });

      // Estilo para etiqueta
      worksheet[`A${currentRow + 1}`].s = {
        font: { bold: true },
        fill: { fgColor: { rgb: this.COLORS.LABEL_BG } },
      };

      // Estilo para valor
      worksheet[`B${currentRow + 1}`].s = {
        alignment: { horizontal: 'right' },
        fill: { fgColor: { rgb: this.COLORS.VALUE_BG } },
      };

      currentRow += 1;
    });

    return currentRow;
  }

  /**
   * Añade solo los encabezados cuando no hay datos
   */
  private addHeadersOnly(
    worksheet: XLSX.WorkSheet,
    headerObj: { [key: string]: string },
    startRow: number
  ): number {
    const headerKeys = Object.keys(headerObj);

    if (headerKeys.length > 0) {
      const headerValues = Object.values(headerObj);
      XLSX.utils.sheet_add_aoa(worksheet, [headerValues], {
        origin: `A${startRow + 1}`,
      });

      // Aplicar estilos
      for (let i = 0; i < headerValues.length; i++) {
        const cellAddress = XLSX.utils.encode_cell({
          r: startRow,
          c: i,
        });

        worksheet[cellAddress].s = this.getHeaderStyle(this.COLORS.SECONDARY);
      }

      return startRow + 1;
    }

    return startRow;
  }

  /**
   * Añade un título de sección
   */
  private addSectionTitle(
    worksheet: XLSX.WorkSheet,
    title: string,
    startRow: number,
    color: string,
    fontSize: number = 12
  ): number {
    const currentRow = startRow + 1;

    // Añadir título
    XLSX.utils.sheet_add_aoa(worksheet, [[title]], {
      origin: `A${currentRow}`,
    });

    // Aplicar estilo
    worksheet[`A${currentRow}`].s = {
      font: {
        bold: true,
        color: { rgb: this.COLORS.HEADER_TEXT },
        sz: fontSize,
      },
      fill: {
        fgColor: { rgb: color },
      },
    };

    // Combinar celdas
    if (!worksheet['!merges']) worksheet['!merges'] = [];
    worksheet['!merges'].push({
      s: { r: currentRow - 1, c: 0 },
      e: { r: currentRow - 1, c: 3 },
    });

    return currentRow;
  }

  /**
   * Aplica estilos a los encabezados de la hoja principal
   */
  private applyHeaderStyles(worksheet: XLSX.WorkSheet): void {
    const headerRange = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');

    for (let col = headerRange.s.c; col <= headerRange.e.c; col++) {
      const cellAddress = XLSX.utils.encode_cell({
        r: headerRange.s.r,
        c: col,
      });

      worksheet[cellAddress].s = this.getHeaderStyle(this.COLORS.PRIMARY);
    }
  }

  /**
   * Obtiene el estilo para encabezados
   */
  private getHeaderStyle(bgColor: string): ExcelStyle {
    return {
      font: {
        bold: true,
        color: { rgb: this.COLORS.HEADER_TEXT },
      },
      fill: {
        fgColor: { rgb: bgColor },
      },
    };
  }
}
