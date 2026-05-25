import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';

// --- ATOMIC EMBEDDED INLINE SVGS (CRASH IMMUNITY) ---
const ShieldCheck = () => <svg className="w-5 h-5 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>;
const Star = () => <svg className="w-4 h-4 text-amber-400 fill-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>;
const Zap = () => <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>;
const ShoppingBag = () => <svg className="w-4 h-4 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>;
const CheckCircle = () => <svg className="w-4 h-4 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>;
const Mail = () => <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>;
const Twitter = () => <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>;
const ArrowRight = () => <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>;
const ActivityIcon = () => <svg className="w-4 h-4 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>;

// --- MOCK DATA FOR A PREMIUM SELLER ---
const SELLER_PROPS = {
  name: 'DevOps_Liquidity_Alpha',
  handle: '@devops_alpha',
  avatar: 'DA',
  bio: 'Specializing in continuous liquidity pools for infrastructure and development tool access. All allocations synthetically validated.',
  trustScore: 98.6,
  verificationLevel: 'Apex Verified',
  verified: true,
  rating: 4.9,
  reviewsCount: 128,
  totalSales: 1420,
  redemptionRate: 99.4,
  joined: 'Oct 2023',
  social: { twitter: '#', website: '#' },
  activity: [
    { id: 1, type: 'listing', text: 'Deployed new Vercel Pro allocation block', time: '2m ago' },
    { id: 2, type: 'sale', text: 'Validated GitHub Copilot token execution', time: '14m ago' },
    { id: 3, type: 'review', text: 'Received 5-star rating for Figma coupon', time: '2h ago' },
  ],
  inventory: [
    { id: 1, brand: 'Vercel Pro', discount: '40% Off', price: '$12/mo', oldPrice: '$20/mo', match: 99, verified: 'ai', category: 'DevOps' },
    { id: 2, brand: 'GitHub Copilot', discount: '20% Off Annual', price: '$80/yr', oldPrice: '$100/yr', match: 97, verified: 'ai', category: 'Dev Tools' },
    { id: 3, brand: 'Supabase Pro', discount: '50% Credits', price: '$0 Base', oldPrice: '$50 value', match: 95, verified: 'ai', category: 'Database' },
    { id: 4, brand: 'Midjourney AI', discount: '1 Month Free', price: '$0', oldPrice: '$30 value', match: 92, verified: 'manual', category: 'AI Tools' },
  ]
};

// --- SUB-COMPONENT: DYNAMIC METRIC CARD ---
const MetricCard = ({ icon: Icon, label, value, color }) => (
  <motion.div 
    whileHover={{ y: -2 }}
    className="bg-white/[0.01] border border-white/5 rounded-2xl p-5 space-y-2"
  >
    <div className="flex justify-between items-center text-zinc-500">
      <span className="text-xs font-mono tracking-wider uppercase">{label}</span>
      <Icon />
    </div>
    <div className="space-y-0.5">
      <h3 className="text-2xl font-extrabold text-white tracking-tight">{value}</h3>
    </div>
  </motion.div>
);

// --- SUB-COMPONENT: INVENTORY COUPON CARD ---
const InventoryCard = ({ coupon }) => {
  const navigate = useNavigate();
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="glass-card border border-white/5 rounded-2xl p-5 flex flex-col justify-between group relative overflow-hidden"
    >
       <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-purple-500/10 to-transparent blur-xl pointer-events-none group-hover:from-purple-500/15 transition-all" />
      
      <div>
        <div className="flex justify-between items-start mb-4">
          <h4 className="text-white font-bold text-base flex items-center gap-1.5 group-hover:text-purple-400 transition-colors">
            {coupon.brand}
            {coupon.match >= 95 && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />}
          </h4>
          <span className="text-[10px] font-mono tracking-wider text-purple-400 bg-purple-950/40 border border-purple-800/30 px-2.5 py-1 rounded-md uppercase">
            {coupon.category}
          </span>
        </div>

        <div className="space-y-0.5 mb-5">
          <h2 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 tracking-tight">
            {coupon.discount}
          </h2>
          <p className="text-xs text-zinc-300">
            Effective price: <span className="text-white font-semibold">{coupon.price}</span> <span className="text-zinc-600 line-through ml-1">{coupon.oldPrice}</span>
          </p>
        </div>
      </div>

      <div className="space-y-3 mt-auto">
        <div className="flex items-center justify-between text-xs font-mono border-t border-white/5 pt-3">
          {coupon.verified === 'ai' ? (
            <span className="flex items-center gap-1 text-cyan-400">
              <Zap /> AI Verified
            </span>
          ) : (
            <span className="text-zinc-500">Manual Check</span>
          )}
          <span className="text-emerald-400">{coupon.match}% Accuracy</span>
        </div>

        <button 
          type="button"
          onClick={() => navigate(`/browse`)}
          className="w-full py-2.5 px-4 bg-white/[0.03] hover:bg-white text-zinc-300 hover:text-black rounded-xl text-xs font-medium border border-white/5 hover:border-white transition-all flex items-center justify-center gap-2"
        >
          View Dynamic Parameters <ArrowRight />
        </button>
      </div>
    </motion.div>
  );
};

export default function SellerProfilePage() {
  const navigate = useNavigate();
  const { handle } = useParams();

  return (
    <div className="min-h-screen bg-[#030014] text-zinc-200 antialiased font-sans relative pb-24">
      {/* Background Decorative Flares */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-cyan-600/5 rounded-full blur-[120px] pointer-events-none" />

      {/* HEADER NAVBAR MOCK */}
      <nav className="h-16 border-b border-white/5 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-50 bg-[#030014]/60 backdrop-blur-xl">
        <div className="flex items-center gap-2 font-bold text-sm text-white">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-purple-600 to-cyan-400 flex items-center justify-center">
            <Zap />
          </div>
          VoucherAI <span className="text-zinc-600 font-normal">/ Creator Matrix</span>
        </div>
        <button onClick={() => navigate('/browse')} className="text-xs text-purple-400 hover:text-purple-300 transition-colors font-medium flex items-center gap-1">
          Back to Database <ArrowRight />
        </button>
      </nav>

      {/* MAIN ARCHITECTURE: SPLIT GRID */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 mt-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* LEFT COLUMN: PROFILE CARD & METRICS (4-COL) */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Main Animated Profile Identity Card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card border border-white/10 rounded-3xl p-8 relative overflow-hidden text-center"
          >
            <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-purple-500/15 via-transparent to-transparent blur-2xl pointer-events-none" />
            
            {/* Avatar & Verification Badge */}
            <div className="relative inline-block mb-5">
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-purple-500 to-indigo-600 p-[1px] shadow-lg shadow-purple-600/20">
                <div className="w-full h-full bg-zinc-950 rounded-[23px] flex items-center justify-center font-black text-3xl text-white">
                  {SELLER_PROPS.avatar}
                </div>
              </div>
              {SELLER_PROPS.verified && (
                <span className="absolute -bottom-2 -right-2 p-1.5 rounded-xl bg-cyan-400 text-black border-4 border-[#030014] shadow-lg">
                  <ShieldCheck />
                </span>
              )}
            </div>

            {/* Identity Info */}
            <h1 className="text-2xl font-black text-white tracking-tight flex items-center justify-center gap-2">
              {SELLER_PROPS.name}
            </h1>
            <p className="text-xs font-mono text-cyan-400 mt-1 uppercase tracking-wider">{handle || SELLER_PROPS.handle}</p>
            
            {/* Short Bio */}
            <p className="text-sm text-zinc-400 mt-5 leading-relaxed font-normal px-2">
              {SELLER_PROPS.bio}
            </p>

            {/* Action Bar */}
            <div className="mt-8 flex gap-2 justify-center">
              <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-xl text-xs font-medium text-white shadow-lg shadow-purple-600/20 flex items-center gap-1.5">
                <Mail /> Message
              </button>
              <button className="p-2.5 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.06] text-zinc-400 hover:text-white transition-all">
                <Twitter />
              </button>
            </div>
          </motion.div>

          {/* Key Trust Metrics Grid */}
          <div className="grid grid-cols-2 gap-4">
            <MetricCard icon={ShieldCheck} label="Trust Score" value={`${SELLER_PROPS.trustScore}%`} color="text-cyan-400" />
            <MetricCard icon={Star} label="Avg Rating" value={`${SELLER_PROPS.rating} / 5`} color="text-amber-400" />
            <MetricCard icon={ShoppingBag} label="Validated Sales" value={SELLER_PROPS.totalSales} color="text-purple-400" />
            <MetricCard icon={CheckCircle} label="Yield Rate" value={`${SELLER_PROPS.redemptionRate}%`} color="text-emerald-400" />
          </div>

          {/* Activity Timeline */}
          <section className="glass-card rounded-2xl p-6 border border-white/5 space-y-5">
            <h3 className="text-xs font-mono uppercase tracking-widest text-zinc-500 flex items-center gap-1.5">
              <ActivityIcon /> Telemetry Event Log
            </h3>
            <div className="space-y-5 relative pl-4 border-l border-white/5 text-xs text-zinc-400">
              {SELLER_PROPS.activity.map(event => (
                <div key={event.id} className="relative">
                  <span className="absolute -left-[20px] top-1 w-2 h-2 rounded-full bg-purple-500 ring-4 ring-[#030014]" />
                  <p className="text-zinc-300 font-normal leading-relaxed">{event.text}</p>
                  <p className="text-[11px] font-mono text-zinc-600">{event.time}</p>
                </div>
              ))}
            </div>
          </section>

        </div>

        {/* RIGHT COLUMN: ACTIVE INVENTORY GRID (8-COL) */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Section Header */}
          <div className="flex justify-between items-center pb-4 border-b border-white/5 gap-4 flex-wrap">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Validated Allocation Index</h2>
              <p className="text-xs text-zinc-500 mt-1">Natively executing synthetic verification on active token segments.</p>
            </div>
            <span className="text-xs font-mono text-purple-400 bg-purple-950/40 border border-purple-800/30 px-3 py-1.5 rounded-full whitespace-nowrap">
              {SELLER_PROPS.inventory.length} active node allocations
            </span>
          </div>

          {/* Coupon Inventory Responsive Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {SELLER_PROPS.inventory.map(coupon => (
              <InventoryCard key={coupon.id} coupon={coupon} />
            ))}
          </div>

        </div>

      </main>
    </div>
  );
}