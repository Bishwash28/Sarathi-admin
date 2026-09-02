// ============================================================
// 🔧 DEMO DATA — safe to delete once connected to the backend.
// Only imported by src/connection/demo/provider.ts. A real backend
// returns the same shape (see src/connection/types.ts) from wherever
// its provider.ts implements this method.
// ============================================================

import type { KycSubmission } from "../types/entities";

// Placeholder document images for the demo — swap for real Supabase Storage
// URLs (signed URLs from a private `kyc-documents` bucket) once riders can
// actually upload from the app.
const doc = (label: string) => ({
  label,
  imageUrl: `https://placehold.co/480x300/FFF5F5/8F1025?text=${encodeURIComponent(label)}`,
});

export const kycSubmissions: KycSubmission[] = [
  {
    id: "KYC-1042",
    riderName: "Prishma K.C.",
    riderId: "U-8499",
    vehicle: "Yamaha FZ · TA 6789",
    submittedDate: "May 24, 2025",
    status: "Pending",
    documents: [
      doc("Citizenship - Front"),
      doc("Citizenship - Back"),
      doc("Driving License"),
      doc("Vehicle Registration (Bluebook)"),
      doc("Rider Selfie"),
    ],
  },
  {
    id: "KYC-1043",
    riderName: "Sagar Pandey",
    riderId: "U-8501",
    vehicle: "Honda Shine · GA 3456",
    submittedDate: "May 18, 2025",
    status: "Pending",
    documents: [
      doc("Citizenship - Front"),
      doc("Citizenship - Back"),
      doc("Driving License"),
      doc("Vehicle Registration (Bluebook)"),
    ],
  },
  {
    id: "KYC-1039",
    riderName: "Sujan Baniya",
    riderId: "U-8492",
    vehicle: "Bajaj Pulsar · BA 1234",
    submittedDate: "May 20, 2025",
    status: "Verified",
    documents: [
      doc("Citizenship - Front"),
      doc("Citizenship - Back"),
      doc("Driving License"),
      doc("Vehicle Registration (Bluebook)"),
    ],
  },
  {
    id: "KYC-1035",
    riderName: "Deepak C.K.",
    riderId: "U-8496",
    vehicle: "Suzuki Access · JA 9012",
    submittedDate: "May 15, 2025",
    status: "Rejected",
    documents: [doc("Citizenship - Front"), doc("Citizenship - Back"), doc("Driving License")],
  },
];
