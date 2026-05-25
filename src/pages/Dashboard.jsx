import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, doc, deleteDoc, updateDoc, getDoc, addDoc, onSnapshot } from 'firebase/firestore'; 
import { db, auth } from '../firebase'; 
import { 
  LayoutDashboard, Wallet, ShieldCheck, Bell, BarChart3, 
  Flame, Zap, PlusCircle, Search, Menu, X, Check, Copy, 
  Sparkles, LogOut, Settings, AlertCircle
} from 'lucide-react';

const Sidebar = ({ isOpen, toggleSidebar, onNavigate }) => {
  const links = [
    { icon: LayoutDashboard, label: 'Overview', path: '/dashboard', active: true },
    { icon: BarChart3, label: 'Analytics', path: '/dashboard' },
    { icon: Wallet, label: 'Liquidity Vault', path: '/dashboard' },
    { icon: Flame, label: 'Marketplace', path: '/browse' },
    { icon: Settings, label: 'Node Settings', path: '/dashboard' },
  ];
  return (
    <aside className={`fixed top-0 left-0 bottom-0 z-50 w-64 bg-[#050215] border-r border-r-white/5 p-6 flex flex-col justify-between transition-transform duration-300 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-base text-white">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-purple-600 to-cyan-400 flex items-center justify-center"><Zap className="w-4 h-4 text-white" /></div>
            <span>Voucher<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">AI</span></span>
          </div>
          <button onClick={toggleSidebar} className="p-1 text-zinc-400 hover:text-white lg:hidden"><X className="w-5 h-5" /></button>
        </div>
        <nav className="space-y-1.5">
          {links.map((link, idx) => (
            <button key={idx} onClick={() => onNavigate(link.path)} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${link.active ? 'bg-white/5 text-white border border-white/5 shadow-inner' : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.02]'}`}>
              <link.icon className={`w-4 h-4 ${link.active ? 'text-purple-400' : 'text-zinc-400'}`} />{link.label}
            </button>
          ))}
        </nav>
      </div>
      <div className="pt-4 border-t border-white/5"><button onClick={() => onNavigate('/')} className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-zinc-500 hover:text-red-400 transition-colors rounded-xl"><LogOut className="w-4 h-4" /> Terminate Session</button></div>
    </aside>
  );
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({ total: 0, active: 0, expired: 0 });
  const [earnings, setEarnings] = useState({ totalRevenue: 0, totalSales: 0 });
  const [purchases, setPurchases] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  
  // Profile Management
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profile, setProfile] = useState({ displayName: '', bio: '', twitter: '', website: '' });
  const [updateLoading, setUpdateLoading] = useState(false);

  const computeMetricsFromList = (list) => {
    const currentDate = new Date();
    let totalCount = 0, expiredCount = 0;
    list.forEach(c => {
      totalCount++;
      if (c.expiry && typeof c.expiry === 'string' && !c.expiry.includes('Continuous')) {
        const expDate = new Date(c.expiry);
        if (!isNaN(expDate.getTime()) && expDate < currentDate) expiredCount++;
      }
    });
    return { total: totalCount, expired: expiredCount };
  };

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (!currentUser) { setLoading(false); return; }

    // 1. Reactive Profile Fetch
    const fetchProfile = async () => {
      const snap = await getDoc(doc(db, 'profiles', currentUser.uid));
      if (snap.exists()) setProfile(snap.data());
    };
    fetchProfile();

    // 2. Reactive Listeners
    const unsubC = onSnapshot(query(collection(db, 'coupons'), where('sellerId', '==', currentUser.uid)), (snap) => {
      const raw = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setCoupons(raw);
      setMetrics(computeMetricsFromList(raw));
      setLoading(false);
    });

    const unsubP = onSnapshot(query(collection(db, 'purchases'), where('buyerId', '==', currentUser.uid)), async (snap) => {
      const sPurchases = await Promise.all(snap.docs.map(async (pDoc) => {
        const d = pDoc.data();
        const cSnap = await getDoc(doc(db, 'coupons', d.couponId));
        return { id: pDoc.id, brand: cSnap.exists() ? cSnap.data().brand : 'Unknown', savings: d.amount, date: 'Recent' };
      }));
      setPurchases(sPurchases);
      let rev = 0; sPurchases.forEach(p => rev += parseFloat(p.savings.replace(/[^0-9.]/g, '')) || 0);
      setEarnings({ totalRevenue: rev, totalSales: sPurchases.length });
    });

    const unsubN = onSnapshot(query(collection(db, 'notifications'), where('userId', '==', currentUser.uid)), (snap) => {
      setNotifications(snap.docs.map(d => ({ id: d.id, ...d.data() })).sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)));
    });

    return () => { unsubC(); unsubP(); unsubN(); };
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault(); setUpdateLoading(true);
    try {
      await updateDoc(doc(db, 'profiles', auth.currentUser.uid), profile);
      setIsEditingProfile(false);
    } catch(err) { alert("Sync failed."); } finally { setUpdateLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#030014] text-zinc-200 antialiased font-sans">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(false)} onNavigate={navigate} />
      <div className="lg:pl-64 min-h-screen flex flex-col">
        <header className="h-16 border-b border-white/5 px-8 flex items-center justify-between sticky top-0 z-40 bg-[#030014]/40 backdrop-blur-md">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden"><Menu /></button>
          <div className="ml-auto relative">
            <button onClick={() => setNotificationsOpen(!notificationsOpen)} className="p-2 relative"><Bell />{notifications.filter(n => !n.read).length > 0 && <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-purple-500" />}</button>
            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-[#0b0826] border border-white/10 rounded-xl p-4 shadow-2xl z-50">
                {notifications.map(n => <div key={n.id} onClick={async() => await updateDoc(doc(db,'notifications',n.id),{read:true})} className={`p-2 cursor-pointer ${!n.read ? 'bg-purple-900/20' : ''}`}>{n.message}</div>)}
              </div>
            )}
          </div>
        </header>

        <main className="flex-1 p-8 grid grid-cols-1 xl:grid-cols-12 gap-8">
          <div className="xl:col-span-8 space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="glass-panel border border-white/5 p-6 rounded-2xl">Revenue: ${earnings.totalRevenue.toFixed(2)}</div>
              <div className="glass-panel border border-white/5 p-6 rounded-2xl">Total Nodes: {metrics.total}</div>
              <div className="glass-panel border border-white/5 p-6 rounded-2xl">Sales: {earnings.totalSales}</div>
            </div>

            {/* Profile Management Section */}
            <div className="border border-white/5 rounded-2xl p-6 bg-white/[0.01] space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="text-sm font-semibold text-white">Public Identity Matrix</h4>
                <button onClick={() => setIsEditingProfile(!isEditingProfile)} className="text-xs text-purple-400">{isEditingProfile ? 'Abort' : 'Edit'}</button>
              </div>
              {isEditingProfile ? (
                <form onSubmit={handleUpdateProfile} className="space-y-3">
                  <input value={profile.displayName} onChange={e => setProfile({...profile, displayName: e.target.value})} className="w-full bg-black p-2 rounded text-sm" placeholder="Display Name" />
                  <textarea value={profile.bio} onChange={e => setProfile({...profile, bio: e.target.value})} className="w-full bg-black p-2 rounded text-sm" placeholder="Bio" />
                  <button type="submit" disabled={updateLoading} className="bg-white text-black px-4 py-2 rounded text-xs font-bold">{updateLoading ? 'Saving...' : 'Save Changes'}</button>
                </form>
              ) : (
                <div className="space-y-1 text-xs text-zinc-400">
                  <p className="text-white font-bold">{profile.displayName || 'Set Name'}</p>
                  <p>{profile.bio || 'No bio set.'}</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}