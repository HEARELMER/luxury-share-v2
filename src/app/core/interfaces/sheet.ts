// Interfaces para mejorar la legibilidad
export interface ExcelStyle {
  font?: {
    bold?: boolean;
    color?: { rgb: string };
    sz?: number;
  };
  fill?: {
    fgColor?: { rgb: string };
  };
  alignment?: {
    horizontal?: string;
    vertical?: string;
  };
}

export interface SummaryData {
  headers: { [key: string]: string }[][];
  selectedColumns: string[][];
  data: any[];
  titles?: string[]; // Títulos personalizados para cada sección
}
