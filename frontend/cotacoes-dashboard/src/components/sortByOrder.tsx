import React from 'react';
import { FaSort } from 'react-icons/fa';

interface SortByOrderProps {
  value: 'asc' | 'desc';
  onChange: (value: 'asc' | 'desc') => void;
}

const SortByOrder: React.FC<SortByOrderProps> = ({ value, onChange }) => {
  const toggleOrder = () => {
    onChange(value === 'asc' ? 'desc' : 'asc');
  };

  return (
    <button onClick={toggleOrder} className="text-gray-500 hover:text-gray-700 cursor-pointer">
      <FaSort fontSize={12}/>
    </button>
  );
};

export default SortByOrder;
