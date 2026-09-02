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
import type { Payment } from "../../types/entities";

export default function Payments() {
  const { data: fetched, isLoading } = useProviderQuery((p) => p.getPayments());
  const [payments, setPayments] = useState<Payment[]>([]);
  useEffect(() => {
    if (fetched) setPayments(fetched);
  }, [fetched]);

  const [viewing, setViewing] = useState<Payment | null>(null);

  const table = useTableState(payments, ["id", "bookingId", "transactionId"], "status");

  const columns: Column<Payment>[] = [
    { header: "Payment ID", accessor: "id", render: (r) => <span className="font-medium text-[var(--color-text-primary)]">{r.id}</span> },
    { header: "Booking ID", accessor: "bookingId" },
    { header: "Amount", accessor: "amount", render: (r) => `NPR ${r.amount}` },
    { header: "Method", accessor: "method" },
    { header: "Transaction ID", accessor: "transactionId" },
    { header: "Date & Time", accessor: "dateTime" },
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
      <PageHeader title="Payments" description="Track all payments and transactions." />
      <div className="mt-6">
        <ListPageCard
          page={table.page}
          totalPages={table.totalPages}
          totalRows={table.totalRows}
          pageSize={table.pageSize}
          onPageChange={table.setPage}
          toolbar={
            <TableToolbar
              searchPlaceholder="Search payments..."
              searchValue={table.search}
              onSearchChange={table.onSearchChange}
              statusOptions={["Completed", "Pending", "Failed"]}
              statusValue={table.status}
              onStatusChange={table.onStatusChange}
            />
          }
        >
          {isLoading && payments.length === 0 ? (
            <p className="p-8 text-center text-sm text-[var(--color-accent-muted)]">Loading payments…</p>
          ) : (
            <DataTable columns={columns} rows={table.paginated} />
          )}
        </ListPageCard>
      </div>

      {viewing && (
        <DetailModal
          title={viewing.id}
          subtitle={`Booking ${viewing.bookingId}`}
          onClose={() => setViewing(null)}
          rows={[
            { label: "Booking ID", value: viewing.bookingId },
            { label: "Amount", value: `NPR ${viewing.amount}` },
            { label: "Method", value: viewing.method },
            { label: "Transaction ID", value: viewing.transactionId },
            { label: "Date & Time", value: viewing.dateTime },
            { label: "Status", value: <StatusBadge status={viewing.status} /> },
          ]}
        />
      )}
    </div>
  );
}
