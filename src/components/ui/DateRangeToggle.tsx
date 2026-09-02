const RANGES = ["Today", "7D", "30D", "YTD"] as const;
export type DateRangeValue = (typeof RANGES)[number];

export default function DateRangeToggle({
  active,
  onChange,
}: {
  active: DateRangeValue;
  onChange: (value: DateRangeValue) => void;
}) {
  return (
    <div className="flex items-center gap-1 rounded-lg border border-[var(--color-card-border)] bg-[var(--color-sidebar)] p-1">
      {RANGES.map((range) => (
        <button
          key={range}
          onClick={() => onChange(range)}
          className={[
            "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
            active === range
              ? "bg-[var(--color-accent)] text-white"
              : "text-[var(--color-accent-muted)] hover:text-[var(--color-text-primary)]",
          ].join(" ")}
        >
          {range}
        </button>
      ))}
    </div>
  );
}
