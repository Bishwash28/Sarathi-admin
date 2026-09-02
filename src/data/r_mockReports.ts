// ============================================================
// 🔧 DEMO DATA — safe to delete once connected to the backend.
// Only imported by src/connection/demo/provider.ts. A real backend
// returns the same ReportsDataset shape from src/connection/types.ts.
// ============================================================
import type { ReportsDataset } from "../connection/types";

export const reportsDataset: ReportsDataset = {
  summary: [
    { label: "Total Rides", value: "2,365", trend: "+12.4%", trendDirection: "up" },
    { label: "Completed Rides", value: "1,985", trend: "+10.2%", trendDirection: "up" },
    { label: "Cancelled Rides", value: "380", trend: "-6.4%", trendDirection: "down" },
    { label: "Total Revenue", value: "NPR 1,245,800", trend: "+15.6%", trendDirection: "up" },
  ],
  ridesOverview: [
    { day: "May 18", requested: 320, completed: 280 },
    { day: "May 19", requested: 300, completed: 260 },
    { day: "May 20", requested: 340, completed: 300 },
    { day: "May 21", requested: 360, completed: 330 },
    { day: "May 22", requested: 310, completed: 270 },
    { day: "May 23", requested: 400, completed: 360 },
    { day: "May 24", requested: 335, completed: 305 },
  ],
  topRoutes: [
    { name: "Koteshwor → Baneshwor", value: 32, color: "#C8102E" },
    { name: "Kalanki → Balaju", value: 24, color: "#F04B5F" },
    { name: "Gongabu → Chabahil", value: 18, color: "#E9A23B" },
    { name: "Others", value: 26, color: "#8B6870" },
  ],
  paymentMethods: [
    { name: "eSewa", value: 45, color: "#C8102E" },
    { name: "Khalti", value: 30, color: "#F04B5F" },
    { name: "Cash", value: 20, color: "#2E9B62" },
    { name: "Card", value: 5, color: "#8B6870" },
  ],
};
