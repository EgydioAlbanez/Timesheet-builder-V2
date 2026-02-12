import type { ThemeMode, TimesheetRow, WeekOption } from '../domain/types';

const KEY = 'sirus_timesheet_v2';

export type PersistedState = {
  version: '2.0';
  theme: ThemeMode;
  selectedEngineerCode: string | null;
  selectedWeek: WeekOption | null;
  data: Record<string, Record<string, { rows: TimesheetRow[] }>>;
};

export const defaultPersistedState: PersistedState = {
  version: '2.0',
  theme: 'dark',
  selectedEngineerCode: null,
  selectedWeek: null,
  data: {}
};

export const loadState = (): PersistedState => {
  const raw = localStorage.getItem(KEY);
  if (!raw) return defaultPersistedState;
  try {
    const parsed = JSON.parse(raw) as PersistedState;
    if (parsed.version !== '2.0') return defaultPersistedState;
    return parsed;
  } catch {
    return defaultPersistedState;
  }
};

export const saveState = (state: PersistedState) => {
  localStorage.setItem(KEY, JSON.stringify(state));
};
