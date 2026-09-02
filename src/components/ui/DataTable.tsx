import type { ReactNode } from "react";

export interface Column<T> {
  header: string;
  accessor: keyof T;
  render?: (row: T) => ReactNode;
}

export default function DataTable<T extends { id: string | number }>({
  columns,
  rows,
}: {
  columns: Column<T>[];
  rows: T[];
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead>
          <tr className="border-b border-[var(--color-card-border)] text-xs uppercase tracking-wide text-[var(--color-accent-muted)]">
            {columns.map((col) => (
              <th key={String(col.accessor)} className="px-5 py-3 font-medium">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.id}
              className="border-b border-[var(--color-card-border)] last:border-0 hover:bg-[var(--color-accent)]/[0.03]"
            >
              {columns.map((col) => (
                <td key={String(col.accessor)} className="px-5 py-3.5 text-[var(--color-text-primary)]">
                  {col.render ? col.render(row) : String(row[col.accessor] ?? "")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
