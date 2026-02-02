import axios from 'axios';
import type { Stock } from '../models/stock';

const LOCAL_URL = import.meta.env.VITE_API_LOCAL;
const PROD_URL = import.meta.env.VITE_API_PROD;   

// Detecta se está rodando local ou produção
const BASE_API_URL = window.location.hostname === "localhost" ? LOCAL_URL : PROD_URL;

// Monta a URL completa para /stocks
const API_URL = `${BASE_API_URL}/stocks`;
interface GetStockParams {
  range?: string;
  interval?: string;
}

export const getStockBySymbol = async (
  symbol: string,
  params: GetStockParams = {}
): Promise<Stock> => {
  const { range = '1y', interval = '1d' } = params;

  const query = new URLSearchParams();
  query.append('range', range);
  query.append('interval', interval);

  const response = await axios.get<Stock>(
    `${API_URL}/${symbol}?${query.toString()}`
  );

  return response.data;
};
