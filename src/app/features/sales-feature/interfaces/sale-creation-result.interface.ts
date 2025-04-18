// interfaces/sale-creation-result.interface.ts
export interface SaleCreationResult {
  success: boolean;
  message: string;
  codeSale?: string;
  saleData?: any;
  error?: any;
  status: 'COMPLETED' | 'RESERVED' | 'ERROR';
}

export interface Client {
  clientId: string;
  name: string;
  firstLastname: string;
  secondLastname: string;
  typeDocument: string;
  numberDocument: string;
}
