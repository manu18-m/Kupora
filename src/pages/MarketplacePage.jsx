import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom'; 
import { collection, getDocs, query, where } from 'firebase/firestore'; // ⚡ Verified all query methods are imported
import { db } from '../firebase'; 
import { 
  Search, Filter, ChevronDown, CheckCircle, Clock, 
  Sparkles, Heart, Tag, TrendingUp, Grid3X3, List,
  Verified, Star, CalendarDays, X
} from 'lucide-react';

// --- DEMO FILTERS SCHEMA ---
const DEMO_CATEGORIES = [
  'All Deals', 'SaaS Tools', 'Infrastructure', 'Design Resources', 'AI & ML', 'Marketing Plugins', 'Cloud Hosting'
];

const DEMO_FILTERS = {
  Discount: ['Over 50%', '30% - 50%', '10% - 30%'],
  SellerScore: ['Top Tier (95+)', 'Highly Trusted (90+)', 'Verified Sellers'],
  VerifiedStatus: ['AI Verified Only', 'Manual Verified']
};

// --- COUNTDOWN TIMER COMPONENT ---
const CountdownTimer = ({ expiryDate }) => {
  const calculateTimeLeft = () => {
    if (!expiryDate || expiryDate.includes('Continuous')) return {};
    
    const difference = +new Date(expiryDate) - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        mins: Math.floor((difference / 1000 / 60) % 60),
      };
    }
    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearTimeout(timer);
  });

  const timerComponents = [];
  Object.keys(timeLeft).forEach((interval) => {
    if (timeLeft[interval] === undefined) return;
    timerComponents.push(
      <span key={interval}>
        {timeLeft[interval]}{interval.charAt(0)}{" "}
      </span>
    );
  });

  return (
    <div className="flex items-center gap-1.5 text-xs text-orange-400 font-mono font-medium">
      <Clock className="w-3.5 h-3.5" />
      {timerComponents.length ? timerComponents : <span>Continuous Monitoring</span>}
    </div>
  );
};

// --- COUPON CARD COMPONENT ---
const CouponCard = ({ coupon }) => {
  const navigate = useNavigate(); 
  const [copied, setCopied] = useState(false);
  const [wished, setWished] = useState(false);

  const handleCopy = (e) => {
    e.stopPropagation(); 
    navigator.clipboard.writeText(coupon.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const fallbackLogo = "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vercel/vercel-original.svg";

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -6, boxShadow: '0 20px 40px -15px rgba(124, 58, 237, 0.15)' }}
      onClick={() => navigate(`/coupon/${coupon.id}`)} 
      className="glass-card glass-card-hover rounded-2xl p-6 flex flex-col justify-between min-h-[300px] relative overflow-hidden group cursor-pointer"
    >
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-purple-500/10 to-transparent blur-2xl pointer-events-none group-hover:from-purple-500/20 transition-all duration-300" />
      
      <div>
        <div className="flex justify-between items-start mb-5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 overflow-hidden shrink-0">
              <img src={coupon.logo || fallbackLogo} alt={coupon.brand} className="w-9 h-9 object-contain" />
            </div>
            <div>
              <h3 className="font-bold text-white text-lg tracking-tight flex items-center gap-1.5">
                {coupon.brand}
                {coupon.trustScore >= 95 && (
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                )}
              </h3>
              <p className="text-xs text-zinc-400">{coupon.category}</p>
            </div>
          </div>
          <button 
            type="button"
            onClick={(e) => {
              e.stopPropagation(); 
              setWished(!wished);
            }}
            className={`p-2 rounded-full border ${wished ? 'bg-purple-500/10 border-purple-500 text-purple-400' : 'bg-white/5 border-white/10 text-zinc-500 hover:text-purple-400 hover:border-purple-500/30'} transition-all`}
          >
            <Heart className="w-4 h-4" fill={wished ? 'currentColor' : 'none'} />
          </button>
        </div>

        <div className="space-y-1 mb-5">
          <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 neon-text-purple leading-tight">
            {coupon.discount}
          </h2>
          <p className="text-sm text-zinc-300">
            Now {coupon.price}
          </p>
        </div>

        <div className="flex items-center justify-between gap-3 text-xs font-mono font-medium border-t border-white/5 pt-4 mb-5">
          {coupon.trustScore >= 95 ? (
            <div className="flex items-center gap-1 text-cyan-400 bg-cyan-950/40 border border-cyan-800/50 px-2.5 py-1 rounded-full">
              <Sparkles className="w-3.5 h-3.5" /> AI Verified
            </div>
          ) : (
            <div className="flex items-center gap-1 text-zinc-400 bg-white/5 border border-white/10 px-2.5 py-1 rounded-full">
              <Verified className="w-3.5 h-3.5 text-zinc-500" /> Manual Verified
            </div>
          )}
          <div className="flex items-center gap-1 text-emerald-400 bg-emerald-950/40 border border-emerald-800/50 px-2.5 py-1 rounded-full">
            <TrendingUp className="w-3.5 h-3.5" /> {coupon.successRate}% Success
          </div>
        </div>
      </div>

      <div className="flex items-end justify-between gap-4 mt-auto">
        <div className="space-y-2 flex-1">
          <div className="flex items-center gap-1.5 text-xs text-zinc-400">
            <svg className="w-3.5 h-3.5 text-zinc-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
            Seller Score: <span className="font-bold text-white ml-0.5">{coupon.trustScore} <span className="text-zinc-600 font-normal">/ 100</span></span>
          </div>
          <CountdownTimer expiryDate={coupon.expiry} />
        </div>
        <button 
          onClick={(e) => {
            e.stopPropagation(); 
            handleCopy(e);
          }}
          className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all group flex items-center gap-2 ${copied ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 border' : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-[0_0_20px_rgba(124,58,237,0.3)]'}`}
        >
          {copied ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>}
          {copied ? 'Copied' : 'Get Code'}
        </button>
      </div>
    </motion.div>
  );
};

// --- SIDEBAR FILTER SECTION ---
const FilterSidebar = ({ filters }) => (
  <div className="space-y-6 glass-card rounded-2xl p-6 border border-white/5 sticky top-24 self-start">
    <div className="flex items-center justify-between pb-4 border-b border-white/5">
      <h3 className="text-lg font-semibold text-white flex items-center gap-2">
        <Filter className="w-4 h-4 text-purple-400" /> Refine Search
      </h3>
      <button className="text-xs text-zinc-500 hover:text-white transition-colors">Reset</button>
    </div>
    
    {Object.entries(filters).map(([key, options]) => (
      <div key={key} className="space-y-3">
        <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-600">{key.replace(/([A-Z])/g, ' $1').trim()}</h4>
        <div className="space-y-2">
          {options.map(option => (
            <label key={option} className="flex items-center gap-2.5 text-sm text-zinc-400 hover:text-white cursor-pointer group">
              <input type="checkbox" className="w-4 h-4 rounded-md border-white/10 bg-white/5 text-purple-500 focus:ring-purple-500/40" />
              {option}
            </label>
          ))}
        </div>
      </div>
    ))}
  </div>
);

// --- MAIN MARKETPLACE VIEW ---
export default function MarketplacePage() {
  const navigate = useNavigate(); 
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All Deals');
  const [searchQuery, setSearchQuery] = useState('');

  // --- REAL-TIME FIRESTORE DATA ACQUISITION LAYERS (MODERATED) ---
  useEffect(() => {
    const fetchApprovedCouponsFromFirestore = async () => {
      try {
        // ⚡ Isolated collection search using verified constraints logic
        const approvedCouponsQuery = query(
          collection(db, 'coupons'), 
          where('status', '==', 'approved')
        );
        
        const querySnapshot = await getDocs(approvedCouponsQuery);
        const dynamicCoupons = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            brand: data.brand || 'Unknown Node',
            code: data.code || 'UNASSIGNED',
            discount: data.discount || 'Special Promotion Allocation',
            category: data.category || 'SaaS Tools',
            expiry: data.expiry || 'Continuous Monitoring',
            price: data.price || '$0.00 Base',
            trustScore: data.trustScore || Math.floor(Math.random() * 8) + 92,
            successRate: data.successRate || Math.floor(Math.random() * 6) + 94,
            logo: data.logo || null
          };
        });
        setCoupons(dynamicCoupons);
      } catch (error) {
        console.error("Data acquisition fault logs: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchApprovedCouponsFromFirestore();
  }, []);

  // --- DYNAMIC TIME-DELTA FILTERING ARRAYS ---
  const filteredCoupons = coupons.filter(coupon => {
    const matchesSearch = coupon.brand.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          coupon.discount.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All Deals' || coupon.category === activeCategory;
    
    let isNotExpired = true;
    if (coupon.expiry && typeof coupon.expiry === 'string' && !coupon.expiry.includes('Continuous')) {
      const expirationDate = new Date(coupon.expiry);
      const currentDate = new Date();
      
      if (!isNaN(expirationDate.getTime())) {
        isNotExpired = expirationDate >= currentDate;
      }
    }

    return matchesSearch && matchesCategory && isNotExpired;
  });

  return (
    <div className="min-h-screen bg-[#030014] text-zinc-100 antialiased font-sans relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-gradient-to-b from-purple-600/10 via-cyan-500/5 to-transparent blur-[140px] pointer-events-none z-0" />

      {/* HEADER SECTION: Search & Category Tabs */}
      <div className="sticky top-0 z-40 bg-[#030014]/60 backdrop-blur-2xl border-b border-white/5 pt-6 pb-2 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
                Browse AI-Verified <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 neon-text-purple">Deals</span>
              </h1>
              
              <button 
                onClick={() => navigate('/upload')}
                className="mt-3 text-xs font-mono font-bold text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-1 bg-purple-950/20 border border-purple-900/30 px-3 py-1.5 rounded-xl group"
              >
                <span>+ Defer New Allocation Contract</span>
                <span className="group-hover:translate-x-0.5 transition-transform">→</span>
              </button>
            </div>
            
            <div className="relative w-full sm:w-80 group">
              <Search className="absolute left-4 top-3.5 w-5 h-5 text-zinc-500 group-focus-within:text-purple-400 transition-colors" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search infrastructure or SaaS codes..." 
                className="w-full bg-white/[0.02] border border-white/10 focus:border-purple-500/50 rounded-2xl pl-12 pr-10 py-3.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition-all placeholder-zinc-600"
              />
              {searchQuery && (
                <X className="absolute right-3.5 top-3.5 w-5 h-5 text-zinc-600 cursor-pointer hover:text-white" onClick={() => setSearchQuery('')} />
              )}
            </div>
          </div>

          {/* CATEGORY TABS CONTAINER */}
          <div className="relative overflow-x-auto no-scrollbar pb-2 flex gap-1.5 font-medium text-sm border-b border-white/5">
            {DEMO_CATEGORIES.map(category => (
              <button 
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`flex-shrink-0 px-4 py-2.5 rounded-xl transition-all ${activeCategory === category ? 'bg-white/5 text-white shadow-inner' : 'text-zinc-500 hover:text-white hover:bg-white/[0.02]'}`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* MAIN CONTENT AREA: SIDEBAR + GRID */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10 grid grid-cols-1 md:grid-cols-[280px_1fr] gap-10">
        <FilterSidebar filters={DEMO_FILTERS} />

        <div className="space-y-8">
          <div className="flex items-center justify-between gap-4 glass-card rounded-2xl p-4 border border-white/5">
            <p className="text-sm text-zinc-400">
              Showing <span className="font-semibold text-white font-mono">{loading ? '...' : filteredCoupons.length}</span> verified active segments
            </p>
            <div className="flex items-center gap-3">
              <button className="text-xs text-zinc-500 font-medium flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5 hover:text-white hover:border-white/10">
                Sorted By: Trust Score <ChevronDown className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-3 text-zinc-600 border-l border-white/5 pl-3">
                <Grid3X3 className="w-5 h-5 text-purple-400" />
                <List className="w-5 h-5 hover:text-zinc-400 transition-colors" />
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 text-xs font-mono font-medium">
            <div className="text-zinc-600 uppercase tracking-wider py-1.5 pr-2">Active Node Constraints:</div>
            <div className="bg-purple-950/40 text-purple-400 border border-purple-900/30 px-3 py-1.5 rounded-full flex items-center gap-1.5">
              {activeCategory}
            </div>
          </div>

          {/* Dynamic Content Grid State Orchestration */}
          {loading ? (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 pb-12">
              {[1, 2, 4].map(shimmerId => (
                <div key={shimmerId} className="glass-card rounded-2xl p-6 min-h-[300px] border border-white/5 animate-pulse flex flex-col justify-between">
                  <div className="flex gap-4"><div className="w-14 h-14 bg-white/5 rounded-2xl" /><div className="space-y-2 flex-1 pt-2"><div className="h-4 bg-white/5 rounded w-1/3" /><div className="h-3 bg-white/5 rounded w-1/4" /></div></div>
                  <div className="h-8 bg-white/5 rounded w-3/4 my-4" />
                  <div className="h-10 bg-white/5 rounded w-full mt-auto" />
                </div>
              ))}
            </div>
          ) : (
            <motion.div layout className="grid grid-cols-1 xl:grid-cols-2 gap-6 pb-12">
              <AnimatePresence mode="popLayout">
                {filteredCoupons.map(coupon => (
                  <CouponCard key={coupon.id} coupon={coupon} />
                ))}
              </AnimatePresence>
            </motion.div>
          )}

          {/* Empty State UI Fallback */}
          {!loading && filteredCoupons.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="glass-card rounded-2xl p-12 text-center text-zinc-500 text-sm font-mono"
            >
              No verified validation arrays match the current segment queries.
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}