import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { Cotacao } from '../models/cotacoes';
import { formatDateBR, formatPriceBR } from '../utils';

interface CotacaoRowProps {
  c: Cotacao;
}

export const CotacaoRow = React.memo(
  ({ c }: CotacaoRowProps) => {
    const navigate = useNavigate();
    
    const handleClick = () => {
      navigate(`/stock/${c.ticker}`);
    };

    return (
      <tr 
        className="border-t hover:bg-gray-50 transition cursor-pointer"
        onClick={handleClick}
      >
        <td className="px-6 py-4">
          <div className="flex items-center gap-3">
            {c.logoURL ? (
              <img src={c.logoURL} alt={c.ticker} className="w-9 h-9 rounded-lg" />
            ) : (
              <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold">
                {c.ticker.slice(0, 2)}
              </div>
            )}
            <div>
              <p className="font-semibold text-gray-800">{c.ticker}</p>
              <p className="text-xs text-gray-500">{c.shortName}</p>
            </div>
          </div>
        </td>

      <td className={`px-6 py-4 font-medium ${c.preco && c.preco > 0 ? 'text-green-600' : 'text-gray-400'}`}>
        {c.preco && c.preco > 0 ? formatPriceBR(c.preco) : '—'}
      </td>

      <td
        className={`px-6 py-4 font-medium ${
          c.change !== undefined ? (c.change >= 0 ? 'text-green-600' : 'text-red-600') : 'text-gray-400'
        }`}
      >
        {c.change !== undefined ? c.change.toFixed(2) + '%' : '—'}
      </td>

      <td className="px-6 py-4 text-sm text-gray-500">
        {c.marketCap !== undefined ? formatPriceBR(c.marketCap) : '—'}
      </td>

      <td className="px-6 py-4">{c.volume?.toLocaleString() ?? '—'}</td>

      <td className="px-6 py-4">{c.atualizadoEm ? formatDateBR(c.atualizadoEm) : '—'}</td>
      </tr>
    );
  },
  (prev, next) =>
    prev.c.ticker === next.c.ticker &&
    prev.c.shortName === next.c.shortName &&
    prev.c.logoURL === next.c.logoURL &&
    prev.c.preco === next.c.preco &&
    prev.c.change === next.c.change &&
    prev.c.marketCap === next.c.marketCap &&
    prev.c.volume === next.c.volume &&
    prev.c.atualizadoEm === next.c.atualizadoEm
);

