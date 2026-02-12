import { parseTimeToMinutes } from './time';

export const calculateHours = (startTime: string, endTime: string): number => {
  const start = parseTimeToMinutes(startTime);
  const end = parseTimeToMinutes(endTime);
  if (start === null || end === null || end <= start) return 0;
  return Number(((end - start) / 60).toFixed(2));
};

export const calculateTotal = (hours: number, travel: number | null): number => {
  return Number((hours + (travel ?? 0)).toFixed(2));
};
