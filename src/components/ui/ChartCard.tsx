import { MoreVertical } from "lucide-react";
import type { ReactNode } from "react";

export default function ChartCard({
  title,
  legend,
  children,
}: {
  title: string;
  legend?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="flex-1 rounded-2xl border border-[var(--color-card-border)] bg-[var(--color-card)] p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-[var(--color-text-primary)]">{title}</h3>
        <button
          aria-label="Chart options"
          className="text-[var(--color-accent-muted)] hover:text-[var(--color-text-primary)]"
        >
          <MoreVertical className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-4 h-72">{children}</div>

      {legend && (
        <div className="mt-4 flex items-center gap-6 text-xs text-[var(--color-accent-muted)]">
          {legend}
        </div>
      )}
    </div>
  );
}
