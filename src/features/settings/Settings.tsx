import PageHeader from "../../components/ui/PageHeader";

export default function Settings() {
  return (
    <div className="p-8">
      <PageHeader title="Settings" description="Manage your admin profile and preferences." />

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-[var(--color-card-border)] bg-[var(--color-card)] p-6">
          <h3 className="text-base font-semibold text-[var(--color-text-primary)]">Profile</h3>
          <div className="mt-5 space-y-4">
            <div>
              <label className="text-xs font-medium text-[var(--color-accent-muted)]">Full Name</label>
              <input
                defaultValue="Admin User"
                className="mt-1.5 w-full rounded-lg border border-[var(--color-card-border)] bg-[var(--color-sidebar)] px-3 py-2.5 text-sm text-[var(--color-text-primary)] focus:border-[var(--color-accent)] focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-[var(--color-accent-muted)]">Email</label>
              <input
                defaultValue="admin@sarathi.com"
                className="mt-1.5 w-full rounded-lg border border-[var(--color-card-border)] bg-[var(--color-sidebar)] px-3 py-2.5 text-sm text-[var(--color-text-primary)] focus:border-[var(--color-accent)] focus:outline-none"
              />
            </div>
            <button className="rounded-lg bg-[var(--color-accent)] px-4 py-2.5 text-sm font-medium text-white hover:opacity-90">
              Save Changes
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--color-card-border)] bg-[var(--color-card)] p-6">
          <h3 className="text-base font-semibold text-[var(--color-text-primary)]">Change Password</h3>
          <div className="mt-5 space-y-4">
            <div>
              <label className="text-xs font-medium text-[var(--color-accent-muted)]">Current Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="mt-1.5 w-full rounded-lg border border-[var(--color-card-border)] bg-[var(--color-sidebar)] px-3 py-2.5 text-sm text-[var(--color-text-primary)] focus:border-[var(--color-accent)] focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-[var(--color-accent-muted)]">New Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="mt-1.5 w-full rounded-lg border border-[var(--color-card-border)] bg-[var(--color-sidebar)] px-3 py-2.5 text-sm text-[var(--color-text-primary)] focus:border-[var(--color-accent)] focus:outline-none"
              />
            </div>
            <button className="rounded-lg border border-[var(--color-card-border)] px-4 py-2.5 text-sm font-medium text-[var(--color-text-primary)] hover:bg-[var(--color-accent)]/5">
              Update Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
