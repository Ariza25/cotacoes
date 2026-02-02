import axios from 'axios';
import type { Sector, AssetType } from '../models/cotacoes';

const API_URL = 'https://cotacoes-2.onrender.com'  

// Detecta se está rodando local ou produção
//const API_URL = window.location.hostname === "localhost" ? 'http://localhost:8080' : PROD_URL;

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
