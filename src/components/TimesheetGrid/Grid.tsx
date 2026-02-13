import { useMemo, useRef } from 'react';
import type { KeyboardEvent } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Trash2, Copy } from 'lucide-react';
import { categories, serviceTypeMapping } from '../../data/services';
import { projectConfigs } from '../../data/projects';
import { calculateHours, calculateTotal } from '../../domain/calc';
import type { RowErrorMap, TimesheetRow } from '../../domain/types';
import { SelectEditor, TextEditor, TimeEditor, TimeOptionsDataList } from './CellEditors';
import { useGridNavigation } from './useGridNavigation';
import { useClipboardPaste } from './useClipboardPaste';

type Props = {
  enabled: boolean;
  rows: TimesheetRow[];
  setRows: (updater: (prev: TimesheetRow[]) => TimesheetRow[]) => void;
  weekDates: string[];
  rowErrors: Map<string, RowErrorMap>;
  validateRowsFn: (rows: TimesheetRow[]) => { errorCount: number };
  duplicateRow: (id: string) => void;
  deleteRow: (id: string) => void;
};

const baseCell =
  'w-full rounded border border-zinc-700 bg-zinc-950 px-2 py-1 text-sm text-zinc-100 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent disabled:opacity-60';

export const Grid = ({ enabled, rows, setRows, weekDates, rowErrors, validateRowsFn, duplicateRow, deleteRow }: Props) => {
  const parentRef = useRef<HTMLDivElement>(null);
  const { active, move } = useGridNavigation(rows.length || 1);
  const { onPaste } = useClipboardPaste(rows, setRows, validateRowsFn, () => undefined);

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 46,
    overscan: 8
  });

  const projects = useMemo(() => projectConfigs.map((p) => p.project), []);

  const patchRow = (id: string, key: keyof TimesheetRow, value: string | number | null) => {
    if (!enabled) return;
    setRows((prev) =>
      prev.map((row) => {
        if (row.id !== id) return row;
        const next = { ...row, [key]: value };
        if (key === 'project') next.scope = '';
        if (key === 'serviceCategory') next.serviceType = '';
        return next;
      })
    );
  };

  const handleKey = (e: KeyboardEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (e.key === 'Tab' && e.shiftKey) return move('Shift+Tab');
    if (['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown', 'Enter', 'Tab'].includes(e.key)) {
      e.preventDefault();
      move(e.key);
    }
  };

  return (
    <div className={`overflow-hidden rounded-xl border border-zinc-800 bg-[#141414] ${enabled ? '' : 'opacity-70'}`}>
      <TimeOptionsDataList />
      <div className="sticky top-0 z-10 grid grid-cols-[120px_140px_140px_160px_170px_110px_110px_90px_100px_90px_260px_90px] gap-2 border-b border-zinc-800 bg-zinc-900 px-2 py-2 text-xs uppercase text-zinc-400">
        {['Date', 'Project', 'Scope', 'Service Category', 'Service Type', 'Start', 'End', 'Hours', 'Travel', 'Total', 'Comments', 'Actions'].map((h) => (
          <div key={h}>{h}</div>
        ))}
      </div>
      <div ref={parentRef} className="h-[60vh] overflow-auto" onPaste={(e) => onPaste(e, active.rowIndex, active.col)}>
        <div style={{ height: virtualizer.getTotalSize(), position: 'relative' }}>
          {virtualizer.getVirtualItems().map((item) => {
            const row = rows[item.index];
            if (!row) return null;
            const errors = rowErrors.get(row.id) ?? {};
            const hours = calculateHours(row.startTime, row.endTime);
            const total = calculateTotal(hours, row.travel);
            const projectScopes = projectConfigs.find((p) => p.project === row.project)?.scopes ?? [];
            const serviceTypes = row.serviceCategory ? serviceTypeMapping[row.serviceCategory] : [];
            const cellClass = (key: string) => `${baseCell} ${errors[key as keyof RowErrorMap] ? 'border-red-500' : ''}`;

            return (
              <div
                key={row.id}
                className="grid grid-cols-[120px_140px_140px_160px_170px_110px_110px_90px_100px_90px_260px_90px] gap-2 px-2 py-1 hover:bg-zinc-900/40"
                style={{ position: 'absolute', transform: `translateY(${item.start}px)`, width: '100%' }}
              >
                <SelectEditor value={row.date} onChange={(v) => patchRow(row.id, 'date', v)} options={weekDates} className={cellClass('date')} />
                <SelectEditor value={row.project} onChange={(v) => patchRow(row.id, 'project', v)} options={projects} className={cellClass('project')} />
                <SelectEditor value={row.scope} onChange={(v) => patchRow(row.id, 'scope', v)} options={projectScopes} className={cellClass('scope')} />
                <SelectEditor value={row.serviceCategory} onChange={(v) => patchRow(row.id, 'serviceCategory', v)} options={categories} className={cellClass('serviceCategory')} />
                <SelectEditor value={row.serviceType} onChange={(v) => patchRow(row.id, 'serviceType', v)} options={serviceTypes} className={cellClass('serviceType')} />
                <TimeEditor value={row.startTime} onChange={(v) => patchRow(row.id, 'startTime', v)} className={cellClass('startTime')} />
                <TimeEditor value={row.endTime} onChange={(v) => patchRow(row.id, 'endTime', v)} className={cellClass('endTime')} />
                <input className={`${baseCell} bg-zinc-800`} readOnly value={hours.toFixed(2)} />
                <input className={cellClass('travel')} value={row.travel ?? ''} onChange={(e) => patchRow(row.id, 'travel', e.target.value === '' ? null : Number(e.target.value))} onKeyDown={handleKey} />
                <input className={`${baseCell} bg-zinc-800`} readOnly value={total.toFixed(2)} />
                <TextEditor value={row.comments} onChange={(v) => patchRow(row.id, 'comments', v)} className={cellClass('comments')} />
                <div className="flex items-center gap-2">
                  <button className="rounded border border-zinc-700 p-1 hover:border-accent" onClick={() => duplicateRow(row.id)}>
                    <Copy size={14} />
                  </button>
                  <button className="rounded border border-zinc-700 p-1 hover:border-red-500" onClick={() => deleteRow(row.id)}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
