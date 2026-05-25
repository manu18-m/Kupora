import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message.replace('Firebase: ', ''));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030014] text-zinc-200 font-sans flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md glass-card border border-white/10 rounded-3xl p-8 space-y-6 relative z-10"
      >
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-black text-white tracking-tight">Access Terminal</h1>
          <p className="text-xs text-zinc-500 font-mono uppercase tracking-wider">Initialize Security Session</p>
        </div>

        {error && (
          <div className="bg-red-950/30 border border-red-900/40 text-red-400 p-3 rounded-xl text-xs font-mono">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-mono uppercase text-zinc-500 tracking-wider">Network Identity (Email)</label>
            <input 
              type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="operator@domain.xyz"
              className="w-full bg-white/[0.02] border border-white/10 focus:border-purple-500/50 rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-mono uppercase text-zinc-500 tracking-wider">Passphrase Key</label>
            <input 
              type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••"
              className="w-full bg-white/[0.02] border border-white/10 focus:border-purple-500/50 rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-all"
            />
          </div>

          <button 
            type="submit" disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium text-xs font-mono uppercase tracking-wider py-3.5 rounded-xl shadow-[0_0_20px_rgba(124,58,237,0.2)] hover:from-purple-500 hover:to-indigo-500 transition-all disabled:opacity-50"
          >
            {loading ? 'Authenticating Data...' : 'Sign In To Node'}
          </button>
        </form>

        <p className="text-center text-xs text-zinc-500">
          Unregistered user trace? <Link to="/signup" className="text-purple-400 hover:underline">Register New Node</Link>
        </p>
      </motion.div>
    </div>
  );
}