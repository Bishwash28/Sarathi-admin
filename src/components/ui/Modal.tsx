import type { ReactNode } from "react";
import { X } from "lucide-react";

export default function Modal({
  title,
  subtitle,
  onClose,
  children,
  footer,
}: {
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--color-text-primary)]/40 p-4">
      <div className="max-h-[85vh] w-full max-w-2xl overflow-hidden rounded-2xl border border-[var(--color-card-border)] bg-[var(--color-card)] shadow-xl">
        <div className="flex items-start justify-between border-b border-[var(--color-card-border)] px-6 py-4">
          <div>
            <h2 className="text-base font-semibold text-[var(--color-text-primary)]">{title}</h2>
            {subtitle && <p className="mt-0.5 text-sm text-[var(--color-accent-muted)]">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded-full p-1.5 text-[var(--color-accent-muted)] hover:bg-[var(--color-accent)]/5 hover:text-[var(--color-text-primary)]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto px-6 py-5">{children}</div>

        {footer && (
          <div className="flex items-center justify-end gap-3 border-t border-[var(--color-card-border)] px-6 py-4">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
