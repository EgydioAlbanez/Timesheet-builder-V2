import type { ClipboardEvent } from 'react';
import type { TimesheetRow } from '../../domain/types';
import { normalizeTime } from '../../domain/time';
import type { EditableColumnKey } from './useGridNavigation';

const editableColumns: EditableColumnKey[] = [
  'date',
  'project',
  'scope',
  'serviceCategory',
  'serviceType',
  'startTime',
  'endTime',
  'travel',
  'comments'
];

export const useClipboardPaste = (
  rows: TimesheetRow[],
  setRows: (updater: (prev: TimesheetRow[]) => TimesheetRow[]) => void,
  validateRowsFn: (rows: TimesheetRow[]) => { errorCount: number },
  setPasteErrors: (keys: string[]) => void
) => {
  const onPaste = (e: ClipboardEvent<HTMLDivElement>, startRow: number, startCol: EditableColumnKey) => {
    const text = e.clipboardData.getData('text/plain');
    if (!text.includes('\t') && !text.includes('\n')) return;
    e.preventDefault();

    const matrix = text
      .split(/\r?\n/)
      .filter(Boolean)
      .map((line) => line.split('\t'));
    const startIndex = editableColumns.indexOf(startCol);
    const draft = rows.map((r) => ({ ...r }));
    const invalid: string[] = [];

    matrix.forEach((rVals, rOffset) => {
      const row = draft[startRow + rOffset];
      if (!row) return;
      rVals.forEach((value, cOffset) => {
        const col = editableColumns[startIndex + cOffset];
        if (!col) return;
        const key = `${row.id}:${col}`;
        const v = value.trim();
        if (col === 'travel') {
          if (v === '') {
            row.travel = null;
            return;
          }
          const num = Number(v);
          if (Number.isNaN(num) || num < 0) invalid.push(key);
          else row.travel = num;
        } else if (col === 'startTime' || col === 'endTime') {
          const normalized = normalizeTime(v);
          if (!normalized) invalid.push(key);
          else row[col] = normalized;
        } else {
          row[col] = v;
        }
      });
    });

    if (invalid.length > 0) {
      setPasteErrors(invalid);
      return;
    }

    const result = validateRowsFn(draft);
    if (result.errorCount > 0) {
      setPasteErrors(['validation']);
      return;
    }

    setPasteErrors([]);
    setRows(() => draft);
  };

  return { onPaste };
};
