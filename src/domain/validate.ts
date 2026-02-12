import type { RowErrorMap, TimesheetRow } from './types';
import { calculateHours } from './calc';
import { isQuarterHour, parseTimeToMinutes } from './time';

const requiredTextFields: (keyof TimesheetRow)[] = ['project', 'scope', 'serviceCategory', 'serviceType', 'date', 'startTime', 'endTime'];

export const validateRow = (row: TimesheetRow, allowedDates: string[]): RowErrorMap => {
  const errors: RowErrorMap = {};

  for (const field of requiredTextFields) {
    if (!String(row[field] ?? '').trim()) errors[field] = 'Required';
  }

  if (row.date && !allowedDates.includes(row.date)) errors.date = 'Date must be in selected week';
  if (row.startTime && !isQuarterHour(row.startTime)) errors.startTime = '15-minute increments only';
  if (row.endTime && !isQuarterHour(row.endTime)) errors.endTime = '15-minute increments only';

  const start = parseTimeToMinutes(row.startTime);
  const end = parseTimeToMinutes(row.endTime);
  if (start !== null && end !== null && end <= start) errors.endTime = 'End time must be after start time';

  if (row.travel !== null && (Number.isNaN(row.travel) || row.travel < 0)) errors.travel = 'Travel must be >= 0';

  return errors;
};

export const validateRows = (rows: TimesheetRow[], allowedDates: string[]) => {
  const rowErrors = new Map<string, RowErrorMap>();

  rows.forEach((row) => rowErrors.set(row.id, validateRow(row, allowedDates)));

  const byDate = new Map<string, TimesheetRow[]>();
  rows.forEach((row) => {
    if (!row.date) return;
    byDate.set(row.date, [...(byDate.get(row.date) ?? []), row]);
  });

  byDate.forEach((dateRows) => {
    const sorted = [...dateRows].sort((a, b) => (parseTimeToMinutes(a.startTime) ?? 0) - (parseTimeToMinutes(b.startTime) ?? 0));

    let running = 0;
    for (let i = 0; i < sorted.length; i += 1) {
      const current = sorted[i];
      const start = parseTimeToMinutes(current.startTime);
      const end = parseTimeToMinutes(current.endTime);
      const err = rowErrors.get(current.id) ?? {};
      if (start !== null && end !== null) {
        running += calculateHours(current.startTime, current.endTime) + (current.travel ?? 0);
        if (running > 10 && !err.dayHours) err.dayHours = 'Warning: day total exceeds 10h';
        if (running > 24) err.dayHours = 'Error: day total exceeds 24h';
        if (i > 0) {
          const prevEnd = parseTimeToMinutes(sorted[i - 1].endTime);
          if (prevEnd !== null && start < prevEnd) err.overlap = 'Warning: overlaps another entry';
        }
      }
      rowErrors.set(current.id, err);
    }
  });

  const errorCount = Array.from(rowErrors.values()).filter((e) =>
    Object.entries(e).some(([k, v]) => Boolean(v) && !['dayHours', 'overlap'].includes(k))
  ).length;

  return { rowErrors, errorCount };
};
