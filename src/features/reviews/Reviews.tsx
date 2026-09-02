import { useEffect, useState } from "react";
import PageHeader from "../../components/ui/PageHeader";
import TableToolbar from "../../components/ui/TableToolbar";
import ListPageCard from "../../components/ui/ListPageCard";
import DataTable, { type Column } from "../../components/ui/DataTable";
import StatusBadge from "../../components/ui/StatusBadge";
import RatingStars from "../../components/ui/RatingStars";
import DetailModal from "../../components/ui/DetailModal";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import { Trash2 } from "lucide-react";
import { useProviderQuery } from "../../hooks/useProviderQuery";
import { useTableState } from "../../hooks/useTableState";
import { useToast } from "../../context/ToastContext";
import type { Review } from "../../types/entities";

export default function Reviews() {
  const { data: fetched, isLoading } = useProviderQuery((p) => p.getReviews());
  const [reviews, setReviews] = useState<Review[]>([]);
  useEffect(() => {
    if (fetched) setReviews(fetched);
  }, [fetched]);

  const [viewing, setViewing] = useState<Review | null>(null);
  const [deleting, setDeleting] = useState<Review | null>(null);
  const { showToast } = useToast();

  const table = useTableState(reviews, ["id", "bookingId", "reviewer", "reviewee", "comment"], "status");

  function handleDelete() {
    if (!deleting) return;
    setReviews((prev) => prev.filter((r) => r.id !== deleting.id));
    showToast(`Review ${deleting.id} removed.`, "info");
    setDeleting(null);
    setViewing(null);
  }

  const columns: Column<Review>[] = [
    { header: "Review ID", accessor: "id", render: (r) => <span className="font-medium text-[var(--color-text-primary)]">{r.id}</span> },
    { header: "Booking ID", accessor: "bookingId" },
    { header: "Reviewer", accessor: "reviewer" },
    { header: "Reviewee", accessor: "reviewee" },
    { header: "Rating", accessor: "rating", render: (r) => <RatingStars rating={r.rating} /> },
    {
      header: "Comment",
      accessor: "comment",
      render: (r) => (
        <button onClick={() => setViewing(r)} className="line-clamp-1 block max-w-[220px] text-left hover:underline">
          {r.comment}
        </button>
      ),
    },
    { header: "Status", accessor: "status", render: (r) => <StatusBadge status={r.status} /> },
    {
      header: "Actions",
      accessor: "id",
      render: (r) => (
        <button aria-label="Remove" onClick={() => setDeleting(r)} className="text-[var(--color-accent-muted)] hover:text-[var(--color-negative)]">
          <Trash2 className="h-4 w-4" />
        </button>
      ),
    },
  ];

  return (
    <div className="p-8">
      <PageHeader title="Reviews" description="Manage all user reviews and ratings." />
      <div className="mt-6">
        <ListPageCard
          page={table.page}
          totalPages={table.totalPages}
          totalRows={table.totalRows}
          pageSize={table.pageSize}
          onPageChange={table.setPage}
          toolbar={
            <TableToolbar
              searchPlaceholder="Search reviews..."
              searchValue={table.search}
              onSearchChange={table.onSearchChange}
              statusOptions={["Active", "Flagged"]}
              statusValue={table.status}
              onStatusChange={table.onStatusChange}
            />
          }
        >
          {isLoading && reviews.length === 0 ? (
            <p className="p-8 text-center text-sm text-[var(--color-accent-muted)]">Loading reviews…</p>
          ) : (
            <DataTable columns={columns} rows={table.paginated} />
          )}
        </ListPageCard>
      </div>

      {viewing && (
        <DetailModal
          title={viewing.id}
          subtitle={`${viewing.reviewer} → ${viewing.reviewee}`}
          onClose={() => setViewing(null)}
          rows={[
            { label: "Booking ID", value: viewing.bookingId },
            { label: "Rating", value: <RatingStars rating={viewing.rating} /> },
            { label: "Comment", value: viewing.comment },
            { label: "Date", value: viewing.date },
            { label: "Status", value: <StatusBadge status={viewing.status} /> },
          ]}
          footer={
            <button
              onClick={() => setDeleting(viewing)}
              className="rounded-lg border border-[var(--color-negative)] px-4 py-2.5 text-sm font-medium text-[var(--color-negative)] hover:bg-[var(--color-negative)]/5"
            >
              Remove Review
            </button>
          }
        />
      )}

      {deleting && (
        <ConfirmDialog
          title="Remove this review?"
          message="This will permanently remove the review from the platform."
          confirmLabel="Remove"
          onConfirm={handleDelete}
          onCancel={() => setDeleting(null)}
        />
      )}
    </div>
  );
}
