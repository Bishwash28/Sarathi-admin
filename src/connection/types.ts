import type { AppUser, Rider, Ride, Booking, Payment, Review, KycSubmission } from "../types/entities";

export type DateRange = "Today" | "7D" | "30D" | "YTD";

export interface StatCard {
  label: string;
  value: string;
  trend: string;
  trendDirection: "up" | "down";
}

export interface DashboardDataset {
  statCards: StatCard[];
  rideStatistics: { day: string; completed: number; requested: number }[];
  revenueOverview: { month: string; revenue: number }[];
}

export interface ReportsDataset {
  summary: StatCard[];
  ridesOverview: { day: string; requested: number; completed: number }[];
  topRoutes: { name: string; value: number; color: string }[];
  paymentMethods: { name: string; value: number; color: string }[];
}

export interface AdminSession {
  token: string;
  admin: { name: string; email: string };
}

/**
 * Every backend under src/connection/<name>/provider.ts implements this
 * interface exactly. Pages only ever import `dataProvider` from
 * src/connection/index.ts — they never know or care which backend is
 * actually running underneath. That's what makes switching backends a
 * one-line .env change instead of a rewrite.
 */
export interface DataProvider {
  id: "demo" | "supabase" | "mysql" | "mongodb";
  label: string;
  /** Whether this backend has real credentials configured (env vars set).
   *  Demo is always true. Others are false until you add your .env values. */
  isConfigured: boolean;

  login(email: string, password: string): Promise<AdminSession | null>;
  logout(): Promise<void>;

  getUsers(): Promise<AppUser[]>;
  getRiders(): Promise<Rider[]>;
  getPassengers(): Promise<AppUser[]>;
  getRides(): Promise<Ride[]>;
  getBookings(): Promise<Booking[]>;
  getPayments(): Promise<Payment[]>;
  getReviews(): Promise<Review[]>;
  getKycSubmissions(): Promise<KycSubmission[]>;
  getDashboardData(range: DateRange): Promise<DashboardDataset>;
  getReportsData(): Promise<ReportsDataset>;
}
