import { useMemo, useState } from 'react';
import { formatDateBR, formatPriceBR, normalizeDividends } from '../utils';
import type { DividendsData } from '../models/dividends';
import { PeriodFilter } from './PeriodFilter';

type Period = '1m' | '6m' | '1a' | '5a' | 'all';

interface Props {
  data: DividendsData;
}

export function DividendsTable({ data }: Props) {
  const rows = useMemo(() => normalizeDividends(data), [data]);

  const [period, setPeriod] = useState<Period>('all');

  const filtered = useMemo(() => {
    if (period === 'all') return rows;

    const now = new Date();
    const from = new Date(now);

    switch (period) {
      case '1m':
        from.setMonth(now.getMonth() - 1);
        break;
      case '6m':
        from.setMonth(now.getMonth() - 6);
        break;
      case '1a':
        from.setFullYear(now.getFullYear() - 1);
        break;
      case '5a':
        from.setFullYear(now.getFullYear() - 5);
        break;
    }

    return rows.filter(r => new Date(r.date) >= from);
  }, [rows, period]);

  const typeColorMap: Record<string, string> = {
    DIVIDENDO: 'bg-emerald-100 text-emerald-700',
    JCP: 'bg-blue-100 text-blue-700',
    DESDOBRAMENTO: 'bg-amber-100 text-amber-700',
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-6 bg-white rounded-xl shadow-sm mt-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">
          Proventos & Eventos
        </h2>

        <PeriodFilter value={period} onChange={setPeriod} />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-100 text-left">
            <tr>
              <th className="p-3">Data</th>
              <th className="p-3">Tipo</th>
              <th className="p-3">Descrição</th>
              <th className="p-3 text-right">Valor</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((row: any, index: number) => (
              <tr
                key={index}
                className="border-t hover:bg-slate-100 transition-colors"
              >
                <td className="p-3">{formatDateBR(row.date)}</td>

                <td className="p-3">
                  <span
                    className={`rounded px-2 py-1 text-xs font-semibold ${
                      typeColorMap[row.type] ?? ''
                    }`}
                  >
                    {row.type}
                  </span>
                </td>

                <td className="p-3">{row.description}</td>

                <td className="p-3 text-right">
                  {row.value
                    ? formatPriceBR(row.value)
                    : row.factor
                    ? `${row.factor}x`
                    : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
