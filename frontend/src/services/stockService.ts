import axios from 'axios';
import type { Stock } from '../models/stock';

const API_URL = 'https://cotacoes-94952904116.europe-west1.run.app/stocks';
//const API_URL = 'http://localhost:8080/stocks';

// Criando instância do axios
const api = axios.create({
  baseURL: API_URL,
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
