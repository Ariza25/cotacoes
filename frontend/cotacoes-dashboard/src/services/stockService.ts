import axios from 'axios';
import type { Stock } from '../models/stock';

//const API_URL = 'https://cotacoes-2.onrender.com/stocks'
const API_URL = 'https://localhost:8080/stocks'  

//const API_URL = window.location.hostname === "localhost" ? 'http://localhost:8080/stocks' : PROD_URL;
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
