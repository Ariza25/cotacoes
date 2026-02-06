import React from 'react';
import type { Cotacao } from '../models/cotacoes';
import type { CotacoesFilters } from '../models/filters';

type SortOrder = 'asc' | 'desc';

function useFilteredAndSortedCotacoes(
  cotacoes: Cotacao[],
  sortColumn: keyof Cotacao,
  sortOrder: SortOrder,
  filters: CotacoesFilters
) {
  return React.useMemo(() => {
    let result = [...cotacoes];

    // 🔹 Filter by sector
    if (filters.sector) {
      result = result.filter(
        (c) => c.sector === filters.sector
      );
    }

    // 🔹 Filter by type
    if (filters.type) {
      result = result.filter(
        (c) => c.type === filters.type
      );
    }

    // 🔹 Sort
    result.sort((a, b) => {
      const aVal = a[sortColumn];
      const bVal = b[sortColumn];

      if (aVal == null) return 1;
      if (bVal == null) return -1;

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
      }

      return sortOrder === 'asc'
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });

    return result;
  }, [cotacoes, sortColumn, sortOrder, filters]);
}

export default useFilteredAndSortedCotacoes;
