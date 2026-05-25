import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, query, where, getDocs, doc, updateDoc, deleteDoc, addDoc } from 'firebase/firestore'; 
import { db } from '../firebase'; 
import { 
  ShieldCheck, Bell, BarChart3, Flame, Zap, PlusCircle, Search, Menu, 
  X, Check, ChevronRight, Copy, Sparkles, LogOut, Settings,
  AlertCircle, Cpu, Shield, CheckSquare, AlertTriangle, DollarSign, Users
} from 'lucide-react';

// --- ENTERPRISE VECTOR ICONS (MAINTAINED) ---
const ShieldIcon = () => <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>;
const UsersIcon = () => <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>;
const CheckQueueIcon = () => <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>;
const AlertIcon = () => <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>;
const DollarIcon = () => <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>;
const CpuIcon = () => <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line><line x1="20" y1="9" x2="23" y2="9"></line><line x1="20" y1="15" x2="23" y2="15"></line><line x1="1" y1="9" x2="4" y2="9"></line><line x1="1" y1="15" x2="4" y2="15"></line></svg>;

// --- MOCK PROTOCOL DATASHEETS (MAINTAINED) ---
const FRAUD_SIGNALS = [
  { id: 'TRX-901', seller: 'Spam_Voucher_Bot', trigger: 'Rapid sequential code injection failures', threat: 'High', action: 'Flagged Node' },
  { id: 'TRX-442', seller: 'Coupon_Farmer_Proxy', trigger: 'Geographical multi-IP verification bursts', threat: 'Critical', action: 'Isolating' },
  { id: 'TRX-109', seller: 'Valid_Dev_Ops_Alpha', trigger: 'Abnormal high-value coupon validation payload', threat: 'Low', action: 'Monitored' }
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('Overview');
  
  // --- REAL-TIME FIRESTORE MODERATION TETHER STATES ---
  const [queueList, setQueueList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actioningId, setActioningId] = useState(null);

  useEffect(() => {
    const fetchPendingModerationQueue = async () => {
      setLoading(true);
      try {
        const q = query(collection(db, 'coupons'), where('status', '==', 'pending'));
        const querySnapshot = await getDocs(q);
        
        const pendingCoupons = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          pendingCoupons.push({
            id: doc.id,
            brand: data.brand || 'Unknown Project',
            discount: data.discount || 'Special Promotion Tier',
            code: data.code || 'UNASSIGNED_HASH',
            category: data.category || 'SaaS Tools',
            expiry: data.expiry || 'Continuous Monitoring',
            price: data.price || '$0.00 Base',
            sellerId: data.sellerId || 'Anonymous Node',
            createdAt: data.createdAt || new Date().toISOString(),
            trustFactor: data.trustFactor || Math.floor(Math.random() * 10) + 89
          });
        });

        pendingCoupons.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setQueueList(pendingCoupons);
      } catch (err) {
        console.error("Moderation queue data fetch tracer fault: ", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPendingModerationQueue();
  }, []);

  // --- MODERATION ACTION INTERFACES WITH LIVE NOTIFICATION INJECTIONS ---
  const handleApproveCoupon = async (item) => {
    const { id, sellerId, brand } = item;
    setActioningId(id);
    try {
      const docRef = doc(db, 'coupons', id);
      
      // 1. Commit mutation change to remote coupon block status
      await updateDoc(docRef, { status: 'approved' });
      
      // 2. Dispatch live approval notification document inside the ledger system
      await addDoc(collection(db, 'notifications'), {
        userId: sellerId,
        message: `Your coupon for ${brand} has been approved and is now live in the marketplace.`,
        type: "approval",
        read: false,
        createdAt: new Date().toISOString()
      });

      // 3. Clean dynamic queue buffer state instantly
      setQueueList(prev => prev.filter(coupon => coupon.id !== id));
    } catch (err) {
      console.error("Ledger execution authorization fault: ", err);
    } finally {
      setActioningId(null);
    }
  };

  const handleRejectCoupon = async (item) => {
    const { id, sellerId, brand } = item;
    setActioningId(id);
    try {
      const docRef = doc(db, 'coupons', id);
      
      // 1. Commit mutation change to remote coupon block status
      await updateDoc(docRef, { status: 'rejected' });
      
      // 2. Dispatch live rejection notification document inside the ledger system
      await addDoc(collection(db, 'notifications'), {
        userId: sellerId,
        message: `Your coupon for ${brand} was rejected during moderation review.`,
        type: "rejection",
        read: false,
        createdAt: new Date().toISOString()
      });

      // 3. Clean dynamic queue buffer state instantly
      setQueueList(prev => prev.filter(coupon => coupon.id !== id));
    } catch (err) {
      console.error("Ledger execution rejection fault: ", err);
    } finally {
      setActioningId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#02010a] text-zinc-200 font-sans antialiased flex">
      
      {/* PERSISTENT ADMIN NAVIGATION BAR SIDEBAR (300px) */}
      <aside className="w-[280px] border-r border-white/5 bg-[#04030f]/60 backdrop-blur-xl flex flex-col justify-between hidden md:flex shrink-0">
        <div className="p-6 space-y-8">
          {/* Logo Frame Header */}
          <div className="flex items-center gap-2.5 font-bold text-sm text-white">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-red-500 via-purple-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-600/10">
              <CpuIcon />
            </div>
            <div>
              <span className="block font-black leading-none">VoucherAI</span>
              <span className="text-[10px] text-red-400 font-mono tracking-widest uppercase mt-0.5 block">Admin Protocol</span>
            </div>
          </div>

          {/* Navigation Control List Options */}
          <nav className="space-y-1">
            {[
              { id: 'Overview', icon: CpuIcon },
              { id: 'AI Fraud Control', icon: ShieldIcon },
              { id: 'Approval Queue', icon: CheckQueueIcon },
              { id: 'Disputes & Reports', icon: AlertIcon }
            ].map(tab => (
              <button
                key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all ${activeTab === tab.id ? 'bg-white/5 text-white border border-white/5 shadow-inner' : 'text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.01]'}`}
              >
                <tab.icon />
                {tab.id}
              </button>
            ))}
          </nav>
        </div>

        {/* Global Pipeline Sync Marker Footer */}
        <div className="p-6 border-t border-white/5 text-[10px] font-mono text-zinc-600 space-y-1.5">
          <div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Validator Sync Secured</div>
          <p>© 2026 Admin Cluster Vault v4.2</p>
        </div>
      </aside>

      {/* CENTRAL ANALYTICS DESKTOP VIEWPORT SPACE */}
      <div className="flex-1 min-w-0 flex flex-col overflow-y-auto max-h-screen relative">
        <div className="absolute top-0 right-1/4 w-[600px] h-[300px] bg-red-600/5 rounded-full blur-[160px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-[400px] h-[400px] bg-purple-600/5 rounded-full blur-[140px] pointer-events-none" />

        {/* TOP CONFIG BAR MARGIN STATUS */}
        <header className="h-16 border-b border-white/5 bg-[#02010a]/40 backdrop-blur-md px-6 sm:px-10 flex items-center justify-between sticky top-0 z-40">
          <h2 className="text-xs font-mono uppercase font-black text-zinc-400 tracking-widest">Sys_State: Execution Engine Control Terminal</h2>
          <div className="flex items-center gap-4 text-xs font-mono font-bold bg-white/5 border border-white/5 p-2 px-4 rounded-xl">
            <span className="text-zinc-500">Security Clearance T1:</span> <span className="text-red-400">Root_Operator</span>
          </div>
        </header>

        {/* CORE INTERACTIVE CONTENT BODY WRAPPER */}
        <div className="p-6 sm:p-10 flex-1 relative z-10 max-w-7xl w-full mx-auto space-y-10">

          <AnimatePresence mode="wait">
            {activeTab === 'Overview' && (
              <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-10">
                
                {/* META METRIC NUMERICAL ROW TILES CARD */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="glass-card rounded-2xl p-5 border border-white/5 flex justify-between items-center">
                    <div><p className="text-[11px] font-mono tracking-wider text-zinc-500 uppercase">Gross Revenue Pool</p><h3 className="text-2xl font-black text-white mt-1">$412,980</h3></div>
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center"><DollarIcon /></div>
                  </div>
                  <div className="glass-card rounded-2xl p-5 border border-white/5 flex justify-between items-center">
                    <div><p className="text-[11px] font-mono tracking-wider text-zinc-500 uppercase">Suspicious Flag Nodes</p><h3 className="text-2xl font-black text-red-400 mt-1">14 Systems</h3></div>
                    <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-400 flex items-center justify-center"><ShieldIcon /></div>
                  </div>
                  <div className="glass-card rounded-2xl p-5 border border-white/5 flex justify-between items-center">
                    <div><p className="text-[11px] font-mono tracking-wider text-zinc-500 uppercase">Validation Queue Size</p><h3 className="text-2xl font-black text-purple-400 mt-1">{loading ? '...' : queueList.length} Allocation Requests</h3></div>
                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center"><CheckQueueIcon /></div>
                  </div>
                  <div className="glass-card rounded-2xl p-5 border border-white/5 flex justify-between items-center">
                    <div><p className="text-[11px] font-mono tracking-wider text-zinc-500 uppercase">Active Core User Nodes</p><h3 className="text-2xl font-black text-white mt-1">240,490 accounts</h3></div>
                    <div className="w-10 h-10 rounded-xl bg-zinc-500/10 text-zinc-400 flex items-center justify-center"><UsersIcon /></div>
                  </div>
                </div>

                {/* THE HIGH-TECH HIGH-DENSITY VISUALIZATION MATRIX PANEL */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Revenue Cluster Chart Graph Frame Bar (2-Col) */}
                  <div className="lg:col-span-2 glass-card rounded-2xl p-6 border border-white/5 space-y-4">
                    <h3 className="text-xs font-mono uppercase text-zinc-400 tracking-wider flex items-center gap-2"><DollarIcon /> Network Yield Velocity Load</h3>
                    <div className="h-64 flex items-end gap-3 pt-6 border-b border-white/5 px-2 relative">
                      <div className="absolute top-4 left-0 right-0 text-[10px] font-mono text-zinc-700 border-b border-dashed border-white/5 pb-1">MAX INTENSITY BAR SCALE: 100% BURST CAPACITY</div>
                      {[40, 65, 50, 85, 95, 75, 60, 90, 100, 80, 55, 70].map((val, idx) => (
                        <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group cursor-pointer">
                          <div style={{ height: `${val}%` }} className="w-full bg-gradient-to-t from-purple-600 via-indigo-500 to-cyan-400 rounded-t group-hover:opacity-80 transition-opacity relative">
                            <span className="absolute -top-7 left-1/2 -translate-x-1/2 font-mono text-[9px] bg-black text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">Cycle {idx+1}: {val}%</span>
                          </div>
                          <span className="text-[9px] font-mono text-zinc-600">M{idx+1}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* AI Threat Classification Index Component (1-Col) */}
                  <div className="glass-card rounded-2xl p-6 border border-white/5 space-y-6">
                    <h3 className="text-xs font-mono uppercase text-zinc-400 tracking-wider flex items-center gap-2"><ShieldIcon /> Threat Vector Vectors</h3>
                    <div className="space-y-4">
                      {[
                        { name: 'Placebo Token Spamting', rate: 72, color: 'bg-red-500' },
                        { name: 'Multi-Proxy Verification Scans', rate: 48, color: 'bg-orange-500' },
                        { name: 'Merchant API Exploits', rate: 19, color: 'bg-amber-500' }
                      ].map((item, i) => (
                        <div key={i} className="space-y-2">
                          <div className="flex justify-between text-xs font-mono"><span className="text-zinc-400">{item.name}</span> <span className="text-white font-bold">{item.rate}% Risk</span></div>
                          <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden border border-white/5">
                            <div style={{ width: `${item.rate}%` }} className={`h-full ${item.color}`} />
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="bg-red-950/20 border border-red-900/30 text-red-400 rounded-xl p-4 text-xs leading-relaxed font-mono flex items-start gap-2.5">
                      <div className="w-2 h-2 rounded-full bg-red-500 mt-1 animate-ping shrink-0" />
                      <p>AI Guard Alert: Persistent cluster brute force validation signature registered on cloud hosting arrays.</p>
                    </div>
                  </div>
                </div>

              </motion.div>
            )}

            {/* AI FRAUD DETECTOR MODULE */}
            {activeTab === 'AI Fraud Control' && (
              <motion.div key="fraud" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
                <div><h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">AI Cluster Fraud Monitoring Real-time Terminal</h1><p className="text-xs text-zinc-500 mt-1">Autonomous isolation logs feeding telemetry details from sandbox validation arrays.</p></div>
                <div className="glass-card rounded-2xl border border-white/5 overflow-hidden">
                  <div className="grid grid-cols-5 p-4 bg-white/5 font-mono text-[10px] text-zinc-400 uppercase font-black tracking-wider border-b border-white/5">
                    <div>Allocation ID</div><div>Seller Node User</div><div>Trigger Event Parameter</div><div>Threat Index</div><div className="text-right">Execution Action</div>
                  </div>
                  <div className="divide-y divide-white/5 text-xs">
                    {FRAUD_SIGNALS.map(signal => (
                      <div key={signal.id} className="grid grid-cols-5 p-4 items-center font-normal">
                        <div className="font-mono font-bold text-purple-400">{signal.id}</div>
                        <div className="text-white font-mono font-semibold">{signal.seller}</div>
                        <div className="text-zinc-400">{signal.trigger}</div>
                        <div><span className={`px-2 py-0.5 rounded-full font-mono text-[10px] font-bold ${signal.threat === 'Critical' ? 'bg-red-950/40 text-red-400 border border-red-900/50' : signal.threat === 'High' ? 'bg-orange-950/40 text-orange-400 border border-orange-900/50' : 'bg-zinc-900 text-zinc-400'}`}>{signal.threat}</span></div>
                        <div className="text-right text-zinc-500 font-mono font-medium">{signal.action}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* COUPON APPROVAL QUEUE MODULE */}
            {activeTab === 'Approval Queue' && (
              <motion.div key="queue" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
                <div><h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">Global Allocation Voucher Mint Queue</h1><p className="text-xs text-zinc-500 mt-1">Perform analytical verification checks manually before broadcasting blocks directly to consumers.</p></div>
                
                {loading ? (
                  <div className="font-mono text-xs text-zinc-500 animate-pulse py-4">Loading operational verification stack indices...</div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {queueList.map(item => (
                      <motion.div layout key={item.id} exit={{ scale: 0.9, opacity: 0 }} className="glass-card rounded-2xl p-5 border border-white/5 flex flex-col justify-between min-h-[240px]">
                        <div className="space-y-3">
                          <div className="flex justify-between items-start">
                            <span className="text-[9px] font-mono text-purple-400 bg-purple-950/40 border border-purple-900/30 px-2 py-0.5 rounded uppercase tracking-wider">ID: {item.id.slice(0,6)}</span> 
                            <span className="text-xs font-mono font-bold text-cyan-400">Trust Factor: {item.trustFactor}%</span>
                          </div>
                          <div>
                            <h4 className="text-white font-bold text-base truncate">{item.brand}</h4>
                            <p className="text-sm font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-300 tracking-tight mt-0.5">{item.discount}</p>
                          </div>
                          <div className="space-y-1 text-[11px] font-mono text-zinc-500 border-t border-white/5 pt-2">
                            <div>Hash Segment: <span className="text-zinc-300 font-bold">{item.code}</span></div>
                            <div>Valuation Base: <span className="text-zinc-300">{item.price}</span></div>
                            <div className="truncate">Node Signature: <span className="text-purple-400 text-[10px]">{item.sellerId}</span></div>
                          </div>
                        </div>
                        <div className="flex gap-2 border-t border-white/5 pt-4 mt-4">
                          <button 
                            disabled={actioningId === item.id}
                            onClick={() => handleApproveCoupon(item)} 
                            className="flex-1 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium hover:bg-emerald-500/20 transition-all disabled:opacity-50"
                          >
                            {actioningId === item.id ? 'Saving...' : 'Grant Auth'}
                          </button>
                          <button 
                            disabled={actioningId === item.id}
                            onClick={() => handleRejectCoupon(item)} 
                            className="px-3 py-2 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-medium hover:bg-red-500/20 transition-all disabled:opacity-50"
                          >
                            Deny
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
                
                {!loading && queueList.length === 0 && (
                  <div className="glass-card rounded-2xl p-12 border border-white/5 text-center text-zinc-600 text-sm font-mono uppercase tracking-wider">Verification execution complete. Core approval ledger is currently idle.</div>
                )}
              </motion.div>
            )}

            {/* REPORT DISPUTE ROUTINE FRAME */}
            {activeTab === 'Disputes & Reports' && (
              <motion.div key="disputes" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="glass-card rounded-2xl p-12 border border-white/5 text-center text-zinc-500 font-mono text-xs uppercase tracking-widest">
                No conflict parameters registered inside the current validation epochs block timeline loop.
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </div>
  );
}