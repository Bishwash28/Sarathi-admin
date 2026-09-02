import { NavLink, useNavigate } from "react-router-dom";
import { LogOut, Navigation } from "lucide-react";
import { navItems } from "../../data/navigation";
import { useAuthStore } from "../../store/c_authStore";

export default function Sidebar() {
  const navigate = useNavigate();
  const logout = useAuthStore((s) => s.logout);

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-[var(--color-card-border)] bg-[var(--color-sidebar)]">
      {/* Brand */}
      <div className="flex items-center gap-3 px-6 py-6">
        <div className="flex h-12 w-12 items-center justify-center rounded-l">
          {/* <Navigation className="h-5 w-5 text-white" strokeWidth={2.5} /> */}
          <img src="/src/assets/Logo-sarathi.png" alt="logo" />
        </div>
        <div>
          <p className="text-base font-semibold leading-none text-[var(--color-text-primary)]">
            SARATHI
          </p>
          <p className="mt-1 text-xs text-[var(--color-accent-muted)]">
            Admin Panel
          </p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-2">
        {navItems.map(({ label, path, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            end={path === "/"}
            className={({ isActive }) =>
              [
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-[var(--color-accent)]/10 text-[var(--color-accent)] border-l-2 border-[var(--color-accent)] pl-[10px]"
                  : "text-[var(--color-accent-muted)] hover:bg-[var(--color-accent)]/5 hover:text-[var(--color-text-primary)]",
              ].join(" ")
            }
          >
            <Icon className="h-[18px] w-[18px]" strokeWidth={2} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="border-t border-[var(--color-card-border)] px-3 py-4">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-[var(--color-accent-muted)] transition-colors hover:bg-[var(--color-accent)]/5 hover:text-[var(--color-text-primary)]"
        >
          <LogOut className="h-[18px] w-[18px]" strokeWidth={2} />
          Logout
        </button>
      </div>
    </aside>
  );
}
