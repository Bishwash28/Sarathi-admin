// ============================================================
// This file talks to whichever backend is active (see
// src/connection/index.ts) — it never hardcodes Supabase, MySQL, or
// MongoDB. You shouldn't need to edit this file when switching
// backends; it's prefixed c_ because it's the one place login/logout
// happens, so it's worth knowing about if something looks wrong.
// ============================================================
import { create } from "zustand";
import { dataProvider } from "../connection";

const TOKEN_KEY = "sarathi_admin_token";
const ADMIN_KEY = "sarathi_admin_user";

interface AdminUser {
  name: string;
  email: string;
}

interface AuthState {
  token: string | null;
  admin: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem(TOKEN_KEY),
  admin: JSON.parse(localStorage.getItem(ADMIN_KEY) ?? "null"),
  isAuthenticated: Boolean(localStorage.getItem(TOKEN_KEY)),
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });

    const session = await dataProvider.login(email, password);

    if (!session) {
      set({
        isLoading: false,
        error: dataProvider.isConfigured
          ? "Invalid email or password."
          : `${dataProvider.label} isn't configured yet — check .env, or set VITE_BACKEND=demo to use the fallback login.`,
      });
      return false;
    }

    localStorage.setItem(TOKEN_KEY, session.token);
    localStorage.setItem(ADMIN_KEY, JSON.stringify(session.admin));
    set({ token: session.token, admin: session.admin, isAuthenticated: true, isLoading: false });
    return true;
  },

  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(ADMIN_KEY);
    dataProvider.logout();
    set({ token: null, admin: null, isAuthenticated: false });
  },
}));
