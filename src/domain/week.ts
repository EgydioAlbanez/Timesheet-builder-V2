import type { WeekOption } from './types';

const YEAR = 2026;

const toIso = (d: Date) => d.toISOString().slice(0, 10);

export const formatDisplayDate = (isoDate: string) => {
  const [y, m, d] = isoDate.split('-').map(Number);
  return `${String(d).padStart(2, '0')}/${String(m).padStart(2, '0')}/${y}`;
};

const formatLabelDate = (isoDate: string) => {
  const date = new Date(`${isoDate}T00:00:00`);
  return date.toLocaleDateString('en-GB', { month: 'short', day: '2-digit' });
};

export const generateWeeks2026 = (): WeekOption[] => {
  const jan1 = new Date(`${YEAR}-01-01T00:00:00`);
  const firstMonday = new Date(jan1);
  while (firstMonday.getDay() !== 1) {
    firstMonday.setDate(firstMonday.getDate() + 1);
  }

  return Array.from({ length: 52 }, (_, i) => {
    const start = new Date(firstMonday);
    start.setDate(firstMonday.getDate() + i * 7);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    return { year: 2026 as const, weekNumber: i + 1, start: toIso(start), end: toIso(end) };
  });
};

export const weekLabel = (week: WeekOption) =>
  `Week ${String(week.weekNumber).padStart(2, '0')} (${formatLabelDate(week.start)} - ${formatLabelDate(week.end)})`;

export const weekDates = (week: WeekOption): string[] => {
  const start = new Date(`${week.start}T00:00:00`);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return toIso(d);
  });
};
