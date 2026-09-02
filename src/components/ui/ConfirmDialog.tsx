import { AlertTriangle } from "lucide-react";
import Modal from "./Modal";

export default function ConfirmDialog({
  title,
  message,
  confirmLabel = "Confirm",
  danger = true,
  onConfirm,
  onCancel,
}: {
  title: string;
  message: string;
  confirmLabel?: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <Modal
      title={title}
      onClose={onCancel}
      footer={
        <>
          <button
            onClick={onCancel}
            className="rounded-lg border border-[var(--color-card-border)] px-4 py-2.5 text-sm font-medium text-[var(--color-text-primary)] hover:bg-[var(--color-accent)]/5"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={[
              "rounded-lg px-4 py-2.5 text-sm font-medium text-white hover:opacity-90",
              danger ? "bg-[var(--color-negative)]" : "bg-[var(--color-accent)]",
            ].join(" ")}
          >
            {confirmLabel}
          </button>
        </>
      }
    >
      <div className="flex items-start gap-3">
        <div
          className={[
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
            danger ? "bg-[var(--color-negative)]/10" : "bg-[var(--color-accent)]/10",
          ].join(" ")}
        >
          <AlertTriangle className={`h-4 w-4 ${danger ? "text-[var(--color-negative)]" : "text-[var(--color-accent)]"}`} />
        </div>
        <p className="text-sm text-[var(--color-accent-muted)]">{message}</p>
      </div>
    </Modal>
  );
}
