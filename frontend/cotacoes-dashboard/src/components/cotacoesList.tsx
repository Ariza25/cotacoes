import React, { useState, useEffect } from 'react';
import type { Cotacao, Sector, AssetType } from '../models/cotacoes';
import type { CotacoesFilters } from '../models/filters';
import { CotacaoRow } from '../memo/memoList';
import { getCotacoesFiltradas } from '../services/cotacoesService';
import { getSectors, getTypes } from '../services/metaDataService';
import Pagination from './pagination';
import SortByOrder from './sortByOrder';
import SortBySector from './sortBySector';
import SortByType from './sortByType';
import useFilteredAndSortedCotacoes from '../hooks/filterList';

export const CotacoesList: React.FC = () => {
  const [cotacoes, setCotacoes] = useState<Cotacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // 🔹 Metadata (TIPADAS)
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [types, setTypes] = useState<AssetType[]>([]);

  // 🔹 Filtros (TIPADOS)
  const [filters, setFilters] = useState<CotacoesFilters>({});

  // 🔹 Ordenação
  const [sortColumn, setSortColumn] =
    useState<'preco' | 'change' | 'marketCap' | 'volume'>('marketCap');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const limit = 10;

  // 🔹 Carrega setores e tipos (tipos dependem do setor selecionado)
  useEffect(() => {
    getSectors().then(setSectors).catch(console.error);
  }, []);

  useEffect(() => {
    getTypes(filters.sector).then(typesResp => {
      setTypes(typesResp);
      // se tipo selecionado não existe mais para este setor, limpa
      if (filters.type && !typesResp.includes(filters.type)) {
        setFilters(f => ({ ...f, type: undefined }));
      }
    }).catch(console.error);
  }, [filters.sector]);

  // 🔹 Busca cotações (backend)
  useEffect(() => {
    let mounted = true;

    const fetchCotacoes = async () => {
      setLoading(true);
      setError(null);

      try {
        const { cotacoes: results, pagination } = await getCotacoesFiltradas({
          ...filters,
          limit,
          page,
          sortBy: sortColumn,
          sortOrder,
        });

        if (mounted) {
          setCotacoes(results);
          setTotalPages(pagination?.totalPages ?? 1);
        }
      } catch (err) {
        if (mounted) setError('Erro ao buscar cotações');
        console.error(err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchCotacoes();
    return () => {
      mounted = false;
    };
  }, [page, filters, sortColumn, sortOrder]);

  // 🔹 Filtro + ordenação no front (caso backend não cubra tudo)
  const filteredAndSorted = useFilteredAndSortedCotacoes(
    cotacoes,
    sortColumn,
    sortOrder,
    filters
  );

  const handleSort = (column: typeof sortColumn) => {
    if (sortColumn === column) {
      setSortOrder(o => (o === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortColumn(column);
      setSortOrder('asc');
    }
  };

  return (
    <div className="overflow-x-auto relative px-4">
      {/* 🔹 Filtros */}
      <div className="flex justify-end mb-4 gap-4">
        <SortBySector
          value={filters.sector ?? ''}
          sectors={sectors}
          onChange={(sector) => {
            setPage(1);
            setFilters(f => ({
              ...f,
              sector: sector || undefined,
            }));
          }}
        />

        <SortByType
          value={filters.type ?? ''}
          types={types}
          onChange={(type) => {
            setPage(1);
            setFilters(f => ({
              ...f,
              type: type || undefined,
            }));
          }}
        />
      </div>

      {/* 🔹 Tabela */}
      <div className={`relative ${loading ? 'opacity-60 pointer-events-none' : ''} transition-opacity duration-200`}>
        <table className="w-full bg-white rounded-xl shadow-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="pl-8 pr-6 py-4 text-left">Ativo</th>

              {(['preco', 'change', 'marketCap', 'volume'] as const).map(col => (
                <th
                  key={col}
                  className="px-6 py-4 text-left cursor-pointer"
                  onClick={() => handleSort(col)}
                >
                  <div className="flex items-center gap-1">
                    {col}
                    <SortByOrder
                      value={sortColumn === col ? sortOrder : 'desc'}
                      onChange={setSortOrder}
                    />
                  </div>
                </th>
              ))}

              <th className="px-6 py-4 text-left whitespace-nowrap">Última atualização</th>
            </tr>
          </thead>

          <tbody>
            {error ? (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-red-500">
                  {error}
                </td>
              </tr>
            ) : loading && cotacoes.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-gray-500">
                  Carregando...
                </td>
              </tr>
            ) : filteredAndSorted.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-gray-500">
                  Nenhuma cotação encontrada
                </td>
              </tr>
            ) : (
              filteredAndSorted.map(c => (
                <CotacaoRow key={c.ticker} c={c} />
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  );
};

export default CotacoesList;
