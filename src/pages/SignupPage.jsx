import React, { useState } from 'react';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user'); // default: user | seller
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 1. Compile base node identification within authentication layer
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. Dispatch programmatic email verification token signature straight to inbox
      await sendEmailVerification(user);
      toast.success("Verification email sent! Please check your inbox.");

      // 3. Persist core metadata inside structural user documents matrix
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        role: role,
        handle: `@${email.split('@')[0]}`,
        createdAt: new Date().toISOString()
      });

      // 4. Provision skeleton state arrays inside profiles if registering as a seller
      if (role === 'seller') {
        await setDoc(doc(db, 'profiles', user.uid), {
          displayName: email.split('@')[0],
          bio: 'Kupora dynamic platform service provider node.',
          trustScore: 95,
          createdAt: new Date().toISOString()
        });
      }

      // 5. Navigate to the core workspace dashboard layout
      navigate('/dashboard');
    } catch (err) {
      const sanitizedError = err.message.replace('Firebase: ', '');
      setError(sanitizedError);
      toast.error(sanitizedError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030014] text-zinc-200 font-sans flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decorative Flares */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md glass-card border border-white/10 rounded-3xl p-8 space-y-6 relative z-10"
      >
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-black text-white tracking-tight">Create Your Account</h1>
          <p className="text-xs text-zinc-500 font-mono uppercase tracking-wider">Join the Kupora marketplace</p>
        </div>

        {error && (
          <div className="bg-red-950/30 border border-red-900/40 text-red-400 p-3 rounded-xl text-xs font-mono">
            {error}
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-mono uppercase text-zinc-500 tracking-wider">Select Account Type</label>
            <div className="grid grid-cols-2 gap-2">
              {['user', 'seller'].map((r) => (
                <button
                  key={r} type="button" onClick={() => setRole(r)}
                  className={`py-2 rounded-xl text-xs font-mono font-bold uppercase border transition-all ${role === r ? 'bg-purple-600/20 border-purple-500 text-purple-400' : 'bg-white/[0.01] border-white/5 text-zinc-500 hover:text-white'}`}
                >
                  {r === 'user' ? 'Buyer' : 'Seller'}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-mono uppercase text-zinc-500 tracking-wider">Email Address</label>
            <input 
              type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="operator@domain.xyz"
              className="w-full bg-white/[0.02] border border-white/10 focus:border-purple-500/50 rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-all placeholder-zinc-700"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-mono uppercase text-zinc-500 tracking-wider">Passphrase Allocation</label>
            <input 
              type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min 6 characters"
              className="w-full bg-white/[0.02] border border-white/10 focus:border-purple-500/50 rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-all placeholder-zinc-700"
            />
          </div>

          <button 
            type="submit" disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium text-xs font-mono uppercase tracking-wider py-3.5 rounded-xl shadow-[0_0_20px_rgba(124,58,237,0.2)] hover:from-purple-500 hover:to-indigo-500 transition-all disabled:opacity-50"
          >
            {loading ? 'Compiling Profile Documents...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-xs text-zinc-500">
          Already have an account? <Link to="/login" className="text-purple-400 hover:underline">Sign In Instead</Link>
        </p>
      </motion.div>
    </div>
  );
}