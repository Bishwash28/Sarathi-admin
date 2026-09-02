const STATUS_STYLES: Record<string, string> = {
  active: "bg-[var(--color-positive)]/10 text-[var(--color-positive)]",
  completed: "bg-[var(--color-positive)]/10 text-[var(--color-positive)]",
  confirmed: "bg-[var(--color-positive)]/10 text-[var(--color-positive)]",
  verified: "bg-[var(--color-positive)]/10 text-[var(--color-positive)]",
  paid: "bg-[var(--color-positive)]/10 text-[var(--color-positive)]",
  pending: "bg-[var(--color-warning)]/10 text-[var(--color-warning)]",
  "pending verify": "bg-[var(--color-warning)]/10 text-[var(--color-warning)]",
  ongoing: "bg-[var(--color-accent-soft)]/10 text-[var(--color-accent-soft)]",
  cancelled: "bg-[var(--color-negative)]/10 text-[var(--color-negative)]",
  rejected: "bg-[var(--color-negative)]/10 text-[var(--color-negative)]",
  failed: "bg-[var(--color-negative)]/10 text-[var(--color-negative)]",
  suspended: "bg-[var(--color-negative)]/10 text-[var(--color-negative)]",
  flagged: "bg-[var(--color-negative)]/10 text-[var(--color-negative)]",
  refunded: "bg-[var(--color-accent-soft)]/10 text-[var(--color-accent-soft)]",
};

export default function StatusBadge({ status }: { status: string }) {
  const style =
    STATUS_STYLES[status.toLowerCase()] ?? "bg-[var(--color-accent-muted)]/10 text-[var(--color-accent-muted)]";

  return (
    <span
      className={[
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
        style,
      ].join(" ")}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}
