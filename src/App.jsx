import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage'; 
import Dashboard from './pages/Dashboard';     
import MarketplacePage from './pages/MarketplacePage';
import CouponDetailsPage from './pages/CouponDetailsPage'; 
import SellerProfilePage from './pages/SellerProfilePage';
import UploadCouponPage from './pages/UploadCouponPage';
import AdminDashboard from './pages/AdminDashboard'; // 👈 Imported perfectly
import ChatPage from './pages/ChatPage';
function App() {
  return (
    <Router>
      <Routes>
        {/* Primary Root Route */}
        <Route path="/" element={<LandingPage />} />
        
        {/* Core Dashboard View */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* ⚡ ACTIVE MARKETPLACE BROWSING PORTAL */}
        <Route path="/browse" element={<MarketplacePage />} />

        {/* ⚡ ACTIVE PREMIUM DETAILED OVERVIEW PARAMETERS */}
        <Route path="/coupon/:id" element={<CouponDetailsPage />} />

        {/* ⚡ ACTIVE SELLER CREATOR NODE PORTAL */}
        <Route path="/seller/:handle" element={<SellerProfilePage />} />

        {/* ⚡ ACTIVE COUPON UPLOAD PORTAL */}
        <Route path="/upload" element={<UploadCouponPage />} />

        {/* ⚡ ACTIVE ADMIN ANALYTICS COCKPIT MANAGEMENT */}
        <Route path="/admin" element={<AdminDashboard />} /> 

        {/* ⚡ ACTIVE CHAT PORTAL */}
        <Route path="/chat" element={<ChatPage />} />
      </Routes>
    </Router>
  );
}

export default App;