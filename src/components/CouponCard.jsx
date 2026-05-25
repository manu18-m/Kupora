import { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, Sparkles, ArrowUpRight } from 'lucide-react';
import { Button } from './ui/Button';

export const CouponCard = ({ coupon }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(coupon.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      className="glass-panel rounded-2xl p-6 relative overflow-hidden group flex flex-col justify-between min-h-[220px]"
    >
      {/* Background Glow Effect */}
      <div className="absolute -right-10 -top-10 w-32 h-32 bg-violet-600/10 rounded-full blur-2xl group-hover:bg-violet-600/20 transition-all duration-300" />
      
      <div>
        {/* Card Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 overflow-hidden">
              <img src={coupon.logo} alt={coupon.brand} className="w-8 h-8 object-contain" />
            </div>
            <div>
              <h3 className="font-semibold text-white text-lg flex items-center gap-1.5">
                {coupon.brand}
                <ArrowUpRight className="w-4 h-4 text-zinc-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              </h3>
              <p className="text-xs text-zinc-400">{coupon.category}</p>
            </div>
          </div>
          
          {/* AI Success Prediction Rate */}
          {coupon.aiConfidence && (
            <div className="flex items-center gap-1 text-[11px] font-medium text-cyan-400 bg-cyan-950/40 border border-cyan-800/50 px-2 py-1 rounded-full">
              <Sparkles className="w-3 h-3" />
              {coupon.aiConfidence}% Match
            </div>
          )}
        </div>

        {/* Coupon Value / Title */}
        <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-200 to-zinc-400 mb-2">
          {coupon.discount}
        </h2>
        <p className="text-sm text-zinc-400 line-clamp-2 mb-4">{coupon.description}</p>
      </div>

      {/* Action Tray */}
      <div className="flex items-center gap-2 mt-auto">
        <div className="flex-1 font-mono text-sm font-semibold tracking-wider bg-black/40 text-violet-400 border border-violet-900/40 px-3 py-2 rounded-xl text-center select-all">
          {coupon.code}
        </div>
        <Button variant={copied ? 'secondary' : 'primary'} onClick={handleCopy} className="!p-3">
          {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
        </Button>
      </div>
    </motion.div>
  );
};