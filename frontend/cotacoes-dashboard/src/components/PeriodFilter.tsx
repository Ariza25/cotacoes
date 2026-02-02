type Period = '1m' | '6m' | '1a' | '5a' | 'all';

interface Props {
  value: Period;
  onChange: (period: Period) => void;
}

const periods: { label: string; value: Period }[] = [
  { label: '1m', value: '1m' },
  { label: '6m', value: '6m' },
  { label: '1a', value: '1a' },
  { label: '5a', value: '5a' },
  { label: 'Todo período', value: 'all' },
];

export function PeriodFilter({ value, onChange }: Props) {
  return (
    <div className="flex gap-4 text-sm">
      {periods.map(p => (
        <button
          key={p.value}
          onClick={() => onChange(p.value)}
          className={`
            transition-colors
            ${value === p.value
              ? 'text-blue-600 font-semibold'
              : 'text-gray-400 hover:text-gray-600'}
          `}
        >
          {p.label}
        </button>
      ))}
    </div>
  );
}
