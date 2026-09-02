// ============================================================
// 🔧 DEMO DATA — safe to delete once connected to the backend.
// Only imported by src/connection/demo/provider.ts. A real backend
// returns the same shape (see src/connection/types.ts) from wherever
// its provider.ts implements this method.
// ============================================================

import type { AppUser, Rider } from "../types/entities";

export const users: AppUser[] = [
  { id: "U-8492", name: "Sujan Baniya", email: "sujan.baniya@example.com", phone: "+977 984-1234567", role: "Rider", rating: 4.8, status: "Active", joinedDate: "May 24, 2025" },
  { id: "U-8493", name: "Pooja Shrestha", email: "pooja.shrestha@example.com", phone: "+977 986-1122334", role: "Passenger", rating: 4.6, status: "Active", joinedDate: "May 23, 2025" },
  { id: "U-8494", name: "Bikram Adhikari", email: "bikram.adk@example.com", phone: "+977 981-9988776", role: "Rider", rating: 4.9, status: "Active", joinedDate: "May 23, 2025" },
  { id: "U-8495", name: "Sunita Karki", email: "sunita.karki@example.com", phone: "+977 985-4455667", role: "Passenger", rating: 4.5, status: "Pending", joinedDate: "May 22, 2025" },
  { id: "U-8496", name: "Deepak C.K.", email: "deepak.ck@example.com", phone: "+977 980-7766554", role: "Rider", rating: 4.7, status: "Active", joinedDate: "May 21, 2025" },
  { id: "U-8497", name: "Anil Shrestha", email: "anil.shrestha@example.com", phone: "+977 984-3322110", role: "Passenger", rating: 4.4, status: "Active", joinedDate: "May 21, 2025" },
  { id: "U-8498", name: "Kavya Lama", email: "kavya.lama@example.com", phone: "+977 986-6677889", role: "Passenger", rating: 4.8, status: "Suspended", joinedDate: "May 19, 2025" },
  { id: "U-8499", name: "Prishma K.C.", email: "prishma.kc@example.com", phone: "+977 981-1231234", role: "Rider", rating: 4.6, status: "Active", joinedDate: "May 18, 2025" },
];

export const riders: Rider[] = [
  { id: "U-8492", name: "Sujan Baniya", email: "sujan.baniya@example.com", phone: "+977 984-1234567", role: "Rider", rating: 4.8, status: "Active", joinedDate: "May 24, 2025", vehicle: "Bajaj Pulsar", licenseNo: "BA 1234", docsVerified: true },
  { id: "U-8494", name: "Bikram Adhikari", email: "bikram.adk@example.com", phone: "+977 981-9988776", role: "Rider", rating: 4.9, status: "Active", joinedDate: "May 23, 2025", vehicle: "CHA 5678", licenseNo: "CHA 5678", docsVerified: true },
  { id: "U-8496", name: "Deepak C.K.", email: "deepak.ck@example.com", phone: "+977 980-7766554", role: "Rider", rating: 4.7, status: "Active", joinedDate: "May 21, 2025", vehicle: "Suzuki Access", licenseNo: "JA 9012", docsVerified: true },
  { id: "U-8499", name: "Prishma K.C.", email: "prishma.kc@example.com", phone: "+977 981-1231234", role: "Rider", rating: 4.6, status: "Active", joinedDate: "May 18, 2025", vehicle: "Yamaha FZ", licenseNo: "TA 6789", docsVerified: false },
  { id: "U-8501", name: "Sagar Pandey", email: "sagar.pandey@example.com", phone: "+977 985-2345678", role: "Rider", rating: 4.5, status: "Pending", joinedDate: "May 18, 2025", vehicle: "Honda Shine", licenseNo: "GA 3456", docsVerified: false },
];

export const passengers: AppUser[] = users.filter((u) => u.role === "Passenger");
