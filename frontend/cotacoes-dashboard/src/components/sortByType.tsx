import React from 'react';
import { FaChevronDown, FaLayerGroup } from 'react-icons/fa';
import type { AssetType } from '../models/cotacoes';
import { getAssetLabel } from '../utils';

interface SortByTypeProps {
  value: AssetType | '';
  onChange: (value: AssetType | '') => void;
  types?: AssetType[]; // <- Agora opcional
}

const SortByType: React.FC<SortByTypeProps> = ({
  value,
  onChange,
  types = [], // <- Fallback para array vazio
}) => {
  return (
    <div className="relative w-64">
      {/* Ícone à esquerda */}
      <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-gray-500">
        <FaLayerGroup size={14} />
      </div>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value as AssetType)}
        className="
          w-full appearance-none rounded-md border border-gray-300
          bg-white py-2 pl-10 pr-10 text-sm text-gray-800
          focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer
        "
      >
        {/* Placeholder */}
        <option value="">Tipo de ativo</option>

        {/* Map com labels amigáveis */}
        {types.length > 0 &&
          types.map((type) => (
            <option key={type} value={type}>
              {getAssetLabel(type)}
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

export default SortByType;
