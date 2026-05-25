import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, Wallet, History, ArrowUpRight, ShieldCheck, 
  Bell, BarChart3, Flame, Zap, PlusCircle, Search, Menu, 
  X, Check, ChevronRight, Copy, Sparkles, LogOut, Settings
} from 'lucide-react';

// --- MOCK DATA ---
const RECENT_PURCHASES = [
  { id: '1', brand: 'Supabase Pro', date: '2 hours ago', savings: '$25.00', status: 'Success', code: 'SUPA25NOW' },
  { id: '2', brand: 'TailwindUI', date: '1 day ago', savings: '$70.00', status: 'Success', code: 'TWUI70VIP' },
  { id: '3', brand: 'Render Host', date: '3 days ago', savings: '$15.00', status: 'Success', code: 'RNDR15OFF' },
];

const UPLOADED_COUPONS = [
  { id: '1', brand: 'Vercel Enterprise', views: '1.2K', usage: '84%', yield: '$420.00' },
  { id: '2', brand: 'Resend Email', views: '430', usage: '91%', yield: '$110.00' },
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

// --- SUB-COMPONENT: SIDEBAR NAV ---
const Sidebar = ({ isOpen, toggleSidebar }) => {
  const links = [
    { icon: LayoutDashboard, label: 'Overview', active: true },
    { icon: BarChart3, label: 'Analytics' },
    { icon: Wallet, label: 'Liquidity Vault' },
    { icon: Flame, label: 'Marketplace' },
    { icon: Settings, label: 'Node Settings' },
  ];

  return (
    <aside className={`fixed top-0 left-0 bottom-0 z-50 w-64 bg-[#050215] border-r border-white/5 p-6 flex flex-col justify-between transition-transform duration-300 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
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
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${link.active ? 'bg-white/5 text-white border border-white/5 shadow-inner' : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.02]'}`}
            >
              <link.icon className={`w-4 h-4 ${link.active ? 'text-purple-400' : 'text-zinc-400'}`} />
              {link.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="pt-4 border-t border-white/5">
        <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-zinc-500 hover:text-red-400 transition-colors rounded-xl">
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
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#030014] text-zinc-200 antialiased font-sans">
      
      {/* GLOBAL RADIAL ACCENT FIELD */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-purple-600/5 rounded-full blur-[120px] pointer-events-none" />

      {/* RENDER ACTIVE NAVIGATION */}
      <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(false)} />

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
              <span className="text-xs font-medium text-zinc-300 hidden md:block">operator_0x1</span>
            </div>
          </div>
        </header>

        {/* PRIMARY VIEWPORT SCROLL SPACE */}
        <main className="flex-1 p-4 sm:p-8 space-y-8 max-w-[1600px] w-full mx-auto grid grid-cols-1 xl:grid-cols-12 gap-8 space-y-0">
          
          {/* LEFT 8-COLUMN GRID CONTAINER */}
          <div className="xl:col-span-8 space-y-8">
            
            {/* HERO INSIGHT METRIC BARS */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              {/* LIQUIDITY POSITION CARD */}
              <motion.div whileHover={{ y: -2 }} className="glass-panel border border-white/5 p-6 rounded-2xl bg-white/[0.01] space-y-3 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500/5 blur-xl pointer-events-none" />
                <div className="flex justify-between items-center text-zinc-500">
                  <span className="text-xs font-mono tracking-wider uppercase">Yield Wallet</span>
                  <Wallet className="w-4 h-4 text-purple-400" />
                </div>
                <div className="space-y-0.5">
                  <h3 className="text-2xl font-extrabold text-white tracking-tight">$1,240.45</h3>
                  <p className="text-[11px] font-medium text-emerald-400 flex items-center gap-0.5">
                    <ArrowUpRight className="w-3 h-3" /> +14.2% this micro-cycle
                  </p>
                </div>
              </motion.div>

              {/* SELLER TRUST METRIC */}
              <motion.div whileHover={{ y: -2 }} className="glass-panel border border-white/5 p-6 rounded-2xl bg-white/[0.01] space-y-3 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-20 h-20 bg-cyan-500/5 blur-xl pointer-events-none" />
                <div className="flex justify-between items-center text-zinc-500">
                  <span className="text-xs font-mono tracking-wider uppercase">Trust Index</span>
                  <ShieldCheck className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="space-y-0.5">
                  <h3 className="text-2xl font-extrabold text-white tracking-tight">99.4 <span className="text-xs text-zinc-500 font-normal">/ 100</span></h3>
                  <p className="text-[11px] font-mono tracking-wider text-cyan-400 uppercase">Tier 1 Elite Publisher</p>
                </div>
              </motion.div>

              {/* REVENUE CHART METRIC */}
              <motion.div whileHover={{ y: -2 }} className="glass-panel border border-white/5 p-6 rounded-2xl bg-white/[0.01] space-y-3 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-20 h-20 bg-indigo-500/5 blur-xl pointer-events-none" />
                <div className="flex justify-between items-center text-zinc-500">
                  <span className="text-xs font-mono tracking-wider uppercase">Saved Pools</span>
                  <BarChart3 className="w-4 h-4 text-indigo-400" />
                </div>
                <div className="space-y-0.5">
                  <h3 className="text-2xl font-extrabold text-white tracking-tight">$410.00</h3>
                  <p className="text-[11px] text-zinc-500">Cumulative stack optimization</p>
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
              {/* CSS inline height simulation mockup bar line */}
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
                    {RECENT_PURCHASES.map((p) => (
                      <tr key={p.id} className="hover:bg-white/[0.01] transition-colors">
                        <td className="p-4 font-medium text-white">{p.brand}</td>
                        <td className="p-4 text-zinc-500">{p.date}</td>
                        <td className="p-4 text-emerald-400 font-medium">{p.savings}</td>
                        <td className="p-4"><CodeChip code={p.code} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* UPLOADED CONTRACT MANAGEMENT PLATFORM BAR */}
            <div className="border border-white/5 rounded-2xl bg-white/[0.01] p-6 space-y-4">
              <h4 className="text-sm font-semibold text-white">Your Uploaded Yield Modules</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {UPLOADED_COUPONS.map((up) => (
                  <div key={up.id} className="border border-white/5 rounded-xl p-4 bg-white/[0.01] flex justify-between items-center">
                    <div>
                      <h5 className="text-sm font-medium text-white">{up.brand}</h5>
                      <p className="text-xs text-zinc-500 mt-1">Analytics: <span className="text-zinc-400">{up.views} clicks</span> • Usage: <span className="text-purple-400">{up.usage}</span></p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-mono text-zinc-500 uppercase">Gross Yield</p>
                      <p className="text-sm font-bold text-white mt-0.5">{up.yield}</p>
                    </div>
                  </div>
                ))}
              </div>
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
                <button className="w-full py-2.5 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-xs font-medium shadow-[0_0_15px_rgba(124,58,237,0.2)] transition-all flex items-center justify-center gap-2 group">
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
                    {/* Ring timeline bullet point node */}
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