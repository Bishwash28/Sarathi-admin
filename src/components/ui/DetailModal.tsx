import type { ReactNode } from "react";
import Modal from "./Modal";

export interface DetailRow {
  label: string;
  value: ReactNode;
}

export default function DetailModal({
  title,
  subtitle,
  rows,
  onClose,
  footer,
}: {
  title: string;
  subtitle?: string;
  rows: DetailRow[];
  onClose: () => void;
  footer?: ReactNode;
}) {
  return (
    <Modal title={title} subtitle={subtitle} onClose={onClose} footer={footer}>
      <dl className="divide-y divide-[var(--color-card-border)]">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
            <dt className="text-sm text-[var(--color-accent-muted)]">{row.label}</dt>
            <dd className="text-sm font-medium text-[var(--color-text-primary)]">{row.value}</dd>
          </div>
        ))}
      </dl>
    </Modal>
  );
}
