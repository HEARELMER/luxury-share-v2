import { InjectionToken } from '@angular/core';

/**
 * Configuración global para la generación de PDFs
 */
export interface PdfGeneratorConfig {
  /**
   * Configuración de marca
   */
  branding: {
    /**
     * Logo de la compañía (URL o Base64)
     */
    logo?: string;
    
    /**
     * Nombre de la compañía
     */
    companyName: string;
    
    /**
     * Color principal para encabezados y elementos destacados
     * Formato: [R, G, B] donde cada valor está entre 0-255
     */
    primaryColor: [number, number, number];
    
    /**
     * Color secundario
     */
    secondaryColor: [number, number, number];
    
    /**
     * Color para textos
     */
    textColor: [number, number, number];
  };
  
  /**
   * Configuración de documentos
   */
  document: {
    /**
     * Orientación predeterminada
     */
    defaultOrientation: 'portrait' | 'landscape';
    
    /**
     * Formato predeterminado
     */
    defaultFormat: 'a4' | 'a3' | 'letter' | [number, number];
    
    /**
     * Unidad predeterminada
     */
    defaultUnit: 'pt' | 'mm' | 'cm' | 'in';
    
    /**
     * Márgenes predeterminados
     */
    margins: {
      top: number;
      right: number;
      bottom: number;
      left: number;
    };
  };
  
  /**
   * Configuración de fuentes
   */
  fonts: {
    /**
     * Fuente predeterminada
     */
    default: string;
    
    /**
     * Tamaño de fuente para título principal
     */
    titleSize: number;
    
    /**
     * Tamaño de fuente para subtítulos
     */
    subtitleSize: number;
    
    /**
     * Tamaño de fuente para texto normal
     */
    normalSize: number;
    
    /**
     * Tamaño de fuente para texto pequeño
     */
    smallSize: number;
  };
  
  /**
   * Metadatos predeterminados
   */
  metadata: {
    /**
     * Autor del documento
     */
    author: string;
    
    /**
     * Creador del documento
     */
    creator: string;
    
    /**
     * Palabras clave
     */
    keywords?: string;
    
    /**
     * Asunto del documento
     */
    subject?: string;
  };
  
  /**
   * Pie de página predeterminado
   */
  footer: {
    /**
     * Texto del pie de página
     */
    text: string;
    
    /**
     * Incluir números de página
     */
    includePageNumbers: boolean;
    
    /**
     * Formato de números de página
     */
    pageNumberFormat: string;
  };
  
  /**
   * Configuraciones para tablas
   */
  tables: {
    /**
     * Estilo de tema para tablas
     */
    theme: 'striped' | 'grid' | 'plain';
    
    /**
     * Colores para encabezados de tabla
     */
    headerColors: {
      fill: [number, number, number];
      text: [number, number, number];
    };
    
    /**
     * Colores alternos para filas
     */
    alternateRowColors: [number, number, number][];
  };
}

/**
 * Token para inyectar la configuración de PDF
 */
export const PDF_CONFIG = new InjectionToken<PdfGeneratorConfig>('pdf-generator-config');

/**
 * Configuración predeterminada para la generación de PDFs
 */
export const DEFAULT_PDF_CONFIG: PdfGeneratorConfig = {
  branding: {
    companyName: 'Mi Empresa',
    primaryColor: [41, 128, 185], // Azul
    secondaryColor: [44, 62, 80], // Azul oscuro
    textColor: [40, 40, 40] // Gris oscuro
  },
  document: {
    defaultOrientation: 'portrait',
    defaultFormat: 'a4',
    defaultUnit: 'mm',
    margins: {
      top: 20,
      right: 15,
      bottom: 20,
      left: 15
    }
  },
  fonts: {
    default: 'helvetica',
    titleSize: 20,
    subtitleSize: 16,
    normalSize: 12,
    smallSize: 10
  },
  metadata: {
    author: 'Sistema de Generación de PDFs',
    creator: 'PDF Generator'
  },
  footer: {
    text: '© Mi Empresa - Todos los derechos reservados',
    includePageNumbers: true,
    pageNumberFormat: 'Página {0} de {1}'
  },
  tables: {
    theme: 'striped',
    headerColors: {
      fill: [41, 128, 185],
      text: [255, 255, 255]
    },
    alternateRowColors: [
      [245, 245, 245],
      [255, 255, 255]
    ]
  }
};

/**
 * Función para aplicar la configuración al servicio
 * @param config Configuración personalizada
 * @returns Configuración final
 */
export function providePdfConfig(config: Partial<PdfGeneratorConfig> = {}) {
  return {
    provide: PDF_CONFIG,
    useValue: { ...DEFAULT_PDF_CONFIG, ...config }
  };
}