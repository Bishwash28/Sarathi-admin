import { useState, type FormEvent } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Navigation, Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useAuthStore } from "../../store/c_authStore";
import { dataProvider } from "../../connection";

export default function Login() {
  const [email, setEmail] = useState("admin@sarathi.com");
  const [password, setPassword] = useState("admin123");
  const [showPassword, setShowPassword] = useState(false);

  const login = useAuthStore((s) => s.login);
  const isLoading = useAuthStore((s) => s.isLoading);
  const error = useAuthStore((s) => s.error);

  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = (location.state as { from?: string })?.from ?? "/";

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const success = await login(email, password);
    if (success) navigate(redirectTo, { replace: true });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-sidebar)] px-4">
      <div className="w-full max-w-sm">
        {/* Brand */}
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-secondary)]">
            <Navigation className="h-6 w-6 text-white" strokeWidth={2.5} />
          </div>
          <p className="mt-4 text-xl font-semibold text-[var(--color-accent)]">SARATHI</p>
          <p className="text-sm text-[var(--color-accent-muted)]">Admin Panel</p>
        </div>

        <div className="rounded-2xl border border-[var(--color-card-border)] bg-[var(--color-card)] p-6">
          <div
            className={[
              "mb-4 flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium",
              dataProvider.isConfigured
                ? "bg-[var(--color-positive)]/10 text-[var(--color-positive)]"
                : "bg-[var(--color-warning)]/10 text-[var(--color-warning)]",
            ].join(" ")}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-current" />
            {dataProvider.isConfigured
              ? `Connected — ${dataProvider.label}`
              : `${dataProvider.label} not configured — using fallback login`}
          </div>

          <h1 className="text-lg font-semibold text-[var(--color-text-primary)]">Sign in</h1>
          <p className="mt-1 text-sm text-[var(--color-accent-muted)]">
            Enter your admin credentials to continue.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="text-xs font-medium text-[var(--color-accent-muted)]">Email</label>
              <div className="relative mt-1.5">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-accent-muted)]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded-lg border border-[var(--color-card-border)] bg-[var(--color-sidebar)] py-2.5 pl-10 pr-4 text-sm text-[var(--color-text-primary)] focus:border-[var(--color-accent)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-[var(--color-accent-muted)]">Password</label>
              <div className="relative mt-1.5">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-accent-muted)]" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full rounded-lg border border-[var(--color-card-border)] bg-[var(--color-sidebar)] py-2.5 pl-10 pr-10 text-sm text-[var(--color-text-primary)] focus:border-[var(--color-accent)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-accent-muted)] hover:text-[var(--color-text-primary)]"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <p className="rounded-lg bg-[var(--color-negative)]/10 px-3 py-2 text-xs text-[var(--color-negative)]">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-lg bg-[var(--color-accent)] py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>

        <p className="mt-4 text-center text-xs text-[var(--color-accent-muted)]">
          {dataProvider.isConfigured
            ? "Sign in with your real admin account."
            : "Fallback credentials pre-filled — see README.md to connect a real backend."}
        </p>
      </div>
    </div>
  );
}
