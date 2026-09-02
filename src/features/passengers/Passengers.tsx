import { useEffect, useState } from "react";
import PageHeader from "../../components/ui/PageHeader";
import TableToolbar from "../../components/ui/TableToolbar";
import ListPageCard from "../../components/ui/ListPageCard";
import DataTable, { type Column } from "../../components/ui/DataTable";
import StatusBadge from "../../components/ui/StatusBadge";
import RatingStars from "../../components/ui/RatingStars";
import FormModal, { type FormField } from "../../components/ui/FormModal";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import { Pencil, Trash2, Ban, ShieldCheck } from "lucide-react";
import { useProviderQuery } from "../../hooks/useProviderQuery";
import { useTableState } from "../../hooks/useTableState";
import { useToast } from "../../context/ToastContext";
import type { AppUser } from "../../types/entities";

const editFields: FormField[] = [
  { key: "name", label: "Full Name", required: true },
  { key: "email", label: "Email", type: "email", required: true },
  { key: "phone", label: "Phone", type: "tel", required: true },
];

export default function Passengers() {
  const { data: fetched, isLoading } = useProviderQuery((p) => p.getPassengers());
  const [passengers, setPassengers] = useState<AppUser[]>([]);
  useEffect(() => {
    if (fetched) setPassengers(fetched);
  }, [fetched]);

  const [editing, setEditing] = useState<AppUser | null>(null);
  const [deleting, setDeleting] = useState<AppUser | null>(null);
  const [suspending, setSuspending] = useState<AppUser | null>(null);
  const { showToast } = useToast();

  const table = useTableState(passengers, ["name", "email", "phone"], "status");

  function toggleSuspend() {
    if (!suspending) return;
    const nextStatus: AppUser["status"] = suspending.status === "Suspended" ? "Active" : "Suspended";
    setPassengers((prev) => prev.map((p) => (p.id === suspending.id ? { ...p, status: nextStatus } : p)));
    showToast(
      nextStatus === "Suspended" ? `${suspending.name} suspended.` : `${suspending.name} reactivated.`,
      nextStatus === "Suspended" ? "error" : "success"
    );
    setSuspending(null);
  }

  const columns: Column<AppUser>[] = [
    { header: "Passenger", accessor: "name", render: (r) => <span className="font-medium text-[var(--color-text-primary)]">{r.name}</span> },
    { header: "Email", accessor: "email" },
    { header: "Phone", accessor: "phone" },
    { header: "Rating", accessor: "rating", render: (r) => <RatingStars rating={r.rating} /> },
    { header: "Status", accessor: "status", render: (r) => <StatusBadge status={r.status} /> },
    { header: "Joined", accessor: "joinedDate" },
    {
      header: "Actions",
      accessor: "id",
      render: (r) => (
        <div className="flex items-center gap-3 text-[var(--color-accent-muted)]">
          <button aria-label="Edit" onClick={() => setEditing(r)} className="hover:text-[var(--color-text-primary)]">
            <Pencil className="h-4 w-4" />
          </button>
          <button
            aria-label={r.status === "Suspended" ? "Reactivate" : "Suspend"}
            onClick={() => setSuspending(r)}
            className={r.status === "Suspended" ? "hover:text-[var(--color-positive)]" : "hover:text-[var(--color-warning)]"}
          >
            {r.status === "Suspended" ? <ShieldCheck className="h-4 w-4" /> : <Ban className="h-4 w-4" />}
          </button>
          <button aria-label="Delete" onClick={() => setDeleting(r)} className="hover:text-[var(--color-negative)]">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  function handleEdit(values: Record<string, string>) {
    if (!editing) return;
    setPassengers((prev) => prev.map((p) => (p.id === editing.id ? { ...p, ...values } : p)));
    showToast(`${values.name} updated.`);
    setEditing(null);
  }

  function handleDelete() {
    if (!deleting) return;
    setPassengers((prev) => prev.filter((p) => p.id !== deleting.id));
    showToast(`${deleting.name} removed.`, "info");
    setDeleting(null);
  }

  return (
    <div className="p-8">
      <PageHeader title="Passengers" description="Registered directly from the app — manage their status here." />
      <div className="mt-6">
        <ListPageCard
          page={table.page}
          totalPages={table.totalPages}
          totalRows={table.totalRows}
          pageSize={table.pageSize}
          onPageChange={table.setPage}
          toolbar={
            <TableToolbar
              searchPlaceholder="Search passengers..."
              searchValue={table.search}
              onSearchChange={table.onSearchChange}
              statusOptions={["Active", "Pending", "Suspended"]}
              statusValue={table.status}
              onStatusChange={table.onStatusChange}
            />
          }
        >
          {isLoading && passengers.length === 0 ? (
            <p className="p-8 text-center text-sm text-[var(--color-accent-muted)]">Loading passengers…</p>
          ) : (
            <DataTable columns={columns} rows={table.paginated} />
          )}
        </ListPageCard>
      </div>

      {editing && (
        <FormModal
          title="Edit Passenger"
          fields={editFields}
          initialValues={{ name: editing.name, email: editing.email, phone: editing.phone }}
          submitLabel="Save Changes"
          onSubmit={handleEdit}
          onClose={() => setEditing(null)}
        />
      )}

      {suspending && (
        <ConfirmDialog
          title={suspending.status === "Suspended" ? "Reactivate this passenger?" : "Suspend this passenger?"}
          message={
            suspending.status === "Suspended"
              ? `${suspending.name} will regain access to the app.`
              : `${suspending.name} won't be able to book rides until reactivated. Use this for rule violations.`
          }
          confirmLabel={suspending.status === "Suspended" ? "Reactivate" : "Suspend"}
          danger={suspending.status !== "Suspended"}
          onConfirm={toggleSuspend}
          onCancel={() => setSuspending(null)}
        />
      )}

      {deleting && (
        <ConfirmDialog
          title="Remove passenger?"
          message={`This will permanently remove ${deleting.name}'s account. This action can't be undone.`}
          confirmLabel="Remove"
          onConfirm={handleDelete}
          onCancel={() => setDeleting(null)}
        />
      )}
    </div>
  );
}
