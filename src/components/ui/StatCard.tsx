import { TrendingUp, TrendingDown } from "lucide-react";
import type { StatCardData } from "../../types/nav";

export default function StatCard({
  label,
  value,
  trend,
  trendDirection,
  icon: Icon,
}: StatCardData) {
  const isUp = trendDirection === "up";

  return (
    <div className="rounded-2xl border border-[var(--color-card-border)] bg-[var(--color-card)] p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-[var(--color-accent-muted)]">{label}</p>
        <Icon className="h-4 w-4 text-[var(--color-accent-muted)]" strokeWidth={2} />
      </div>

      <p className="mt-3 text-[26px] font-semibold leading-none text-[var(--color-text-primary)]">
        {value}
      </p>

      <div
        className={[
          "mt-3 flex items-center gap-1 text-xs font-medium",
          isUp ? "text-[var(--color-positive)]" : "text-[var(--color-negative)]",
        ].join(" ")}
      >
        {isUp ? (
          <TrendingUp className="h-3.5 w-3.5" />
        ) : (
          <TrendingDown className="h-3.5 w-3.5" />
        )}
        {trend}
      </div>
    </div>
  );
}
