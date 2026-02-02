import type { Sector, AssetType } from '../models/cotacoes';

export interface CotacoesFilters {
  sector?: Sector;
  type?: AssetType;
}
