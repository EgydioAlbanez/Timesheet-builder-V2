import type { ServiceCategory } from '../domain/types';

export const categories: ServiceCategory[] = ['Prelims', 'Scope', 'N.A'];

export const serviceTypeMapping: Record<ServiceCategory, string[]> = {
  Prelims: ['Miscellaneous', 'Document Generation', 'Meeting', 'Project Management', 'Variations', 'Receipt Verification'],
  Scope: ['Software Engineering', 'SAT', 'ACP generation', 'ACP Software/Graphics', 'Snags', 'Panel Modifications', 'HLC', 'SFAT', 'HFAT', 'Software Design', 'Hardware Design', 'Hardware Design Documents', 'Miscellaneous', 'VTOPs', 'Document Generation'],
  'N.A': ['Annual Leave', 'Sick Leave', 'Bank Holiday', 'Training', 'Site Induction', 'Estimating new jobs', 'Days in Lieu', 'Miscellaneous']
};
