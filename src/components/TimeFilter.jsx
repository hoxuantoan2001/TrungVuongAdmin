import { CalendarDays } from 'lucide-react';
import { cx } from '../data';

const TIME_OPTIONS = [
  { key: 'all', label: 'Tất cả' },
  { key: '7d', label: '7 ngày' },
  { key: '30d', label: '30 ngày' },
  { key: '90d', label: '90 ngày' },
  { key: '6m', label: '6 tháng' }
];

export default function TimeFilter({ value, onChange }) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <CalendarDays size={16} className="text-slate-400 hidden sm:block" />
      <div className="flex gap-1 rounded-xl bg-slate-100 p-1">
        {TIME_OPTIONS.map(opt => (
          <button
            key={opt.key}
            type="button"
            onClick={() => onChange(opt.key)}
            className={cx(
              'px-3 py-1.5 rounded-lg text-[12px] font-bold transition-all whitespace-nowrap',
              value === opt.key
                ? 'bg-white text-blue-700 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export { TIME_OPTIONS };
