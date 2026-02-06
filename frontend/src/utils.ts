import type { AssetType } from './models/assettype';
import type { DividendsData } from './models/dividends';

// src/utils/format.ts
export const formatDateBR = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('pt-BR');
};

export const formatDateTimeBR = (dateString: string) => {
  return new Date(dateString).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatPriceBR = (value: number) => {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

export const ASSET_TYPE_LABEL_PT: Record<AssetType, string> = {
  stock: 'Ações',
  fund: 'Fundos de Investimentos',
  dr: 'BDRs',
  bdr: 'BDRs', 
};

export function getAssetLabel(
  type: AssetType,
  locale: 'pt-BR' | 'en-US' = 'pt-BR'
) {
  if (locale === 'pt-BR') {
    return ASSET_TYPE_LABEL_PT[type];
  }
  return type;
}

// src/utils/sectorLabels.ts
import type { Sector } from './models/sectors';

export const SECTOR_LABEL_PT: Record<Sector, string> = {
  'Retail Trade': 'Varejo',
  'Energy Minerals': 'Energia Mineral',
  'Health Services': 'Serviços de Saúde',
  'Utilities': 'Serviços Públicos',
  'Finance': 'Financeiro',
  'Consumer Services': 'Serviços ao Consumidor',
  'Consumer Non-Durables': 'Bens de Consumo Não Duráveis',
  'Non-Energy Minerals': 'Minerais Não Energéticos',
  'Commercial Services': 'Serviços Comerciais',
  'Distribution Services': 'Serviços de Distribuição',
  'Transportation': 'Transporte',
  'Technology Services': 'Serviços de Tecnologia',
  'Process Industries': 'Indústrias de Processos',
  'Communications': 'Comunicações',
  'Producer Manufacturing': 'Indústria Produtora',
  'Miscellaneous': 'Diversos',
  'Electronic Technology': 'Tecnologia Eletrônica',
  'Industrial Services': 'Serviços Industriais',
  'Health Technology': 'Tecnologia em Saúde',
  'Consumer Durables': 'Bens de Consumo Duráveis',
};

export function getSectorLabel(
  sector: Sector,
  locale: 'pt-BR' | 'en-US' = 'pt-BR'
) {
  if (locale === 'pt-BR') {
    return SECTOR_LABEL_PT[sector];
  }
  return sector;
}

export interface DividendRow {
  date: string;
  year: number;
  type: string;
  description: string;
  value?: number;
  factor?: number;
}

export function normalizeDividends(data: DividendsData): DividendRow[] {
  const cash = data.cashDividends.map(d => ({
    date: d.paymentDate,
    year: new Date(d.paymentDate).getFullYear(),
    type: d.label,
    description: d.relatedTo,
    value: d.rate
  }));

  const stock = data.stockDividends.map(d => ({
    date: d.approvedOn,
    year: new Date(d.approvedOn).getFullYear(),
    type: d.label,
    description: 'Desdobramento',
    factor: d.factor
  }));

  return [...cash, ...stock].sort(
    (a, b) => +new Date(b.date) - +new Date(a.date)
  );
}
