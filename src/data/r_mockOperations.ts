// ============================================================
// 🔧 DEMO DATA — safe to delete once connected to the backend.
// Only imported by src/connection/demo/provider.ts. A real backend
// returns the same shape (see src/connection/types.ts) from wherever
// its provider.ts implements this method.
// ============================================================

import type { Ride, Booking, Payment, Review } from "../types/entities";

export const rides: Ride[] = [
  { id: "R-01015", riderName: "Sujan Baniya", route: "Bus Park → Yogikuti", dateTime: "May 25, 2025 - 08:30 AM", seats: 3, fare: 300, status: "Active" },
  { id: "R-01016", riderName: "Bikram Adhikari", route: "Traffic Chowk → New Baneshwor", dateTime: "May 25, 2025 - 09:00 AM", seats: 2, fare: 250, status: "Ongoing" },
  { id: "R-01017", riderName: "Deepak C.K.", route: "Koteshwor → Baluwatar", dateTime: "May 25, 2025 - 07:45 AM", seats: 1, fare: 200, status: "Completed" },
  { id: "R-01018", riderName: "Prishma K.C.", route: "Kalanki → Balaju", dateTime: "May 25, 2025 - 06:15 PM", seats: 4, fare: 150, status: "Active" },
  { id: "R-01019", riderName: "Sagar Pandey", route: "Gongabu → Chabahil", dateTime: "May 24, 2025 - 05:30 PM", seats: 2, fare: 180, status: "Cancelled" },
  { id: "R-01020", riderName: "Sujan Baniya", route: "Hospital Chowk → Yogikuti", dateTime: "May 24, 2025 - 08:15 AM", seats: 3, fare: 220, status: "Completed" },
  { id: "R-01021", riderName: "Bikram Adhikari", route: "Sundhara → Maitighar", dateTime: "May 24, 2025 - 09:10 AM", seats: 2, fare: 130, status: "Completed" },
];

export const bookings: Booking[] = [
  { id: "BK10783", rideId: "R-01015", passengerName: "Pooja Shrestha", route: "Bus Park → Hospital Chowk", dateTime: "May 25, 2025 - 08:30 AM", payment: "Paid", status: "Confirmed" },
  { id: "BK10784", rideId: "R-01016", passengerName: "Sunita Karki", route: "Traffic Chowk → New Baneshwor", dateTime: "May 25, 2025 - 09:00 AM", payment: "Paid", status: "Completed" },
  { id: "BK10785", rideId: "R-01017", passengerName: "Anil Shrestha", route: "Koteshwor → Baluwatar", dateTime: "May 25, 2025 - 07:45 AM", payment: "Paid", status: "Completed" },
  { id: "BK10786", rideId: "R-01018", passengerName: "Kavya Lama", route: "Kalanki → Balaju", dateTime: "May 25, 2025 - 06:15 PM", payment: "Pending", status: "Pending" },
  { id: "BK10787", rideId: "R-01019", passengerName: "Pooja Shrestha", route: "Gongabu → Chabahil", dateTime: "May 24, 2025 - 05:30 PM", payment: "Refunded", status: "Cancelled" },
  { id: "BK10788", rideId: "R-01020", passengerName: "Anil Shrestha", route: "Hospital Chowk → Yogikuti", dateTime: "May 24, 2025 - 08:15 AM", payment: "Paid", status: "Completed" },
  { id: "BK10789", rideId: "R-01021", passengerName: "Sunita Karki", route: "Sundhara → Maitighar", dateTime: "May 24, 2025 - 09:10 AM", payment: "Paid", status: "Completed" },
];

export const payments: Payment[] = [
  { id: "PAY10087", bookingId: "BK10783", amount: 300, method: "eSewa", transactionId: "8802A200237", dateTime: "May 25, 2025 - 08:31 AM", status: "Completed" },
  { id: "PAY10088", bookingId: "BK10784", amount: 250, method: "Khalti", transactionId: "6602B980164", dateTime: "May 25, 2025 - 09:01 AM", status: "Completed" },
  { id: "PAY10089", bookingId: "BK10785", amount: 200, method: "Cash", transactionId: "—", dateTime: "May 25, 2025 - 07:46 AM", status: "Completed" },
  { id: "PAY10090", bookingId: "BK10786", amount: 150, method: "eSewa", transactionId: "7712A200951", dateTime: "May 25, 2025 - 06:16 PM", status: "Pending" },
  { id: "PAY10091", bookingId: "BK10787", amount: 180, method: "Khalti", transactionId: "5602B119843", dateTime: "May 24, 2025 - 05:31 PM", status: "Failed" },
  { id: "PAY10092", bookingId: "BK10788", amount: 220, method: "Card", transactionId: "4402C778210", dateTime: "May 24, 2025 - 08:16 AM", status: "Completed" },
  { id: "PAY10093", bookingId: "BK10789", amount: 130, method: "Cash", transactionId: "—", dateTime: "May 24, 2025 - 09:11 AM", status: "Completed" },
];

export const reviews: Review[] = [
  { id: "RV00210", bookingId: "BK10784", reviewer: "Sunita Karki", reviewee: "Bikram Adhikari", rating: 5, comment: "Great ride and on time, would join again!", date: "May 25, 2025", status: "Active" },
  { id: "RV00211", bookingId: "BK10785", reviewer: "Anil Shrestha", reviewee: "Deepak C.K.", rating: 4, comment: "Smooth and polite driver.", date: "May 25, 2025", status: "Active" },
  { id: "RV00212", bookingId: "BK10788", reviewer: "Anil Shrestha", reviewee: "Sujan Baniya", rating: 5, comment: "Very comfortable and safe ride.", date: "May 24, 2025", status: "Active" },
  { id: "RV00213", bookingId: "BK10789", reviewer: "Sunita Karki", reviewee: "Bikram Adhikari", rating: 2, comment: "Rider was late by 15 minutes.", date: "May 24, 2025", status: "Flagged" },
  { id: "RV00214", bookingId: "BK10783", reviewer: "Pooja Shrestha", reviewee: "Sujan Baniya", rating: 5, comment: "Exactly as described, great experience.", date: "May 25, 2025", status: "Active" },
];
