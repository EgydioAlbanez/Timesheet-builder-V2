import { describe, expect, it } from 'vitest';
import { generateWeeks2026 } from '../domain/week';

describe('week generation', () => {
  it('has 52 weeks and proper first week', () => {
    const weeks = generateWeeks2026();
    expect(weeks).toHaveLength(52);
    expect(weeks[0]).toMatchObject({ start: '2026-01-05', end: '2026-01-11', weekNumber: 1 });
  });
});
