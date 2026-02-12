export type ProjectConfig = {
  project: string;
  scopes: string[];
};

export const projectConfigs: ProjectConfig[] = [
  { project: 'Atlas Upgrade', scopes: ['-', 'Backend Sync', 'Control Panels', 'Site Tests'] },
  { project: 'Borealis Plant', scopes: ['-', 'Commissioning', 'Documentation', 'SAT'] },
  { project: 'Cobalt Retrofit', scopes: ['-', 'Snagging', 'Software Design', 'Handover'] },
  { project: 'Delta Expansion', scopes: ['-', 'FAT', 'HLC', 'Graphics'] },
  { project: 'Evergreen Maintenance', scopes: ['-', 'Routine Checks', 'Variations', 'Client Support'] },
  { project: 'Frontier Build', scopes: ['-', 'Design', 'Site Induction', 'HFAT'] }
];
