import axios from 'axios';
import type { Sector, AssetType } from '../models/cotacoes';

const API_URL = 'https://cotacoes-94952904116.europe-west1.run.app';
//const API_URL = 'http://localhost:8080'

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000, // opcional, bom para evitar requests travados
});

export const getSectors = async (): Promise<Sector[]> => {
  const response = await api.get<{ sectors: Sector[] }>('/sectors');
  return response.data.sectors;
};

export const getTypes = async (sector?: Sector): Promise<AssetType[]> => {
  const response = await api.get<{ types: AssetType[] }>('/types', {
    params: sector ? { sector } : undefined,
  });
  return response.data.types;
};
