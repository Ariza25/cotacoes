// Modelo para dados completos de uma ação
export interface Stock {
  symbol: string;
  shortName: string;
  longName: string;
  currency: string;
  marketCap: number;
  logourl: string;
  
  regularMarketPrice: number;
  regularMarketChange: number;
  regularMarketChangePercent: number;
  regularMarketTime: string;
  regularMarketDayHigh: number;
  regularMarketDayLow: number;
  regularMarketDayRange: string;
  regularMarketVolume: number;
  regularMarketPreviousClose: number;
  regularMarketOpen: number;
  
  fiftyTwoWeekRange: string;
  fiftyTwoWeekLow: number;
  fiftyTwoWeekHigh: number;
  
  usedInterval: string;
  usedRange: string;
  
  historicalDataPrice: HistoricalDataPrice[];
  validRanges: string[];
  validIntervals: string[];
  
  priceEarnings: number;
  earningsPerShare: number;
  
  summaryProfile: SummaryProfile;
  financialData: FinancialData;
  dividendsData: DividendsData;
}

export interface HistoricalDataPrice {
  date: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  adjustedClose: number;
}

export interface SummaryProfile {
  symbol: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone: string;
  website: string;
  industry: string;
  industryKey: string;
  sector: string;
  longBusinessSummary: string;
  fullTimeEmployees: number;
  updatedAt: string;
}

export interface FinancialData {
  symbol: string;
  currentPrice: number;
  ebitda: number;
  quickRatio: number;
  currentRatio: number;
  debtToEquity: number;
  revenuePerShare: number;
  returnOnAssets: number;
  returnOnEquity: number;
  earningsGrowth: number;
  revenueGrowth: number;
  grossMargins: number;
  ebitdaMargins: number;
  operatingMargins: number;
  profitMargins: number;
  totalCash: number;
  totalDebt: number;
  totalRevenue: number;
  grossProfits: number;
  operatingCashflow: number;
  freeCashflow: number;
  financialCurrency: string;
  type: string;
  updatedAt: string;
}

export interface DividendsData {
  cashDividends: CashDividend[];
  stockDividends: StockDividend[];
  subscriptions: Subscription[];
}

export interface CashDividend {
  assetIssued: string;
  paymentDate: string;
  rate: number;
  relatedTo: string;
  approvedOn?: string;
  isinCode: string;
  label: string;
  lastDatePrior: string;
  remarks: string;
}

export interface StockDividend {
  assetIssued: string;
  factor: number;
  completeFactor: string;
  approvedOn: string;
  isinCode: string;
  label: string;
  lastDatePrior: string;
  remarks: string;
}

export interface Subscription {
  assetIssued: string;
  factor: number;
  approvedOn: string;
  isinCode: string;
  label: string;
  lastDatePrior: string;
  remarks: string;
}
