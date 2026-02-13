export const SummaryStrip = ({ totalHours, entries, projects, errorRows }: { totalHours: number; entries: number; projects: number; errorRows: number }) => (
  <div className="mb-3 grid grid-cols-2 gap-3 rounded-xl border border-zinc-800 bg-zinc-900/70 p-3 backdrop-blur md:grid-cols-4">
    <div><div className="text-xs text-zinc-400">Total Hours</div><div className="text-xl font-semibold text-accent">{totalHours.toFixed(2)}</div></div>
    <div><div className="text-xs text-zinc-400">Entry Count</div><div className="text-xl font-semibold">{entries}</div></div>
    <div><div className="text-xs text-zinc-400">Unique Projects</div><div className="text-xl font-semibold">{projects}</div></div>
    <div><div className="text-xs text-zinc-400">Validation</div><div className={`text-xl font-semibold ${errorRows ? 'text-red-400' : 'text-green-400'}`}>{errorRows} rows with errors</div></div>
  </div>
);
