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

  useEffect(() => {
    if (code.length >= 5) {
      setAiStatus('scanning');
      const timer = setTimeout(() => { setAiStatus('verified'); }, 1400);
      return () => clearTimeout(timer);
    } else {
      setAiStatus('idle');
    }
  }, [code]);

  const handleDrag = (e) => { e.preventDefault(); setIsDragging(e.type === "dragover" || e.type === "dragenter"); };
  const handleDrop = (e) => { e.preventDefault(); setIsDragging(false); if (e.dataTransfer.files && e.dataTransfer.files[0]) { setUploadedLogo(URL.createObjectURL(e.dataTransfer.files[0])); toast.success('Brand asset cached.'); } };
  const handleFileSelect = (e) => { if (e.target.files && e.target.files[0]) { setUploadedLogo(URL.createObjectURL(e.target.files[0])); toast.success('Brand asset cached.'); } };

  const handleUploadCoupon = async (e) => {
    e.preventDefault();
    const currentUser = auth.currentUser;
    if (!currentUser) { toast.error('Authentication fault.'); return; }
    if (!brand.trim() || !code.trim() || !discount.trim() || !price.trim()) { toast.error('Validation Error: Required fields missing.'); return; }

    setSubmitLoading(true);
    const toastId = toast.loading('Syncing node credentials...');

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
        
        // ⚡ Community Trust Foundation Telemetry
        workedCount: 0,
        failedCount: 0,
        
        createdAt: new Date().toISOString()
      });

      toast.success('Voucher contract deployed!', { id: toastId });
      setBrand(''); setDiscount(''); setCode(''); setExpiry(''); setPrice(''); setTerms(''); setUploadedLogo(null);
      setTimeout(() => navigate('/browse'), 2000);
    } catch (err) {
      toast.error(err.message.replace('Firebase: ', ''), { id: toastId });
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030014] text-zinc-200 font-sans antialiased relative pb-24">
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-gradient-to-bl from-purple-600/10 via-cyan-500/5 to-transparent blur-[150px] pointer-events-none z-0" />
      
      <nav className="h-16 border-b border-white/5 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-40 bg-[#030014]/60 backdrop-blur-xl">
        <div className="flex items-center gap-2.5 font-bold text-sm text-white">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-purple-600 to-cyan-400 flex items-center justify-center"><SparklesIcon className="w-4 h-4 text-white" /></div>
          <div>Kupora <span className="text-zinc-600 font-mono font-normal">/ Mint Node Allocation</span></div>
        </div>
        <button type="button" onClick={() => navigate('/browse')} className="text-xs font-mono font-medium text-zinc-500 hover:text-white transition-colors bg-white/5 border border-white/5 px-3 py-1.5 rounded-xl hover:bg-white/10">Cancel</button>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-8 mt-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start relative z-10">
        <div className="lg:col-span-7 space-y-8">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">Deploy Voucher Contract</h1>
            <p className="text-sm text-zinc-500">Inject functional tokens into the Kupora global pipeline.</p>
          </div>

          <form className="space-y-6" onSubmit={handleUploadCoupon}>
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase text-zinc-500 tracking-wider">Asset Brand Identity</label>
              <div onDragOver={handleDrag} onDragLeave={handleDrag} onDrop={handleDrop} className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center gap-3 transition-all relative group overflow-hidden min-h-[140px] ${isDragging ? 'border-purple-500 bg-purple-500/5' : 'border-white/10 bg-white/[0.01] hover:border-white/20'}`}>
                {uploadedLogo ? (
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-white/10 bg-white/5 flex items-center justify-center"><img src={uploadedLogo} alt="Logo" className="w-10 h-10 object-contain" /><button type="button" onClick={() => setUploadedLogo(null)} className="absolute inset-0 bg-black/80 opacity-0 hover:opacity-100 transition-opacity text-[10px] font-bold text-red-400">Clear</button></div>
                ) : (
                  <><UploadIcon /><div className="text-center text-xs text-zinc-400"><label className="text-white font-medium cursor-pointer hover:text-purple-400">Browse directory<input type="file" accept="image/*" className="hidden" onChange={handleFileSelect} /></label> or drop file</div></>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2"><label className="text-xs font-mono uppercase text-zinc-500">Brand Name</label><input type="text" required value={brand} onChange={(e) => setBrand(e.target.value)} className="w-full bg-white/[0.01] border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none" /></div>
              <div className="space-y-2"><label className="text-xs font-mono uppercase text-zinc-500">Discount</label><input type="text" required value={discount} onChange={(e) => setDiscount(e.target.value)} className="w-full bg-white/[0.01] border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none" /></div>
            </div>

            <div className="space-y-2"><label className="text-xs font-mono uppercase text-zinc-500">Coupon Code</label><input type="text" required value={code} onChange={(e) => setCode(e.target.value)} className="w-full bg-white/[0.01] border border-white/10 rounded-xl px-4 py-3.5 text-sm font-mono text-purple-300 focus:outline-none" /></div>
            
            <div className="space-y-2"><label className="text-xs font-mono uppercase text-zinc-500">Category</label><div className="flex flex-wrap gap-2">{CATEGORIES.map(cat => <button key={cat} type="button" onClick={() => setCategory(cat)} className={`px-4 py-2 rounded-xl text-xs font-medium border transition-all ${category === cat ? 'bg-purple-500/10 border-purple-500 text-purple-400' : 'bg-white/[0.01] border-white/5 text-zinc-500'}`}>{cat}</button>)}</div></div>

            <button type="submit" disabled={submitLoading} className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium text-sm py-4 rounded-xl shadow-[0_0_20px_rgba(124,58,237,0.25)] transition-all flex items-center justify-center gap-2 mt-4">{submitLoading ? 'Deploying...' : 'Upload Coupon'} <ArrowRightIcon /></button>
          </form>
        </div>

        {/* RIGHT COLUMN: PREVIEW */}
        <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-24 hidden lg:block">
          <div className="flex items-center gap-1.5 text-xs font-mono uppercase text-zinc-500"><LayoutIcon /> Workspace Preview</div>
          <div className="glass-card border border-white/10 rounded-3xl p-6 min-h-[320px] flex flex-col justify-between bg-white/[0.01] shadow-2xl">
            <div className="text-white font-bold text-base">{brand || 'Brand'}</div>
            <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">{discount || 'Value'}</div>
            <div className="text-xs text-zinc-500 font-mono mt-auto">{code || 'CODE'}</div>
          </div>
        </div>
      </main>
    </div>
  );
}