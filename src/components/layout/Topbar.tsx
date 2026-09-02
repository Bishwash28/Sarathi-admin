import { Search, Bell } from "lucide-react";
import { useAuthStore } from "../../store/c_authStore";

export default function Topbar() {
  const admin = useAuthStore((s) => s.admin);

  return (
    <header className="flex items-center gap-4 border-b border-[var(--color-card-border)] px-8 py-4">
      <div className="relative flex-1 max-w-xl">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-accent-muted)]" />
        <input
          type="text"
          placeholder="Search..."
          className="w-full rounded-lg border border-[var(--color-card-border)] bg-[var(--color-sidebar)] py-2.5 pl-10 pr-4 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-accent-muted)] focus:border-[var(--color-accent)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
        />
      </div>

      <div className="ml-auto flex items-center gap-5">
        <button
          aria-label="Notifications"
          className="relative rounded-full p-2 text-[var(--color-accent-muted)] hover:bg-[var(--color-accent)]/5 hover:text-[var(--color-text-primary)]"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" />
        </button>

        <div className="flex items-center gap-3 border-l border-[var(--color-card-border)] pl-5">
          <span className="text-sm font-medium text-[var(--color-text-primary)]">
            {admin?.name ?? "Admin User"}
          </span>
          <div className="h-9 w-9 overflow-hidden rounded-full bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-secondary)]" />
        </div>
      </div>
    </header>
  );
}
