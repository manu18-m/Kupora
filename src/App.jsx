import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate
} from 'react-router-dom';

import React, { useState, useEffect, createContext, useContext } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase';

import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import MarketplacePage from './pages/MarketplacePage';
import CouponDetailsPage from './pages/CouponDetailsPage';
import SellerProfilePage from './pages/SellerProfilePage';
import UploadCouponPage from './pages/UploadCouponPage';
import AdminDashboard from './pages/AdminDashboard';
import ChatPage from './pages/ChatPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';

import { Toaster } from 'react-hot-toast';

// --- REAL FIREBASE AUTHENTICATION CONTEXT ---
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setRole(userDoc.data().role);
        } else {
          setRole('user');
        }
      } else {
        setCurrentUser(null);
        setRole(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const logout = () => signOut(auth);

  return (
    <AuthContext.Provider value={{ user: currentUser, role, loading, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

// --- DASHBOARD LAYOUT ---
const DashboardLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-[#030014] text-zinc-100 flex flex-col relative">
      {/* HEADER */}
      <header className="h-16 border-b border-white/5 bg-[#030014]/60 backdrop-blur-xl sticky top-0 z-50 px-6 flex items-center justify-between">
        {/* LOGO */}
        <div
          onClick={() => navigate('/')}
          className="flex items-center gap-2 font-bold text-sm text-white cursor-pointer"
        >
          <div className="w-6 h-6 rounded bg-gradient-to-tr from-purple-600 to-cyan-400" />
          <span>Kupora</span>
        </div>

        {/* NAVIGATION */}
        <nav className="flex items-center gap-6 text-xs font-mono font-bold uppercase tracking-wider">
          <button
            onClick={() => navigate('/browse')}
            className={`hover:text-purple-400 transition-colors ${
              location.pathname === '/browse' ? 'text-purple-400' : 'text-zinc-400'
            }`}
          >
            Market
          </button>

          <button
            onClick={() => navigate('/dashboard')}
            className={`hover:text-purple-400 transition-colors ${
              location.pathname === '/dashboard' ? 'text-purple-400' : 'text-zinc-400'
            }`}
          >
            Dashboard
          </button>

          <button
            onClick={() => navigate('/chat')}
            className={`hover:text-purple-400 transition-colors ${
              location.pathname === '/chat' ? 'text-purple-400' : 'text-zinc-400'
            }`}
          >
            Messages
          </button>

          <button
            onClick={() => navigate('/upload')}
            className={`hover:text-purple-400 transition-colors ${
              location.pathname === '/upload' ? 'text-purple-400' : 'text-zinc-400'
            }`}
          >
            + Upload
          </button>

          {user ? (
            <button
              onClick={() => {
                logout();
                navigate('/');
              }}
              className="text-red-400 hover:text-red-300 transition-colors border-l border-white/5 pl-6"
            >
              Sign Out
            </button>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="text-cyan-400 hover:text-cyan-300 transition-colors border-l border-white/5 pl-6"
            >
              Sign In
            </button>
          )}
        </nav>
      </header>

      {/* PAGE CONTENT */}
      <div className="flex-1 min-h-0 w-full relative z-10">
        {children}
      </div>
    </div>
  );
};

// --- PROTECTED ROUTE ---
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, role } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        {/* ⚡ GLOBAL TOAST SYSTEM MOUNTED SAFELY UNDER ROUTER LAYER CLOSURES */}
        <Toaster
          position="top-right"
          containerStyle={{
            top: 20,
            right: 20,
            zIndex: 99999, // Guarantee isolation overhead relative stacking contexts
          }}
          toastOptions={{
            style: {
              background: '#0b0826',
              color: '#ffffff',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '14px',
              padding: '14px 16px',
              fontSize: '13px',
              fontWeight: '500',
              boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#8b5cf6',
                secondary: '#0b0826',
              },
            },
            error: {
              duration: 4000,
              iconTheme: {
                primary: '#ef4444',
                secondary: '#0b0826',
              },
            },
          }}
        />

        <Routes>
          {/* PUBLIC ROUTES */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

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
    </AuthProvider>
  );
}

export default App;