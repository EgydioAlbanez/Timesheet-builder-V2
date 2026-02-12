import { ChevronLeft, ChevronRight, Download, Mail, Moon, Plus, Sun } from 'lucide-react';
import type { Engineer } from '../data/engineers';
import type { ThemeMode, WeekOption } from '../domain/types';
import { weekLabel } from '../domain/week';

type Props = {
  engineers: Engineer[];
  selectedEngineerCode: string | null;
  setSelectedEngineerCode: (code: string) => void;
  weeks: WeekOption[];
  selectedWeek: WeekOption | null;
  setSelectedWeek: (week: WeekOption) => void;
  addRow: () => void;
  exportCsv: () => void;
  copyEmailTemplate: () => void;
  openOutlook: () => void;
  exportDisabled: boolean;
  theme: ThemeMode;
  toggleTheme: () => void;
  autosaveStatus: string;
};

export const TopBar = ({
  engineers,
  selectedEngineerCode,
  setSelectedEngineerCode,
  weeks,
  selectedWeek,
  setSelectedWeek,
  addRow,
  exportCsv,
  copyEmailTemplate,
  exportDisabled,
  openOutlook,
  theme,
  toggleTheme,
  autosaveStatus
}: Props) => {
  const idx = selectedWeek ? weeks.findIndex((w) => w.weekNumber === selectedWeek.weekNumber) : -1;
  return (
    <div className="sticky top-0 z-20 mb-3 grid gap-3 rounded-xl border border-zinc-800 bg-zinc-900/70 p-3 backdrop-blur">
      <div className="grid grid-cols-1 items-center gap-3 lg:grid-cols-[1.2fr_1fr_auto]">
        <input
          list="engineers"
          placeholder="Select Engineer"
          value={selectedEngineerCode ?? ''}
          onChange={(e) => setSelectedEngineerCode(e.target.value)}
          className="rounded border border-zinc-700 bg-zinc-950 px-3 py-2"
        />
        <datalist id="engineers">
          {engineers.map((e) => (
            <option key={e.code} value={e.code}>{`${e.name} (${e.code})`}</option>
          ))}
        </datalist>

        <div className="flex items-center gap-2">
          <button className="rounded border border-zinc-700 p-2" disabled={idx <= 0} onClick={() => idx > 0 && setSelectedWeek(weeks[idx - 1])}>
            <ChevronLeft size={16} />
          </button>
          <select
            className="min-w-[280px] rounded border border-zinc-700 bg-zinc-950 px-3 py-2"
            value={selectedWeek?.weekNumber ?? ''}
            onChange={(e) => setSelectedWeek(weeks.find((w) => w.weekNumber === Number(e.target.value)) ?? weeks[0])}
          >
            <option value="">Select Week</option>
            {weeks.map((w) => (
              <option key={w.weekNumber} value={w.weekNumber}>
                {weekLabel(w)}
              </option>
            ))}
          </select>
          <button className="rounded border border-zinc-700 p-2" disabled={idx < 0 || idx >= weeks.length - 1} onClick={() => idx < weeks.length - 1 && setSelectedWeek(weeks[idx + 1])}>
            <ChevronRight size={16} />
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button className="rounded border border-zinc-700 px-3 py-2 hover:border-accent" onClick={addRow}><Plus size={14} className="inline"/> Add Row</button>
          <button className="rounded border border-zinc-700 px-3 py-2 hover:border-accent disabled:opacity-50" onClick={exportCsv} disabled={exportDisabled}><Download size={14} className="inline"/> Export CSV</button>
          <button className="rounded border border-zinc-700 px-3 py-2 hover:border-accent" onClick={copyEmailTemplate}><Mail size={14} className="inline"/> Copy Email Template</button>
          <button className="rounded border border-zinc-700 px-3 py-2 hover:border-accent" onClick={openOutlook}>Open in Outlook</button>
          <button className="rounded border border-zinc-700 p-2 hover:border-accent" onClick={toggleTheme}>{theme === 'dark' ? <Sun size={16}/> : <Moon size={16}/>}</button>
          <span className="text-xs text-zinc-400">{autosaveStatus}</span>
        </div>
      </div>
    </div>
  );
};
