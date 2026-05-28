import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // ⚡ Added routing hook
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, ShieldCheck, ChevronRight, Copy, Check, 
  ArrowRight, Cpu, Zap, Activity, Users, Globe, 
  ArrowLeft, Star, Plus, Minus,
} from 'lucide-react';
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs
} from 'firebase/firestore';

import { db } from '../firebase';

// --- MOCK DATA CONTEXTS ---
const BRAND_LOGOS = [
  { name: 'Vercel', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vercel/vercel-original.svg' },
  { name: 'Figma', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg' },
  { name: 'Supabase', logo: 'https://img.stackshare.io/service/11559/supabase.png' },
  { name: 'DigitalOcean', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/digitalocean/digitalocean-original.svg' },
  { name: 'GitHub', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg' },
];

const FAQS = [
  { q: "How does the AI verify these coupon codes?", a: "Our AI engine runs real-time browser automation scripts alongside crowd-sourced programmatic checking hooks. It updates success probability indexes continuously to eliminate dead clicks." },
  { q: "Can merchants inject custom target rules?", a: "Yes. Using our Developer Dashboard, merchants can seamlessly deploy customized programmatic discount wrappers tied to active API routes." },
  { q: "Is the browser extensions network secure?", a: "Completely. All data transformations are fully client-side anonymized and zero-knowledge end-to-end sandbox isolated." }
];

// --- BRAND MINI COMPONENT ---
const BrandCard = ({ coupon }) => {
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();
  const handleCopy = (e) => {
    e.stopPropagation();

    navigator.clipboard.writeText(coupon.code);
    setCopied(true);

    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      onClick={() => navigate(`/coupon/${coupon.id}`)}
      className="glass-card glass-card-hover rounded-2xl p-6 min-w-[280px] w-[280px] sm:min-w-[320px] sm:w-[320px] shrink-0 flex flex-col justify-between relative overflow-hidden group cursor-pointer"
    >
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-purple-500/10 to-transparent blur-xl pointer-events-none" />

      <div>
        <div className="flex justify-between items-start mb-4">
          <span className="text-xs font-mono tracking-wider text-purple-400 bg-purple-950/40 border border-purple-800/30 px-2.5 py-1 rounded-md">
            {coupon.category}
          </span>

          <div className="flex items-center gap-1 text-xs font-medium text-emerald-400 bg-emerald-950/40 border border-emerald-800/50 px-2 py-0.5 rounded-full">
            <Sparkles className="w-3 h-3" />
            {coupon.match}% Accuracy
          </div>
        </div>

        <h3 className="text-white text-xl font-bold mb-1">
          {coupon.brand}
        </h3>

        <p className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 mb-2">
          {coupon.value}
        </p>

        <p className="text-sm text-zinc-400 line-clamp-2 mb-6">
          {coupon.desc}
        </p>
      </div>

      <div className="flex items-center gap-2 mt-auto">
        <div className="flex-1 font-mono text-xs font-semibold bg-black/40 text-purple-300 border border-purple-900/40 p-2.5 rounded-xl text-center">
          {coupon.code.slice(0, 2)}****{coupon.code.slice(-2)}
        </div>

        <button
          onClick={handleCopy}
          className={`p-2.5 rounded-xl border transition-all ${
            copied
              ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
              : 'glass-card text-zinc-400 hover:text-white border-white/10'
          }`}
        >
          {copied ? (
            <Check className="w-4 h-4" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
        </button>
      </div>
    </div>
  );
};

// --- CORE LANDING COMPONENT ---
export default function LandingPage() {
  const [activeFaq, setActiveFaq] = useState(null);
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const carouselRef = useRef(null); // ⚡ Instantiated navigation engine
  const navigate = useNavigate();
useEffect(() => {

  const fetchTrendingCoupons = async () => {

    try {

      const q = query(
        collection(db, 'coupons'),
        where('status', '==', 'approved'),
        orderBy('createdAt', 'desc'),
        limit(4)
      );

      const snap = await getDocs(q);

      setCoupons(
        snap.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
      );

    } catch (err) {

      console.error(
        'Error fetching coupons:',
        err
      );

    } finally {

      setLoading(false);

    }
  };

  fetchTrendingCoupons();

}, []);

  const scrollCarousel = (direction) => {
    if (carouselRef.current) {
      const { scrollLeft, clientWidth } = carouselRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth / 2 : scrollLeft + clientWidth / 2;
      carouselRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#030014] text-zinc-200 font-sans antialiased overflow-x-hidden relative">
      
      {/* BACKGROUND AMBIENT GLOWS */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-gradient-to-b from-purple-600/10 via-cyan-500/5 to-transparent blur-[140px] pointer-events-none z-0" />
      <div className="absolute top-[2500px] right-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[160px] pointer-events-none" />

      {/* STICKY NAVBAR */}
      <motion.nav 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="sticky top-0 z-50 border-b border-white/5 bg-[#030014]/60 backdrop-filter backdrop-blur-xl"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-lg text-white">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-purple-600/20">
              <Cpu className="w-4 h-4 text-white" />
            </div>
            <span>Kup<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">ora</span></span>
          </div>

          <div className="flex items-center gap-4 sm:gap-6 text-xs sm:text-sm font-medium text-zinc-400 overflow-x-auto no-scrollbar">

  <button
    onClick={() =>
      document.getElementById('features')?.scrollIntoView({
        behavior: 'smooth',
      })
    }
    className="hover:text-white transition-colors"
  >
    Features
  </button>

  <button
    onClick={() =>
      document.getElementById('trending')?.scrollIntoView({
        behavior: 'smooth',
      })
    }
    className="hover:text-white transition-colors"
  >
    Trending
  </button>

  <button
    onClick={() =>
      document.getElementById('trust')?.scrollIntoView({
        behavior: 'smooth',
      })
    }
    className="hover:text-white transition-colors"
  >
    Enterprise Trust
  </button>

  <button
    onClick={() =>
      document.getElementById('faq')?.scrollIntoView({
        behavior: 'smooth',
      })
    }
    className="hover:text-white transition-colors"
  >
    FAQ
  </button>

</div>

         <div className="flex items-center gap-4">

 <button
  onClick={() => navigate('/login')}
  className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
>
    Sign In
  </button>

  <button
    onClick={() => navigate('/browse')}
    className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-xl shadow-[0_0_20px_rgba(124,58,237,0.3)] transition-all transform hover:scale-[1.02]"
  >
    Launch App
  </button>

</div>
        </div>
      </motion.nav>

      {/* HERO SECTION */}
      <section className="relative z-10 pt-20 pb-16 px-4 max-w-7xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 px-3 py-1.5 rounded-full text-xs font-mono font-medium text-purple-300 mb-6"
        >
          <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-pulse" /> ENGINE VERSION 3.2 LIVE
        </motion.div>

        <motion.h1 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-3xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.1]"
        >
          Zero Dead Clicks.<br/>
          Get Coupons Verified by <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-400 to-cyan-400 neon-text-purple">Contextual AI</span>
        </motion.h1>

        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 text-zinc-400 text-lg sm:text-xl max-w-2xl mx-auto font-normal leading-relaxed"
        >
          Stop copy-pasting expired codes from 2018. Kupora processes millions of automated checkout validations every hour to guarantee active match yields.
        </motion.p>

        {/* PROMPT ACTION BOX */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 max-w-2xl mx-auto"
        >
          <div className="relative group p-1.5 bg-white/5 border border-white/10 rounded-2xl flex items-center shadow-2xl focus-within:border-purple-500/50 transition-all duration-300">
            <input 
              type="text" 
              placeholder="Paste a merchant URL or ask 'Best cloud infrastructure discounts'..." 
              className="w-full bg-transparent border-none text-white text-sm placeholder-zinc-500 pl-4 focus:outline-none"
            />
            <button 
              onClick={() => navigate('/browse')} // ⚡ Renders browsing portal on click
              className="bg-white text-black px-5 py-2.5 rounded-xl font-medium text-sm hover:bg-zinc-200 transition-all shrink-0 flex items-center gap-1.5"
            >
              <span>Scan Market</span> <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </section>

      {/* FEATURED BRANDS (MARQUEE RIBBON EFFECT) */}
      <section className="py-8 border-y border-white/5 bg-white/[0.01] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 text-xs font-mono tracking-widest text-zinc-500 uppercase text-center mb-6">
          Natively Interfacing Premium Digital Platforms
        </div>
        <div className="flex gap-12 justify-center items-center opacity-40 grayscale contrast-200">
          {BRAND_LOGOS.map((brand, i) => (
            <div key={i} className="flex items-center gap-2">
              <img src={brand.logo} alt={brand.name} className="w-6 h-6 object-contain" />
              <span className="font-bold text-white text-sm">{brand.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* AI-POWERED TRUST SYSTEM SECTION */}
      <section id="features" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <h2 className="text-xs font-mono tracking-widest text-cyan-400 uppercase">Core Integrity Engine</h2>
          <p className="text-3xl sm:text-4xl font-bold text-white">Continuous verification. No placebo tokens.</p>
          <p className="text-zinc-400 text-sm">Traditional coupon platforms run on manual crowd-sourced guesses. We deployed persistent headless validations.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card rounded-2xl p-8 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-white text-lg font-semibold">Real-Time Payload Verification</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">Our infrastructure executes synthetic API cart checkout calls every 90 seconds to verify code state parameters.</p>
          </div>

          <div className="glass-card rounded-2xl p-8 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-white text-lg font-semibold">Decentralized Trust Network</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">Cross-validating telemetry nodes guarantee that exclusive publisher agreements match true user payouts.</p>
          </div>

          <div className="glass-card rounded-2xl p-8 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Activity className="w-5 h-5" />
            </div>
            <h3 className="text-white text-lg font-semibold">Contextual Elastic Filters</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">We evaluate your explicit project profile architecture to suggest active tokens optimized for your budget.</p>
          </div>
        </div>
      </section>

      {/* TRENDING COUPONS CAROUSEL */}
      <section id="trending" className="py-20 bg-gradient-to-b from-transparent via-purple-950/10 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-xs font-mono tracking-widest text-purple-400 uppercase mb-2">Live Demand Index</h2>
              <p className="text-3xl font-bold text-white">Active Global Match Tokens</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => scrollCarousel('left')} className="p-2 rounded-xl border border-white/5 bg-white/[0.02] text-zinc-400 hover:text-white transition-colors">
                <ArrowLeft className="w-4 h-4" />
              </button>
              <button onClick={() => scrollCarousel('right')} className="p-2 rounded-xl border border-white/5 bg-white/[0.02] text-zinc-400 hover:text-white transition-colors">
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div 
            ref={carouselRef}
            className="flex gap-6 overflow-x-auto pb-6 no-scrollbar snap-x snap-mandatory"
          >
            {loading ? (

  [1, 2, 3].map((i) => (
    <div
      key={i}
      className="glass-card rounded-2xl p-6 min-w-[320px] h-[300px] animate-pulse bg-white/5"
    />
  ))

) : coupons.length > 0 ? (

  coupons.map((coupon) => (

    <BrandCard
      key={coupon.id}
      coupon={{
        ...coupon,

        value: coupon.discount,

        desc:
          coupon.terms ||
          'Standard enterprise allocation rules apply.',

        match:
          coupon.workedCount &&
          coupon.failedCount
            ? Math.round(
                (
                  coupon.workedCount /
                  (
                    coupon.workedCount +
                    coupon.failedCount
                  )
                ) * 100
              )
            : 95
      }}
    />

  ))

) : (

  <div className="glass-card rounded-2xl p-10 text-center min-w-full border border-white/5">
    <p className="text-zinc-500 font-mono text-sm">
      No live marketplace allocations available.
    </p>
  </div>

)}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-xs font-mono tracking-widest text-indigo-400 uppercase">Seamless Orchestration</h2>
          <p className="text-3xl font-bold text-white">Three steps to optimized billing</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          <div className="space-y-3 relative z-10">
            <div className="text-4xl font-extrabold text-white/10 font-mono">01</div>
            <h4 className="text-white font-semibold text-lg">Input Scope Profile</h4>
            <p className="text-zinc-400 text-sm leading-relaxed">Paste the direct checkout url link or mention specific technologies you currently manage.</p>
          </div>
          <div className="space-y-3 relative z-10">
            <div className="text-4xl font-extrabold text-white/10 font-mono">02</div>
            <h4 className="text-white font-semibold text-lg">AI Payload Synthesis</h4>
            <p className="text-zinc-400 text-sm leading-relaxed">Our backend nodes test dynamic token variations in real time against the targeted merchant payload framework.</p>
          </div>
          <div className="space-y-3 relative z-10">
            <div className="text-4xl font-extrabold text-white/10 font-mono">03</div>
            <h4 className="text-white font-semibold text-lg">One-Click Injection</h4>
            <p className="text-zinc-400 text-sm leading-relaxed">Copy the maximum optimization factor token string and execute clean cost savings instantly.</p>
          </div>
        </div>
      </section>

      {/* SELLER TRUST STATISTICS */}
      <section id="trust" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-white/5">
        <div className="glass-card rounded-3xl p-8 sm:p-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-purple-500/5 via-transparent to-cyan-500/5 pointer-events-none" />
          
          <div className="space-y-2">
            <div className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight flex items-center justify-center gap-1">
              <Users className="w-6 h-6 text-purple-400 shrink-0" /> 240K+
            </div>
            <p className="text-xs font-mono tracking-wider text-zinc-500 uppercase">Active Platform Users</p>
            <p className="text-zinc-400 text-xs px-4">Indie hackers and enterprise procurement units updating metrics daily.</p>
          </div>

          <div className="space-y-2 border-y md:border-y-0 md:border-x border-white/5 py-6 md:py-0">
            <div className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 tracking-tight">
              $1.4M+
            </div>
            <p className="text-xs font-mono tracking-wider text-zinc-500 uppercase">SaaS Capital Retained</p>
            <p className="text-zinc-400 text-xs px-4">Direct margin optimization saved from redundant infrastructure spending.</p>
          </div>

          <div className="space-y-2">
            <div className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight flex items-center justify-center gap-1">
              <Globe className="w-6 h-6 text-cyan-400 shrink-0" /> 99.8%
            </div>
            <p className="text-xs font-mono tracking-wider text-zinc-500 uppercase">Real Validation Index</p>
            <p className="text-zinc-400 text-xs px-4">Guaranteed elimination rate of placebo or non-functional placeholder codes.</p>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-xs font-mono tracking-widest text-emerald-400 uppercase">User Telemetry Opinions</h2>
          <p className="text-3xl font-bold text-white">Endorsed by Digital Operators</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-card rounded-2xl p-6 space-y-4">
            <div className="flex gap-1 text-amber-400"><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /></div>
            <p className="text-zinc-300 text-sm leading-relaxed">"We integrated Kupora into our design workspace procurement flows. Saved $400 on initial environment licenses without clicking traditional spam web interfaces."</p>
            <div>
              <p className="text-white text-sm font-semibold">Alex Rivers</p>
              <p className="text-xs text-zinc-500">Principal Engineer, Synapse Digital</p>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6 space-y-4">
            <div className="flex gap-1 text-amber-400"><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /></div>
            <p className="text-zinc-300 text-sm leading-relaxed">"Pure Linear style clean UI execution. The AI confidence ratings are 100% accurate. I don't look anywhere else when renewing base server instances anymore."</p>
            <div>
              <p className="text-white text-sm font-semibold">Elena Rostova</p>
              <p className="text-xs text-zinc-500">Founder, ByteScale Studio</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section id="faq" className="py-24 max-w-3xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-white text-center mb-12">Frequently Answered Queries</h2>
        <div className="space-y-4">
          {FAQS.map((faq, idx) => (
            <div key={idx} className="border-b border-white/5 pb-4">
              <button 
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full flex justify-between items-center text-left py-2 text-white font-medium hover:text-purple-400 transition-colors"
              >
                <span>{faq.q}</span>
                {activeFaq === idx ? <Minus className="w-4 h-4 text-purple-400" /> : <Plus className="w-4 h-4 text-zinc-500" />}
              </button>
              <AnimatePresence>
                {activeFaq === idx && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <p className="text-sm text-zinc-400 mt-2 leading-relaxed">{faq.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-24 px-4 max-w-7xl mx-auto text-center relative z-10">
        <div className="glass-card rounded-3xl p-8 sm:p-16 max-w-4xl mx-auto relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-indigo-600/5 to-cyan-500/10 blur-xl opacity-50" />
          <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight relative z-10">Optimize Your Stack Costs Now</h2>
          <p className="text-zinc-400 text-sm sm:text-base max-w-lg mx-auto mt-4 relative z-10">
            Join thousands of independent developers and venture operations stopping overhead fee drain.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4 relative z-10">
            <button 
              onClick={() => navigate('/browse')} // ⚡ Renders browsing portal on click
              className="px-6 py-3 bg-white text-black font-medium rounded-xl hover:bg-zinc-200 transition-all flex items-center justify-center gap-2"
            >
              Start Free Today <ChevronRight className="w-4 h-4" />
            </button>
            <button className="px-6 py-3 glass-card border-white/10 hover:bg-white/10 text-white font-medium rounded-xl transition-all">
              Enterprise Integration API
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/5 bg-black/20 py-12 text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 font-bold text-white text-sm">
            <div className="w-5 h-5 rounded bg-gradient-to-tr from-purple-600 to-cyan-400 flex items-center justify-center">
              <Cpu className="w-2.5 h-2.5 text-white" />
            </div>
            <span>Kupora</span>
          </div>
          
          <div className="flex gap-8">

  <button
    onClick={() =>
      document.getElementById('features')?.scrollIntoView({
        behavior: 'smooth',
      })
    }
    className="hover:text-zinc-300 transition-colors"
  >
    Privacy Charter
  </button>

  <button
    onClick={() =>
      document.getElementById('trending')?.scrollIntoView({
        behavior: 'smooth',
      })
    }
    className="hover:text-zinc-300 transition-colors"
  >
    Terms of Service
  </button>

  <button
    onClick={() =>
      document.getElementById('trust')?.scrollIntoView({
        behavior: 'smooth',
      })
    }
    className="hover:text-zinc-300 transition-colors"
  >
    System Infrastructure
  </button>

</div>

          <div className="flex gap-4 text-zinc-400">
            {/* ⚡ BULLETPROOF TWITTER / X INLINE SVG */}
            <a href="#" className="hover:text-white transition-colors">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
              </svg>
            </a>
            
            {/* ⚡ BULLETPROOF GITHUB INLINE SVG */}
            <a href="#" className="hover:text-white transition-colors">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
                <path d="M9 18c-4.51 2-5-2-7-2"></path>
              </svg>
            </a>
            
            {/* ⚡ BULLETPROOF LINKEDIN INLINE SVG */}
            <a href="#" className="hover:text-white transition-colors">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                <rect x="2" y="9" width="4" height="12"></rect>
                <circle cx="4" cy="4" r="2"></circle>
              </svg>
            </a>
          </div>
        </div>
        <div className="text-center mt-8 text-[11px] text-zinc-600">
          © {new Date().getFullYear()} Kupora Protocols Inc. Distributed Open Analytics Validation System.
        </div>
      </footer>
    </div>
  );
}