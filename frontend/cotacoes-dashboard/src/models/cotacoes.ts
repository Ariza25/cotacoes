// Tipo que o front usa
export interface Cotacao {
  ticker: string;
  shortName?: string;
  longName?: string;
  preco: number;
  change?: number;
  marketCap?: number;
  volume?: number;
  logoURL?: string;
  atualizadoEm: string;
  sector: Sector;
  type?: AssetType;
}

// Tipo que representa o retorno cru da API do backend
export interface CotacaoAPI {
  stock: string;
  name: string;
  close: number;
  change: number;
  market_cap: number;
  volume: number;
  logo: string;
  sector: Sector;
  type?: AssetType;
  atualizadoEm?: string;
}

export type AssetType = 'stock' | 'fund' | 'bdr';

export type Sector = | 'Retail Trade' | 'Energy Minerals' | 'Health Services' | 'Utilities' | 'Finance' | 'Consumer Services' | 'Consumer Non-Durables' | 'Non-Energy Minerals' | 'Commercial Services' | 'Distribution Services' | 'Transportation' | 'Technology Services' | 'Process Industries' | 'Communications' | 'Producer Manufacturing' | 'Miscellaneous' | 'Electronic Technology' | 'Industrial Services' | 'Health Technology' | 'Consumer Durables';


