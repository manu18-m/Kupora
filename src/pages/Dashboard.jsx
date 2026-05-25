import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs, doc, deleteDoc, updateDoc, getDoc } from 'firebase/firestore'; 
import { db, auth } from '../firebase'; 
import { 
  LayoutDashboard, Wallet, ShieldCheck, Bell, BarChart3, 
  Flame, Zap, PlusCircle, Search, Menu, X, Check, Copy, 
  Sparkles, LogOut, Settings, AlertCircle
} from 'lucide-react';

// --- MOCK DATA FOR THE TRACKERS (MAINTAINED AUXILIARY SATELLITES) ---
const TRENDING_COUPONS = [
  { id: '1', brand: 'Cursor Pro', discount: '1 Month Free', confidence: '99%', category: 'AI Tools' },
  { id: '2', brand: 'Linear App', discount: '20% Off Base', confidence: '94%', category: 'DevOps' },
];

const ACTIVITY_FEED = [
  { id: 1, type: 'match', text: 'AI successfully verified Stripe API coupon payload', time: 'Just now' },
  { id: 2, type: 'sale', text: 'Your Vercel token generated $42.00 in marketplace yield', time: '14m ago' },
  { id: 3, type: 'payout', text: 'Wallet clearance finalized via USDC protocol layer', time: '1h ago' },
];

// --- SUB-COMPONENT: SIDEBAR NAV ---
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
            <button
              key={idx}
              onClick={() => onNavigate(link.path)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${link.active ? 'bg-white/5 text-white border border-white/5 shadow-inner' : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.02]'}`}
            >
              <link.icon className={`w-4 h-4 ${link.active ? 'text-purple-400' : 'text-zinc-400'}`} />
              {link.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="pt-4 border-t border-white/5">
        <button 
          onClick={() => onNavigate('/')}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-zinc-500 hover:text-red-400 transition-colors rounded-xl"
        >
          <LogOut className="w-4 h-4" />
          Terminate Session
        </button>
      </div>
    </aside>
  );
};

// --- SUB-COMPONENT: MINI INTERACTIVE CODE CHIP ---
const CodeChip = ({ code }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button 
      type="button"
      onClick={handleCopy}
      className={`font-mono text-xs px-2.5 py-1 rounded-md border flex items-center gap-1.5 transition-all ${copied ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-white/[0.02] border-white/5 text-zinc-400 hover:border-white/10 hover:text-white'}`}
    >
      <span>{code}</span>
      {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
    </button>
  );
};

// --- MAIN UI CONTROLLER ---
export default function Dashboard() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // --- SELLER COUPONS MANAGEMENT STATES ---
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [metrics, setMetrics] = useState({ total: 0, active: 0, expired: 0 });

  // --- BUYER PURCHASE HISTORY STATES ---
  const [purchases, setPurchases] = useState([]);
  const [purchasesLoading, setPurchasesLoading] = useState(true);

  // --- INLINE EDIT FORM LOCAL CACHE STATES ---
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
    let totalCount = 0;
    let activeCount = 0;
    let expiredCount = 0;

    list.forEach(c => {
      totalCount++;
      let isExpired = false;
      if (c.expiry && typeof c.expiry === 'string' && !c.expiry.includes('Continuous')) {
        const expDate = new Date(c.expiry);
        if (!isNaN(expDate.getTime()) && expDate < currentDate) {
          isExpired = true;
        }
      }
      if (isExpired) expiredCount++;
      else activeCount++;
    });

    return { total: totalCount, active: activeCount, expired: expiredCount };
  };

  // --- COMPOSITE DATA LOADING EFFECT ---
  useEffect(() => {
    const fetchEcosystemData = async () => {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        setLoading(false);
        setPurchasesLoading(false);
        return;
      }

      // 1. PIPELINE: FETCH SELLER REVENUE ASSIGNED MODULES
      try {
        const couponsQuery = query(collection(db, 'coupons'), where('sellerId', '==', currentUser.uid));
        const couponsSnapshot = await getDocs(couponsQuery);
        
        let totalCount = 0;
        let activeCount = 0;
        let expiredCount = 0;
        const rawCoupons = [];
        const currentDate = new Date();

        couponsSnapshot.forEach((doc) => {
          const data = doc.data();
          totalCount++;

          let isExpired = false;
          if (data.expiry && typeof data.expiry === 'string' && !data.expiry.includes('Continuous')) {
            const expDate = new Date(data.expiry);
            if (!isNaN(expDate.getTime()) && expDate < currentDate) {
              isExpired = true;
            }
          }

          if (isExpired) expiredCount++;
          else activeCount++;

          rawCoupons.push({
            id: doc.id,
            brand: data.brand || 'Unknown Node',
            discount: data.discount || 'Allocation Special',
            expiry: data.expiry || 'Continuous Monitoring',
            price: data.price || '$0.00 Base',
            code: data.code || 'UNKNOWN_PARAM',
            createdAt: data.createdAt || new Date().toISOString()
          });
        });

        rawCoupons.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setCoupons(rawCoupons);
        setMetrics({ total: totalCount, active: activeCount, expired: expiredCount });
      } catch (err) {
        console.error("Seller metrics compilation asset load error: ", err);
      } finally {
        setLoading(false);
      }

      // 2. PIPELINE: FETCH BUYER HISTORICAL TRANSACTION RECORDS
      try {
        const purchasesQuery = query(collection(db, 'purchases'), where('buyerId', '==', currentUser.uid));
        const purchaseSnap = await getDocs(purchasesQuery);
        
        const structuredPurchases = await Promise.all(
          purchaseSnap.docs.map(async (purchaseDoc) => {
            const purchaseData = purchaseDoc.data();
            let brandName = 'Unknown Target';
            let discountValue = 'Promo Block Unlocked';
            let couponCodeString = 'UNASSIGNED';

            if (purchaseData.couponId) {
              try {
                const couponDocSnap = await getDoc(doc(db, 'coupons', purchaseData.couponId));
                if (couponDocSnap.exists()) {
                  const couponData = couponDocSnap.data();
                  brandName = couponData.brand || brandName;
                  discountValue = couponData.discount || discountValue;
                  couponCodeString = couponData.code || couponCodeString;
                }
              } catch (docErr) {
                console.error("Relational schema cross-join trace loop error: ", docErr);
              }
            }

            let relativeTimeString = 'Recent Cycle';
            if (purchaseData.purchasedAt) {
              const diffMs = new Date() - new Date(purchaseData.purchasedAt);
              const diffMins = Math.floor(diffMs / 60000);
              const diffHours = Math.floor(diffMins / 60);
              if (diffMins < 60) relativeTimeString = `${diffMins}m ago`;
              else if (diffHours < 24) relativeTimeString = `${diffHours} hours ago`;
              else relativeTimeString = new Date(purchaseData.purchasedAt).toLocaleDateString();
            }

            return {
              id: purchaseDoc.id,
              couponId: purchaseData.couponId,
              brand: brandName,
              discount: discountValue,
              code: couponCodeString,
              date: relativeTimeString,
              savings: purchaseData.amount || '$0.00 Base'
            };
          })
        );

        setPurchases(structuredPurchases);
      } catch (err) {
        console.error("Buyer transaction profile tracking load fault: ", err);
      } finally {
        setPurchasesLoading(false);
      }
    };

    fetchEcosystemData();
  }, []);

  // --- FIRESTORE DELETE ROUTINE ---
  const handleDeleteCoupon = async (e, couponId) => {
    e.stopPropagation(); 

    const confirmWipe = window.confirm("Are you sure you want to terminate this contract allocation node?");
    if (!confirmWipe) return;

    setDeletingId(couponId);
    try {
      await deleteDoc(doc(db, 'coupons', couponId));

      setCoupons(prevCoupons => {
        const remaining = prevCoupons.filter(c => c.id !== couponId);
        setMetrics(computeMetricsFromList(remaining));
        return remaining;
      });
    } catch (err) {
      console.error("Ledger correction failure trace: ", err);
      alert("Error processing deletion node allocation.");
    } finally {
      setDeletingId(null);
    }
  };

  // --- FIRESTORE UPDATE ROUTINE ---
  const handleUpdateCoupon = async (e, couponId) => {
    e.preventDefault();
    e.stopPropagation();
    setUpdateLoading(true);

    try {
      const docRef = doc(db, 'coupons', couponId);
      const payload = {
        brand: editBrand.trim(),
        discount: editDiscount.trim(),
        code: editCode.trim().toUpperCase(),
        expiry: editExpiry || 'Continuous Monitoring',
        price: editPrice.trim()
      };

      await updateDoc(docRef, payload);

      setCoupons(prevCoupons => {
        const mutatedList = prevCoupons.map(c => c.id === couponId ? { ...c, ...payload } : c);
        setMetrics(computeMetricsFromList(mutatedList));
        return mutatedList;
      });

      setEditingId(null);
    } catch (err) {
      console.error("Ledger modification transmission failure trace: ", err);
      alert("Error pushing compilation updates to remote collection node.");
    } finally {
      setUpdateLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030014] text-zinc-200 antialiased font-sans">
      
      {/* GLOBAL RADIAL ACCENT FIELD */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-purple-600/5 rounded-full blur-[120px] pointer-events-none" />

      {/* RENDER ACTIVE NAVIGATION */}
      <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(false)} onNavigate={(path) => navigate(path)} />

      {/* CORE FRAME LAYOUT CONTENT SLAG */}
      <div className="lg:pl-64 min-h-screen flex flex-col">
        
        {/* COMPONENT BAR TOP HEADER */}
        <header className="h-16 border-b border-white/5 px-4 sm:px-8 flex items-center justify-between bg-[#030014]/40 backdrop-blur-md sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="p-2 text-zinc-400 hover:text-white lg:hidden">
              <Menu className="w-5 h-5" />
            </button>
            <div className="relative hidden sm:block w-64">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500" />
              <input 
                type="text" 
                placeholder="Search index metadata..." 
                className="w-full bg-white/[0.02] border border-white/5 focus:border-purple-500/40 rounded-xl pl-9 pr-4 py-1.5 text-xs focus:outline-none transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* NOTIFICATIONS MATRIX HUB */}
            <button className="w-9 h-9 rounded-xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.04] flex items-center justify-center text-zinc-400 hover:text-white relative transition-all">
              <Bell className="w-4 h-4" />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-purple-500 ring-4 ring-[#030014]" />
            </button>
            
            {/* AVATAR ATOMIC PANEL */}
            <div className="flex items-center gap-2 border-l border-white/5 pl-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-500 to-indigo-600 p-[1px]">
                <div className="w-full h-full bg-zinc-950 rounded-[7px] flex items-center justify-center text-xs font-bold text-white">OP</div>
              </div>
              <span className="text-xs font-medium text-zinc-300 hidden md:block">
                {auth.currentUser ? auth.currentUser.email.split('@')[0] : 'operator_0x1'}
              </span>
            </div>
          </div>
        </header>

        {/* PRIMARY VIEWPORT SCROLL SPACE */}
        <main className="flex-1 p-4 sm:p-8 space-y-8 max-w-[1600px] w-full mx-auto grid grid-cols-1 xl:grid-cols-12 gap-8 space-y-0">
          
          {/* LEFT 8-COLUMN GRID CONTAINER */}
          <div className="xl:col-span-8 space-y-8">
            
            {/* HERO INSIGHT METRIC BARS */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              {/* TOTAL UPLOADED CONTRACT MATRIX CARD */}
              <motion.div whileHover={{ y: -2 }} className="glass-panel border border-white/5 p-6 rounded-2xl bg-white/[0.01] space-y-3 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500/5 blur-xl pointer-events-none" />
                <div className="flex justify-between items-center text-zinc-500">
                  <span className="text-xs font-mono tracking-wider uppercase">Total Deployed</span>
                  <BarChart3 className="w-4 h-4 text-purple-400" />
                </div>
                <div className="space-y-0.5">
                  <h3 className="text-2xl font-extrabold text-white tracking-tight">
                    {loading ? '...' : metrics.total} <span className="text-xs text-zinc-500 font-normal">nodes</span>
                  </h3>
                  <p className="text-[11px] font-medium text-purple-400 flex items-center gap-0.5">
                    Cumulative system architecture index
                  </p>
                </div>
              </motion.div>

              {/* ACTIVE ALLOCATIONS METRIC */}
              <motion.div whileHover={{ y: -2 }} className="glass-panel border border-white/5 p-6 rounded-2xl bg-white/[0.01] space-y-3 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-20 h-20 bg-cyan-500/5 blur-xl pointer-events-none" />
                <div className="flex justify-between items-center text-zinc-500">
                  <span className="text-xs font-mono tracking-wider uppercase">Active Allocations</span>
                  <ShieldCheck className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="space-y-0.5">
                  <h3 className="text-2xl font-extrabold text-white tracking-tight">
                    {loading ? '...' : metrics.active} <span className="text-xs text-zinc-500 font-normal">live</span>
                  </h3>
                  <p className="text-[11px] font-mono tracking-wider text-emerald-400 uppercase">
                    Natively verification operational
                  </p>
                </div>
              </motion.div>

              {/* EXPIRED CONTRACT TRACKER */}
              <motion.div whileHover={{ y: -2 }} className="glass-panel border border-white/5 p-6 rounded-2xl bg-white/[0.01] space-y-3 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-20 h-20 bg-red-500/5 blur-xl pointer-events-none" />
                <div className="flex justify-between items-center text-zinc-500">
                  <span className="text-xs font-mono tracking-wider uppercase">Expired Links</span>
                  <Wallet className="w-4 h-4 text-red-400" />
                </div>
                <div className="space-y-0.5">
                  <h3 className="text-2xl font-extrabold text-white tracking-tight">
                    {loading ? '...' : metrics.expired} <span className="text-xs text-zinc-500 font-normal">dead</span>
                  </h3>
                  <p className="text-[11px] text-zinc-500">Terminated contract conditions</p>
                </div>
              </motion.div>

            </div>

            {/* ANALYTICS SIMULATED GRAPH GRID VIEW */}
            <div className="border border-white/5 rounded-2xl p-6 bg-white/[0.01] space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="text-sm font-semibold text-white">Validation Yield Performance</h4>
                  <p className="text-xs text-zinc-500">Simulated programmatic hourly traffic load</p>
                </div>
                <span className="text-xs font-mono bg-purple-950/40 text-purple-400 px-2 py-0.5 rounded border border-purple-900/30">Live telemetry</span>
              </div>
              <div className="h-32 flex items-end gap-2 pt-4">
                {[40, 25, 45, 30, 55, 70, 65, 80, 50, 95, 60, 85].map((val, idx) => (
                  <div key={idx} className="flex-1 bg-white/5 rounded-t-md relative group h-full flex items-end">
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: `${val}%` }}
                      transition={{ duration: 0.6, delay: idx * 0.03 }}
                      className="w-full bg-gradient-to-t from-purple-600/40 via-indigo-500/60 to-cyan-400 rounded-t-md relative group-hover:brightness-125 transition-all"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* RECENT PURCHASES ROW BLOCK */}
            <div className="border border-white/5 rounded-2xl bg-white/[0.01] overflow-hidden">
              <div className="p-6 border-b border-white/5">
                <h4 className="text-sm font-semibold text-white">Recent Purchase Pipeline</h4>
              </div>
              <div className="overflow-x-auto">
                {purchasesLoading ? (
                  <div className="p-6 font-mono text-xs text-zinc-500 animate-pulse">
                    Synchronizing transaction pipeline logs...
                  </div>
                ) : purchases.length === 0 ? (
                  <div className="p-8 text-center text-zinc-500 font-mono text-xs flex flex-col items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-purple-400" />
                    <span>No active contract allocations unlocked inside your client history profile.</span>
                  </div>
                ) : (
                  <table className="w-full text-left text-xs text-zinc-400">
                    <thead className="bg-white/[0.02] text-zinc-500 font-mono uppercase tracking-wider text-[10px]">
                      <tr>
                        <th className="p-4">Target Brand</th>
                        <th className="p-4">Timestamp</th>
                        <th className="p-4">Retained Yield</th>
                        <th className="p-4">Runtime Token</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {purchases.map((p) => (
                        <tr 
                          key={p.id} 
                          onClick={() => p.couponId && navigate(`/coupon/${p.couponId}`)}
                          className="hover:bg-white/[0.01] transition-colors cursor-pointer"
                        >
                          <td className="p-4">
                            <span className="font-medium text-white block">{p.brand}</span>
                            <span className="text-[10px] text-purple-400 font-mono">{p.discount}</span>
                          </td>
                          <td className="p-4 text-zinc-500">{p.date}</td>
                          <td className="p-4 text-emerald-400 font-medium">{p.savings}</td>
                          <td className="p-4" onClick={(e) => e.stopPropagation()}>
                            <CodeChip code={p.code} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>

            {/* REAL-TIME DYNAMIC FIRESTORE OWNED TOKEN TRAY */}
            <div className="border border-white/5 rounded-2xl bg-white/[0.01] p-6 space-y-4">
              <h4 className="text-sm font-semibold text-white">Your Uploaded Yield Modules</h4>
              
              {loading ? (
                <div className="space-y-2 font-mono text-xs text-zinc-500 animate-pulse">
                  Synchronizing matrix ledger collections...
                </div>
              ) : coupons.length === 0 ? (
                <div className="p-6 text-center border border-dashed border-white/5 rounded-xl text-zinc-500 font-mono text-xs flex flex-col items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-purple-400" />
                  <span>No operational contract modules assigned to your node workspace signatures.</span>
                </div>
              ) : (
                <div className="space-y-3">
                  {coupons.slice(0, 4).map((up) => {
                    const isCurrentEditingTarget = editingId === up.id;
                    
                    return (
                      <div key={up.id} className="border border-white/5 rounded-xl p-4 bg-white/[0.01] transition-all relative group/card">
                        <AnimatePresence mode="wait">
                          {!isCurrentEditingTarget ? (
                            <motion.div 
                              key="view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                              onClick={() => navigate(`/coupon/${up.id}`)}
                              className="flex justify-between items-center cursor-pointer w-full"
                            >
                              <div className="min-w-0 flex-1 pr-3">
                                <h5 className="text-sm font-medium text-white truncate">{up.brand}</h5>
                                <p className="text-xs text-zinc-500 mt-1 truncate">
                                  Code: <span className="font-mono text-purple-400">{up.code}</span>
                                </p>
                              </div>
                              
                              <div className="text-right shrink-0 flex items-center gap-3">
                                <div>
                                  <p className="text-xs font-mono text-zinc-500 uppercase">Valuation</p>
                                  <p className="text-sm font-bold text-white mt-0.5">{up.price}</p>
                                </div>
                                
                                <div className="flex items-center gap-1.5 opacity-0 group-hover/card:opacity-100 transition-opacity pl-2">
                                  <button
                                    type="button"
                                    onClick={(e) => { e.stopPropagation(); initiateEditMode(up); }}
                                    className="p-2 rounded-lg border border-white/5 bg-white/[0.02] hover:bg-white/5 text-zinc-400 hover:text-white transition-all h-8 w-8 flex items-center justify-center"
                                    title="Edit Contract Parameters"
                                  >
                                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                                  </button>

                                  <button
                                    type="button"
                                    disabled={deletingId === up.id}
                                    onClick={(e) => handleDeleteCoupon(e, up.id)}
                                    className="p-2 rounded-lg border border-red-500/20 bg-red-950/10 hover:bg-red-500 hover:text-white text-red-400 transition-all h-8 w-8 flex items-center justify-center"
                                    title="Terminate Contract Allocation"
                                  >
                                    {deletingId === up.id ? (
                                      <div className="w-3 h-3 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                                    )}
                                  </button>
                                </div>
                              </div>
                            </motion.div>
                          ) : (
                            <motion.form 
                              key="edit" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                              onSubmit={(e) => handleUpdateCoupon(e, up.id)}
                              className="w-full space-y-3 pt-1"
                            >
                              <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                  <label className="text-[10px] font-mono text-zinc-600 uppercase tracking-wide">Brand Name</label>
                                  <input type="text" required value={editBrand} onChange={(e) => setEditBrand(e.target.value)} className="w-full bg-black/40 border border-white/10 focus:border-purple-500/60 text-xs text-white rounded-lg px-2.5 py-1.5 focus:outline-none transition-all" />
                               </div>
                                <div className="space-y-1">
                                  <label className="text-[10px] font-mono text-zinc-600 uppercase tracking-wide">Discount Value</label>
                                  <input type="text" required value={editDiscount} onChange={(e) => setEditDiscount(e.target.value)} className="w-full bg-black/40 border border-white/10 focus:border-purple-500/60 text-xs text-white rounded-lg px-2.5 py-1.5 focus:outline-none transition-all" />
                                </div>
                              </div>

                              <div className="grid grid-cols-3 gap-2">
                                <div className="space-y-1">
                                  <label className="text-[10px] font-mono text-zinc-600 uppercase tracking-wide">Promo Code</label>
                                  <input type="text" required value={editCode} onChange={(e) => setEditCode(e.target.value)} className="w-full bg-black/40 border border-white/10 focus:border-purple-500/60 text-xs text-purple-300 font-mono tracking-wider rounded-lg px-2 py-1.5 focus:outline-none transition-all" />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[10px] font-mono text-zinc-600 uppercase tracking-wide">Price Vector</label>
                                  <input type="text" required value={editPrice} onChange={(e) => setEditPrice(e.target.value)} className="w-full bg-black/40 border border-white/10 focus:border-purple-500/60 text-xs text-white rounded-lg px-2.5 py-1.5 focus:outline-none transition-all" />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[10px] font-mono text-zinc-600 uppercase tracking-wide">Expiry Target</label>
                                  <input type="date" value={editExpiry} onChange={(e) => setEditExpiry(e.target.value)} className="w-full bg-black/40 border border-white/10 focus:border-purple-500/60 text-[11px] text-zinc-400 rounded-lg px-2 py-1 focus:outline-none transition-all" />
                                </div>
                              </div>

                              <div className="flex justify-end gap-2 pt-2 border-t border-white/5">
                                <button
                                  type="button" disabled={updateLoading} onClick={() => setEditingId(null)}
                                  className="px-3 py-1.5 text-[11px] font-mono text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-all disabled:opacity-50"
                                >
                                  Abort
                                </button>
                                <button
                                  type="submit" disabled={updateLoading}
                                  className="px-4 py-1.5 text-[11px] font-mono font-bold text-black bg-white hover:bg-zinc-200 rounded-lg shadow-md transition-all flex items-center gap-1.5 disabled:opacity-50"
                                >
                                  {updateLoading ? (
                                    <div className="w-3 h-3 border-2 border-black border-t-transparent rounded-full animate-spin" />
                                  ) : (
                                    <>Commit</>
                                  )}
                                </button>
                              </div>
                            </motion.form>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>

          {/* RIGHT 4-COLUMN AUXILIARY FEED COLUMN */}
          <div className="xl:col-span-4 space-y-6">
            
            {/* QUICK ACTIONS UTILITY TRAY */}
            <div className="border border-white/5 bg-gradient-to-b from-purple-950/10 to-transparent rounded-2xl p-6 space-y-4">
              <h4 className="text-sm font-semibold text-white flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-purple-400" /> Command Controls
              </h4>
              <div className="space-y-2.5">
                <button 
                  onClick={() => navigate('/upload')}
                  className="w-full py-2.5 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-xs font-medium shadow-[0_0_15px_rgba(124,58,237,0.2)] transition-all flex items-center justify-center gap-2 group"
                >
                  <PlusCircle className="w-4 h-4" /> Inject New Yield Token
                </button>
                <button className="w-full py-2.5 px-4 border border-white/5 hover:border-white/10 bg-white/[0.02] hover:bg-white/[0.05] text-zinc-300 rounded-xl text-xs font-medium transition-all flex items-center justify-center gap-2">
                  Execute Bulk API CSV Upload
                </button>
              </div>
            </div>

            {/* TRENDING AI TRACKER HIGHLIGHTS */}
            <div className="border border-white/5 rounded-2xl p-6 space-y-4">
              <h4 className="text-sm font-semibold text-white">High Success Confidence Nodes</h4>
              <div className="space-y-3">
                {TRENDING_COUPONS.map((trend) => (
                  <div key={trend.id} className="p-3 rounded-xl border border-white/5 bg-white/[0.01] flex items-center justify-between group hover:border-white/10 transition-colors">
                    <div>
                      <h5 className="text-xs font-semibold text-white">{trend.brand}</h5>
                      <p className="text-[11px] text-purple-400 mt-0.5">{trend.discount}</p>
                    </div>
                    <span className="text-[10px] font-mono font-medium text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-900/30">
                      {trend.confidence} Match
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* REAL-TIME ACTIVITY TELEMETRY FEED */}
            <div className="border border-white/5 rounded-2xl p-6 space-y-4">
              <h4 className="text-sm font-semibold text-white">Live Event Stream Logs</h4>
              <div className="relative pl-4 border-l border-white/5 space-y-6 text-xs">
                {ACTIVITY_FEED.map((act) => (
                  <div key={act.id} className="relative space-y-1">
                    <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-purple-500 ring-4 ring-[#030014]" />
                    <p className="text-zinc-300 leading-relaxed font-normal">{act.text}</p>
                    <p className="text-[10px] font-mono text-zinc-600">{act.time}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </main>
      </div>
    </div>
  );
}