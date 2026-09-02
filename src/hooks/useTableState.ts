import { useMemo, useState } from "react";

const PAGE_SIZE = 6;

export function useTableState<T extends Record<string, any>>(
  rows: T[],
  searchKeys: (keyof T)[],
  statusKey?: keyof T
) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All Status");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let result = rows;

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter((row) =>
        searchKeys.some((key) => String(row[key] ?? "").toLowerCase().includes(q))
      );
    }

    if (statusKey && status !== "All Status") {
      result = result.filter((row) => String(row[statusKey]) === status);
    }

    return result;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows, search, status]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  function onSearchChange(value: string) {
    setSearch(value);
    setPage(1);
  }

  function onStatusChange(value: string) {
    setStatus(value);
    setPage(1);
  }

  return {
    search,
    status,
    page: safePage,
    totalPages,
    totalRows: filtered.length,
    pageSize: PAGE_SIZE,
    paginated,
    onSearchChange,
    onStatusChange,
    setPage,
  };
}
