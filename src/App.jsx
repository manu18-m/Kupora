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
import EmailConfirmedPage from './pages/EmailConfirmedPage';

import { Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

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
              location.pathname === '/browse'
                ? 'text-purple-400'
                : 'text-zinc-400'
            }`}
          >
            Market
          </button>

          <button
            onClick={() => navigate('/dashboard')}
            className={`hover:text-purple-400 transition-colors ${
              location.pathname === '/dashboard'
                ? 'text-purple-400'
                : 'text-zinc-400'
            }`}
          >
            Dashboard
          </button>

          <button
            onClick={() => navigate('/chat')}
            className={`hover:text-purple-400 transition-colors ${
              location.pathname === '/chat'
                ? 'text-purple-400'
                : 'text-zinc-400'
            }`}
          >
            Messages
          </button>

          <button
            onClick={() => navigate('/upload')}
            className={`hover:text-purple-400 transition-colors ${
              location.pathname === '/upload'
                ? 'text-purple-400'
                : 'text-zinc-400'
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

  // NOT LOGGED IN
  if (!user) {
    return (
      <Navigate
        to="/login"
        state={{ from: location }}
        replace
      />
    );
  }

  // EMAIL NOT VERIFIED
  if (!user.emailVerified) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  // ROLE NOT ALLOWED
  if (allowedRoles && !allowedRoles.includes(role)) {
    return (
      <Navigate
        to="/dashboard"
        replace
      />
    );
  }

  return children;
};

// --- WRAPPER FOR FLUID PAGE TRANSITIONS ---
const PageTransitionWrapper = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{
        duration: 0.24,
        ease: [0.23, 1, 0.32, 1]
      }}
      className="w-full h-full min-h-0 min-w-0"
    >
      {children}
    </motion.div>
  );
};

// --- ANIMATED ROUTER ORCHESTRATION ---
function AnimatedAppRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>

        {/* PUBLIC ROUTES */}
        <Route
          path="/"
          element={
            <PageTransitionWrapper>
              <LandingPage />
            </PageTransitionWrapper>
          }
        />

        <Route
          path="/login"
          element={
            <PageTransitionWrapper>
              <LoginPage />
            </PageTransitionWrapper>
          }
        />
        
        <Route
          path="/signup"
          element={
            <PageTransitionWrapper>
              <SignupPage />
            </PageTransitionWrapper>
          }
        />

        <Route
          path="/email-confirmed"
          element={
            <PageTransitionWrapper>
              <EmailConfirmedPage />
            </PageTransitionWrapper>
          }
        />

        {/* MARKETPLACE */}
        <Route
          path="/browse"
          element={
            <DashboardLayout>
              <PageTransitionWrapper>
                <MarketplacePage />
              </PageTransitionWrapper>
            </DashboardLayout>
          }
        />

        {/* COUPON DETAILS */}
        <Route
          path="/coupon/:id"
          element={
            <DashboardLayout>
              <PageTransitionWrapper>
                <CouponDetailsPage />
              </PageTransitionWrapper>
            </DashboardLayout>
          }
        />

        {/* SELLER PROFILE */}
        <Route
          path="/seller/:handle"
          element={
            <DashboardLayout>
              <PageTransitionWrapper>
                <SellerProfilePage />
              </PageTransitionWrapper>
            </DashboardLayout>
          }
        />

        {/* USER DASHBOARD */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={['user', 'seller', 'admin']}>
              <DashboardLayout>
                <PageTransitionWrapper>
                  <Dashboard />
                </PageTransitionWrapper>
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
                <PageTransitionWrapper>
                  <ChatPage />
                </PageTransitionWrapper>
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
                <PageTransitionWrapper>
                  <UploadCouponPage />
                </PageTransitionWrapper>
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
                <PageTransitionWrapper>
                  <AdminDashboard />
                </PageTransitionWrapper>
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* FALLBACK */}
        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />

      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>

        {/* GLOBAL TOAST SYSTEM */}
        <Toaster
          position="top-right"
          containerStyle={{
            top: 20,
            right: 20,
            zIndex: 99999,
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

        <AnimatedAppRoutes />

      </Router>
    </AuthProvider>
  );
}

export default App;