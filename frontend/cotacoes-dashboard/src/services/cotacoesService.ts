import axios from 'axios';
import type { Cotacao, CotacaoAPI, Sector, AssetType } from '../models/cotacoes';

const API_URL = 'https://cotacoes-2.onrender.com/cotacoes'
//const API_URL = 'https://cotacoes-94952904116.europe-west1.run.app/cotacoes'  

//const API_URL = window.location.hostname === "localhost" ? 'http://localhost:8080/cotacoes' : PROD_URL;
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

  return response.data.stocks.map((data) => {
    // Garantimos o logo mesmo que a API troque o nome do campo.
    const ticker = data.stock?.toUpperCase();
    let logo =
      data.logo ||
      data.logoURL ||
      data.logoUrl ||
      data.logo_url ||
      data.logourl;

    // Se vier vazio ou placeholder, forçamos uma URL válida baseada no ticker.
    const looksLikePlaceholder = logo?.toUpperCase().includes('BRAPI.SVG');
    if ((!logo || looksLikePlaceholder) && ticker) {
      // Ícone oficial em SVG no domínio de ícones da brapi.
      logo = `https://icons.brapi.dev/icons/${ticker}.svg`;
    }

    // Garantia extra: se ainda assim vier BRAPI.svg, força a URL esperada.
    if (logo?.toUpperCase().includes('BRAPI.SVG') && ticker) {
      logo = `https://icons.brapi.dev/icons/${ticker}.svg`;
    }

    return {
    ticker: data.stock,
    shortName: data.name,
    longName: data.name,
    preco: data.close,
    change: data.change,
    marketCap: data.market_cap,
    volume: data.volume,
    logoURL: logo,
    // Guardamos variações cruas para evitar perda caso o componente precise
    logo: data.logo,
    logourl: data.logourl,
    sector: data.sector,
    type: data.type,
    atualizadoEm: data.atualizadoEm ?? new Date().toISOString(),
    };
  });
};
