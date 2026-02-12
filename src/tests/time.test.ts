import { describe, expect, it } from 'vitest';
import { isQuarterHour, normalizeTime, parseTimeToMinutes } from '../domain/time';

describe('time utils', () => {
  it('parses time and normalizes', () => {
    expect(parseTimeToMinutes('09:30')).toBe(570);
    expect(normalizeTime('930')).toBe('09:30');
  });
  it('validates quarter-hour', () => {
    expect(isQuarterHour('09:45')).toBe(true);
    expect(isQuarterHour('09:10')).toBe(false);
  });
});
