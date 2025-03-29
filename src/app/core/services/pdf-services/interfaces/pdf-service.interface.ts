
export interface PdfOptions {
    orientation?: 'portrait' | 'landscape';
    unit?: 'pt' | 'mm' | 'cm' | 'in';
    format?: 'a4' | 'a3' | 'letter' | [number, number];
  }
  
  export interface HeaderData {
    title: string;
    logo?: string;
    companyName?: string;
  }
  
  export interface TableData {
    headers: string[];
    rows: any[][];
    startY?: number;
  }
  