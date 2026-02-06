import axios from 'axios';
import type { Stock } from '../models/stock';

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL.replace(/\/$/, '')}/stocks`,
});

interface GetStockParams {
  range?: string;
  interval?: string;
}

export const getStockBySymbol = async (
  symbol: string,
  params: GetStockParams = {}
): Promise<Stock> => {
  const { range = '1y', interval = '1d' } = params;

  const response = await api.get<Stock>(`/${symbol}`, {
    params: { range, interval },
  });

  return response.data;
};
