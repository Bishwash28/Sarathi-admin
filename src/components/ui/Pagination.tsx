import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({
  page,
  totalPages,
  totalRows,
  pageSize,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  totalRows: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}) {
  const start = totalRows === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, totalRows);
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).slice(0, 5);

  return (
    <div className="flex items-center justify-between border-t border-[var(--color-card-border)] px-5 py-4 text-sm text-[var(--color-accent-muted)]">
      <span>
        Showing {start} to {end} of {totalRows} results
      </span>

      <div className="flex items-center gap-1">
        <button
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
          className="rounded-md p-1.5 hover:bg-[var(--color-accent)]/5 disabled:opacity-30"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        {pages.map((p) => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={[
              "h-8 w-8 rounded-md text-sm",
              p === page
                ? "bg-[var(--color-accent)] text-white"
                : "text-[var(--color-accent-muted)] hover:bg-[var(--color-accent)]/5",
            ].join(" ")}
          >
            {p}
          </button>
        ))}
        <button
          disabled={page === totalPages}
          onClick={() => onPageChange(page + 1)}
          className="rounded-md p-1.5 hover:bg-[var(--color-accent)]/5 disabled:opacity-30"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
