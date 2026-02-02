import axios from 'axios';
import type { Cotacao, CotacaoAPI, Sector, AssetType } from '../models/cotacoes';

const LOCAL_URL = import.meta.env.VITE_API_LOCAL;
const PROD_URL = import.meta.env.VITE_API_PROD;   

// Detecta se está rodando local ou produção
const BASE_API_URL = window.location.hostname === "localhost" ? LOCAL_URL : PROD_URL;

// Monta a URL completa para /stocks
const API_URL = `${BASE_API_URL}/cotacoes`;

interface GetCotacoesParams {
  sector?: Sector;
  type?: AssetType;
  sortBy?: 'ticker' | 'preco' | 'change' | 'marketCap' | 'volume';
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  page?: number;
}

export const getCotacoesFiltradas = async (
  params: GetCotacoesParams = {}
): Promise<Cotacao[]> => {
  const {
    sector,
    type,
    sortBy = 'marketCap',
    sortOrder = 'desc',
    limit = 50,
    page = 1,
  } = params;

  const query = new URLSearchParams();

  if (sector) query.append('sector', sector);
  if (type) query.append('type', type);

  query.append('sortBy', sortBy);
  query.append('sortOrder', sortOrder);
  query.append('limit', limit.toString());
  query.append('page', page.toString());

  const response = await axios.get<{
    stocks: CotacaoAPI[];
  }>(`${API_URL}?${query.toString()}`);

  return response.data.stocks.map((data) => ({
    ticker: data.stock,
    shortName: data.name,
    longName: data.name,
    preco: data.close,
    change: data.change,
    marketCap: data.market_cap,
    volume: data.volume,
    logoURL: data.logo,
    sector: data.sector,
    type: data.type,
    atualizadoEm: data.atualizadoEm ?? new Date().toISOString(),
  }));
};
