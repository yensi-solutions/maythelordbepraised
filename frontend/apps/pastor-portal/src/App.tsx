import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { ProtectedRoute } from './components/ProtectedRoute';
import { DashboardPage } from './pages/DashboardPage';
import { ProfilePage } from './pages/ProfilePage';
import { ServicesPage } from './pages/ServicesPage';
import { BookingsPage } from './pages/BookingsPage';
import { PrayersPage } from './pages/PrayersPage';
import { WaitlistAdminPage } from './pages/WaitlistAdminPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/admin/waitlist" element={<WaitlistAdminPage />} />
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/dashboard/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/dashboard/services" element={<ProtectedRoute><ServicesPage /></ProtectedRoute>} />
        <Route path="/dashboard/bookings" element={<ProtectedRoute><BookingsPage /></ProtectedRoute>} />
        <Route path="/dashboard/prayers" element={<ProtectedRoute><PrayersPage /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}
