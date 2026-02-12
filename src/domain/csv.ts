import type { TimesheetRow, WeekOption } from './types';
import { calculateHours, calculateTotal } from './calc';

const header = ['Week','Date','Project','Scope','Service Category','Service Type','Start Time','End Time','Hours','Travel Time','Total Hours','Comments'];

const escapeCsv = (value: string) => `"${value.replaceAll('"', '""')}"`;

export const buildCsv = (rows: TimesheetRow[], week: WeekOption) => {
  const body = rows.map((row) => {
    const hours = calculateHours(row.startTime, row.endTime).toFixed(2);
    const travel = (row.travel ?? 0).toFixed(2);
    const total = calculateTotal(Number(hours), row.travel ?? 0).toFixed(2);
    return [
      `Week ${String(week.weekNumber).padStart(2, '0')}`,
      row.date,
      row.project,
      row.scope,
      row.serviceCategory,
      row.serviceType,
      row.startTime,
      row.endTime,
      hours,
      travel,
      total,
      row.comments
    ].map((v) => escapeCsv(String(v))).join(',');
  });

  return [header.join(','), ...body].join('\n');
};
