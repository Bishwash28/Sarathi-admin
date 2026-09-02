// ============================================================
// MySQL can't be queried directly from a browser (no MySQL driver runs
// in client-side JS, and you'd be exposing DB credentials if it could).
// So this provider talks to a small REST API instead — see
// c_server.example.js in this folder for a ready-to-run Express server
// that implements exactly the endpoints this file calls.
// ============================================================
import axios from "axios";
import type { DataProvider, DateRange, DashboardDataset, ReportsDataset, AdminSession } from "../types";

const baseURL = import.meta.env.VITE_API_BASE_URL ?? "";
const isConfigured = Boolean(baseURL);

const api = axios.create({ baseURL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("sarathi_admin_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

function warnNotConfigured(method: string) {
  console.warn(
    `[mysqlProvider] ${method} called but VITE_API_BASE_URL isn't set — add it to .env, and make sure your Express+MySQL server is running. See src/connection/mysql/README.md.`
  );
}

export const mysqlProvider: DataProvider = {
  id: "mysql",
  label: "MySQL",
  isConfigured,

  async login(email, password): Promise<AdminSession | null> {
    if (!isConfigured) return warnNotConfigured("login"), null;
    try {
      const { data } = await api.post("/auth/login", { email, password });
      return data; // expected shape: { token, admin: { name, email } }
    } catch {
      return null;
    }
  },

  async logout() {
    // Stateless JWT-style auth needs no server call — just drop the
    // token (already handled by the auth store). If you use sessions
    // instead, POST to /auth/logout here.
  },

  async getUsers() {
    if (!isConfigured) return warnNotConfigured("getUsers"), [];
    const { data } = await api.get("/users");
    return data;
  },
  async getRiders() {
    if (!isConfigured) return warnNotConfigured("getRiders"), [];
    const { data } = await api.get("/riders");
    return data;
  },
  async getPassengers() {
    if (!isConfigured) return warnNotConfigured("getPassengers"), [];
    const { data } = await api.get("/passengers");
    return data;
  },
  async getRides() {
    if (!isConfigured) return warnNotConfigured("getRides"), [];
    const { data } = await api.get("/rides");
    return data;
  },
  async getBookings() {
    if (!isConfigured) return warnNotConfigured("getBookings"), [];
    const { data } = await api.get("/bookings");
    return data;
  },
  async getPayments() {
    if (!isConfigured) return warnNotConfigured("getPayments"), [];
    const { data } = await api.get("/payments");
    return data;
  },
  async getReviews() {
    if (!isConfigured) return warnNotConfigured("getReviews"), [];
    const { data } = await api.get("/reviews");
    return data;
  },
  async getKycSubmissions() {
    if (!isConfigured) return warnNotConfigured("getKycSubmissions"), [];
    const { data } = await api.get("/kyc-submissions");
    return data;
  },
  async getDashboardData(range: DateRange): Promise<DashboardDataset> {
    if (!isConfigured) {
      warnNotConfigured("getDashboardData");
      return { statCards: [], rideStatistics: [], revenueOverview: [] };
    }
    const { data } = await api.get("/dashboard", { params: { range } });
    return data;
  },
  async getReportsData(): Promise<ReportsDataset> {
    if (!isConfigured) {
      warnNotConfigured("getReportsData");
      return { summary: [], ridesOverview: [], topRoutes: [], paymentMethods: [] };
    }
    const { data } = await api.get("/reports");
    return data;
  },
};
