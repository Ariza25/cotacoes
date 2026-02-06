export type DividendLabel = string;

export interface CashDividend {
  paymentDate: string;
  rate: number;
  label: string;
  relatedTo: string;
}

export interface StockDividend {
  approvedOn: string;
  factor: number;
  label: string;
}

export interface DividendsData {
  cashDividends: CashDividend[];
  stockDividends: StockDividend[];
}
