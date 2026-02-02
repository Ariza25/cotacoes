import React from 'react';
import { FaChevronDown, FaGlobeAmericas } from 'react-icons/fa';
import type { Sector } from '../models/cotacoes';
import { getSectorLabel } from '../utils';

interface SortBySectorProps {
  value: Sector | '';
  onChange: (value: Sector | '') => void;
  sectors: Sector[];
}

const SortBySector: React.FC<SortBySectorProps> = ({
  value,
  onChange,
  sectors,
}) => {
  return (
    <div className="relative w-64">
      {/* Ícone à esquerda */}
      <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-gray-500">
        <FaGlobeAmericas size={14} />
      </div>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value as Sector)}
        className="
          w-full appearance-none rounded-md border border-gray-300
          bg-white py-2 pl-10 pr-10 text-sm text-gray-800
          focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer
        "
      >
        {/* Placeholder */}
        <option value="">Setores</option>

        {/* Map com labels amigáveis */}
        {sectors.map((sector) => (
          <option key={sector} value={sector}>
            {getSectorLabel(sector)}
          </option>
        ))}
      </select>

      {/* Seta à direita */}
      <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-500">
        <FaChevronDown size={12} />
      </div>
    </div>
  );
};

export default SortBySector;
