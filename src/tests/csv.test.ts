import { describe, expect, it } from 'vitest';
import { buildCsv } from '../domain/csv';

describe('csv generation', () => {
  it('creates required columns', () => {
    const csv = buildCsv([
      {
        id: '1',
        date: '2026-01-05',
        project: 'Atlas Upgrade',
        scope: '-',
        serviceCategory: 'Scope',
        serviceType: 'Software Engineering',
        startTime: '09:00',
        endTime: '10:15',
        travel: 0,
        comments: 'test'
      }
    ], { year: 2026, weekNumber: 1, start: '2026-01-05', end: '2026-01-11' });
    expect(csv).toContain('Week,Date,Project,Scope,Service Category,Service Type,Start Time,End Time,Hours,Travel Time,Total Hours,Comments');
    expect(csv).toContain('"1.25"');
  });
});
