// ============================================================
// models.example.js — Mongoose schemas matching what c_server.example.js
// and provider.ts expect. Copy alongside server.js as models.js and
// adjust field names/validation to your real design.
// ============================================================
const mongoose = require("mongoose");
const { Schema } = mongoose;

// No separate Admin model — an admin is a row in the same User collection
// riders/passengers live in, with role: "Admin". Only Admin documents need
// passwordHash populated (the mobile app's rider/passenger auth is a
// separate concern from this admin panel).
const UserSchema = new Schema({
  name: String,
  email: { type: String, unique: true },
  phone: String,
  role: { type: String, enum: ["Rider", "Passenger", "Admin"] },
  passwordHash: String, // only set for the Admin document(s)
  rating: { type: Number, default: 0 },
  status: { type: String, enum: ["Active", "Pending", "Suspended"], default: "Active" },
  vehicle: String, // riders only
  licenseNo: String, // riders only
  docsVerified: { type: Boolean, default: false }, // riders only
  joinedDate: { type: Date, default: Date.now },
});

const RideSchema = new Schema({
  riderId: { type: Schema.Types.ObjectId, ref: "User" },
  riderName: String,
  route: String,
  dateTime: Date,
  seats: Number,
  fare: Number,
  status: { type: String, enum: ["Active", "Ongoing", "Completed", "Cancelled"], default: "Active" },
});

const BookingSchema = new Schema({
  rideId: { type: Schema.Types.ObjectId, ref: "Ride" },
  passengerId: { type: Schema.Types.ObjectId, ref: "User" },
  passengerName: String,
  route: String,
  dateTime: Date,
  payment: { type: String, enum: ["Paid", "Pending", "Refunded"], default: "Pending" },
  status: { type: String, enum: ["Confirmed", "Pending", "Completed", "Cancelled"], default: "Pending" },
});

const PaymentSchema = new Schema({
  bookingId: { type: Schema.Types.ObjectId, ref: "Booking" },
  amount: Number,
  method: { type: String, enum: ["eSewa", "Khalti", "Cash", "Card"] },
  transactionId: String,
  dateTime: Date,
  status: { type: String, enum: ["Completed", "Pending", "Failed"], default: "Pending" },
});

const ReviewSchema = new Schema({
  bookingId: { type: Schema.Types.ObjectId, ref: "Booking" },
  reviewer: String,
  reviewee: String,
  rating: Number,
  comment: String,
  date: Date,
  status: { type: String, enum: ["Active", "Flagged"], default: "Active" },
});

const KycDocumentSchema = new Schema({
  label: String,
  imageUrl: String, // ideally a signed/private URL, not public
});

const KycSubmissionSchema = new Schema({
  riderId: { type: Schema.Types.ObjectId, ref: "User" },
  riderName: String,
  vehicle: String,
  submittedDate: Date,
  status: { type: String, enum: ["Pending", "Verified", "Rejected"], default: "Pending" },
  reviewedBy: { type: Schema.Types.ObjectId, ref: "User" }, // the admin who reviewed it
  documents: [KycDocumentSchema],
});

module.exports = {
  User: mongoose.model("User", UserSchema),
  Ride: mongoose.model("Ride", RideSchema),
  Booking: mongoose.model("Booking", BookingSchema),
  Payment: mongoose.model("Payment", PaymentSchema),
  Review: mongoose.model("Review", ReviewSchema),
  KycSubmission: mongoose.model("KycSubmission", KycSubmissionSchema),
};
