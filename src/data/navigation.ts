import {
  LayoutGrid,
  Users,
  Car,
  User,
  Ticket,
  Receipt,
  Wallet,
  MessageSquareText,
  FileBarChart2,
  ShieldCheck,
  Settings,
} from "lucide-react";
import type { NavItem } from "../types/nav";

export const navItems: NavItem[] = [
  { label: "Dashboard", path: "/", icon: LayoutGrid },
  { label: "Users", path: "/users", icon: Users },
  { label: "Riders", path: "/riders", icon: Car },
  { label: "Passengers", path: "/passengers", icon: User },
  { label: "KYC Verification", path: "/kyc", icon: ShieldCheck },
  { label: "Rides", path: "/rides", icon: Ticket },
  { label: "Bookings", path: "/bookings", icon: Receipt },
  { label: "Payments", path: "/payments", icon: Wallet },
  { label: "Reviews", path: "/reviews", icon: MessageSquareText },
  { label: "Reports", path: "/reports", icon: FileBarChart2 },
  { label: "Settings", path: "/settings", icon: Settings },
];
