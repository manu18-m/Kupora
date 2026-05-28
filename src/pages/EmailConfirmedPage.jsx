import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function EmailConfirmedPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#030014] text-zinc-200 font-sans flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decorative Flare Matrix */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-purple-600/5 rounded-full blur-[100px] pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
        className="w-full max-w-md glass-card border border-white/10 rounded-3xl p-8 space-y-6 text-center relative z-10 bg-white/[0.01] backdrop-blur-2xl shadow-2xl"
      >
        {/* Animated Check Icon */}
        <div className="mx-auto w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.1)]">
          <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        <div className="space-y-2">
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-tight">
            Email Confirmed Successfully ✅
          </h1>
          <p className="text-xs font-mono text-zinc-500 uppercase tracking-wider">
            Clearance Validation Parameter Pushed
          </p>
        </div>

        <p className="text-sm text-zinc-400 leading-relaxed max-w-xs mx-auto">
          Your Kupora account has been verified. Your platform node signature is now fully active inside the network ledger.
        </p>

        <button 
          type="button"
          onClick={() => navigate('/dashboard')}
          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-mono font-bold text-xs uppercase tracking-wider py-3.5 rounded-xl shadow-[0_0_25px_rgba(124,58,237,0.25)] transition-all transform hover:scale-[1.01]"
        >
          Enter Workspace Core Dashboard
        </button>
      </motion.div>
    </div>
  );
}