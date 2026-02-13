export const Landing = ({ onStart }: { onStart: () => void }) => (
  <div className="flex min-h-screen flex-col items-center justify-center bg-black text-white">
    <h1 className="animate-pulse text-7xl font-bold tracking-[0.3em] text-accent">SIRUS</h1>
    <button
      className="mt-10 rounded-lg border border-accent px-6 py-3 text-accent transition hover:bg-accent hover:text-black"
      onClick={onStart}
    >
      Start Timesheet
    </button>
    <footer className="absolute bottom-6 text-center text-xs text-zinc-400">
      <div>Developed By: Egydio Albanese</div>
      <div>Version: V2.0</div>
    </footer>
  </div>
);
