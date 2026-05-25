import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs, doc, deleteDoc, updateDoc, getDoc, addDoc } from 'firebase/firestore'; 
import { db, auth } from '../firebase'; 
import { 
  LayoutDashboard, Wallet, ShieldCheck, Bell, BarChart3, 
  Flame, Zap, PlusCircle, Search, Menu, X, Check, Copy, 
  Sparkles, LogOut, Settings, AlertCircle
} from 'lucide-react';

// --- MOCK DATA (MAINTAINED AUXILIARY SATELLITES) ---
const RECENT_PURCHASES = [
  { id: '1', brand: 'Supabase Pro', date: '2 hours ago', savings: '$25.00', status: 'Success', code: 'SUPA25NOW' },
  { id: '2', brand: 'TailwindUI', date: '1 day ago', savings: '$70.00', status: 'Success', code: 'TWUI70VIP' },
  { id: '3', brand: 'Render Host', date: '3 days ago', savings: '$15.00', status: 'Success', code: 'RNDR15OFF' },
];

const TRENDING_COUPONS = [
  { id: '1', brand: 'Cursor Pro', discount: '1 Month Free', confidence: '99%', category: 'AI Tools' },
  { id: '2', brand: 'Linear App', discount: '20% Off Base', confidence: '94%', category: 'DevOps' },
];

const ACTIVITY_FEED = [
  { id: 1, type: 'match', text: 'AI successfully verified Stripe API coupon payload', time: 'Just now' },
  { id: 2, type: 'sale', text: 'Your Vercel token generated $42.00 in marketplace yield', time: '14m ago' },
  { id: 3, type: 'payout', text: 'Wallet clearance finalized via USDC protocol layer', time: '1h ago' },
];

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
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-purple-600 to-cyan-400 flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span>Voucher<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">AI</span></span>
          </div>
          <button onClick={toggleSidebar} className="p-1 text-zinc-400 hover:text-white lg:hidden">
            <X className="w-5 h-5" />
          </button>
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

const CodeChip = ({ code }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => { navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 1500); };
  return (
    <button type="button" onClick={handleCopy} className={`font-mono text-xs px-2.5 py-1 rounded-md border flex items-center gap-1.5 transition-all ${copied ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-white/[0.02] border-white/5 text-zinc-400 hover:border-white/10 hover:text-white'}`}>
      <span>{code}</span> {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
    </button>
  );
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [metrics, setMetrics] = useState({ total: 0, active: 0, expired: 0 });
  const [purchases, setPurchases] = useState([]);
  const [purchasesLoading, setPurchasesLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [notificationsLoading, setNotificationsLoading] = useState(true);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(false);
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
    let totalCount = 0, activeCount = 0, expiredCount = 0;
    list.forEach(c => {
      totalCount++;
      let isExpired = false;
      if (c.expiry && typeof c.expiry === 'string' && !c.expiry.includes('Continuous')) {
        const expDate = new Date(c.expiry);
        if (!isNaN(expDate.getTime()) && expDate < currentDate) isExpired = true;
      }
      if (isExpired) expiredCount++; else activeCount++;
    });
    return { total: totalCount, active: activeCount, expired: expiredCount };
  };

  useEffect(() => {
    const fetchEcosystemData = async () => {
      const currentUser = auth.currentUser;
      if (!currentUser) { setLoading(false); setPurchasesLoading(false); setNotificationsLoading(false); return; }

      // 1. Coupons
      try {
        const couponsQuery = query(collection(db, 'coupons'), where('sellerId', '==', currentUser.uid));
        const couponsSnapshot = await getDocs(couponsQuery);
        let totalCount = 0, activeCount = 0, expiredCount = 0;
        const rawCoupons = [], currentDate = new Date();
        couponsSnapshot.forEach((doc) => {
          const data = doc.data(); totalCount++;
          let isExpired = false;
          if (data.expiry && typeof data.expiry === 'string' && !data.expiry.includes('Continuous')) {
            const expDate = new Date(data.expiry);
            if (!isNaN(expDate.getTime()) && expDate < currentDate) isExpired = true;
          }
          if (isExpired) expiredCount++; else activeCount++;
          rawCoupons.push({ id: doc.id, brand: data.brand || 'Unknown', discount: data.discount || 'Special', expiry: data.expiry || 'Continuous', price: data.price || '$0', code: data.code || 'X', createdAt: data.createdAt || new Date().toISOString() });
        });
        rawCoupons.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setCoupons(rawCoupons);
        setMetrics({ total: totalCount, active: activeCount, expired: expiredCount });
      } catch (err) { console.error(err); } finally { setLoading(false); }

      // 2. Purchases
      try {
        const pQuery = query(collection(db, 'purchases'), where('buyerId', '==', currentUser.uid));
        const pSnap = await getDocs(pQuery);
        const sPurchases = await Promise.all(pSnap.docs.map(async (pDoc) => {
          const data = pDoc.data();
          let brand = 'Unknown', discount = 'Promo', code = 'X';
          const cSnap = await getDoc(doc(db, 'coupons', data.couponId));
          if (cSnap.exists()) { const cD = cSnap.data(); brand = cD.brand; discount = cD.discount; code = cD.code; }
          return { id: pDoc.id, brand, discount, code, savings: data.amount, date: 'Recent' };
        }));
        setPurchases(sPurchases);
      } catch (err) { console.error(err); } finally { setPurchasesLoading(false); }

      // 3. Notifications
      try {
        const nQuery = query(collection(db, 'notifications'), where('userId', '==', currentUser.uid));
        const nSnap = await getDocs(nQuery);
        const rawN = nSnap.docs.map(d => ({ id: d.id, ...d.data() }));
        rawN.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setNotifications(rawN);
      } catch (err) { console.error(err); } finally { setNotificationsLoading(false); }
    };
    fetchEcosystemData();
  }, []);

  const handleUpdateCoupon = async (e, couponId) => {
    e.preventDefault(); setUpdateLoading(true);
    try {
      const payload = { brand: editBrand, discount: editDiscount, code: editCode.toUpperCase(), expiry: editExpiry || 'Continuous Monitoring', price: editPrice };
      await updateDoc(doc(db, 'coupons', couponId), payload);
      setCoupons(prev => { const m = prev.map(c => c.id === couponId ? { ...c, ...payload } : c); setMetrics(computeMetricsFromList(m)); return m; });
      setEditingId(null);
    } catch (err) { alert("Update failed."); } finally { setUpdateLoading(false); }
  };

  const handleDeleteCoupon = async (e, couponId) => {
    e.stopPropagation(); if (!window.confirm("Terminate contract?")) return;
    setDeletingId(couponId);
    try {
      await deleteDoc(doc(db, 'coupons', couponId));
      setCoupons(prev => { const m = prev.filter(c => c.id !== couponId); setMetrics(computeMetricsFromList(m)); return m; });
    } finally { setDeletingId(null); }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-[#030014] text-zinc-200 antialiased font-sans">
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-purple-600/5 rounded-full blur-[120px] pointer-events-none" />
      <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(false)} onNavigate={navigate} />
      <div className="lg:pl-64 min-h-screen flex flex-col">
        <header className="h-16 border-b border-white/5 px-4 sm:px-8 flex items-center justify-between bg-[#030014]/40 backdrop-blur-md sticky top-0 z-40">
          <button onClick={() => setSidebarOpen(true)} className="p-2 text-zinc-400 hover:text-white lg:hidden"><Menu className="w-5 h-5" /></button>
          <div className="flex items-center gap-4 ml-auto">
            <div className="relative">
              <button onClick={() => setNotificationsOpen(!notificationsOpen)} className="w-9 h-9 rounded-xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.04] flex items-center justify-center text-zinc-400 hover:text-white relative transition-all"><Bell className="w-4 h-4" />{unreadCount > 0 && <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-purple-500 ring-4 ring-[#030014]" />}</button>
              <AnimatePresence>
                {notificationsOpen && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute right-0 mt-2 w-80 bg-[#0b0826] border border-white/10 rounded-2xl p-4 shadow-2xl z-50">
                    {notifications.map(n => <div key={n.id} onClick={async() => { await updateDoc(doc(db,'notifications',n.id),{read:true}); setNotifications(prev => prev.map(x => x.id === n.id ? {...x, read: true} : x)) }} className={`p-2 cursor-pointer ${!n.read ? 'bg-purple-900/20' : ''}`}>{n.message}</div>)}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-8 space-y-8 max-w-[1600px] w-full mx-auto grid grid-cols-1 xl:grid-cols-12 gap-8">
          <div className="xl:col-span-8 space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="glass-panel border border-white/5 p-6 rounded-2xl">Total Nodes: {metrics.total}</div>
              <div className="glass-panel border border-white/5 p-6 rounded-2xl">Active: {metrics.active}</div>
              <div className="glass-panel border border-white/5 p-6 rounded-2xl">Expired: {metrics.expired}</div>
            </div>

            <div className="border border-white/5 rounded-2xl bg-white/[0.01] p-6 space-y-4">
              <h4 className="text-sm font-semibold text-white">Your Uploaded Yield Modules</h4>
              {coupons.map(up => (
                <div key={up.id} className="border border-white/5 rounded-xl p-4 bg-white/[0.01] flex justify-between items-center">
                  {editingId === up.id ? (
                    <form onSubmit={(e) => handleUpdateCoupon(e, up.id)} className="flex w-full gap-2">
                      <input value={editBrand} onChange={(e) => setEditBrand(e.target.value)} className="bg-black text-white p-1 rounded" />
                      <button type="submit">Commit</button>
                    </form>
                  ) : (
                    <>
                      <span>{up.brand}</span>
                      <div className="flex gap-2">
                        <button onClick={() => initiateEditMode(up)}>Edit</button>
                        <button onClick={(e) => handleDeleteCoupon(e, up.id)}>Delete</button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}