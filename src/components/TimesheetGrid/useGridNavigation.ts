import { useCallback, useState } from 'react';

export type EditableColumnKey =
  | 'date'
  | 'project'
  | 'scope'
  | 'serviceCategory'
  | 'serviceType'
  | 'startTime'
  | 'endTime'
  | 'travel'
  | 'comments';

const columns: EditableColumnKey[] = ['date', 'project', 'scope', 'serviceCategory', 'serviceType', 'startTime', 'endTime', 'travel', 'comments'];

export const useGridNavigation = (rowCount: number) => {
  const [active, setActive] = useState<{ rowIndex: number; col: EditableColumnKey }>({ rowIndex: 0, col: 'date' });

  const move = useCallback(
    (key: string) => {
      const colIndex = columns.indexOf(active.col);
      if (key === 'ArrowRight' || key === 'Tab') {
        const nextCol = columns[(colIndex + 1) % columns.length];
        const rowInc = colIndex + 1 >= columns.length ? 1 : 0;
        setActive({ rowIndex: Math.min(rowCount - 1, active.rowIndex + rowInc), col: nextCol });
      }
      if (key === 'ArrowLeft' || key === 'Shift+Tab') {
        const nextCol = columns[(colIndex - 1 + columns.length) % columns.length];
        const rowDec = colIndex - 1 < 0 ? 1 : 0;
        setActive({ rowIndex: Math.max(0, active.rowIndex - rowDec), col: nextCol });
      }
      if (key === 'ArrowDown' || key === 'Enter') setActive({ ...active, rowIndex: Math.min(rowCount - 1, active.rowIndex + 1) });
      if (key === 'ArrowUp') setActive({ ...active, rowIndex: Math.max(0, active.rowIndex - 1) });
    },
    [active, rowCount]
  );

  return { active, setActive, move, editableColumns: columns };
};
