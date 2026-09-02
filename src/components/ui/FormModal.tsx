import { useState } from "react";
import Modal from "./Modal";

export interface FormField {
  key: string;
  label: string;
  type?: "text" | "email" | "tel" | "select";
  options?: string[];
  required?: boolean;
}

export default function FormModal({
  title,
  subtitle,
  fields,
  initialValues,
  submitLabel = "Save",
  onSubmit,
  onClose,
}: {
  title: string;
  subtitle?: string;
  fields: FormField[];
  initialValues?: Record<string, string>;
  submitLabel?: string;
  onSubmit: (values: Record<string, string>) => void;
  onClose: () => void;
}) {
  const [values, setValues] = useState<Record<string, string>>(
    initialValues ?? Object.fromEntries(fields.map((f) => [f.key, f.options?.[0] ?? ""]))
  );

  function handleChange(key: string, value: string) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <Modal
      title={title}
      subtitle={subtitle}
      onClose={onClose}
      footer={
        <>
          <button
            onClick={onClose}
            className="rounded-lg border border-[var(--color-card-border)] px-4 py-2.5 text-sm font-medium text-[var(--color-text-primary)] hover:bg-[var(--color-accent)]/5"
          >
            Cancel
          </button>
          <button
            onClick={() => onSubmit(values)}
            className="rounded-lg bg-[var(--color-accent)] px-4 py-2.5 text-sm font-medium text-white hover:opacity-90"
          >
            {submitLabel}
          </button>
        </>
      }
    >
      <div className="space-y-4">
        {fields.map((field) => (
          <div key={field.key}>
            <label className="text-xs font-medium text-[var(--color-accent-muted)]">{field.label}</label>
            {field.type === "select" ? (
              <select
                value={values[field.key] ?? ""}
                onChange={(e) => handleChange(field.key, e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-[var(--color-card-border)] bg-[var(--color-sidebar)] px-3 py-2.5 text-sm text-[var(--color-text-primary)] focus:border-[var(--color-accent)] focus:outline-none"
              >
                {field.options?.map((opt) => (
                  <option key={opt}>{opt}</option>
                ))}
              </select>
            ) : (
              <input
                type={field.type ?? "text"}
                required={field.required}
                value={values[field.key] ?? ""}
                onChange={(e) => handleChange(field.key, e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-[var(--color-card-border)] bg-[var(--color-sidebar)] px-3 py-2.5 text-sm text-[var(--color-text-primary)] focus:border-[var(--color-accent)] focus:outline-none"
              />
            )}
          </div>
        ))}
      </div>
    </Modal>
  );
}
