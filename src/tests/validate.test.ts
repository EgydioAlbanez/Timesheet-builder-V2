import { describe, expect, it } from 'vitest';
import type { TimesheetRow } from '../domain/types';
import { validateRow } from '../domain/validate';

describe('validation', () => {
  it('checks date in week and required fields', () => {
    const row: TimesheetRow = {
      id: '1',
      date: '2026-01-20',
      project: '',
      scope: '',
      serviceCategory: '',
      serviceType: '',
      startTime: '10:00',
      endTime: '09:00',
      travel: -1,
      comments: ''
    };
    const errors = validateRow(row, ['2026-01-05']);
    expect(errors.date).toBeTruthy();
    expect(errors.endTime).toBeTruthy();
    expect(errors.travel).toBeTruthy();
    expect(errors.project).toBeTruthy();
  });
});
