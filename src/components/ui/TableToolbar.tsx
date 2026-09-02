import { Search, Plus } from "lucide-react";

export default function TableToolbar({
  searchPlaceholder,
  searchValue,
  onSearchChange,
  addLabel,
  onAddClick,
  statusOptions,
  statusValue,
  onStatusChange,
}: {
  searchPlaceholder: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  addLabel?: string;
  onAddClick?: () => void;
  statusOptions?: string[];
  statusValue?: string;
  onStatusChange?: (value: string) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="relative flex-1 min-w-[220px] max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-accent-muted)]" />
        <input
          type="text"
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full rounded-lg border border-[var(--color-card-border)] bg-[var(--color-sidebar)] py-2.5 pl-10 pr-4 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-accent-muted)] focus:border-[var(--color-accent)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
        />
      </div>

      {statusOptions && (
        <select
          value={statusValue}
          onChange={(e) => onStatusChange?.(e.target.value)}
          className="rounded-lg border border-[var(--color-card-border)] bg-[var(--color-sidebar)] px-3 py-2.5 text-sm text-[var(--color-text-primary)] focus:border-[var(--color-accent)] focus:outline-none"
        >
          <option>All Status</option>
          {statusOptions.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      )}

      {addLabel && (
        <button
          onClick={onAddClick}
          className="ml-auto flex items-center gap-2 rounded-lg bg-[var(--color-accent)] px-4 py-2.5 text-sm font-medium text-white hover:opacity-90"
        >
          <Plus className="h-4 w-4" />
          {addLabel}
        </button>
      )}
    </div>
  );
}
