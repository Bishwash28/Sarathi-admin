import type { LucideIcon } from "lucide-react";

export interface NavItem {
  label: string;
  path: string;
  icon: LucideIcon;
}

export interface StatCardData {
  label: string;
  value: string;
  trend: string;
  trendDirection: "up" | "down";
  icon: LucideIcon;
}
