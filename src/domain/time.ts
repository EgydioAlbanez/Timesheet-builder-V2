export const TIME_OPTIONS = Array.from({ length: 96 }, (_, i) => {
  const hours = Math.floor(i / 4);
  const mins = (i % 4) * 15;
  return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
});

export const parseTimeToMinutes = (value: string): number | null => {
  const input = value.trim();
  const match = input.match(/^(\d{1,2})(?::?(\d{2}))?$/);
  if (!match) return null;
  const hh = Number(match[1]);
  const mm = Number(match[2] ?? '00');
  if (hh > 23 || mm > 59) return null;
  return hh * 60 + mm;
};

export const normalizeTime = (value: string): string | null => {
  const mins = parseTimeToMinutes(value);
  if (mins === null) return null;
  const hh = Math.floor(mins / 60);
  const mm = mins % 60;
  return `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
};

export const isQuarterHour = (value: string) => {
  const mins = parseTimeToMinutes(value);
  return mins !== null && mins % 15 === 0;
};
