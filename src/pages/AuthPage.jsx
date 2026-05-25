import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Cpu, Mail, Lock, User, ArrowRight, Sparkles, 
  ShieldCheck, Check, AlertCircle, ArrowLeft, KeySquare 
} from 'lucide-react';

export default function AuthPage() {
  // UI states: 'login' | 'register' | 'forgot' | 'otp'
  const [authState, setAuthState] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [name, setName] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [errors, setErrors] = useState({});

  // Helper for password tracking strength calculations
  const calculatePasswordStrength = (pwd) => {
    let score = 0;
    if (!pwd) return score;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    return score;
  };

  const pwdStrength = calculatePasswordStrength(password);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    
    // Simple frontend validation examples
    if (authState === 'login' && !email) {
      setErrors({ email: 'Valid institutional email is required.' });
      return;
    }
    
    if (authState === 'register') {
      if (!name) { setErrors({ name: 'Profile handle cannot be empty.' }); return; }
      if (password !== passwordConfirm) { setErrors({ passwordConfirm: 'Security tokens do not match.' }); return; }
      // Transition to OTP verification phase 
      setAuthState('otp');
      return;
    }

    if (authState === 'forgot') {
      setAuthState('login'); // Fallback loop asset
    }
  };

  const handleOtpChange = (element, index) => {
    if (isNaN(element.value)) return false;
    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);
    if (element.nextSibling) {
      element.nextSibling.focus();
    }
  };

  // Shared structural variants for clean layout shifts
  const formVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0, transition: { cubicBezier: [0.16, 1, 0.3, 1], duration: 0.4 } },
    exit: { opacity: 0, x: -20, transition: { duration: 0.2 } }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-[#030014] text-zinc-100 antialiased overflow-hidden">
      
      {/* LEFT PANEL: BRAND INFRASTRUCTURE GLOW PROPS */}
      <div className="hidden lg:flex lg:col-span-5 bg-[#05021a] border-r border-white/5 relative items-center justify-center p-12 overflow-hidden">
        {/* Dynamic backdrop arrays */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-gradient-to-tr from-purple-600/15 to-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-full h-[1px] bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />
        
        <div className="max-w-md space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 font-bold text-xl text-white">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-purple-600/30">
              <Cpu className="w-5 h-5 text-white" />
            </div>
            <span>Voucher<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">AI</span></span>
          </div>
          
          <h1 className="text-3xl font-extrabold tracking-tight text-white leading-tight">
            Deploy dynamic discount payloads directly via <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-300">Unified Web API Hooks</span>.
          </h1>
          
          <p className="text-zinc-400 text-sm leading-relaxed">
            Gain immediate access to our real-time checkout monitoring grid. Eliminate stale codes and scale validation yields autonomously.
          </p>

          <div className="pt-6 border-t border-white/5 space-y-3">
            <div className="flex items-center gap-3 text-xs text-zinc-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> Fully secure client-side sandbox isolation
            </div>
            <div className="flex items-center gap-3 text-xs text-zinc-400">
              <Sparkles className="w-4 h-4 text-cyan-400" /> Continuous synthetic automated validations
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL: INTERACTIVE CONFIGURATOR SCHEMAS */}
      <div className="col-span-1 lg:col-span-7 flex items-center justify-center p-6 sm:p-12 relative">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[140px] pointer-events-none" />
        
        <div className="w-full max-w-md relative z-10">
          
          {/* TOP BAR ACTION TRACE FOR OTP / FORGOT SUB-STATES */}
          {authState !== 'login' && authState !== 'register' && (
            <button 
              onClick={() => setAuthState('login')}
              className="inline-flex items-center gap-2 text-xs text-zinc-500 hover:text-white transition-colors mb-8"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Return to access gate
            </button>
          )}

          <AnimatePresence mode="wait">
            
            {/* LOGIN SUB-VIEW PANEL */}
            {authState === 'login' && (
              <motion.div key="login" variants={formVariants} initial="hidden" animate="visible" exit="exit" className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-white tracking-tight">Welcome operator</h2>
                  <p className="text-zinc-400 text-sm mt-1">Authenticate identity nodes to synchronize system vaults.</p>
                </div>

                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-zinc-400">Institutional Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-3 w-4 h-4 text-zinc-500" />
                      <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@company.com" 
                        className={`w-full bg-white/[0.02] border ${errors.email ? 'border-red-500/50' : 'border-white/10'} focus:border-purple-500/50 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none transition-all`}
                      />
                    </div>
                    {errors.email && <p className="text-[11px] text-red-400 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.email}</p>}
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-medium text-zinc-400">Security Token</label>
                      <button type="button" onClick={() => setAuthState('forgot')} className="text-xs text-purple-400 hover:text-purple-300 transition-colors">Forgot Key?</button>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-3 w-4 h-4 text-zinc-500" />
                      <input 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••" 
                        className="w-full bg-white/[0.02] border border-white/10 focus:border-purple-500/50 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none transition-all"
                      />
                    </div>
                  </div>

                  <button type="submit" className="w-full py-2.5 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-xl text-sm font-medium text-white shadow-[0_0_20px_rgba(124,58,237,0.25)] transition-all transform hover:scale-[1.01] flex items-center justify-center gap-2">
                    Establish Connection <ArrowRight className="w-4 h-4" />
                  </button>
                </form>

                <div className="relative my-6 flex items-center justify-center">
                  <div className="absolute w-full border-b border-white/5" />
                  <span className="relative px-3 bg-[#030014] text-[11px] font-mono uppercase tracking-widest text-zinc-600">Alternative Vectors</span>
                </div>

                <button className="w-full py-2.5 px-4 border border-white/10 hover:border-white/20 bg-white/[0.01] hover:bg-white/[0.04] text-zinc-300 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/></svg>
                  Access via Google Cloud SSO
                </button>

                <p className="text-center text-xs text-zinc-500">
                  New deployment sector?{' '}
                  <button onClick={() => setAuthState('register')} className="text-purple-400 hover:text-purple-300 transition-colors underline underline-offset-4">Provision account</button>
                </p>
              </motion.div>
            )}

            {/* REGISTER SUB-VIEW PANEL */}
            {authState === 'register' && (
              <motion.div key="register" variants={formVariants} initial="hidden" animate="visible" exit="exit" className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-white tracking-tight">Provision Identity</h2>
                  <p className="text-zinc-400 text-sm mt-1">Initialize customized workspace credentials configuration.</p>
                </div>

                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-zinc-400">Account Operator Name</label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-3 w-4 h-4 text-zinc-500" />
                      <input 
                        type="text" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Satya Nadella" 
                        className={`w-full bg-white/[0.02] border ${errors.name ? 'border-red-500/50' : 'border-white/10'} focus:border-purple-500/50 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none transition-all`}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-zinc-400">Institutional Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-3 w-4 h-4 text-zinc-500" />
                      <input 
                        type="email" 
                        required
                        placeholder="satya@microsoft.com" 
                        className="w-full bg-white/[0.02] border border-white/10 focus:border-purple-500/50 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-zinc-400">Create Private Security Token</label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-3 w-4 h-4 text-zinc-500" />
                      <input 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••" 
                        className="w-full bg-white/[0.02] border border-white/10 focus:border-purple-500/50 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none transition-all"
                      />
                    </div>
                    
                    {/* COMPLEX PASSWORD STRENGTH INDICATOR PRIMITIVE */}
                    {password && (
                      <div className="space-y-1 pt-1">
                        <div className="flex gap-1 h-1 w-full rounded-full bg-white/5 overflow-hidden">
                          {[...Array(4)].map((_, i) => (
                            <div 
                              key={i} 
                              className={`h-full flex-1 transition-all duration-300 ${
                                i < pwdStrength 
                                  ? pwdStrength <= 2 ? 'bg-amber-500' : 'bg-emerald-500'
                                  : 'bg-transparent'
                              }`} 
                            />
                          ))}
                        </div>
                        <p className="text-[10px] font-mono tracking-wider text-zinc-500 uppercase">
                          Entropy rating:{' '}
                          <span className={pwdStrength <= 2 ? 'text-amber-400' : 'text-emerald-400'}>
                            {pwdStrength === 1 && 'Critical'}
                            {pwdStrength === 2 && 'Weak Payload'}
                            {pwdStrength === 3 && 'Secure Check'}
                            {pwdStrength === 4 && 'Highly Cryptographic'}
                          </span>
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-zinc-400">Confirm Security Token</label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-3 w-4 h-4 text-zinc-500" />
                      <input 
                        type="password" 
                        value={passwordConfirm}
                        onChange={(e) => setPasswordConfirm(e.target.value)}
                        placeholder="••••••••" 
                        className={`w-full bg-white/[0.02] border ${errors.passwordConfirm ? 'border-red-500/50' : 'border-white/10'} focus:border-purple-500/50 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none transition-all`}
                      />
                    </div>
                    {errors.passwordConfirm && <p className="text-[11px] text-red-400 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.passwordConfirm}</p>}
                  </div>

                  <button type="submit" className="w-full py-2.5 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-xl text-sm font-medium text-white shadow-[0_0_20px_rgba(124,58,237,0.25)] transition-all transform hover:scale-[1.01]">
                    Initialize Core Protocol
                  </button>
                </form>

                <p className="text-center text-xs text-zinc-500">
                  Already mapped to the system?{' '}
                  <button onClick={() => setAuthState('login')} className="text-purple-400 hover:text-purple-300 transition-colors underline underline-offset-4">Invoke connection</button>
                </p>
              </motion.div>
            )}

            {/* OTP SECURITY VERIFICATION STEP */}
            {authState === 'otp' && (
              <motion.div key="otp" variants={formVariants} initial="hidden" animate="visible" exit="exit" className="space-y-6">
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-2xl flex items-center justify-center mx-auto">
                    <KeySquare className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold text-white tracking-tight">Two-Factor Authentication</h2>
                  <p className="text-zinc-400 text-sm max-w-xs mx-auto">We routed a 4-digit verification matrix payload directly to your workspace inbox address.</p>
                </div>

                <form onSubmit={(e) => { e.preventDefault(); setAuthState('login'); }} className="space-y-6">
                  <div className="flex justify-center gap-3">
                    {otp.map((data, index) => (
                      <input
                        key={index}
                        type="text"
                        maxLength="1"
                        value={data}
                        onChange={(e) => handleOtpChange(e.target, index)}
                        onFocus={(e) => e.target.select()}
                        className="w-14 h-14 bg-white/[0.02] border border-white/10 focus:border-purple-500 text-center font-mono text-xl font-bold text-white rounded-xl focus:outline-none transition-all"
                      />
                    ))}
                  </div>

                  <button type="submit" className="w-full py-2.5 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-xl text-sm font-medium text-white shadow-[0_0_20px_rgba(124,58,237,0.25)] transition-all transform hover:scale-[1.01]">
                    Verify Sync Matrix
                  </button>
                </form>

                <p className="text-center text-xs text-zinc-500">
                  Matrix latency timeout?{' '}
                  <button onClick={() => setOtp(['', '', '', ''])} className="text-purple-400 hover:text-purple-300 transition-colors underline underline-offset-4">Transmit new signal</button>
                </p>
              </motion.div>
            )}

            {/* FORGOT PASSWORD PROTOCOL */}
            {authState === 'forgot' && (
              <motion.div key="forgot" variants={formVariants} initial="hidden" animate="visible" exit="exit" className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-white tracking-tight">Key Override Matrix</h2>
                  <p className="text-zinc-400 text-sm mt-1">Submit your verification endpoints to dispatch password sync directives.</p>
                </div>

                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-zinc-400">Registered Institutional Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-3 w-4 h-4 text-zinc-500" />
                      <input 
                        type="email" 
                        required
                        placeholder="operator@company.com" 
                        className="w-full bg-white/[0.02] border border-white/10 focus:border-purple-500/50 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none transition-all"
                      />
                    </div>
                  </div>

                  <button type="submit" className="w-full py-2.5 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-xl text-sm font-medium text-white shadow-[0_0_20px_rgba(124,58,237,0.25)] transition-all transform hover:scale-[1.01]">
                    Dispatch Override Signal
                  </button>
                </form>
              </motion.div>
            )}
            
          </AnimatePresence>
        </div>
      </div>

    </div>
  );
}