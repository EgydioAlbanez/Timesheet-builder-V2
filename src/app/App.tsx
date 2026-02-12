import { useEffect, useMemo, useState } from 'react';
import { engineers } from '../data/engineers';
import { buildCsv } from '../domain/csv';
import { buildEmailTemplate } from '../domain/email';
import { calculateHours, calculateTotal } from '../domain/calc';
import type { TimesheetRow, WeekOption } from '../domain/types';
import { validateRows } from '../domain/validate';
import { generateWeeks2026, weekDates } from '../domain/week';
import { loadState, saveState, type PersistedState } from '../storage/localStorage';
import { Landing } from '../components/Landing';
import { TopBar } from '../components/TopBar';
import { SummaryStrip } from '../components/SummaryStrip';
import { Grid } from '../components/TimesheetGrid/Grid';

const makeRow = (week?: WeekOption): TimesheetRow => ({
  id: crypto.randomUUID(),
  date: week?.start ?? '',
  project: '',
  scope: '',
  serviceCategory: '',
  serviceType: '',
  startTime: '',
  endTime: '',
  travel: null,
  comments: ''
});

export default function App() {
  const [started, setStarted] = useState(false);
  const initial = useMemo(() => loadState(), []);
  const weeks = useMemo(() => generateWeeks2026(), []);
  const [persisted, setPersisted] = useState<PersistedState>(initial);
  const [autosaveStatus, setAutosaveStatus] = useState('Saved');

  const selectedWeek = persisted.selectedWeek;
  const selectedEngineerCode = persisted.selectedEngineerCode;
  const weekRows = selectedEngineerCode && selectedWeek ? (persisted.data[selectedEngineerCode]?.[String(selectedWeek.weekNumber)]?.rows ?? []) : [];

  const allowedDates = selectedWeek ? weekDates(selectedWeek) : [];
  const { rowErrors, errorCount } = validateRows(weekRows, allowedDates);

  const setRows = (updater: (prev: TimesheetRow[]) => TimesheetRow[]) => {
    if (!selectedEngineerCode || !selectedWeek) return;
    setPersisted((prev) => {
      const byEngineer = prev.data[selectedEngineerCode] ?? {};
      const key = String(selectedWeek.weekNumber);
      return {
        ...prev,
        data: {
          ...prev.data,
          [selectedEngineerCode]: {
            ...byEngineer,
            [key]: { rows: updater(byEngineer[key]?.rows ?? []) }
          }
        }
      };
    });
  };

  useEffect(() => {
    document.documentElement.classList.toggle('dark', persisted.theme === 'dark');
    setAutosaveStatus('Saving');
    const timer = setTimeout(() => {
      try {
        saveState(persisted);
        setAutosaveStatus('Saved');
      } catch {
        setAutosaveStatus('Error');
      }
    }, 600);
    return () => clearTimeout(timer);
  }, [persisted]);

  useEffect(() => {
    const interval = setInterval(() => {
      try {
        saveState(persisted);
        setAutosaveStatus('Saved');
      } catch {
        setAutosaveStatus('Error');
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [persisted]);

  const addRow = () => setRows((prev) => [...prev, makeRow(selectedWeek ?? undefined)]);
  const duplicateRow = (id: string) => setRows((prev) => {
    const row = prev.find((r) => r.id === id);
    if (!row) return prev;
    return [...prev, { ...row, id: crypto.randomUUID() }];
  });
  const deleteRow = (id: string) => setRows((prev) => prev.filter((r) => r.id !== id));

  const currentEngineer = engineers.find((e) => e.code === selectedEngineerCode);

  const exportCsv = () => {
    if (!selectedWeek || !currentEngineer || errorCount > 0) return;
    const csv = buildCsv(weekRows, selectedWeek);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Timesheet_${currentEngineer.name.replaceAll(' ', '')}_Week${String(selectedWeek.weekNumber).padStart(2, '0')}_2026.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyEmailTemplate = async () => {
    if (!selectedWeek || !currentEngineer) return;
    const template = buildEmailTemplate(currentEngineer, selectedWeek, weekRows);
    await navigator.clipboard.writeText(`Subject: ${template.subject}\n\n${template.body}`);
  };

  const openOutlook = () => {
    if (!selectedWeek || !currentEngineer) return;
    const template = buildEmailTemplate(currentEngineer, selectedWeek, weekRows);
    window.open(template.mailto, '_blank');
  };

  const total = weekRows.reduce(
    (sum, row) => sum + calculateTotal(calculateHours(row.startTime, row.endTime), row.travel),
    0
  );

  if (!started) return <Landing onStart={() => setStarted(true)} />;

  const enabled = Boolean(selectedEngineerCode && selectedWeek);

  return (
    <div className="min-h-screen bg-black p-4 text-zinc-100">
      <TopBar
        engineers={engineers}
        selectedEngineerCode={selectedEngineerCode}
        setSelectedEngineerCode={(label) => {
          const codeMatch = label.match(/ENG_\d{3}/)?.[0] ?? label;
          setPersisted((prev) => ({ ...prev, selectedEngineerCode: codeMatch || null }));
        }}
        weeks={weeks}
        selectedWeek={selectedWeek}
        setSelectedWeek={(w) => setPersisted((prev) => ({ ...prev, selectedWeek: w }))}
        addRow={addRow}
        exportCsv={exportCsv}
        copyEmailTemplate={copyEmailTemplate}
        openOutlook={openOutlook}
        exportDisabled={errorCount > 0}
        theme={persisted.theme}
        toggleTheme={() => setPersisted((prev) => ({ ...prev, theme: prev.theme === 'dark' ? 'light' : 'dark' }))}
        autosaveStatus={autosaveStatus}
      />

      <SummaryStrip
        totalHours={total}
        entries={weekRows.length}
        projects={new Set(weekRows.map((r) => r.project).filter(Boolean)).size}
        errorRows={errorCount}
      />

      <Grid
        enabled={enabled}
        rows={weekRows}
        setRows={setRows}
        weekDates={allowedDates}
        rowErrors={rowErrors}
        validateRowsFn={(rows) => validateRows(rows, allowedDates)}
        duplicateRow={duplicateRow}
        deleteRow={deleteRow}
      />
    </div>
  );
}
