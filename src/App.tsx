import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardLayout from "./components/layout/DashboardLayout";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import Login from "./features/auth/Login";
import Dashboard from "./features/dashboard/Dashboard";
import Users from "./features/users/Users";
import Riders from "./features/riders/Riders";
import Passengers from "./features/passengers/Passengers";
import KycVerification from "./features/kyc/KycVerification";
import Rides from "./features/rides/Rides";
import Bookings from "./features/bookings/Bookings";
import Payments from "./features/payments/Payments";
import Reviews from "./features/reviews/Reviews";
import Reports from "./features/reports/Reports";
import Settings from "./features/settings/Settings";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/users" element={<Users />} />
                  <Route path="/riders" element={<Riders />} />
                  <Route path="/passengers" element={<Passengers />} />
                  <Route path="/kyc" element={<KycVerification />} />
                  <Route path="/rides" element={<Rides />} />
                  <Route path="/bookings" element={<Bookings />} />
                  <Route path="/payments" element={<Payments />} />
                  <Route path="/reviews" element={<Reviews />} />
                  <Route path="/reports" element={<Reports />} />
                  <Route path="/settings" element={<Settings />} />
                </Routes>
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
