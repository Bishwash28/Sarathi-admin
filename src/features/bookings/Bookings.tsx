import { useEffect, useState } from "react";
import PageHeader from "../../components/ui/PageHeader";
import TableToolbar from "../../components/ui/TableToolbar";
import ListPageCard from "../../components/ui/ListPageCard";
import DataTable, { type Column } from "../../components/ui/DataTable";
import StatusBadge from "../../components/ui/StatusBadge";
import DetailModal from "../../components/ui/DetailModal";
import { Eye } from "lucide-react";
import { useProviderQuery } from "../../hooks/useProviderQuery";
import { useTableState } from "../../hooks/useTableState";
import type { Booking } from "../../types/entities";

export default function Bookings() {
  const { data: fetched, isLoading } = useProviderQuery((p) => p.getBookings());
  const [bookings, setBookings] = useState<Booking[]>([]);
  useEffect(() => {
    if (fetched) setBookings(fetched);
  }, [fetched]);

  const [viewing, setViewing] = useState<Booking | null>(null);

  const table = useTableState(bookings, ["id", "rideId", "passengerName", "route"], "status");

  const columns: Column<Booking>[] = [
    { header: "Booking ID", accessor: "id", render: (r) => <span className="font-medium text-[var(--color-text-primary)]">{r.id}</span> },
    { header: "Ride ID", accessor: "rideId" },
    { header: "Passenger", accessor: "passengerName" },
    { header: "Route", accessor: "route" },
    { header: "Date & Time", accessor: "dateTime" },
    { header: "Payment", accessor: "payment", render: (r) => <StatusBadge status={r.payment} /> },
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

  return (
    <div className="p-8">
      <PageHeader title="Bookings" description="Manage all bookings across the platform." />
      <div className="mt-6">
        <ListPageCard
          page={table.page}
          totalPages={table.totalPages}
          totalRows={table.totalRows}
          pageSize={table.pageSize}
          onPageChange={table.setPage}
          toolbar={
            <TableToolbar
              searchPlaceholder="Search bookings..."
              searchValue={table.search}
              onSearchChange={table.onSearchChange}
              statusOptions={["Confirmed", "Pending", "Completed", "Cancelled"]}
              statusValue={table.status}
              onStatusChange={table.onStatusChange}
            />
          }
        >
          {isLoading && bookings.length === 0 ? (
            <p className="p-8 text-center text-sm text-[var(--color-accent-muted)]">Loading bookings…</p>
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
            { label: "Ride ID", value: viewing.rideId },
            { label: "Passenger", value: viewing.passengerName },
            { label: "Route", value: viewing.route },
            { label: "Date & Time", value: viewing.dateTime },
            { label: "Payment", value: <StatusBadge status={viewing.payment} /> },
            { label: "Status", value: <StatusBadge status={viewing.status} /> },
          ]}
        />
      )}
    </div>
  );
}
