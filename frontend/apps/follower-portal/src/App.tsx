import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { ProtectedRoute } from './components/ProtectedRoute';
import { BrowsePastorsPage } from './pages/BrowsePastorsPage';
import { PastorDetailPage } from './pages/PastorDetailPage';
import { PrayerWallPage } from './pages/PrayerWallPage';
import { MyBookingsPage } from './pages/MyBookingsPage';
import { GivingPage } from './pages/GivingPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/pastors" element={<ProtectedRoute><BrowsePastorsPage /></ProtectedRoute>} />
        <Route path="/pastors/:pastorId" element={<ProtectedRoute><PastorDetailPage /></ProtectedRoute>} />
        <Route path="/prayers" element={<ProtectedRoute><PrayerWallPage /></ProtectedRoute>} />
        <Route path="/bookings" element={<ProtectedRoute><MyBookingsPage /></ProtectedRoute>} />
        <Route path="/give" element={<ProtectedRoute><GivingPage /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}
