import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Check, X, FileText } from "lucide-react";
import PageHeader from "../../components/ui/PageHeader";
import TableToolbar from "../../components/ui/TableToolbar";
import StatusBadge from "../../components/ui/StatusBadge";
import Modal from "../../components/ui/Modal";
import { useProviderQuery } from "../../hooks/useProviderQuery";
import { useTableState } from "../../hooks/useTableState";
import { useToast } from "../../context/ToastContext";
import type { KycSubmission } from "../../types/entities";

export default function KycVerification() {
  const { data: fetched, isLoading } = useProviderQuery((p) => p.getKycSubmissions());
  const [submissions, setSubmissions] = useState<KycSubmission[]>([]);
  useEffect(() => {
    if (fetched) setSubmissions(fetched);
  }, [fetched]);

  const [active, setActive] = useState<KycSubmission | null>(null);
  const [searchParams] = useSearchParams();
  const { showToast } = useToast();

  const table = useTableState(submissions, ["riderName", "vehicle", "id"], "status");

  // Deep link from the Riders page (?rider=U-8499) opens that rider's
  // review modal automatically, once the submissions have loaded.
  useEffect(() => {
    const riderId = searchParams.get("rider");
    if (riderId && submissions.length > 0) {
      const match = submissions.find((s) => s.riderId === riderId);
      if (match) setActive(match);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, submissions]);

  function updateStatus(id: string, status: KycSubmission["status"]) {
    setSubmissions((prev) => prev.map((s) => (s.id === id ? { ...s, status } : s)));
    showToast(
      status === "Verified" ? "Rider documents approved." : "Rider documents rejected.",
      status === "Verified" ? "success" : "error"
    );
    setActive(null);
    // This is still a local-state update — wire it to a real write once
    // your backend supports it (e.g. Supabase: supabase.from("kyc_submissions")
    // .update({ status }).eq("id", id), then also flip the rider's
    // docs_verified flag so the Riders page reflects it). See
    // src/connection/*/README.md for each backend's suggested schema.
  }

  const pendingCount = submissions.filter((s) => s.status === "Pending").length;

  return (
    <div className="p-8">
      <PageHeader
        title="KYC Verification"
        description={`Review rider identity and vehicle documents before approval. ${pendingCount} pending.`}
      />

      <div className="mt-6">
        <div className="rounded-2xl border border-[var(--color-card-border)] bg-[var(--color-card)]">
          <div className="p-5">
            <TableToolbar
              searchPlaceholder="Search by rider name..."
              searchValue={table.search}
              onSearchChange={table.onSearchChange}
              statusOptions={["Pending", "Verified", "Rejected"]}
              statusValue={table.status}
              onStatusChange={table.onStatusChange}
            />
          </div>

          {isLoading && submissions.length === 0 ? (
            <p className="p-8 text-center text-sm text-[var(--color-accent-muted)]">Loading submissions…</p>
          ) : (
            <div className="grid gap-4 p-5 pt-0 sm:grid-cols-2 xl:grid-cols-3">
              {table.paginated.map((submission) => (
                <button
                  key={submission.id}
                  onClick={() => setActive(submission)}
                  className="flex flex-col items-start rounded-xl border border-[var(--color-card-border)] p-4 text-left transition-colors hover:border-[var(--color-accent)]"
                >
                  <div className="flex w-full items-start justify-between">
                    <div>
                      <p className="font-medium text-[var(--color-text-primary)]">{submission.riderName}</p>
                      <p className="mt-0.5 text-xs text-[var(--color-accent-muted)]">{submission.vehicle}</p>
                    </div>
                    <StatusBadge status={submission.status} />
                  </div>

                  <div className="mt-3 flex items-center gap-1.5 text-xs text-[var(--color-accent-muted)]">
                    <FileText className="h-3.5 w-3.5" />
                    {submission.documents.length} documents · Submitted {submission.submittedDate}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {active && (
        <Modal
          title={active.riderName}
          subtitle={`${active.vehicle} · Submitted ${active.submittedDate}`}
          onClose={() => setActive(null)}
          footer={
            active.status === "Pending" ? (
              <>
                <button
                  onClick={() => updateStatus(active.id, "Rejected")}
                  className="flex items-center gap-2 rounded-lg border border-[var(--color-negative)] px-4 py-2.5 text-sm font-medium text-[var(--color-negative)] hover:bg-[var(--color-negative)]/5"
                >
                  <X className="h-4 w-4" />
                  Reject
                </button>
                <button
                  onClick={() => updateStatus(active.id, "Verified")}
                  className="flex items-center gap-2 rounded-lg bg-[var(--color-positive)] px-4 py-2.5 text-sm font-medium text-white hover:opacity-90"
                >
                  <Check className="h-4 w-4" />
                  Approve
                </button>
              </>
            ) : (
              <StatusBadge status={active.status} />
            )
          }
        >
          <div className="grid gap-4 sm:grid-cols-2">
            {active.documents.map((doc) => (
              <div key={doc.label}>
                <p className="mb-2 text-xs font-medium text-[var(--color-accent-muted)]">{doc.label}</p>
                <img
                  src={doc.imageUrl}
                  alt={doc.label}
                  className="w-full rounded-lg border border-[var(--color-card-border)] object-cover"
                />
              </div>
            ))}
          </div>
        </Modal>
      )}
    </div>
  );
}
