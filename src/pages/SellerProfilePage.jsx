import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore'; 
import { db } from '../firebase'; 
import { 
  ShieldCheck, ArrowRight, Zap, ShoppingBag, 
  Activity, Star, CornerDownRight, ExternalLink, Mail,
} from 'lucide-react';

// --- SUB-COMPONENT: DYNAMIC METRIC CARD ---
const MetricCard = ({ icon: Icon, label, value }) => (
  <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-5 space-y-2">
    <div className="flex justify-between items-center text-zinc-500">
      <span className="text-[10px] font-mono tracking-wider uppercase">{label}</span>
      <Icon className="w-4 h-4" />
    </div>
    <h3 className="text-xl font-extrabold text-white tracking-tight">{value}</h3>
  </div>
);

// --- SUB-COMPONENT: INVENTORY COUPON CARD ---
const InventoryCard = ({ coupon }) => {
  const navigate = useNavigate();
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} whileHover={{ y: -4 }}
      className="glass-card border border-white/5 rounded-2xl p-5 flex flex-col justify-between min-h-[220px] relative overflow-hidden group cursor-pointer"
      onClick={() => navigate(`/coupon/${coupon.id}`)}
    >
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-purple-500/10 to-transparent blur-xl pointer-events-none group-hover:from-purple-500/15 transition-all" />
      <div>
        <div className="flex justify-between items-start mb-4">
          <h4 className="text-white font-bold text-base group-hover:text-purple-400 transition-colors">{coupon.brand}</h4>
          <span className="text-[10px] font-mono text-purple-400 bg-purple-950/40 border border-purple-800/30 px-2.5 py-1 rounded-md uppercase">{coupon.category}</span>
        </div>
        <div className="space-y-0.5 mb-5">
          <h2 className="text-xl font-extrabold text-white tracking-tight">{coupon.discount}</h2>
          <p className="text-xs text-zinc-400">Effective: <span className="text-white font-semibold">{coupon.price}</span></p>
        </div>
      </div>
      <div className="flex items-center justify-between text-[10px] font-mono border-t border-white/5 pt-3 mt-auto">
        <span className="text-cyan-400">AI Verified</span>
        <span className="text-emerald-400">99% Accuracy</span>
      </div>
    </motion.div>
  );
};

export default function SellerProfilePage() {
  const navigate = useNavigate();
  const { id } = useParams(); // Using UID or handle from URL
  
  const [profile, setProfile] = useState(null);
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSellerData = async () => {
      setLoading(true);
      try {
        // 1. Fetch Profile
        const profSnap = await getDoc(doc(db, 'profiles', id));
        if (profSnap.exists()) setProfile(profSnap.data());

        // 2. Fetch Approved Coupons
        const q = query(
          collection(db, 'coupons'), 
          where('sellerId', '==', id),
          where('status', '==', 'approved')
        );
        const snap = await getDocs(q);
        setInventory(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (err) {
        console.error("Profile/Inventory fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSellerData();
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-zinc-500 font-mono">Synchronizing Seller Matrix...</div>;

  return (
    <div className="min-h-screen bg-[#030014] text-zinc-200 antialiased font-sans relative pb-24">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[140px] pointer-events-none" />
      
      <nav className="h-16 border-b border-white/5 px-8 flex items-center justify-between sticky top-0 z-50 bg-[#030014]/60 backdrop-blur-xl">
        <div className="flex items-center gap-2 font-bold text-sm text-white">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-purple-600 to-cyan-400 flex items-center justify-center"><Zap className="w-4 h-4" /></div>
          VoucherAI <span className="text-zinc-600 font-normal">/ Creator Matrix</span>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-8 mt-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: Profile */}
        <div className="lg:col-span-4 space-y-8">
          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="glass-card border border-white/10 rounded-3xl p-8 text-center">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-purple-500 to-indigo-600 mx-auto flex items-center justify-center font-black text-3xl text-white mb-5 shadow-lg">
              {profile?.displayName?.slice(0, 2).toUpperCase() || '??'}
            </div>
            <h1 className="text-2xl font-black text-white">{profile?.displayName || 'Unknown Seller'}</h1>
            <p className="text-sm text-zinc-400 mt-4 leading-relaxed px-2">{profile?.bio || 'No biography provided.'}</p>
            <div className="mt-8 flex gap-2 justify-center">
              {profile?.twitter && <a href={profile.twitter} className="p-2.5 rounded-xl border border-white/5 bg-white/[0.02] hover:text-white transition-all"><Twitter /></a>}
              {profile?.website && <a href={profile.website} className="p-2.5 rounded-xl border border-white/5 bg-white/[0.02] hover:text-white transition-all"><ExternalLink /></a>}
            </div>
          </motion.div>

          <div className="grid grid-cols-2 gap-4">
            <MetricCard icon={ShieldCheck} label="Trust Score" value={`${profile?.trustScore || 0}%`} />
            <MetricCard icon={ShoppingBag} label="Total Uploads" value={inventory.length} />
          </div>
        </div>

        {/* Right Column: Inventory */}
        <div className="lg:col-span-8 space-y-8">
          <h2 className="text-xl font-bold text-white border-b border-white/5 pb-4">Validated Allocation Index</h2>
          {inventory.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {inventory.map(coupon => <InventoryCard key={coupon.id} coupon={coupon} />)}
            </div>
          ) : (
            <div className="p-12 text-center border border-dashed border-white/10 rounded-2xl text-zinc-600 font-mono text-xs">
              No approved yield modules currently listed by this node.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}