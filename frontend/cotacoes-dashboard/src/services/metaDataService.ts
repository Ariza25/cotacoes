import axios from 'axios';
import type { Sector, AssetType } from '../models/cotacoes';

const LOCAL_URL = import.meta.env.VITE_API_LOCAL;
const PROD_URL = import.meta.env.VITE_API_PROD;   

// Detecta se está rodando local ou produção
const API_URL = window.location.hostname === "localhost" ? LOCAL_URL : PROD_URL;

export const getSectors = async (): Promise<Sector[]> => {
  const response = await axios.get<{ sectors: Sector[] }>(
    `${API_URL}/sectors`
  );

  return response.data.sectors; // ✅ ARRAY
};

export const getTypes = async (): Promise<AssetType[]> => {
  const response = await axios.get<{ types: AssetType[] }>(
    `${API_URL}/types`
  );

  return response.data.types; // ✅ ARRAY
};
