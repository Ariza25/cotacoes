import axios from 'axios';
import type { Cotacao, CotacaoAPI, Sector, AssetType } from '../models/cotacoes';

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL.replace(/\/$/, '')}/cotacoes`,
});

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

  const response = await api.get<{
    stocks: CotacaoAPI[];
  }>('/', {
    params: {
      sector,
      type,
      sortBy,
      sortOrder,
      limit,
      page,
    },
  });

  return response.data.stocks.map((data) => {

    let logo =
      data.logo ||
      data.logoURL ||
      data.logoUrl ||
      data.logo_url ||
      data.logourl;

    return {
      ticker: data.stock,
      shortName: data.name,
      longName: data.name,
      preco: data.close,
      change: data.change,
      marketCap: data.market_cap,
      volume: data.volume,
      logoURL: logo,
      logo: data.logo,
      logourl: data.logourl,
      sector: data.sector,
      type: data.type,
      atualizadoEm: data.atualizadoEm ?? new Date().toISOString(),
    };
  });
};
