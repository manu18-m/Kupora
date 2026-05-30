import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, ShieldCheck, Clock, Copy, Check, ArrowLeft, 
  ThumbsUp, AlertTriangle, Share2, CornerDownRight, CreditCard, Lock
} from 'lucide-react';

import { useNavigate, useParams } from 'react-router-dom'; 

import {
  doc,
  getDoc,
  collection,
  addDoc,
  increment,
  updateDoc,
  query,
  where,
  getDocs
} from 'firebase/firestore';

import { db, auth } from '../firebase'; 
import toast from 'react-hot-toast';

// --- SUB-COMPONENT: TIMER PROPS ENGINE ---
const CountdownEngine = ({ expiryDate }) => {

  const calculateDelta = () => {

    if (!expiryDate || expiryDate.includes('Continuous')) {
      return null;
    }

    const delta = +new Date(expiryDate) - +new Date();

    if (delta <= 0) {
      return null;
    }

    return {
      d: Math.floor(delta / (1000 * 60 * 60 * 24)),
      h: Math.floor((delta / (1000 * 60 * 60)) % 24),
      m: Math.floor((delta / 1000 / 60) % 60),
      s: Math.floor((delta / 1000) % 60)
    };
  };

  const [timeLeft, setTimeLeft] = useState(calculateDelta());

  useEffect(() => {

    const clock = setInterval(() => {
      setTimeLeft(calculateDelta());
    }, 1000);

    return () => clearInterval(clock);

  }, [expiryDate]);

  if (!timeLeft) {
    return (
      <span className="text-emerald-400 font-mono">
        Continuous Monitoring / Active
      </span>
    );
  }

  return (
    <div className="flex gap-2 font-mono text-sm text-orange-400 font-bold">
      <Clock className="w-4 h-4 mt-0.5" />

      <span>
        {timeLeft.d}d {timeLeft.h}h {timeLeft.m}m {timeLeft.s}s
      </span>
    </div>
  );
};

export default function CouponDetailsPage() {

  const navigate = useNavigate();
  const { id } = useParams();

  const [coupon, setCoupon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [isPurchased, setIsPurchased] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // NEW: PREVENT SPAM VOTING
  const [hasVoted, setHasVoted] = useState(false);
  const checkPurchaseStatus = async (couponId) => {

  const currentUser = auth.currentUser;

  if (!currentUser || !couponId) return;

  try {

    const purchaseQuery = query(
      collection(db, 'purchases'),
      where('buyerId', '==', currentUser.uid),
      where('couponId', '==', couponId)
    );

    const snapshot = await getDocs(purchaseQuery);

    if (!snapshot.empty) {
      setIsPurchased(true);
    }

  } catch (err) {
    console.error(err);
  }
};

  // --- COMMUNITY VALIDATION ENGINE ---
  const handleValidation = async (type) => {

    if (!coupon) return;

    // PREVENT MULTIPLE VOTES
    if (hasVoted) {
      toast.error('You already submitted validation.');
      return;
    }

    const field =
      type === 'worked'
        ? 'workedCount'
        : 'failedCount';

    try {

      await updateDoc(
        doc(db, 'coupons', coupon.id),
        {
          [field]: increment(1)
        }
      );

      // UPDATE LOCAL STATE
      setCoupon(prev => ({
        ...prev,
        [field]: (prev[field] || 0) + 1
      }));

      // LOCK VOTING
      setHasVoted(true);

      toast.success(
        type === 'worked'
          ? 'Coupon marked as working.'
          : 'Coupon reported as failed.'
      );

    } catch (err) {

      toast.error('Validation sync failed.');

    }
  };

  // --- FETCH COUPON ---
  useEffect(() => {

    const fetchSingleCoupon = async () => {

      setLoading(true);

      try {

        const docSnap = await getDoc(
          doc(db, 'coupons', id)
        );

        if (docSnap.exists()) {

          const data = docSnap.data();
          let sellerData = null;

if (data.sellerId) {
  const sellerDoc = await getDoc(
    doc(db, 'users', data.sellerId)
  );

  if (sellerDoc.exists()) {
    sellerData = sellerDoc.data();
  }
}

          setCoupon({
            id: docSnap.id,
            ...data,

            workedCount: data.workedCount || 0,
            failedCount: data.failedCount || 0,

            terms: data.terms
              ? data.terms.split('\n')
              : ['Applies to standard plans.'],

            logo:
              data.logo ||
              'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vercel/vercel-original.svg',

            seller: {
               name: sellerData?.handle || 'Unknown Seller',
                handle: sellerData?.handle || '@unknown',
               upiId: sellerData?.upiId || '',
               score: 98.6,
               totalSales: sellerData?.totalSales || 0,
             rank: 'Trusted Seller'
          }
          });
          await checkPurchaseStatus(docSnap.id);

        } else {

          setError(true);

        }

      } catch (err) {

        setError(true);

      } finally {

        setLoading(false);

      }
    };

    if (id) {
      fetchSingleCoupon();
    }

  }, [id]);

  // --- PURCHASE SIMULATION ---
 const handlePurchaseSimulation = async () => {

  const currentUser = auth.currentUser;

  if (!currentUser) {
    toast.error('Authentication required.');
    return;
  }

  if (isPurchased) {
    toast.error('Coupon already purchased');
    return;
  }

  if (coupon?.sellerId === currentUser.uid) {
    toast.error("You can't buy your own coupon");
    return;
  }

  setIsProcessing(true);

  try {

    await addDoc(
      collection(db, 'purchases'),
      {
        buyerId: currentUser.uid,
        sellerId: coupon.sellerId,
        couponId: coupon.id,
        amount: coupon.price,
        purchasedAt: new Date().toISOString()
      }
    );

    setIsPurchased(true);

    toast.success('Coupon unlocked.');

  } catch (err) {

    toast.error('Transaction failed.');

  } finally {

    setIsProcessing(false);

  }
};

  // LOADING STATE
  if (loading) {
    return (
      <div className="min-h-screen bg-[#030014] flex items-center justify-center text-zinc-500 font-mono text-xs">
        Loading coupon data...
      </div>
    );
  }

  // ERROR STATE
  if (error || !coupon) {
    return (
      <div className="min-h-screen bg-[#030014] flex items-center justify-center text-red-400 font-mono text-xs">
        Coupon not found.
      </div>
    );
  }

  // SUCCESS RATE
  const totalValidations =
    (coupon.workedCount || 0) +
    (coupon.failedCount || 0);

  const successRate =
    totalValidations > 0
      ? Math.round(
          ((coupon.workedCount || 0) /
            totalValidations) * 100
        )
      : 0;

  return (
    <div className="min-h-screen bg-[#030014] text-zinc-200 font-sans antialiased relative pb-24">

      {/* BACKGROUND GLOW */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-gradient-to-bl from-purple-600/10 via-indigo-500/5 to-transparent blur-[150px] pointer-events-none" />

      <main className="max-w-7xl mx-auto px-4 sm:px-8 mt-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">

        {/* LEFT COLUMN */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">

          {/* MAIN CARD */}
          <div className="glass-card border border-white/10 rounded-2xl p-6 relative overflow-hidden">

            <h1 className="text-2xl font-black text-white">
              {coupon.brand}
            </h1>

            <p className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 my-4">
              {coupon.discount}
            </p>
            <p className="text-zinc-400 text-sm">
              Price: ₹{coupon.price}
            </p>
            <p className="text-zinc-500 text-xs mt-1">
  Seller: {coupon.seller?.handle}
</p>

            <CountdownEngine expiryDate={coupon.expiry} />
            {isPurchased ? (

  <div className="mt-6 bg-emerald-950/20 border border-emerald-900/30 rounded-xl p-4">

    <p className="text-xs text-emerald-400 mb-2">
      Coupon Code
    </p>

    <div className="flex items-center justify-between">

      <span className="font-mono text-lg font-bold text-emerald-400">
        {coupon.code}
      </span>

      <button
        onClick={() => {
          navigator.clipboard.writeText(coupon.code);
          toast.success('Coupon copied');
        }}
      >
        <Copy className="w-5 h-5 text-emerald-400" />
      </button>

    </div>

  </div>

) : (

  <div className="mt-6 bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex items-center gap-3">

    <Lock className="w-5 h-5 text-zinc-500" />

    <div>

      <p className="text-white text-sm font-medium">
        Coupon Locked
      </p>

      <p className="text-zinc-500 text-xs">
        Purchase to reveal coupon code
      </p>

    </div>

  </div>

)}

        {!isPurchased && (
  <button
    onClick={handlePurchaseSimulation}
    disabled={isProcessing}
    className="w-full mt-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 font-bold text-xs uppercase tracking-wider text-white"
  >
    {isProcessing
      ? 'Processing...'
      :  `Buy Coupon - ₹${coupon.price}`}
  </button>
)}
          </div>

          {/* COMMUNITY TRUST */}
          <section className="glass-card border border-white/5 rounded-2xl p-6 space-y-4">

            <div className="flex justify-between items-center">

              <h3 className="text-xs font-mono uppercase tracking-widest text-zinc-500">
                Community Trust
              </h3>

              <span className="text-xs text-zinc-600 font-mono">
                {totalValidations} Total Votes
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-5">

              {/* SUCCESS RATE */}
              <div>

                <div className="text-3xl font-black text-white">
                  {successRate}%
                </div>

                <p className="text-sm text-zinc-500">
                  Success Rate
                </p>
              </div>

              {/* BUTTONS */}
              <div className="flex gap-2 flex-wrap">

                <button
                  disabled={hasVoted}
                  onClick={() => handleValidation('worked')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    hasVoted
                      ? 'bg-zinc-900 border border-zinc-800 text-zinc-600 cursor-not-allowed'
                      : 'bg-emerald-950/20 border border-emerald-900/30 text-emerald-400 hover:bg-emerald-950/40'
                  }`}
                >
                  <ThumbsUp className="w-4 h-4" />
                  Worked
                </button>

                <button
                  disabled={hasVoted}
                  onClick={() => handleValidation('failed')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    hasVoted
                      ? 'bg-zinc-900 border border-zinc-800 text-zinc-600 cursor-not-allowed'
                      : 'bg-red-950/20 border border-red-900/30 text-red-400 hover:bg-red-950/40'
                  }`}
                >
                  <AlertTriangle className="w-4 h-4" />
                  Didn't Work
                </button>

              </div>
            </div>

            {/* VERIFIED TEXT */}
            <div className="text-xs text-zinc-500 font-mono border-t border-white/5 pt-4">
              Verified by Kupora community
            </div>

          </section>
        </div>

        {/* RIGHT COLUMN */}
        <div className="lg:col-span-7 space-y-8">

          {/* TERMS */}
          <section className="glass-card border border-white/5 rounded-2xl p-6 space-y-3.5 text-xs text-zinc-400 leading-relaxed">

            {coupon.terms.map((term, i) => (
              <div
                key={i}
                className="flex gap-2.5 items-start"
              >
                <CornerDownRight className="w-4 h-4 text-purple-500 shrink-0 mt-0.5" />

                <p>{term}</p>
              </div>
            ))}

          </section>

        </div>
      </main>
    </div>
  );
}