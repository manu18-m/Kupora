import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate
} from 'react-router-dom';

import React, { useState } from 'react';

import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import MarketplacePage from './pages/MarketplacePage';
import CouponDetailsPage from './pages/CouponDetailsPage';
import SellerProfilePage from './pages/SellerProfilePage';
import UploadCouponPage from './pages/UploadCouponPage';
import AdminDashboard from './pages/AdminDashboard';
import ChatPage from './pages/ChatPage';

// --- MOCK AUTH SYSTEM ---
const useAuth = () => {
  const [user] = useState({
    isAuthenticated: true,
    role: 'admin', // change to: 'user' | 'seller' | 'admin'
    handle: '@devops_alpha',
  });

  return user;
};

// --- DASHBOARD LAYOUT ---
const DashboardLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#030014] text-zinc-100 flex flex-col">
      
      {/* HEADER */}
      <header className="h-16 border-b border-white/5 bg-[#030014]/60 backdrop-blur-xl sticky top-0 z-50 px-6 flex items-center justify-between">
        
        {/* LOGO */}
        <div
          onClick={() => navigate('/')}
          className="flex items-center gap-2 font-bold text-sm text-white cursor-pointer"
        >
          <div className="w-6 h-6 rounded bg-gradient-to-tr from-purple-600 to-cyan-400" />
          <span>VoucherAI Platform</span>
        </div>

        {/* NAVIGATION */}
        <nav className="flex items-center gap-6 text-xs font-mono font-bold uppercase tracking-wider">
          
          <button
            onClick={() => navigate('/browse')}
            className={`hover:text-purple-400 ${
              location.pathname === '/browse'
                ? 'text-purple-400'
                : 'text-zinc-400'
            }`}
          >
            Market
          </button>

          <button
            onClick={() => navigate('/dashboard')}
            className={`hover:text-purple-400 ${
              location.pathname === '/dashboard'
                ? 'text-purple-400'
                : 'text-zinc-400'
            }`}
          >
            Workspace
          </button>

          <button
            onClick={() => navigate('/chat')}
            className={`hover:text-purple-400 ${
              location.pathname === '/chat'
                ? 'text-purple-400'
                : 'text-zinc-400'
            }`}
          >
            Messages
          </button>

          <button
            onClick={() => navigate('/upload')}
            className={`hover:text-purple-400 ${
              location.pathname === '/upload'
                ? 'text-purple-400'
                : 'text-zinc-400'
            }`}
          >
            + Deploy
          </button>
        </nav>
      </header>

      {/* PAGE CONTENT */}
      <div className="flex-1 min-h-0 w-full">
        {children}
      </div>
    </div>
  );
};

// --- PROTECTED ROUTE ---
const ProtectedRoute = ({ children, allowedRoles }) => {
  const auth = useAuth();
  const location = useLocation();

  // Not authenticated
  if (!auth.isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // Role not allowed
  if (allowedRoles && !allowedRoles.includes(auth.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <Routes>

        {/* PUBLIC ROUTE */}
        <Route path="/" element={<LandingPage />} />

        {/* MARKETPLACE */}
        <Route
          path="/browse"
          element={
            <DashboardLayout>
              <MarketplacePage />
            </DashboardLayout>
          }
        />

        {/* COUPON DETAILS */}
        <Route
          path="/coupon/:id"
          element={
            <DashboardLayout>
              <CouponDetailsPage />
            </DashboardLayout>
          }
        />

        {/* SELLER PROFILE */}
        <Route
          path="/seller/:handle"
          element={
            <DashboardLayout>
              <SellerProfilePage />
            </DashboardLayout>
          }
        />

        {/* USER DASHBOARD */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={['user', 'seller', 'admin']}>
              <DashboardLayout>
                <Dashboard />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* CHAT */}
        <Route
          path="/chat"
          element={
            <ProtectedRoute allowedRoles={['user', 'seller', 'admin']}>
              <DashboardLayout>
                <ChatPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* SELLER UPLOAD */}
        <Route
          path="/upload"
          element={
            <ProtectedRoute allowedRoles={['seller', 'admin']}>
              <DashboardLayout>
                <UploadCouponPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* ADMIN */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <DashboardLayout>
                <AdminDashboard />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </Router>
  );
}

export default App;