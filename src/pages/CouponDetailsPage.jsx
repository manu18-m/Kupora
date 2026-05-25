import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, ShieldCheck, Clock, Copy, Check, ArrowLeft, 
  ThumbsUp, MessageSquare, AlertTriangle, ExternalLink, 
  HelpCircle, Star, Share2, CornerDownRight 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// --- MOCK COUPON OBJECT (PROPS SIMULATION SCHEMA) ---
const SELECTED_COUPON = {
  id: '0x-vercel-pro',
  brand: 'Vercel Pro Tier',
  discount: '40% Off Cloud Infrastructure',
  price: '$12.00/mo',
  oldPrice: '$20.00/mo',
  code: 'VERCEL40AI',
  category: 'Cloud Dev Infrastructure',
  expiry: '2026-09-30T00:00:00Z',
  logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vercel/vercel-original.svg',
  successRate: 99.4,
  aiConfidence: 99,
  seller: {
    name: 'DevOps_Liquidity_Alpha',
    handle: '@devops_alpha', // ⚡ Added identifier handle context
    verified: true,
    score: 98.6,
    totalSales: 1420,
    rank: 'Tier 1 Prime Publisher'
  },
  terms: [
    'Applies only to functional team and pro configurations.',
    'Max utilization baseline capped at 12 rolling cycles per organization.',
    'Zero compatibility stacking on top of parallel seed venture discount vouchers.'
  ],
  reviews: [
    { id: 1, user: 'indie_hacker_42', rating: 5, comment: 'Instant injection pipeline. Automated checking parameters matched perfectly. Saved $96 on our backend migration build instantly.', time: '3 hours ago' },
    { id: 2, user: 'procure_ops_node', rating: 5, comment: 'Synthetic verification payload data was true to scale. Solid cryptographic proof.', time: '2 days ago' }
  ],
  similars: [
    { id: 'sim-1', brand: 'Supabase Pro', value: '$50 Credits', code: 'SUPA50POOL', rate: 97 },
    { id: 'sim-2', brand: 'Cursor Editor', value: '20% OFF Base', code: 'CURS20NEXT', rate: 94 }
  ]
};

// --- SUB-COMPONENT: TIMER PROPS ENGINE ---
const CountdownEngine = ({ expiryDate }) => {
  const calculateDelta = () => {
    const delta = +new Date(expiryDate) - +new Date();
    if (delta <= 0) return null;
    return {
      d: Math.floor(delta / (1000 * 60 * 60 * 24)),
      h: Math.floor((delta / (1000 * 60 * 60)) % 24),
      m: Math.floor((delta / 1000 / 60) % 60),
      s: Math.floor((delta / 1000) % 60)
    };
  };

  const [timeLeft, setTimeLeft] = useState(calculateDelta());

  useEffect(() => {
    const clock = setInterval(() => setTimeLeft(calculateDelta()), 1000);
    return () => clearInterval(clock);
  }, [expiryDate]);

  if (!timeLeft) return <span className="text-red-400 font-mono">Contract Terminated / Expired</span>;

  return (
    <div className="flex gap-2 font-mono text-sm text-orange-400 font-bold">
      <Clock className="w-4 h-4 mt-0.5" />
      <span>{timeLeft.d}d {timeLeft.h}h {timeLeft.m}m {timeLeft.s}s</span>
    </div>
  );
};

export default function CouponDetailsPage() {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [reported, setReported] = useState(false);
  const [upvotes, setUpvotes] = useState(142);
  const [voted, setVoted] = useState(false);

  const triggerCopy = () => {
    navigator.clipboard.writeText(SELECTED_COUPON.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#030014] text-zinc-200 font-sans antialiased relative pb-24">
      {/* Ambient background grid beam flares */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-gradient-to-bl from-purple-600/10 via-indigo-500/5 to-transparent blur-[150px] pointer-events-none" />

      {/* TOP CONFIG HEADER CONTROL */}
      <div className="border-b border-white/5 bg-[#030014]/40 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between">
          <button 
            onClick={() => navigate('/browse')}
            className="inline-flex items-center gap-2 text-xs text-zinc-500 hover:text-white transition-colors font-medium group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" /> Return to Database Index
          </button>
          
          <div className="flex items-center gap-3">
            <button className="p-2 rounded-xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.04] text-zinc-400 hover:text-white transition-all">
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* MASTER COLUMNS ARCHITECTURE */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 mt-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* LEFT COLUMN COMPONENT LAYER: PREVIEW CARD + PRIMARY ACTION TRAY (5-COL) */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
          
          {/* THE MASTER CONVERSION DISPLAY CARD */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card border border-white/10 rounded-2xl p-6 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-purple-500/15 via-transparent to-transparent blur-2xl pointer-events-none" />
            
            {/* Main Badge Array Header */}
            <div className="flex justify-between items-start gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
                <img src={SELECTED_COUPON.logo} alt={SELECTED_COUPON.brand} className="w-10 h-10 object-contain" />
              </div>
              
              <div className="flex flex-col items-end gap-1.5 text-[10px] font-mono tracking-wider">
                <span className="flex items-center gap-1 text-cyan-400 bg-cyan-950/40 border border-cyan-800/50 px-2.5 py-0.5 rounded-full uppercase">
                  <Sparkles className="w-3 h-3 animate-pulse" /> AI CONFIDENCE: {SELECTED_COUPON.aiConfidence}%
                </span>
                <span className="text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2.5 py-0.5 rounded-full uppercase">
                  {SELECTED_COUPON.successRate}% YIELD VERIFIED
                </span>
              </div>
            </div>

            {/* Price Engine Section */}
            <div className="space-y-1 mb-6">
              <span className="text-xs font-mono uppercase text-zinc-500 tracking-widest">{SELECTED_COUPON.category}</span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">{SELECTED_COUPON.brand}</h1>
              <p className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-100 to-cyan-400 pt-1">
                {SELECTED_COUPON.discount}
              </p>
              <div className="text-xs text-zinc-400 flex items-center gap-1.5 pt-2">
                Contract Rate: <span className="text-white font-semibold">{SELECTED_COUPON.price}</span> 
                <span className="text-zinc-600 line-through">{SELECTED_COUPON.oldPrice}</span>
              </div>
            </div>

            {/* Countdown State Wrapper */}
            <div className="bg-white/[0.01] border border-white/5 rounded-xl p-4 flex justify-between items-center">
              <span className="text-xs text-zinc-500 font-medium">Validation Lease Expiry:</span>
              <CountdownEngine expiryDate={SELECTED_COUPON.expiry} />
            </div>

            {/* Interactive Coupon Hash Trigger */}
            <div className="mt-6 p-1.5 bg-black/40 rounded-xl border border-white/5 flex items-center justify-between group">
              <span className="font-mono text-sm tracking-wider font-bold text-purple-400 pl-4 select-all">{SELECTED_COUPON.code}</span>
              <button 
                onClick={triggerCopy}
                className={`px-5 py-2.5 rounded-lg text-xs font-medium transition-all flex items-center gap-2 ${copied ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 border' : 'bg-white text-black hover:bg-zinc-200'}`}
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Payload Saved' : 'Copy Code'}</span>
              </button>
            </div>
          </motion.div>

          {/* CROWD ELEMETRY SIGNAL FEEDBACK TRACE */}
          <div className="glass-card rounded-xl p-4 border border-white/5 flex justify-between items-center text-xs text-zinc-400">
            <div className="flex items-center gap-1">
              <span>Did this allocation match your payload?</span>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => { if(!voted){ setUpvotes(upvotes+1); setVoted(true); } }}
                className={`px-3 py-1.5 rounded-lg border flex items-center gap-1.5 transition-colors ${voted ? 'bg-purple-500/10 border-purple-500 text-purple-400' : 'border-white/5 bg-white/5 hover:text-white'}`}
              >
                <ThumbsUp className="w-3.5 h-3.5" /> <span>{upvotes}</span>
              </button>
              
              <button 
                onClick={() => setReported(true)}
                disabled={reported}
                className={`px-3 py-1.5 rounded-lg border flex items-center gap-1.5 transition-colors ${reported ? 'border-red-500/30 text-red-400 bg-red-950/20' : 'border-white/5 bg-white/5 hover:text-red-400 hover:border-red-500/20'}`}
              >
                <AlertTriangle className="w-3.5 h-3.5" /> <span>{reported ? 'Flagged' : 'Report Fail'}</span>
              </button>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN COMPONENT LAYER: SELLER SPECS + DETAILS + REVIEWS (7-COL) */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* THE SELLER VERIFICATION SPECS GRID */}
          <section className="glass-card border border-white/5 rounded-2xl p-6 space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-widest text-zinc-500">Cryptographic Seller Node Profile</h3>
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
              {/* ⚡ Dynamic Route Links Added to Avatar and Name Triggers Below */}
              <div className="flex items-center gap-3">
                <div 
                  onClick={() => navigate(`/seller/${SELECTED_COUPON.seller.handle}`)}
                  className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 font-mono font-bold text-sm cursor-pointer hover:border-purple-500/40 transition-colors"
                >
                  DA
                </div>
                <div>
                  <h4 
                    onClick={() => navigate(`/seller/${SELECTED_COUPON.seller.handle}`)}
                    className="text-white font-bold text-sm flex items-center gap-1.5 cursor-pointer hover:text-purple-400 transition-colors"
                  >
                    {SELECTED_COUPON.seller.name}
                    <ShieldCheck className="w-4 h-4 text-cyan-400" />
                  </h4>
                  <p className="text-xs text-zinc-500">{SELECTED_COUPON.seller.rank}</p>
                </div>
              </div>

              <div className="text-left sm:text-right">
                <p className="text-xs text-zinc-500">Node Trust Factor</p>
                <p className="text-xl font-black text-white tracking-tight">{SELECTED_COUPON.seller.score}% <span className="text-xs font-normal text-zinc-600">/ 100</span></p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs font-mono text-zinc-400 pt-1">
              <div>Total Validated Yield Actions: <span className="text-white font-bold ml-1">{SELECTED_COUPON.seller.totalSales} units</span></div>
              <div className="text-right">Settlement Protocols: <span className="text-cyan-400 font-bold ml-1">USDC / Web3 API</span></div>
            </div>
          </section>

          {/* PROTOCOL LEGALITIES TERMS AND CONDITIONS */}
          <section className="space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-widest text-zinc-500">Execution Bounds & Terms</h3>
            <div className="glass-card border border-white/5 rounded-2xl p-6 space-y-3.5 text-xs text-zinc-400 leading-relaxed">
              {SELECTED_COUPON.terms.map((term, i) => (
                <div key={i} className="flex gap-2.5 items-start">
                  <CornerDownRight className="w-4 h-4 text-purple-500 shrink-0 mt-0.5" />
                  <p>{term}</p>
                </div>
              ))}
            </div>
          </section>

          {/* CROWD FEEDBACK REVIEWS BLOCK */}
          <section className="space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-widest text-zinc-500 flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4" /> Node Network Verification Logs
            </h3>
            
            <div className="space-y-3">
              {SELECTED_COUPON.reviews.map((rev) => (
                <div key={rev.id} className="glass-card border border-white/5 rounded-xl p-5 space-y-2.5 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-mono font-bold text-zinc-300 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-500" /> {rev.user}
                    </span>
                    <span className="text-zinc-600 font-mono">{rev.time}</span>
                  </div>
                  <div className="flex gap-0.5 text-amber-400">
                    {[...Array(rev.rating)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-current" />)}
                  </div>
                  <p className="text-zinc-400 leading-relaxed font-normal">{rev.comment}</p>
                </div>
              ))}
            </div>
          </section>

          {/* SIMILAR ALTERNATIVE ALLOCATIONS ROW */}
          <section className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-mono uppercase tracking-widest text-zinc-500">Correlated Dynamic Tokens</h3>
              <button onClick={() => navigate('/browse')} className="text-xs text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-1">
                View All Deals <ExternalLink className="w-3 h-3" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {SELECTED_COUPON.similars.map((sim) => (
                <div 
                  key={sim.id} 
                  className="glass-card border border-white/5 rounded-xl p-4 flex justify-between items-center group hover:border-purple-500/30 transition-all cursor-pointer"
                  onClick={() => navigate('/browse')}
                >
                  <div>
                    <h5 className="text-xs font-bold text-white group-hover:text-purple-400 transition-colors">{sim.brand}</h5>
                    <p className="text-sm font-black text-zinc-300 mt-0.5">{sim.value}</p>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-cyan-400 bg-cyan-950/40 border border-cyan-800/40 px-2 py-0.5 rounded-full">
                    {sim.rate}% Match
                  </span>
                </div>
              ))}
            </div>
          </section>

        </div>

      </main>
    </div>
  );
}