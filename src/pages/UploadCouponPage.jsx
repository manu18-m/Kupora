import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc } from 'firebase/firestore'; // ⚡ Added Firestore methods
import { db, auth } from '../firebase'; // ⚡ Imported db and auth engines

// --- ATOMIC INLINE SVGS FOR CRASH PROTECTION ---
const UploadIcon = () => <svg className="w-8 h-8 text-zinc-500 group-hover:text-purple-400 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>;
const SparklesIcon = ({ className = "w-4 h-4" }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M14 12a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>;
const ClockIcon = () => <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>;
const CheckIcon = () => <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg>;
const ArrowRightIcon = () => <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>;

const CATEGORIES = ['SaaS Tools', 'Infrastructure', 'Design Resources', 'AI & ML', 'Cloud Hosting'];

export default function UploadCouponPage() {
  const navigate = useNavigate();
  
  // --- FORM STATES ---
  const [brand, setBrand] = useState('');
  const [discount, setDiscount] = useState('');
  const [code, setCode] = useState('');
  const [category, setCategory] = useState('SaaS Tools');
  const [expiry, setExpiry] = useState('');
  const [price, setPrice] = useState('');
  const [terms, setTerms] = useState('');
  
  // --- UI INTERACTIVE STATES ---
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedLogo, setUploadedLogo] = useState(null);
  const [aiStatus, setAiStatus] = useState('idle'); // idle | scanning | verified
  const [suggestedPricing, setSuggestedPricing] = useState(null);

  // --- DATABASE TRANSACTION STATES ---
  const [submitLoading, setSubmitLoading] = useState(false);
  const [transactionError, setTransactionError] = useState('');
  const [transactionSuccess, setTransactionSuccess] = useState(false);

  // Dynamic pricing strategy engine simulator
  useEffect(() => {
    if (discount.length > 2) {
      setSuggestedPricing({
        recommended: `$${Math.floor(Math.random() * 15) + 5}.00/mo`,
        confidence: Math.floor(Math.random() * 10) + 89
      });
    } else {
      setSuggestedPricing(null);
    }
  }, [discount]);

  // AI string checking simulator
  useEffect(() => {
    if (code.length >= 5) {
      setAiStatus('scanning');
      const timer = setTimeout(() => {
        setAiStatus('verified');
      }, 1800);
      return () => clearTimeout(timer);
    } else {
      setAiStatus('idle');
    }
  }, [code]);

  const handleDrag = (e) => {
    e.preventDefault();
    setIsDragging(e.type === "dragover" || e.type === "dragenter");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setUploadedLogo(URL.createObjectURL(e.dataTransfer.files[0]));
    }
  };

  // --- FIRESTORE SUBMISSION FLOW ---
  const handleUploadCoupon = async (e) => {
    e.preventDefault();
    setTransactionError('');
    setTransactionSuccess(false);
    setSubmitLoading(true);

    const currentUser = auth.currentUser;
    if (!currentUser) {
      setTransactionError('Authentication fault: Unassigned session key. Sign in to mint parameters.');
      setSubmitLoading(false);
      return;
    }

    if (!brand.trim() || !code.trim() || !discount.trim() || !price.trim()) {
      setTransactionError('Validation trace: Explicit data constraints require full configuration matrices.');
      setSubmitLoading(false);
      return;
    }

    try {
      await addDoc(collection(db, 'coupons'), {
        brand: brand.trim(),
        code: code.trim().toUpperCase(),
        discount: discount.trim(),
        category: category,
        expiry: expiry || 'Continuous Monitoring',
        price: price.trim(),
        terms: terms.trim() || 'Standard enterprise allocation rules apply.',
        sellerId: currentUser.uid,
        createdAt: new Date().toISOString()
      });

      setTransactionSuccess(true);
      
      // Auto-clear configuration states
      setBrand('');
      setDiscount('');
      setCode('');
      setExpiry('');
      setPrice('');
      setTerms('');
      setUploadedLogo(null);

      setTimeout(() => {
        navigate('/browse');
      }, 2000);

    } catch (err) {
      setTransactionError(err.message.replace('Firebase: ', ''));
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030014] text-zinc-200 font-sans antialiased relative pb-24">
      {/* Background Glow Structure */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-gradient-to-bl from-purple-600/10 via-cyan-500/5 to-transparent blur-[150px] pointer-events-none" />

      {/* STICKY NAV HEADER */}
      <nav className="h-16 border-b border-white/5 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-50 bg-[#030014]/60 backdrop-blur-xl">
        <div className="flex items-center gap-2 font-bold text-sm text-white">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-purple-600 to-cyan-400 flex items-center justify-center">
            <SparklesIcon className="w-4 h-4 text-white" />
          </div>
          VoucherAI <span className="text-zinc-600 font-normal">/ Mint Node Allocation</span>
        </div>
        <button onClick={() => navigate('/browse')} className="text-xs text-zinc-500 hover:text-white transition-colors">
          Abort Session
        </button>
      </nav>

      {/* MASTER TWO-COLUMN GRID */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 mt-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* LEFT COLUMN: THE INPUT BLOCK FORM (7-COL) */}
        <div className="lg:col-span-7 space-y-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Deploy Voucher Contract</h1>
            <p className="text-xs text-zinc-500 mt-1">Inject functional code elements into the global contextual verification pipeline.</p>
          </div>

          <form className="space-y-6" onSubmit={handleUploadCoupon}>
            
            {/* TRANSACTION NOTIFICATIONS TRAY */}
            <AnimatePresence mode="popLayout">
              {transactionError && (
                <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="bg-red-950/30 border border-red-900/40 text-red-400 p-4 rounded-xl text-xs font-mono">
                  {transactionError}
                </motion.div>
              )}
              {transactionSuccess && (
                <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="bg-emerald-950/30 border border-emerald-900/40 text-emerald-400 p-4 rounded-xl text-xs font-mono flex items-center gap-2">
                  <CheckIcon /> Contract successfully initialized. Syncing metadata across ledger layers...
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* DRAG & DROP LOGO AREA */}
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase text-zinc-500 tracking-wider">Asset Brand Identity</label>
              <div 
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center gap-3 transition-all relative ${isDragging ? 'border-purple-500 bg-purple-500/5' : 'border-white/10 bg-white/[0.01] hover:border-white/20'}`}
              >
                {uploadedLogo ? (
                  <div className="relative group w-16 h-16 rounded-xl overflow-hidden border border-white/10 bg-white/5 flex items-center justify-center">
                    <img src={uploadedLogo} alt="Logo preview" className="w-10 h-10 object-contain" />
                    <button type="button" onClick={() => setUploadedLogo(null)} className="absolute inset-0 bg-black/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs text-red-400 font-mono font-bold">Clear</button>
                  </div>
                ) : (
                  <>
                    <UploadIcon />
                    <div className="text-center text-xs text-zinc-400">
                      <span className="text-white font-medium cursor-pointer hover:text-purple-400 transition-colors">Upload a brand image asset</span> or drag and drop
                      <p className="text-zinc-600 font-mono mt-1 text-[10px]">PNG, SVG, or WEBP up to 2MB</p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* TWIN ROW INPUTS: BRAND & DISCOUNT */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase text-zinc-500 tracking-wider">Target Brand</label>
                <input 
                  type="text" value={brand} onChange={(e) => setBrand(e.target.value)} placeholder="e.g. Vercel"
                  className="w-full bg-white/[0.02] border border-white/10 focus:border-purple-500/50 rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-all placeholder-zinc-700"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase text-zinc-500 tracking-wider">Discount Parameter Value</label>
                <input 
                  type="text" value={discount} onChange={(e) => setDiscount(e.target.value)} placeholder="e.g. 40% Off Team Tier"
                  className="w-full bg-white/[0.02] border border-white/10 focus:border-purple-500/50 rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-all placeholder-zinc-700"
                />
              </div>
            </div>

            {/* EXPLICIT VALUE TOKEN HASH CODE */}
            <div className="space-y-2 relative">
              <div className="flex justify-between items-center">
                <label className="text-xs font-mono uppercase text-zinc-500 tracking-wider">Cryptographic Promo Code</label>
                <AnimatePresence mode="popLayout">
                  {aiStatus === 'scanning' && (
                    <motion.span initial={{ opacity: 0, y: 3 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-[10px] font-mono text-cyan-400 flex items-center gap-1.5 bg-cyan-950/40 border border-cyan-800/40 px-2 py-0.5 rounded-full">
                      <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" /> Analyzing string array...
                    </motion.span>
                  )}
                  {aiStatus === 'verified' && (
                    <motion.span initial={{ opacity: 0, y: 3 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-[10px] font-mono text-emerald-400 flex items-center gap-1 bg-emerald-950/40 border border-emerald-800/40 px-2 py-0.5 rounded-full">
                      <CheckIcon /> Syntax Verification Clear
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
              <input 
                type="text" value={code} onChange={(e) => setCode(e.target.value)} placeholder="e.g. VERCEL40AI"
                className="w-full bg-white/[0.02] border border-white/10 focus:border-purple-500/50 rounded-xl px-4 py-3 text-sm font-mono tracking-wider text-purple-300 placeholder-zinc-700 focus:outline-none transition-all"
              />
            </div>

            {/* CATEGORY SELECTOR TRAY */}
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase text-zinc-500 tracking-wider">Classification Category</label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat} type="button" onClick={() => setCategory(cat)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all border ${category === cat ? 'bg-purple-500/10 border-purple-500 text-purple-400' : 'bg-white/[0.01] border-white/5 text-zinc-500 hover:text-white'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* DATE PICKER & PRICING TRAY */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase text-zinc-500 tracking-wider">Lease Expiry Target</label>
                <input 
                  type="date" value={expiry} onChange={(e) => setExpiry(e.target.value)}
                  className="w-full bg-white/[0.02] border border-white/10 focus:border-purple-500/50 rounded-xl px-4 py-3 text-sm text-zinc-400 focus:outline-none transition-all"
                />
              </div>
              
              <div className="space-y-2 relative">
                <label className="text-xs font-mono uppercase text-zinc-500 tracking-wider">Target Contract Valuation Pricing</label>
                <input 
                  type="text" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="e.g. $12.00/mo"
                  className="w-full bg-white/[0.02] border border-white/10 focus:border-purple-500/50 rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-all placeholder-zinc-700"
                />
                
                {/* DYNAMIC PRICE SUGGESTION FLYOUT COMPONENT */}
                <AnimatePresence>
                  {suggestedPricing && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95, y: 5 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 5 }}
                      className="absolute -bottom-14 left-0 right-0 bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 flex justify-between items-center text-[11px] font-mono z-10 shadow-xl"
                    >
                      <span className="text-zinc-500 flex items-center gap-1"><InfoIcon /> Recommended Rate Strategy:</span>
                      <button 
                        type="button" onClick={() => setPrice(suggestedPricing.recommended)}
                        className="text-cyan-400 font-bold hover:underline transition-all bg-cyan-950/50 border border-cyan-800/40 px-2 py-0.5 rounded"
                      >
                        Apply {suggestedPricing.recommended} ({suggestedPricing.confidence}% cert)
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* LEGAL TERMS INPUT BLOCK */}
            <div className={`${suggestedPricing ? 'pt-10' : 'pt-0'} space-y-2 transition-all`}>
              <label className="text-xs font-mono uppercase text-zinc-500 tracking-wider">Execution Restrictive Terms</label>
              <textarea 
                rows="3" value={terms} onChange={(e) => setTerms(e.target.value)} placeholder="e.g. Applies only to specific production configurations. Capped baseline limits map to unique clusters..."
                className="w-full bg-white/[0.02] border border-white/10 focus:border-purple-500/50 rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-all placeholder-zinc-700 resize-none"
              />
            </div>

            {/* MINT CALL TO ACTION TRIGGER */}
            <button 
              type="submit" disabled={submitLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium text-sm py-3.5 rounded-xl shadow-[0_0_20px_rgba(124,58,237,0.3)] transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
            >
              {submitLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Committing Contract to Ledger...</span>
                </>
              ) : (
                <>
                  <span>Broadcast Allocation Parameters</span> <ArrowRightIcon />
                </>
              )}
            </button>
          </form>
        </div>

        {/* RIGHT COLUMN: THE LIVE PREVIEW CARD RENDERER (5-COL) */}
        <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-24">
          <h4 className="text-xs font-mono uppercase tracking-widest text-zinc-500">Live Workspace Pipeline State</h4>
          
          {/* DYNAMIC CARD COMPONENT TARGET PREVIEW */}
          <div className="glass-card border border-white/10 rounded-3xl p-6 relative overflow-hidden min-h-[300px] flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-purple-500/10 via-transparent to-transparent blur-2xl pointer-events-none" />
            
            <div>
              <div className="flex justify-between items-start gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden shrink-0 font-mono text-xs font-bold text-zinc-600">
                    {uploadedLogo ? <img src={uploadedLogo} alt="Logo snippet" className="w-8 h-8 object-contain" /> : '0x'}
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-base tracking-tight truncate max-w-[140px] placeholder-shimmer">
                      {brand || <span className="opacity-20 font-normal">Brand Target</span>}
                    </h3>
                    <p className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider">{category}</p>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1 font-mono text-[9px]">
                  <span className={`px-2 py-0.5 rounded-full border tracking-wide uppercase transition-all ${aiStatus === 'verified' ? 'bg-cyan-950/40 border-cyan-800 text-cyan-400' : 'bg-white/5 border-white/10 text-zinc-600'}`}>
                    AI Scanned
                  </span>
                  <span className="bg-emerald-950/40 border border-emerald-900/30 text-emerald-400 px-2 py-0.5 rounded-full uppercase tracking-wide">
                    99% Accuracy
                  </span>
                </div>
              </div>

              <div className="space-y-1 mb-6">
                <h2 className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-200 to-cyan-400 leading-tight">
                  {discount || <span className="opacity-10 tracking-normal text-white font-extrabold">Allocation Value</span>}
                </h2>
                <div className="text-xs text-zinc-400">
                  Target Pricing Rate: <span className="text-white font-semibold">{price || <span className="opacity-20 font-normal">$0.00</span>}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4 mt-auto">
              <div className="flex justify-between items-center text-[11px] font-mono border-t border-white/5 pt-3 text-zinc-500">
                <span>Lease Bound Lifecycle:</span>
                <span className="text-orange-400 flex items-center gap-1 font-bold">
                  <ClockIcon /> {expiry ? `${expiry}` : 'Continuous Monitoring'}
                </span>
              </div>

              <div className="p-1.5 bg-black/40 border border-white/5 rounded-xl flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-purple-400 pl-3 uppercase tracking-wider">
                  {code || <span className="opacity-20 font-normal normal-case">Code array hash</span>}
                </span>
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-zinc-500 border border-white/5">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                </div>
              </div>
            </div>

          </div>
        </div>

      </main>
    </div>
  );
}

// Extra static helpers
const InfoIcon = () => <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>;