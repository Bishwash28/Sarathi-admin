import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
import type { Rider, KycSubmission } from "../../types/entities";

const editFields: FormField[] = [
  { key: "name", label: "Full Name", required: true },
  { key: "email", label: "Email", type: "email", required: true },
  { key: "phone", label: "Phone", type: "tel", required: true },
  { key: "vehicle", label: "Vehicle", required: true },
  { key: "licenseNo", label: "License No.", required: true },
];

export default function Riders() {
  const { data: fetchedRiders, isLoading } = useProviderQuery((p) => p.getRiders());
  const { data: kycSubmissions } = useProviderQuery((p) => p.getKycSubmissions());
  const [riders, setRiders] = useState<Rider[]>([]);
  useEffect(() => {
    if (fetchedRiders) setRiders(fetchedRiders);
  }, [fetchedRiders]);

  const [editing, setEditing] = useState<Rider | null>(null);
  const [deleting, setDeleting] = useState<Rider | null>(null);
  const [suspending, setSuspending] = useState<Rider | null>(null);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const table = useTableState(riders, ["name", "email", "vehicle", "licenseNo"], "status");

  function docsCell(rider: Rider) {
    const hasKyc = (kycSubmissions ?? []).some((k: KycSubmission) => k.riderId === rider.id);
    if (rider.docsVerified) return <StatusBadge status="Verified" />;
    return (
      <button
        onClick={() => navigate(hasKyc ? `/kyc?rider=${rider.id}` : "/kyc")}
        className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-warning)]/10 px-2.5 py-1 text-xs font-medium text-[var(--color-warning)] hover:underline"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-current" />
        Pending — Review
      </button>
    );
  }

  function toggleSuspend() {
    if (!suspending) return;
    const nextStatus: Rider["status"] = suspending.status === "Suspended" ? "Active" : "Suspended";
    setRiders((prev) => prev.map((r) => (r.id === suspending.id ? { ...r, status: nextStatus } : r)));
    showToast(
      nextStatus === "Suspended" ? `${suspending.name} suspended.` : `${suspending.name} reactivated.`,
      nextStatus === "Suspended" ? "error" : "success"
    );
    setSuspending(null);
  }

  const columns: Column<Rider>[] = [
    { header: "Rider", accessor: "name", render: (r) => <span className="font-medium text-[var(--color-text-primary)]">{r.name}</span> },
    { header: "Vehicle", accessor: "vehicle" },
    { header: "License No.", accessor: "licenseNo" },
    { header: "Rating", accessor: "rating", render: (r) => <RatingStars rating={r.rating} /> },
    { header: "Docs", accessor: "docsVerified", render: docsCell },
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
    setRiders((prev) => prev.map((r) => (r.id === editing.id ? { ...r, ...values } : r)));
    showToast(`${values.name} updated.`);
    setEditing(null);
  }

  function handleDelete() {
    if (!deleting) return;
    setRiders((prev) => prev.filter((r) => r.id !== deleting.id));
    showToast(`${deleting.name} removed.`, "info");
    setDeleting(null);
  }

  return (
    <div className="p-8">
      <PageHeader title="Riders" description="Automatically added once KYC is approved — manage status here." />
      <div className="mt-6">
        <ListPageCard
          page={table.page}
          totalPages={table.totalPages}
          totalRows={table.totalRows}
          pageSize={table.pageSize}
          onPageChange={table.setPage}
          toolbar={
            <TableToolbar
              searchPlaceholder="Search riders..."
              searchValue={table.search}
              onSearchChange={table.onSearchChange}
              statusOptions={["Active", "Pending", "Suspended"]}
              statusValue={table.status}
              onStatusChange={table.onStatusChange}
            />
          }
        >
          {isLoading && riders.length === 0 ? (
            <p className="p-8 text-center text-sm text-[var(--color-accent-muted)]">Loading riders…</p>
          ) : (
            <DataTable columns={columns} rows={table.paginated} />
          )}
        </ListPageCard>
      </div>

      {editing && (
        <FormModal
          title="Edit Rider"
          fields={editFields}
          initialValues={{
            name: editing.name,
            email: editing.email,
            phone: editing.phone,
            vehicle: editing.vehicle,
            licenseNo: editing.licenseNo,
          }}
          submitLabel="Save Changes"
          onSubmit={handleEdit}
          onClose={() => setEditing(null)}
        />
      )}

      {suspending && (
        <ConfirmDialog
          title={suspending.status === "Suspended" ? "Reactivate this rider?" : "Suspend this rider?"}
          message={
            suspending.status === "Suspended"
              ? `${suspending.name} will be able to publish rides again.`
              : `${suspending.name} won't be able to publish or accept rides until reactivated. Use this for rule violations.`
          }
          confirmLabel={suspending.status === "Suspended" ? "Reactivate" : "Suspend"}
          danger={suspending.status !== "Suspended"}
          onConfirm={toggleSuspend}
          onCancel={() => setSuspending(null)}
        />
      )}

      {deleting && (
        <ConfirmDialog
          title="Remove rider?"
          message={`This will permanently remove ${deleting.name}'s account. This action can't be undone.`}
          confirmLabel="Remove"
          onConfirm={handleDelete}
          onCancel={() => setDeleting(null)}
        />
      )}
    </div>
  );
}
