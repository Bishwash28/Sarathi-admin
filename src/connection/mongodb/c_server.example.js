// ============================================================
// c_server.example.js — a minimal Express + Mongoose server implementing
// every endpoint src/connection/mongodb/provider.ts calls. Copy this
// out, customize, and run it as its own Node process — same idea as
// the MySQL example, different database underneath.
//
//   mkdir sarathi-server && cd sarathi-server
//   npm init -y
//   npm install express mongoose cors jsonwebtoken bcrypt dotenv
//   cp ../src/connection/mongodb/c_server.example.js server.js
//   cp ../src/connection/mongodb/models.example.js models.js
//   cp ../src/connection/mongodb/.env.example .env   # fill in your Mongo URI
//   node server.js
//
// Then set VITE_API_BASE_URL=http://localhost:4000/api in the
// frontend's .env and VITE_BACKEND=mongodb.
// ============================================================

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();

const {
  User,
  Ride,
  Booking,
  Payment,
  Review,
  KycSubmission,
} = require("./models");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI);

const JWT_SECRET = process.env.JWT_SECRET || "change-this-in-production";

function requireAdmin(req, res, next) {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ error: "No token" });
  try {
    req.admin = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
}

// --- Auth ---
// No separate Admin model — an admin is just a User document with
// role: "Admin".
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  const admin = await User.findOne({ email, role: "Admin" });
  if (!admin || !admin.passwordHash || !(await bcrypt.compare(password, admin.passwordHash))) {
    return res.status(401).json({ error: "Invalid credentials" });
  }
  const token = jwt.sign({ id: admin._id, email: admin.email }, JWT_SECRET, { expiresIn: "7d" });
  res.json({ token, admin: { name: admin.name, email: admin.email } });
});

// --- Users / Riders / Passengers ---
app.get("/api/users", requireAdmin, async (req, res) => res.json(await User.find({ role: { $ne: "Admin" } })));
app.get("/api/riders", requireAdmin, async (req, res) => res.json(await User.find({ role: "Rider" })));
app.get("/api/passengers", requireAdmin, async (req, res) => res.json(await User.find({ role: "Passenger" })));

// --- Rides / Bookings / Payments / Reviews ---
app.get("/api/rides", requireAdmin, async (req, res) => res.json(await Ride.find()));
app.get("/api/bookings", requireAdmin, async (req, res) => res.json(await Booking.find()));
app.get("/api/payments", requireAdmin, async (req, res) => res.json(await Payment.find()));
app.get("/api/reviews", requireAdmin, async (req, res) => res.json(await Review.find()));

// --- KYC ---
app.get("/api/kyc-submissions", requireAdmin, async (req, res) => res.json(await KycSubmission.find()));

// --- Dashboard / Reports (adjust these aggregate queries to your schema) ---
app.get("/api/dashboard", requireAdmin, async (req, res) => {
  // Stub — replace with a real MongoDB aggregation pipeline grouped by
  // req.query.range.
  res.json({ statCards: [], rideStatistics: [], revenueOverview: [] });
});
app.get("/api/reports", requireAdmin, async (req, res) => {
  res.json({ summary: [], ridesOverview: [], topRoutes: [], paymentMethods: [] });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`SARATHI MongoDB API running on http://localhost:${PORT}`));
