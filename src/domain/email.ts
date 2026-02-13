import type { Engineer } from '../data/engineers';
import type { TimesheetRow, WeekOption } from './types';
import { calculateHours, calculateTotal } from './calc';

export const buildEmailTemplate = (engineer: Engineer, week: WeekOption, rows: TimesheetRow[]) => {
  const totalHours = rows
    .reduce((sum, row) => sum + calculateTotal(calculateHours(row.startTime, row.endTime), row.travel), 0)
    .toFixed(2);
  const projects = [...new Set(rows.map((r) => r.project).filter(Boolean))].join(', ') || 'N/A';
  const weekPadded = String(week.weekNumber).padStart(2, '0');

  const subject = `Timesheet Submission - ${engineer.name} - Week ${weekPadded} - 2026`;
  const body = `Dear Manager,\nPlease find attached my timesheet for Week ${weekPadded} (${week.start} - ${week.end}).\n\nSummary:\n- Total Hours: ${totalHours} hours\n- Projects: ${projects}\n- Period: ${week.start} to ${week.end}\n- Week: Week ${weekPadded} of 2026\n\nBest regards,\n${engineer.name}\n${engineer.code}`;

  return {
    subject,
    body,
    mailto: `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  };
};
