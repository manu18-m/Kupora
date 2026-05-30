import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, doc, deleteDoc, updateDoc, getDoc, addDoc, onSnapshot } from 'firebase/firestore'; 
import { db, auth } from '../firebase'; 
import { setDoc } from 'firebase/firestore';
import { 
  LayoutDashboard, Wallet, ShieldCheck, Bell, BarChart3, 
  Flame, Zap, PlusCircle, Search, Menu, X, Check, Copy, 
  Sparkles, LogOut, Settings, AlertCircle
} from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

// --- SUB-COMPONENT: SIDEBAR NAV ---
const Sidebar = ({ isOpen, toggleSidebar, onNavigate }) => {
  const links = [
    { icon: LayoutDashboard, label: 'Overview', path: '/dashboard', active: true },
    { icon: BarChart3, label: 'Analytics', path: '/dashboard' },
    { icon: Wallet, label: 'Earnings', path: '/dashboard' },
    { icon: Flame, label: 'Marketplace', path: '/browse' },
    { icon: Settings, label: 'Settings', path: '/dashboard' },
  ];

  return (
    <aside className={`fixed top-0 left-0 bottom-0 z-50 w-[85vw] sm:w-64 bg-[#050215] border-r border-r-white/5 p-6 flex flex-col justify-between transition-transform duration-300 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-base text-white">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-purple-600 to-cyan-400 flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span>Kup<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">ora</span></span>
          </div>
          <button onClick={toggleSidebar} className="p-1 text-zinc-400 hover:text-white lg:hidden"><X className="w-5 h-5" /></button>
        </div>
        <nav className="space-y-1.5">
          {links.map((link, idx) => (
            <button key={idx} onClick={() => onNavigate(link.path)} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${link.active ? 'bg-white/5 text-white border border-white/5 shadow-inner' : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.02]'}`}>
              <link.icon className={`w-4 h-4 ${link.active ? 'text-purple-400' : 'text-zinc-400'}`} />
              {link.label}
            </button>
          ))}
        </nav>
      </div>
      <div className="pt-4 border-t border-white/5">
        <button onClick={() => onNavigate('/')} className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-zinc-500 hover:text-red-400 transition-colors rounded-xl"><LogOut className="w-4 h-4" /> Terminate Session</button>
      </div>
    </aside>
  );
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [metrics, setMetrics] = useState({ total: 0, active: 0, expired: 0 });
  const [earnings, setEarnings] = useState({ totalRevenue: 0, totalSales: 0 });
  const [purchases, setPurchases] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [notificationsLoading, setNotificationsLoading] = useState(true);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  
  // Profile Management Local States
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profile, setProfile] = useState({
  displayName: '',
  bio: '',
  twitter: '',
  website: '',
  upiId: '',
  phone: ''
});
  const [updateLoading, setUpdateLoading] = useState(false);

  // Inline Edit Local Form States
  const [editingId, setEditingId] = useState(null);
  const [editBrand, setEditBrand] = useState('');
  const [editDiscount, setEditDiscount] = useState('');
  const [editCode, setEditCode] = useState('');
  const [editExpiry, setEditExpiry] = useState('');
  const [editPrice, setEditPrice] = useState('');

  const initiateEditMode = (coupon) => {
    setEditingId(coupon.id);
    setEditBrand(coupon.brand);
    setEditDiscount(coupon.discount);
    setEditCode(coupon.code);
    setEditExpiry(coupon.expiry === 'Continuous Monitoring' ? '' : coupon.expiry);
    setEditPrice(coupon.price);
  };

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
    if (!currentUser) { setLoading(false); setNotificationsLoading(false); return; }

    // 1. Initial Profile State Pull Setup
    const fetchProfile = async () => {
      const snap = await getDoc(doc(db, 'profiles', currentUser.uid));
      if (snap.exists()) setProfile(snap.data());
    };
    fetchProfile();

    // 2. Reactive Listener Layer: Merchant Coupons
    const qC = query(collection(db, 'coupons'), where('sellerId', '==', currentUser.uid));
    const unsubC = onSnapshot(qC, (snapshot) => {
      const raw = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setCoupons(raw);
      setMetrics(computeMetricsFromList(raw));
      setLoading(false);
    });

    // 3. Reactive Listener Layer: Relational Purchase Telemetry & Earnings Calculations
    const qP = query(collection(db, 'purchases'), where('buyerId', '==', currentUser.uid));
    const unsubP = onSnapshot(qP, async (snapshot) => {
      const sPurchases = await Promise.all(snapshot.docs.map(async (pDoc) => {
        const d = pDoc.data();
        const cSnap = await getDoc(doc(db, 'coupons', d.couponId));
        return { id: pDoc.id, couponId: d.couponId, brand: cSnap.exists() ? cSnap.data().brand : 'Unknown', savings: d.amount, date: 'Recent' };
      }));
      setPurchases(sPurchases);
      let rev = 0; 
      sPurchases.forEach(p => rev += parseFloat(String(p.savings).replace(/[^0-9.]/g, '')) || 0);
      setEarnings({ totalRevenue: rev, totalSales: sPurchases.length });
    });

    // 4. Reactive Listener Layer: User Scoped Notifications
    const qN = query(collection(db, 'notifications'), where('userId', '==', currentUser.uid));
    const unsubN = onSnapshot(qN, (snapshot) => {
      setNotifications(snapshot.docs.map(d => ({ id: d.id, ...d.data() })).sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)));
      setNotificationsLoading(false);
    });

    return () => { unsubC(); unsubP(); unsubN(); };
  }, []);

  // --- FIRESTORE OPERATION WORKFLOWS ---
  const handleUpdateProfile = async (e) => {
    e.preventDefault(); setUpdateLoading(true);
    try {
      await setDoc(
  doc(db, 'profiles', auth.currentUser.uid),
  profile,
  { merge: true }
);
      setIsEditingProfile(false);
    } catch(err) { alert("Sync failed."); } finally { setUpdateLoading(false); }
  };

  const handleUpdateCoupon = async (e, id) => {
    e.preventDefault(); setUpdateLoading(true);
    try {
      const p = { brand: editBrand, discount: editDiscount, code: editCode.toUpperCase(), expiry: editExpiry || 'Continuous Monitoring', price: editPrice };
      await updateDoc(doc(db, 'coupons', id), p);
      setEditingId(null);
    } catch(err) { alert("Failed update."); } finally { setUpdateLoading(false); }
  };

  const handleDeleteCoupon = async (e, id) => {
    e.stopPropagation(); if (!window.confirm("Terminate contract?")) return;
    setDeletingId(id);
    try { await deleteDoc(doc(db, 'coupons', id)); } finally { setDeletingId(null); }
  };

  // --- RECHARTS FORMATTING CONVERSION PIPELINE ---
  const operationalChartData = purchases.map((p, idx) => {
    const numericSavings = parseFloat(String(p.savings).replace(/[^0-9.]/g, '')) || 0;
    return { index: `Tx ${idx + 1}`, Yield: numericSavings, Volume: 1 };
  }).reverse();

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <SkeletonTheme baseColor="#0d0a27" highlightColor="#1a1540">
      <div className="min-h-screen bg-[#030014] text-zinc-200 antialiased font-sans">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-purple-600/5 rounded-full blur-[120px] pointer-events-none" />
        <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(false)} onNavigate={navigate} />
        
        <div className="lg:pl-64 min-h-screen flex flex-col">
          {/* GLOBAL CONSOLE HEADER */}
          <header className="h-16 border-b border-white/5 px-8 flex items-center justify-between sticky top-0 z-40 bg-[#030014]/40 backdrop-blur-md">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-zinc-400 hover:text-white"><Menu /></button>
            
            <div className="ml-auto relative">
              <button onClick={() => setNotificationsOpen(!notificationsOpen)} className="p-2 relative text-zinc-400 hover:text-white">
                <Bell />
                {unreadCount > 0 && <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-purple-500" />}
              </button>
              <AnimatePresence>
                {notificationsOpen && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute right-0 mt-2 w-[90vw] sm:w-80 bg-[#0b0826] border border-white/10 rounded-xl p-4 shadow-2xl z-50 overflow-y-auto max-h-96">
                    {notificationsLoading ? (
                      <div className="space-y-2 py-1"><Skeleton height={32} count={3} className="mb-1" /></div>
                    ) : notifications.length === 0 ? (
                      <div className="p-2 text-xs font-mono text-zinc-500 text-center">No recent alerts recorded.</div>
                    ) : (
                      notifications.map(n => <div key={n.id} onClick={async() => await updateDoc(doc(db,'notifications',n.id),{read:true})} className={`p-2 rounded-lg text-xs mb-1 cursor-pointer transition-colors ${!n.read ? 'bg-purple-900/20 text-white' : 'text-zinc-400 hover:bg-white/5'}`}>{n.message}</div>)
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </header>

          {/* CORE WORKSPACE FRAME */}
          <main className="flex-1 p-3 sm:p-6 lg:p-8 max-w-[1600px] w-full mx-auto grid grid-cols-1 xl:grid-cols-12 gap-8">
            <div className="xl:col-span-8 space-y-8">
              
              {/* HERO INSIGHT METRIC BARS */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { label: "Total Revenue", val: `$${earnings.totalRevenue.toFixed(2)}` },
                  { label: "Uploaded Coupons", val: `${metrics.total} modules` },
                  { label: "Total Sales", val: `${earnings.totalSales} units` }
                ].map((card, index) => (
                  <div key={index} className="glass-panel border border-white/5 p-6 rounded-2xl bg-white/[0.01]">
                    <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">{card.label}</span>
                    <div className="text-2xl font-extrabold text-white mt-1">
                      {loading ? <Skeleton width={120} height={28} className="mt-1" /> : card.val}
                    </div>
                  </div>
                ))}
              </div>

              {/* HIGH-VISIBILITY RESPONSIVE RECHARTS ANALYTICS GRID CONTAINER */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-white/5 rounded-2xl p-5 bg-white/[0.01] relative overflow-hidden">
                  <div className="mb-4"><h4 className="text-xs font-mono uppercase tracking-wider text-zinc-400">Revenue Analytics</h4></div>
                  <div className="h-48 w-full">
                    {loading ? (
                      <Skeleton height="100%" className="rounded-xl" />
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={operationalChartData.length ? operationalChartData : [{index: '0', Yield: 0}]}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                          <XAxis dataKey="index" stroke="#4b5563" fontSize={9} tickLine={false} />
                          <YAxis stroke="#4b5563" fontSize={9} tickLine={false} axisLine={false} />
                          <Tooltip contentStyle={{ backgroundColor: '#0b0826', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '11px', fontFamily: 'monospace' }} />
                          <Line type="monotone" dataKey="Yield" stroke="#a78bfa" strokeWidth={2} dot={{ fill: '#7c3aed', r: 3 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </div>

                <div className="border border-white/5 rounded-2xl p-5 bg-white/[0.01] relative overflow-hidden">
                  <div className="mb-4"><h4 className="text-xs font-mono uppercase tracking-wider text-zinc-400">Sales Activity </h4></div>
                  <div className="h-48 w-full">
                    {loading ? (
                      <Skeleton height="100%" className="rounded-xl" />
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={operationalChartData.length ? operationalChartData : [{index: '0', Volume: 0}]}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                          <XAxis dataKey="index" stroke="#4b5563" fontSize={9} tickLine={false} />
                          <YAxis stroke="#4b5563" fontSize={9} tickLine={false} axisLine={false} />
                          <Tooltip contentStyle={{ backgroundColor: '#0b0826', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '11px', fontFamily: 'monospace' }} />
                          <Bar dataKey="Volume" fill="url(#cyanGradient)" radius={[4, 4, 0, 0]}>
                            <defs><linearGradient id="cyanGradient" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#22d3ee" stopOpacity={0.8}/><stop offset="100%" stopColor="#06b6d4" stopOpacity={0.2}/></linearGradient></defs>
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </div>
              </div>

              {/* IDENTITY METADATA MODERATION GRID */}
              <div className="border border-white/5 rounded-2xl p-6 bg-white/[0.01] space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-semibold text-white">Profile Settings</h4>
                  {!loading && <button onClick={() => setIsEditingProfile(!isEditingProfile)} className="text-xs text-purple-400 font-mono hover:text-purple-300">{isEditingProfile ? 'Abort' : 'Edit'}</button>}
                </div>
                {loading ? (
                  <div className="space-y-2"><Skeleton width={140} height={16} /><Skeleton count={2} height={12} width="85%" /></div>
                ) : isEditingProfile ? (
                  <form onSubmit={handleUpdateProfile} className="space-y-3">
                    <input value={profile.displayName} onChange={e => setProfile({...profile, displayName: e.target.value})} className="w-full bg-black/40 border border-white/10 p-2 rounded text-sm text-white focus:outline-none" placeholder="Display Name" />
                    <textarea value={profile.bio} onChange={e => setProfile({...profile, bio: e.target.value})} className="w-full bg-black/40 border border-white/10 p-2 rounded text-sm text-white focus:outline-none" placeholder="Bio Description" />
                   
                    <input
  value={profile.phone || ''}
  onChange={e =>
    setProfile({
      ...profile,
      phone: e.target.value
    })
  }
  className="w-full bg-black/40 border border-white/10 p-2 rounded text-sm text-white focus:outline-none"
  placeholder="Phone Number"
/>

<input
  value={profile.upiId || ''}
  onChange={e =>
    setProfile({
      ...profile,
      upiId: e.target.value
    })
  }
  className="w-full bg-black/40 border border-white/10 p-2 rounded text-sm text-white focus:outline-none"
  placeholder="UPI ID (manu@paytm)"
/>
                    <button type="submit" disabled={updateLoading} className="bg-white text-black px-4 py-2 rounded text-xs font-bold font-mono transition-opacity disabled:opacity-50">{updateLoading ? 'Saving...' : 'Save Changes'}</button>
                  </form>
                ) : (
                 <div className="space-y-1 text-xs text-zinc-400">
  <p className="text-white font-bold">
    {profile.displayName || 'Set Profile Name Signature'}
  </p>

  <p className="leading-relaxed">
    {profile.bio || 'No workspace operational biography defined.'}
  </p>

  <p className="text-zinc-500">
    Phone: {profile.phone || 'Not Set'}
  </p>

  <p className="text-zinc-500">
    UPI: {profile.upiId ? 'Configured ✅' : 'Not Set'}
  </p>
</div>
                )}
                </div>

              {/* OWNED MODULE PARAMS STORAGE MODULE TRAY */}
              <div className="border border-white/5 rounded-2xl p-6 space-y-4 bg-white/[0.01]">
                <h4 className="text-sm font-semibold text-white">Your Coupons</h4>
                <div className="space-y-2">
                  {loading ? (
                    Array(2).fill(0).map((_, i) => <div key={i} className="border border-white/5 rounded-xl p-4 bg-black/20"><Skeleton height={20} width="40%" /></div>)
                  ) : coupons.length === 0 ? (
                    <div className="text-center font-mono text-xs text-zinc-600 py-4">No active vouchers listed.</div>
                  ) : (
                    coupons.map(up => (
                      <div key={up.id} className="border border-white/5 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-black/20">
                        {editingId === up.id ? (
                          <form onSubmit={(e) => handleUpdateCoupon(e, up.id)} className="flex flex-col sm:flex-row w-full gap-2 items-stretch sm:items-center">
                            <input value={editBrand} onChange={(e) => setEditBrand(e.target.value)} className="bg-black/60 border border-white/10 text-white text-xs p-2 rounded flex-1 focus:outline-none" />
                            <button type="submit" className="text-xs font-mono text-black bg-white px-3 py-2 rounded-lg">Commit</button>
                          </form>
                        ) : (
                          <><span className="text-xs font-medium text-zinc-200">{up.brand}</span> <div className="flex gap-2 text-xs font-mono"><button onClick={() => initiateEditMode(up)} className="text-zinc-500 hover:text-white transition-colors">Edit</button><button onClick={(e) => handleDeleteCoupon(e, up.id)} className="text-red-500 hover:text-red-400 transition-colors">Delete</button></div></>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>
          </main>
        </div>
      </div>
    </SkeletonTheme>
  );
}