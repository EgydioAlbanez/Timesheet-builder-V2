import { describe, expect, it } from 'vitest';
import { calculateHours } from '../domain/calc';

describe('calc', () => {
  it('computes decimal hours', () => {
    expect(calculateHours('09:00', '10:15')).toBe(1.25);
  });
});
