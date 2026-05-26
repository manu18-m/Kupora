import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc } from 'firebase/firestore'; 
import { db, auth } from '../firebase'; 
import toast from 'react-hot-toast';

// --- ATOMIC INLINE SVGS FOR DESIGN IMMUNITY ---
const UploadIcon = () => <svg className="w-8 h-8 text-zinc-500 group-hover:text-purple-400 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>;
const SparklesIcon = ({ className = "w-4 h-4" }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M14 12a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>;
const ClockIcon = () => <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>;
const ArrowRightIcon = () => <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>;
const InfoIcon = () => <svg className="w-3.5 h-3.5 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>;
const LayoutIcon = () => <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>;

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
  const [aiStatus, setAiStatus] = useState('idle'); 
  const [suggestedPricing, setSuggestedPricing] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);

  // Dynamic pricing engine simulator
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

  // AI string syntax scanning simulator
  useEffect(() => {
    if (code.length >= 5) {
      setAiStatus('scanning');
      const timer = setTimeout(() => {
        setAiStatus('verified');
      }, 1400);
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
      toast.success('Brand asset cached in sandbox memory.');
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedLogo(URL.createObjectURL(e.target.files[0]));
      toast.success('Brand asset cached in sandbox memory.');
    }
  };

  // --- FIRESTORE TRANSACTION ENTRY PIPELINE ---
  const handleUploadCoupon = async (e) => {
    e.preventDefault();

    const currentUser = auth.currentUser;
    if (!currentUser) {
      toast.error('Authentication fault: Unassigned session token key.');
      return;
    }

    if (!brand.trim() || !code.trim() || !discount.trim() || !price.trim()) {
      toast.error('Validation Error: Explicit parameter matrices require complete setup configurations.');
      return;
    }

    setSubmitLoading(true);
    const toastId = toast.loading('Syncing node credentials across transaction layers...');

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
        status: "pending", 
        createdAt: new Date().toISOString()
      });

      toast.success('Voucher contract deployed! Awaiting network validator clearance.', { id: toastId });
      
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
      toast.error(err.message.replace('Firebase: ', ''), { id: toastId });
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030014] text-zinc-200 font-sans antialiased relative pb-24">
      {/* Structural ambient lighting anchors */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-gradient-to-bl from-purple-600/10 via-cyan-500/5 to-transparent blur-[150px] pointer-events-none z-0" />
      <div className="absolute bottom-0 left-10 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[130px] pointer-events-none z-0" />

      {/* TOP DEPLOYMENT CONFIG STICKY BAR */}
      <nav className="h-16 border-b border-white/5 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-40 bg-[#030014]/60 backdrop-blur-xl">
        <div className="flex items-center gap-2.5 font-bold text-sm text-white">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-purple-600 to-cyan-400 flex items-center justify-center shadow-md shadow-purple-500/20">
            <SparklesIcon className="w-4 h-4 text-white" />
          </div>
          <div>
            Kupora <span className="text-zinc-600 font-mono font-normal">/ Mint Node Allocation</span>
          </div>
        </div>
        <button type="button" onClick={() => navigate('/browse')} className="text-xs font-mono font-medium text-zinc-500 hover:text-white transition-colors bg-white/5 border border-white/5 px-3 py-1.5 rounded-xl hover:bg-white/10">
          Cancel Upload
        </button>
      </nav>

      {/* TWO-COLUMN GRID BOUNDS CONTAINER */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 mt-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start relative z-10">
        
        {/* LEFT COMPONENT COLUMN: PREMIUM WORKFLOW INPUT CONFIG (7-COL) */}
        <div className="lg:col-span-7 space-y-8">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">Upload Coupon</h1>
            <p className="text-sm text-zinc-500 font-normal">Upload and manage verified discount coupons for the Kupora marketplace.</p>
          </div>

          <form className="space-y-6" onSubmit={handleUploadCoupon}>
            
            {/* FILE SUBMISSION/DRAG BLOCK */}
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase text-zinc-500 tracking-wider">Asset Brand Identity Logo</label>
              <div 
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center gap-3 transition-all relative group overflow-hidden min-h-[140px] ${isDragging ? 'border-purple-500 bg-purple-500/5' : 'border-white/10 bg-white/[0.01] hover:border-white/20'}`}
              >
                {uploadedLogo ? (
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="relative group w-16 h-16 rounded-xl overflow-hidden border border-white/10 bg-white/5 flex items-center justify-center shadow-inner">
                    <img src={uploadedLogo} alt="Preview segment string" className="w-10 h-10 object-contain" />
                    <button type="button" onClick={() => setUploadedLogo(null)} className="absolute inset-0 bg-black/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs text-red-400 font-mono font-bold">Clear</button>
                  </motion.div>
                ) : (
                  <>
                    <UploadIcon />
                    <div className="text-center text-xs text-zinc-400">
                      <label className="text-white font-medium cursor-pointer hover:text-purple-400 transition-colors inline-block">
                        Browse workspace node directory
                        <input type="file" accept="image/*" className="hidden" onChange={handleFileSelect} />
                      </label>
                      <span> or drag asset configuration</span>
                      <p className="text-zinc-600 font-mono mt-1 text-[10px]">SVG, PNG, or WEBP system profiles up to 2MB</p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* TWIN ROW INTERFACE INPUT FIELDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase text-zinc-500 tracking-wider">Brand Name</label>
                <input 
                  type="text" required value={brand} onChange={(e) => setBrand(e.target.value)} placeholder="e.g. Supabase"
                  className="w-full bg-white/[0.01] border border-white/10 focus:border-purple-500/40 rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none transition-all placeholder-zinc-700 focus:ring-1 focus:ring-purple-500/30"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase text-zinc-500 tracking-wider">Discount Offer</label>
                <input 
                  type="text" required value={discount} onChange={(e) => setDiscount(e.target.value)} placeholder="e.g. $50.00 Free Cloud Credits"
                  className="w-full bg-white/[0.01] border border-white/10 focus:border-purple-500/40 rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none transition-all placeholder-zinc-700 focus:ring-1 focus:ring-purple-500/30"
                />
              </div>
            </div>

            {/* SYNTAX TOKEN INPUT CODE FIELD */}
            <div className="space-y-2 relative">
              <div className="flex justify-between items-center h-4">
                <label className="text-xs font-mono uppercase text-zinc-500 tracking-wider">Coupon Code</label>
                <AnimatePresence mode="popLayout">
                  {aiStatus === 'scanning' && (
                    <motion.span initial={{ opacity: 0, y: 3 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-[10px] font-mono text-cyan-400 flex items-center gap-1.5 bg-cyan-950/40 border border-cyan-800/40 px-2.5 py-0.5 rounded-full">
                      <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" /> Evaluating array signature...
                    </motion.span>
                  )}
                  {aiStatus === 'verified' && (
                    <motion.span initial={{ opacity: 0, y: 3 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-[10px] font-mono text-emerald-400 flex items-center gap-1 bg-emerald-950/40 border border-emerald-800/40 px-2.5 py-0.5 rounded-full">
                      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg> Key Token Struct Valid
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
              <input 
                type="text" required value={code} onChange={(e) => setCode(e.target.value)} placeholder="e.g. SUPADATABASE50"
                className="w-full bg-white/[0.01] border border-white/10 focus:border-purple-500/40 rounded-xl px-4 py-3.5 text-sm font-mono tracking-wider text-purple-300 placeholder-zinc-700 focus:outline-none transition-all focus:ring-1 focus:ring-purple-500/30"
              />
            </div>

            {/* CATEGORY MATRIX ARRAY SELECTION GRID */}
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase text-zinc-500 tracking-wider">Category</label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat} type="button" onClick={() => setCategory(cat)}
                    className={`px-4 py-2.5 rounded-xl text-xs font-medium transition-all border ${category === cat ? 'bg-purple-500/10 border-purple-500 text-purple-400 font-bold shadow-inner' : 'bg-white/[0.01] border-white/5 text-zinc-500 hover:text-white hover:border-white/10'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* CALCULATION RATE & LEASE MATRICES */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase text-zinc-500 tracking-wider">Expiry Date</label>
                <input 
                  type="date" value={expiry} onChange={(e) => setExpiry(e.target.value)}
                  className="w-full bg-white/[0.01] border border-white/10 focus:border-purple-500/40 rounded-xl px-4 py-3.5 text-sm text-zinc-400 focus:outline-none transition-all focus:ring-1 focus:ring-purple-500/30"
                />
              </div>
              
              <div className="space-y-2 relative">
                <label className="text-xs font-mono uppercase text-zinc-500 tracking-wider">Selling Price</label>
                <input 
                  type="text" required value={price} onChange={(e) => setPrice(e.target.value)} placeholder="e.g. $5.00 Base Pool"
                  className="w-full bg-white/[0.01] border border-white/10 focus:border-purple-500/40 rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none transition-all placeholder-zinc-700 focus:ring-1 focus:ring-purple-500/30"
                />
                
                {/* FLOATING RECOMMENDATION STRATEGY ALGORITHM BLOCK */}
                <AnimatePresence>
                  {suggestedPricing && (
                    <motion.div 
                      initial={{ opacity: 0, y: 4, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 4, scale: 0.98 }}
                      className="absolute -bottom-14 left-0 right-0 bg-zinc-900/95 backdrop-blur-md border border-white/5 rounded-xl p-2.5 flex justify-between items-center text-[11px] font-mono z-20 shadow-xl"
                    >
                      <span className="text-zinc-500 flex items-center gap-1"><InfoIcon /> Rates Core Suggestion:</span>
                      <button 
                        type="button" onClick={() => setPrice(suggestedPricing.recommended)}
                        className="text-cyan-400 font-bold hover:text-cyan-300 transition-colors bg-cyan-950/50 border border-cyan-800/40 px-2 py-0.5 rounded text-[10px]"
                      >
                        Apply {suggestedPricing.recommended} ({suggestedPricing.confidence}% confidence)
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* BOUNDARY AND RESTRICIVE MATRIX FORM TERM CONDITIONS */}
            <div className={`${suggestedPricing ? 'pt-10' : 'pt-0'} space-y-2 transition-all duration-200`}>
              <label className="text-xs font-mono uppercase text-zinc-500 tracking-wider">Contract Bound Limitations & Terms</label>
              <textarea 
                rows="3" value={terms} onChange={(e) => setTerms(e.target.value)} placeholder="Applies to pro tiers rolling cycles configurations. Limits map to unique cryptographic workspace clusters context..."
                className="w-full bg-white/[0.01] border border-white/10 focus:border-purple-500/40 rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-all placeholder-zinc-700 resize-none focus:ring-1 focus:ring-purple-500/30"
              />
            </div>

            {/* BROADCAST CONTRACT ACTIONS EXECUTOR BUTTON TRIGGER */}
            <button 
              type="submit" disabled={submitLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium text-sm py-4 rounded-xl shadow-[0_0_20px_rgba(124,58,237,0.25)] transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
            >
              {submitLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Pushing Parameters Matrix Block...</span>
                </>
              ) : (
                <>
                  <span>Upload Coupon</span> <ArrowRightIcon />
                </>
              )}
            </button>
          </form>
        </div>

        {/* RIGHT COLUMN COMPONENT LAYER: WORKSPACE REAL-TIME DESKTOP PREVIEW CHANNEL (5-COL) */}
        <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-24 hidden lg:block">
          <div className="flex items-center gap-1.5 text-xs font-mono uppercase text-zinc-500 tracking-wider">
            <LayoutIcon /> Real-time Workspace Pipeline State Preview
          </div>
          
          <div className="glass-card border border-white/10 rounded-3xl p-6 relative overflow-hidden min-h-[320px] flex flex-col justify-between bg-white/[0.01] shadow-2xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-purple-500/10 via-transparent to-transparent blur-2xl pointer-events-none" />
            
            <div>
              <div className="flex justify-between items-start gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden shrink-0 font-mono text-xs font-bold text-zinc-600">
                    {uploadedLogo ? <img src={uploadedLogo} alt="Logo thumbnail stream snippet" className="w-8 h-8 object-contain" /> : '0x'}
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-base tracking-tight truncate max-w-[150px]">
                      {brand || <span className="opacity-20 font-normal italic">Identity Target</span>}
                    </h3>
                    <p className="text-[10px] font-mono text-purple-400 bg-purple-950/20 px-2 py-0.5 rounded border border-purple-900/30 mt-0.5 w-max uppercase tracking-wider">{category}</p>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1 font-mono text-[9px] text-right">
                  <span className={`px-2 py-0.5 rounded-full border tracking-wide uppercase font-bold transition-all ${aiStatus === 'verified' ? 'bg-cyan-950/40 border-cyan-800 text-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.15)]' : 'bg-white/5 border-white/10 text-zinc-600'}`}>
                    {aiStatus === 'verified' ? 'AI Scanned Clear' : 'Analysis Idle'}
                  </span>
                  <span className="bg-emerald-950/40 border border-emerald-900/30 text-emerald-400 px-2 py-0.5 rounded-full uppercase tracking-wide font-medium">
                    99% Accuracy Verified
                  </span>
                </div>
              </div>

              <div className="space-y-1 mb-6">
                <h2 className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-200 to-cyan-400 leading-tight tracking-tight">
                  {discount || <span className="opacity-10 tracking-normal text-white font-extrabold">Matrix Value Capacity</span>}
                </h2>
                <div className="text-xs text-zinc-400">
                  Target Pricing Clearance Rate: <span className="text-white font-semibold font-mono">{price || <span className="opacity-20 font-normal">$0.00 Base</span>}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4 mt-auto">
              <div className="flex justify-between items-center text-[11px] font-mono border-t border-white/5 pt-3 text-zinc-500">
                <span>Lease Bound Lifecycle Expiry:</span>
                <span className="text-orange-400 flex items-center gap-1 font-bold">
                  <ClockIcon /> {expiry ? `${expiry}` : 'Continuous Monitoring'}
                </span>
              </div>

              <div className="p-2 bg-black/40 border border-white/5 rounded-xl flex items-center justify-between shadow-inner">
                <span className="font-mono text-xs font-bold text-purple-400 pl-2 uppercase tracking-wider">
                  {code ? code.toUpperCase() : <span className="opacity-20 font-normal normal-case italic text-zinc-600">Voucher string hash channel...</span>}
                </span>
                <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-zinc-500 border border-white/5">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                </div>
              </div>
            </div>

          </div>

          {/* EMPTY EXTRA DESCRIPTIVE MAP STATE GUIDANCE TEXT */}
          <AnimatePresence>
            {!brand && !discount && !code && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 border border-dashed border-white/5 rounded-2xl bg-white/[0.005] text-center text-xs font-mono text-zinc-600 leading-relaxed">
                Fill the left compilation matrix fields to feed properties straight to the dynamic sandbox simulation window.
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </main>
    </div>
  );
}