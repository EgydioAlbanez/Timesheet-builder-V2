# SIRUS Timesheet System – V2.0

Modern spreadsheet-style timesheet web app built with React + TypeScript + Vite.

## Run

```bash
npm install
npm run dev
```

## Scripts

- `npm run dev` – start local dev server
- `npm run build` – production build
- `npm run preview` – preview build
- `npm run test` – run unit tests
- `npm run lint` – lint codebase

## Feature checklist

- [x] Landing page with SIRUS intro and Start action
- [x] Single-screen main app with sticky top bar, summary strip, grid
- [x] Engineer + week selectors (2026 Week 01-52, Monday-Sunday)
- [x] Spreadsheet grid editing with row add/duplicate/delete
- [x] Date/week lock, dependent dropdowns, required field validation
- [x] Time parsing + 15-min enforcement, hours + total auto-calculated
- [x] Soft/hard daily hour and overlap warnings
- [x] Safe TSV paste with full validation gate (no partial apply)
- [x] CSV export with required format + filename
- [x] Email template copy + Outlook mailto link
- [x] Dark/light theme toggle with persistence
- [x] localStorage autosave on debounce and periodic interval
- [x] Virtualized rows for large datasets
- [x] Unit tests for week/time/calc/validation/csv

## Key files

- `src/app/App.tsx`
- `src/components/TimesheetGrid/Grid.tsx`
- `src/domain/week.ts`
- `src/domain/validate.ts`
- `src/storage/localStorage.ts`
