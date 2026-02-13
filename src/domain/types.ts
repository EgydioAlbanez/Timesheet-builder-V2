export type ThemeMode = 'dark' | 'light';

export type ServiceCategory = 'Prelims' | 'Scope' | 'N.A';

export type TimesheetRow = {
  id: string;
  date: string;
  project: string;
  scope: string;
  serviceCategory: ServiceCategory | '';
  serviceType: string;
  startTime: string;
  endTime: string;
  travel: number | null;
  comments: string;
};

export type WeekOption = {
  year: 2026;
  weekNumber: number;
  start: string;
  end: string;
};

export type RowErrorMap = Partial<Record<keyof TimesheetRow | 'hours' | 'overlap' | 'dayHours', string>>;
