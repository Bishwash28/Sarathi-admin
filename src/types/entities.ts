export interface AppUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "Rider" | "Passenger";
  rating: number;
  status: "Active" | "Pending" | "Suspended";
  joinedDate: string;
}

export interface Rider extends AppUser {
  vehicle: string;
  licenseNo: string;
  docsVerified: boolean;
}

export interface Ride {
  id: string;
  riderName: string;
  route: string;
  dateTime: string;
  seats: number;
  fare: number;
  status: "Active" | "Ongoing" | "Completed" | "Cancelled";
}

export interface Booking {
  id: string;
  rideId: string;
  passengerName: string;
  route: string;
  dateTime: string;
  payment: "Paid" | "Pending" | "Refunded";
  status: "Confirmed" | "Pending" | "Completed" | "Cancelled";
}

export interface Payment {
  id: string;
  bookingId: string;
  amount: number;
  method: "eSewa" | "Khalti" | "Cash" | "Card";
  transactionId: string;
  dateTime: string;
  status: "Completed" | "Pending" | "Failed";
}

export interface KycDocument {
  label: string;
  imageUrl: string;
}

export interface KycSubmission {
  id: string;
  riderName: string;
  riderId: string;
  vehicle: string;
  submittedDate: string;
  status: "Pending" | "Verified" | "Rejected";
  documents: KycDocument[];
}

export interface Review {
  id: string;
  bookingId: string;
  reviewer: string;
  reviewee: string;
  rating: number;
  comment: string;
  date: string;
  status: "Active" | "Flagged";
}
