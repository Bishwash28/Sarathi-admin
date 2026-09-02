import { createClient } from "@supabase/supabase-js";
import type { DataProvider, DateRange, DashboardDataset, ReportsDataset, AdminSession } from "../types";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ?? "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? "";
const isConfigured = Boolean(supabaseUrl && supabaseAnonKey);

const supabase = isConfigured ? createClient(supabaseUrl, supabaseAnonKey) : null;

function warnNotConfigured(method: string) {
  console.warn(
    `[supabaseProvider] ${method} called but Supabase isn't configured — add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env. See src/connection/supabase/README.md.`
  );
}

export const supabaseProvider: DataProvider = {
  id: "supabase",
  label: "Supabase",
  isConfigured,

  async login(email, password): Promise<AdminSession | null> {
    if (!supabase) {
      warnNotConfigured("login");
      return null;
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error || !data.session) return null;

    // Confirm this account has role = 'Admin' in the same `users` table
    // riders/passengers live in — there's no separate admins table. See
    // README.md for the schema.
    const { data: userRow, error: roleError } = await supabase
      .from("users")
      .select("name, email, role")
      .eq("id", data.user.id)
      .single();

    if (roleError || !userRow || userRow.role !== "Admin") {
      await supabase.auth.signOut();
      return null;
    }

    return { token: data.session.access_token, admin: { name: userRow.name, email: userRow.email } };
  },

  async logout() {
    if (supabase) await supabase.auth.signOut();
  },

  async getUsers() {
    if (!supabase) return warnNotConfigured("getUsers"), [];
    // Exclude the Admin row(s) — this list is for managing riders/passengers.
    const { data } = await supabase.from("users").select("*").neq("role", "Admin");
    return data ?? [];
  },
  async getRiders() {
    if (!supabase) return warnNotConfigured("getRiders"), [];
    const { data } = await supabase.from("riders").select("*");
    return data ?? [];
  },
  async getPassengers() {
    if (!supabase) return warnNotConfigured("getPassengers"), [];
    const { data } = await supabase.from("users").select("*").eq("role", "Passenger");
    return data ?? [];
  },
  async getRides() {
    if (!supabase) return warnNotConfigured("getRides"), [];
    const { data } = await supabase.from("rides").select("*");
    return data ?? [];
  },
  async getBookings() {
    if (!supabase) return warnNotConfigured("getBookings"), [];
    const { data } = await supabase.from("bookings").select("*");
    return data ?? [];
  },
  async getPayments() {
    if (!supabase) return warnNotConfigured("getPayments"), [];
    const { data } = await supabase.from("payments").select("*");
    return data ?? [];
  },
  async getReviews() {
    if (!supabase) return warnNotConfigured("getReviews"), [];
    const { data } = await supabase.from("reviews").select("*");
    return data ?? [];
  },
  async getKycSubmissions() {
    if (!supabase) return warnNotConfigured("getKycSubmissions"), [];
    // Real setup: join kyc_submissions + kyc_documents, and generate a
    // signed URL per document from a private Storage bucket rather than
    // storing public imageUrls. See README.md for the schema.
    const { data } = await supabase.from("kyc_submissions").select("*, documents:kyc_documents(*)");
    return data ?? [];
  },
  async getDashboardData(range: DateRange): Promise<DashboardDataset> {
    if (!supabase) {
      warnNotConfigured("getDashboardData");
      return { statCards: [], rideStatistics: [], revenueOverview: [] };
    }
    // Real setup: call a Postgres function/RPC that aggregates by range,
    // e.g. supabase.rpc('dashboard_stats', { range }). Stubbed here.
    const { data } = await supabase.rpc("dashboard_stats", { range });
    return data ?? { statCards: [], rideStatistics: [], revenueOverview: [] };
  },
  async getReportsData(): Promise<ReportsDataset> {
    if (!supabase) {
      warnNotConfigured("getReportsData");
      return { summary: [], ridesOverview: [], topRoutes: [], paymentMethods: [] };
    }
    const { data } = await supabase.rpc("reports_summary");
    return data ?? { summary: [], ridesOverview: [], topRoutes: [], paymentMethods: [] };
  },
};
