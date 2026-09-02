import type { DataProvider } from "./types";
import { demoProvider } from "./demo/provider";
import { supabaseProvider } from "./supabase/provider";
import { mysqlProvider } from "./mysql/provider";
import { mongodbProvider } from "./mongodb/provider";

/**
 * ============================================================
 * BACKEND SWITCH — this is the one place that decides which
 * backend the whole app talks to.
 * ============================================================
 *
 * Set VITE_BACKEND in your .env to one of: demo | supabase | mysql | mongodb
 * No .env, or an unrecognized value → falls back to "demo" automatically.
 *
 * Every page imports `dataProvider` from here and nothing else — switching
 * backends is a one-line .env change, not a code change.
 */
const BACKEND = (import.meta.env.VITE_BACKEND ?? "demo") as DataProvider["id"];

const providers: Record<DataProvider["id"], DataProvider> = {
  demo: demoProvider,
  supabase: supabaseProvider,
  mysql: mysqlProvider,
  mongodb: mongodbProvider,
};

export const dataProvider: DataProvider = providers[BACKEND] ?? demoProvider;

export type { DataProvider, DateRange, DashboardDataset, ReportsDataset, AdminSession, StatCard } from "./types";
