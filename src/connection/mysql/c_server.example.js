// ============================================================
// c_server.example.js — a minimal Express + MySQL server implementing
// every endpoint src/connection/mysql/provider.ts calls. This is the
// file you're meant to copy out, customize, and actually run.
//
// This is NOT part of the Vite frontend build — it's a separate Node
// process. Run it on its own:
//
//   mkdir sarathi-server && cd sarathi-server
//   npm init -y
//   npm install express mysql2 cors jsonwebtoken bcrypt dotenv
//   cp ../src/connection/mysql/c_server.example.js server.js
//   cp ../src/connection/mysql/.env.example .env   # fill in your DB creds
//   node server.js
//
// Then set VITE_API_BASE_URL=http://localhost:4000/api in the
// frontend's .env and VITE_BACKEND=mysql.
// ============================================================

const express = require("express");
const mysql = require("mysql2/promise");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

const JWT_SECRET = process.env.JWT_SECRET || "change-this-in-production";

// --- Auth middleware ---
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
// No separate admins table — an admin is just a row in `users` with
// role = 'Admin'.
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  const [rows] = await pool.query("SELECT * FROM users WHERE email = ? AND role = 'Admin'", [email]);
  const admin = rows[0];
  if (!admin || !admin.password_hash || !(await bcrypt.compare(password, admin.password_hash))) {
    return res.status(401).json({ error: "Invalid credentials" });
  }
  const token = jwt.sign({ id: admin.id, email: admin.email }, JWT_SECRET, { expiresIn: "7d" });
  res.json({ token, admin: { name: admin.name, email: admin.email } });
});

// --- Users / Riders / Passengers ---
app.get("/api/users", requireAdmin, async (req, res) => {
  // Exclude Admin rows — this list is for managing riders/passengers.
  const [rows] = await pool.query("SELECT * FROM users WHERE role != 'Admin'");
  res.json(rows);
});
app.get("/api/riders", requireAdmin, async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM users WHERE role = 'Rider'");
  res.json(rows);
});
app.get("/api/passengers", requireAdmin, async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM users WHERE role = 'Passenger'");
  res.json(rows);
});

// --- Rides / Bookings / Payments / Reviews ---
app.get("/api/rides", requireAdmin, async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM rides");
  res.json(rows);
});
app.get("/api/bookings", requireAdmin, async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM bookings");
  res.json(rows);
});
app.get("/api/payments", requireAdmin, async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM payments");
  res.json(rows);
});
app.get("/api/reviews", requireAdmin, async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM reviews");
  res.json(rows);
});

// --- KYC ---
app.get("/api/kyc-submissions", requireAdmin, async (req, res) => {
  const [submissions] = await pool.query("SELECT * FROM kyc_submissions");
  for (const s of submissions) {
    const [docs] = await pool.query("SELECT label, image_url AS imageUrl FROM kyc_documents WHERE submission_id = ?", [s.id]);
    s.documents = docs;
  }
  res.json(submissions);
});

// --- Dashboard / Reports (adjust these aggregate queries to your schema) ---
app.get("/api/dashboard", requireAdmin, async (req, res) => {
  // Stub — replace with real aggregate queries grouped by req.query.range
  res.json({ statCards: [], rideStatistics: [], revenueOverview: [] });
});
app.get("/api/reports", requireAdmin, async (req, res) => {
  res.json({ summary: [], ridesOverview: [], topRoutes: [], paymentMethods: [] });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`SARATHI MySQL API running on http://localhost:${PORT}`));
