import type { DataProvider, DateRange, DashboardDataset, ReportsDataset, AdminSession } from "../types";
import { users, riders, passengers } from "../../data/r_mockUsers";
import { rides, bookings, payments, reviews } from "../../data/r_mockOperations";
import { kycSubmissions } from "../../data/r_mockKyc";
import { dashboardDatasets } from "../../data/r_dashboardData";
import { reportsDataset } from "../../data/r_mockReports";

const FALLBACK_EMAIL = "admin@sarathi.com";
const FALLBACK_PASSWORD = "admin123";
const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

export const demoProvider: DataProvider = {
  id: "demo",
  label: "Demo",
  isConfigured: true, // always available, no setup needed

  async login(email, password): Promise<AdminSession | null> {
    await delay(400);
    if (email === FALLBACK_EMAIL && password === FALLBACK_PASSWORD) {
      return { token: "demo-token", admin: { name: "Admin User", email } };
    }
    return null;
  },

  async logout() {
    await delay(100);
  },

  async getUsers() {
    await delay();
    return users;
  },
  async getRiders() {
    await delay();
    return riders;
  },
  async getPassengers() {
    await delay();
    return passengers;
  },
  async getRides() {
    await delay();
    return rides;
  },
  async getBookings() {
    await delay();
    return bookings;
  },
  async getPayments() {
    await delay();
    return payments;
  },
  async getReviews() {
    await delay();
    return reviews;
  },
  async getKycSubmissions() {
    await delay();
    return kycSubmissions;
  },
  async getDashboardData(range: DateRange): Promise<DashboardDataset> {
    await delay();
    return dashboardDatasets[range];
  },
  async getReportsData(): Promise<ReportsDataset> {
    await delay();
    return reportsDataset;
  },
};
