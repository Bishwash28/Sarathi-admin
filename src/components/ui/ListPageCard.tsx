import type { ReactNode } from "react";
import Pagination from "./Pagination";

export default function ListPageCard({
  toolbar,
  children,
  page,
  totalPages,
  totalRows,
  pageSize,
  onPageChange,
}: {
  toolbar: ReactNode;
  children: ReactNode;
  page: number;
  totalPages: number;
  totalRows: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}) {
  return (
    <div className="rounded-2xl border border-[var(--color-card-border)] bg-[var(--color-card)]">
      <div className="p-5">{toolbar}</div>
      {children}
      <Pagination
        page={page}
        totalPages={totalPages}
        totalRows={totalRows}
        pageSize={pageSize}
        onPageChange={onPageChange}
      />
    </div>
  );
}
