import { useEffect, useState } from "react";
import PageHeader from "../../components/ui/PageHeader";
import TableToolbar from "../../components/ui/TableToolbar";
import ListPageCard from "../../components/ui/ListPageCard";
import DataTable, { type Column } from "../../components/ui/DataTable";
import StatusBadge from "../../components/ui/StatusBadge";
import DetailModal from "../../components/ui/DetailModal";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import { Eye } from "lucide-react";
import { useProviderQuery } from "../../hooks/useProviderQuery";
import { useTableState } from "../../hooks/useTableState";
import { useToast } from "../../context/ToastContext";
import type { Ride } from "../../types/entities";

export default function Rides() {
  const { data: fetched, isLoading } = useProviderQuery((p) => p.getRides());
  const [rides, setRides] = useState<Ride[]>([]);
  useEffect(() => {
    if (fetched) setRides(fetched);
  }, [fetched]);

  const [viewing, setViewing] = useState<Ride | null>(null);
  const [cancelling, setCancelling] = useState<Ride | null>(null);
  const { showToast } = useToast();

  const table = useTableState(rides, ["id", "riderName", "route"], "status");

  const columns: Column<Ride>[] = [
    { header: "Ride ID", accessor: "id", render: (r) => <span className="font-medium text-[var(--color-text-primary)]">{r.id}</span> },
    { header: "Rider", accessor: "riderName" },
    { header: "Route", accessor: "route" },
    { header: "Date & Time", accessor: "dateTime" },
    { header: "Seats", accessor: "seats" },
    { header: "Fare", accessor: "fare", render: (r) => `NPR ${r.fare}` },
    { header: "Status", accessor: "status", render: (r) => <StatusBadge status={r.status} /> },
    {
      header: "Actions",
      accessor: "id",
      render: (r) => (
        <button aria-label="View" onClick={() => setViewing(r)} className="text-[var(--color-accent-muted)] hover:text-[var(--color-text-primary)]">
          <Eye className="h-4 w-4" />
        </button>
      ),
    },
  ];

  function handleCancel() {
    if (!cancelling) return;
    setRides((prev) => prev.map((r) => (r.id === cancelling.id ? { ...r, status: "Cancelled" } : r)));
    showToast(`Ride ${cancelling.id} cancelled.`, "info");
    setCancelling(null);
    setViewing(null);
  }

  return (
    <div className="p-8">
      <PageHeader title="Rides" description="Manage all rides created by riders." />
      <div className="mt-6">
        <ListPageCard
          page={table.page}
          totalPages={table.totalPages}
          totalRows={table.totalRows}
          pageSize={table.pageSize}
          onPageChange={table.setPage}
          toolbar={
            <TableToolbar
              searchPlaceholder="Search rides..."
              searchValue={table.search}
              onSearchChange={table.onSearchChange}
              statusOptions={["Active", "Ongoing", "Completed", "Cancelled"]}
              statusValue={table.status}
              onStatusChange={table.onStatusChange}
            />
          }
        >
          {isLoading && rides.length === 0 ? (
            <p className="p-8 text-center text-sm text-[var(--color-accent-muted)]">Loading rides…</p>
          ) : (
            <DataTable columns={columns} rows={table.paginated} />
          )}
        </ListPageCard>
      </div>

      {viewing && (
        <DetailModal
          title={viewing.id}
          subtitle={viewing.route}
          onClose={() => setViewing(null)}
          rows={[
            { label: "Rider", value: viewing.riderName },
            { label: "Route", value: viewing.route },
            { label: "Date & Time", value: viewing.dateTime },
            { label: "Seats Available", value: viewing.seats },
            { label: "Fare per Seat", value: `NPR ${viewing.fare}` },
            { label: "Status", value: <StatusBadge status={viewing.status} /> },
          ]}
          footer={
            viewing.status !== "Cancelled" && viewing.status !== "Completed" ? (
              <button
                onClick={() => setCancelling(viewing)}
                className="rounded-lg border border-[var(--color-negative)] px-4 py-2.5 text-sm font-medium text-[var(--color-negative)] hover:bg-[var(--color-negative)]/5"
              >
                Cancel Ride
              </button>
            ) : undefined
          }
        />
      )}

      {cancelling && (
        <ConfirmDialog
          title="Cancel this ride?"
          message={`This will mark ${cancelling.id} as cancelled and notify booked passengers.`}
          confirmLabel="Cancel Ride"
          onConfirm={handleCancel}
          onCancel={() => setCancelling(null)}
        />
      )}
    </div>
  );
}
