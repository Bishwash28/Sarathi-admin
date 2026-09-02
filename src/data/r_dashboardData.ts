// ============================================================
// 🔧 DEMO DATA — safe to delete once connected to the backend.
// This file is only imported by src/connection/demo/provider.ts.
// A real backend returns the same DashboardDataset shape from
// src/connection/types.ts — see src/connection/README.md.
// ============================================================
import type { DateRange, DashboardDataset } from "../connection/types";

export const dashboardDatasets: Record<DateRange, DashboardDataset> = {
  Today: {
    statCards: [
      { label: "Total Users", value: "24,592", trend: "+0.4%", trendDirection: "up" },
      { label: "Active Riders", value: "312", trend: "+2.1%", trendDirection: "up" },
      { label: "Active Passengers", value: "890", trend: "+3.5%", trendDirection: "up" },
      { label: "Completed Rides", value: "612", trend: "+1.1%", trendDirection: "up" },
      { label: "Today's Rides", value: "3,192", trend: "-1.2%", trendDirection: "down" },
      { label: "Total Revenue", value: "$12.4K", trend: "+4.0%", trendDirection: "up" },
    ],
    rideStatistics: [
      { day: "8am", completed: 120, requested: 150 },
      { day: "10am", completed: 260, requested: 300 },
      { day: "12pm", completed: 340, requested: 380 },
      { day: "2pm", completed: 300, requested: 330 },
      { day: "4pm", completed: 420, requested: 460 },
      { day: "6pm", completed: 500, requested: 540 },
      { day: "8pm", completed: 380, requested: 400 },
    ],
    revenueOverview: [
      { month: "8am", revenue: 800 },
      { month: "10am", revenue: 1600 },
      { month: "12pm", revenue: 2200 },
      { month: "2pm", revenue: 1900 },
      { month: "4pm", revenue: 2700 },
      { month: "6pm", revenue: 3200 },
      { month: "8pm", revenue: 2400 },
    ],
  },
  "7D": {
    statCards: [
      { label: "Total Users", value: "24,592", trend: "+8.2%", trendDirection: "up" },
      { label: "Active Riders", value: "1,204", trend: "+4.1%", trendDirection: "up" },
      { label: "Active Passengers", value: "8,430", trend: "+12.5%", trendDirection: "up" },
      { label: "Completed Rides", value: "5,120", trend: "+2.3%", trendDirection: "up" },
      { label: "Today's Rides", value: "3,192", trend: "-1.2%", trendDirection: "down" },
      { label: "Total Revenue", value: "$84.2K", trend: "+15.4%", trendDirection: "up" },
    ],
    rideStatistics: [
      { day: "Mon", completed: 900, requested: 1150 },
      { day: "Tue", completed: 1500, requested: 1650 },
      { day: "Wed", completed: 1450, requested: 2950 },
      { day: "Thu", completed: 2550, requested: 2450 },
      { day: "Fri", completed: 2400, requested: 3200 },
      { day: "Sat", completed: 3550, requested: 3850 },
      { day: "Sun", completed: 4300, requested: 4450 },
    ],
    revenueOverview: [
      { month: "Mon", revenue: 3200 },
      { month: "Tue", revenue: 4100 },
      { month: "Wed", revenue: 9200 },
      { month: "Thu", revenue: 12100 },
      { month: "Fri", revenue: 10600 },
      { month: "Sat", revenue: 14400 },
      { month: "Sun", revenue: 15800 },
    ],
  },
  "30D": {
    statCards: [
      { label: "Total Users", value: "24,592", trend: "+18.6%", trendDirection: "up" },
      { label: "Active Riders", value: "1,204", trend: "+9.4%", trendDirection: "up" },
      { label: "Active Passengers", value: "8,430", trend: "+22.1%", trendDirection: "up" },
      { label: "Completed Rides", value: "18.5K", trend: "+6.7%", trendDirection: "up" },
      { label: "Today's Rides", value: "3,192", trend: "-1.2%", trendDirection: "down" },
      { label: "Total Revenue", value: "$342.1K", trend: "+21.4%", trendDirection: "up" },
    ],
    rideStatistics: [
      { day: "Wk 1", completed: 4200, requested: 4800 },
      { day: "Wk 2", completed: 5100, requested: 5600 },
      { day: "Wk 3", completed: 4700, requested: 5300 },
      { day: "Wk 4", completed: 6200, requested: 6800 },
    ],
    revenueOverview: [
      { month: "Wk 1", revenue: 68000 },
      { month: "Wk 2", revenue: 81000 },
      { month: "Wk 3", revenue: 74000 },
      { month: "Wk 4", revenue: 96000 },
    ],
  },
  YTD: {
    statCards: [
      { label: "Total Users", value: "24,592", trend: "+64.2%", trendDirection: "up" },
      { label: "Active Riders", value: "1,204", trend: "+48.1%", trendDirection: "up" },
      { label: "Active Passengers", value: "8,430", trend: "+71.5%", trendDirection: "up" },
      { label: "Completed Rides", value: "142.5K", trend: "+52.3%", trendDirection: "up" },
      { label: "Today's Rides", value: "3,192", trend: "-1.2%", trendDirection: "down" },
      { label: "Total Revenue", value: "$842.1K", trend: "+58.4%", trendDirection: "up" },
    ],
    rideStatistics: [
      { day: "Jan", completed: 8200, requested: 9400 },
      { day: "Feb", completed: 9100, requested: 10200 },
      { day: "Mar", completed: 10800, requested: 12100 },
      { day: "Apr", completed: 12400, requested: 13600 },
      { day: "May", completed: 14300, requested: 15800 },
    ],
    revenueOverview: [
      { month: "Jan", revenue: 3200 },
      { month: "Feb", revenue: 4100 },
      { month: "Mar", revenue: 9200 },
      { month: "Apr", revenue: 12100 },
      { month: "May", revenue: 10600 },
      { month: "Jun", revenue: 14400 },
    ],
  },
};
