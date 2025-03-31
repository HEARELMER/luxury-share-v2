// interfaces/sale-creation-result.interface.ts
export interface SaleCreationResult {
  success: boolean;
  message: string;
  codeSale?: string;
  saleData?: any;
  error?: any;
  status: 'COMPLETED' | 'RESERVED' | 'ERROR';
}