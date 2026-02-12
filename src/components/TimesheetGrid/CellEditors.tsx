import { TIME_OPTIONS, normalizeTime } from '../../domain/time';

type BaseProps = {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  options?: string[];
};

export const SelectEditor = ({ value, onChange, options = [], className }: BaseProps) => (
  <select className={className} value={value} onChange={(e) => onChange(e.target.value)}>
    <option value="">Select</option>
    {options.map((opt) => (
      <option key={opt} value={opt}>
        {opt}
      </option>
    ))}
  </select>
);

export const TextEditor = ({ value, onChange, className }: BaseProps) => (
  <input className={className} value={value} onChange={(e) => onChange(e.target.value)} />
);

export const TimeEditor = ({ value, onChange, className }: BaseProps) => (
  <input
    className={className}
    list="time-options"
    value={value}
    onChange={(e) => onChange(e.target.value)}
    onBlur={(e) => {
      const normalized = normalizeTime(e.target.value);
      if (normalized) onChange(normalized);
    }}
  />
);

export const TimeOptionsDataList = () => (
  <datalist id="time-options">
    {TIME_OPTIONS.map((time) => (
      <option key={time} value={time} />
    ))}
  </datalist>
);
