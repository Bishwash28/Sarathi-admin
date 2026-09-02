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
  { key: "role", label: "Role", type: "select", options: ["Rider", "Passenger"] },
];

export default function Users() {
  // Fetched via whichever backend is active (see src/connection) — falls
  // into local state so the demo Edit/Suspend/Delete actions below can
  // still mutate it instantly. Wire those to real writes the same way
  // once your backend supports them (see providerTypes/connection README).
  const { data: fetched, isLoading } = useProviderQuery((p) => p.getUsers());
  const [users, setUsers] = useState<AppUser[]>([]);
  useEffect(() => {
    if (fetched) setUsers(fetched);
  }, [fetched]);

  const [editing, setEditing] = useState<AppUser | null>(null);
  const [deleting, setDeleting] = useState<AppUser | null>(null);
  const [suspending, setSuspending] = useState<AppUser | null>(null);
  const { showToast } = useToast();

  const table = useTableState(users, ["name", "email", "phone"], "status");

  function toggleSuspend() {
    if (!suspending) return;
    const nextStatus: AppUser["status"] = suspending.status === "Suspended" ? "Active" : "Suspended";
    setUsers((prev) => prev.map((u) => (u.id === suspending.id ? { ...u, status: nextStatus } : u)));
    showToast(
      nextStatus === "Suspended" ? `${suspending.name} suspended.` : `${suspending.name} reactivated.`,
      nextStatus === "Suspended" ? "error" : "success"
    );
    setSuspending(null);
  }

  const columns: Column<AppUser>[] = [
    { header: "Name", accessor: "name", render: (r) => <span className="font-medium text-[var(--color-text-primary)]">{r.name}</span> },
    { header: "Email", accessor: "email" },
    { header: "Phone", accessor: "phone" },
    { header: "Role", accessor: "role" },
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
    setUsers((prev) =>
      prev.map((u) => (u.id === editing.id ? { ...u, ...values, role: values.role as AppUser["role"] } : u))
    );
    showToast(`${values.name} updated.`);
    setEditing(null);
  }

  function handleDelete() {
    if (!deleting) return;
    setUsers((prev) => prev.filter((u) => u.id !== deleting.id));
    showToast(`${deleting.name} removed.`, "info");
    setDeleting(null);
  }

  return (
    <div className="p-8">
      <PageHeader title="Users" description="Riders and passengers register from the app — manage their status here." />
      <div className="mt-6">
        <ListPageCard
          page={table.page}
          totalPages={table.totalPages}
          totalRows={table.totalRows}
          pageSize={table.pageSize}
          onPageChange={table.setPage}
          toolbar={
            <TableToolbar
              searchPlaceholder="Search users..."
              searchValue={table.search}
              onSearchChange={table.onSearchChange}
              statusOptions={["Active", "Pending", "Suspended"]}
              statusValue={table.status}
              onStatusChange={table.onStatusChange}
            />
          }
        >
          {isLoading && users.length === 0 ? (
            <p className="p-8 text-center text-sm text-[var(--color-accent-muted)]">Loading users…</p>
          ) : (
            <DataTable columns={columns} rows={table.paginated} />
          )}
        </ListPageCard>
      </div>

      {editing && (
        <FormModal
          title="Edit User"
          fields={editFields}
          initialValues={{ name: editing.name, email: editing.email, phone: editing.phone, role: editing.role }}
          submitLabel="Save Changes"
          onSubmit={handleEdit}
          onClose={() => setEditing(null)}
        />
      )}

      {suspending && (
        <ConfirmDialog
          title={suspending.status === "Suspended" ? "Reactivate this user?" : "Suspend this user?"}
          message={
            suspending.status === "Suspended"
              ? `${suspending.name} will regain access to the app.`
              : `${suspending.name} won't be able to use the app until reactivated. Use this for rule violations.`
          }
          confirmLabel={suspending.status === "Suspended" ? "Reactivate" : "Suspend"}
          danger={suspending.status !== "Suspended"}
          onConfirm={toggleSuspend}
          onCancel={() => setSuspending(null)}
        />
      )}

      {deleting && (
        <ConfirmDialog
          title="Remove user?"
          message={`This will permanently remove ${deleting.name}'s account. This action can't be undone.`}
          confirmLabel="Remove"
          onConfirm={handleDelete}
          onCancel={() => setDeleting(null)}
        />
      )}
    </div>
  );
}
