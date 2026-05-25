import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Sparkles, SlidersHorizontal } from 'lucide-react';
import { CouponCard } from '../components/CouponCard';
import { Button } from '../components/ui/Button';

// Mock Data for Production Shell Configuration
const MOCK_COUPONS = [
  { id: 1, brand: 'Vercel', category: 'Cloud Infrastructure', discount: 'Pro Plan: $50 Off', description: 'Unlock advanced analytical tools, globally distributed compute setups, and premium team features.', code: 'VERCELAI50', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vercel/vercel-original.svg', aiConfidence: 99 },
  { id: 2, brand: 'Framer', category: 'Design Tools', discount: '3 Months Free', description: 'Build interactive websites instantly. Valid across all personal and workspace professional tiers.', code: 'MOTIONARTIST', logo: 'https://img.stackshare.io/service/11494/framer.png', aiConfidence: 94 },
  { id: 3, brand: 'Linear', category: 'Productivity', discount: '20% Off Annual Base', description: 'Streamline project backlogs, cycles, and internal engineering workflows seamlessly.', code: 'LINEAR20CYCLE', logo: 'https://linear.app/static/images/logo.png', aiConfidence: 89 },
];

export const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleAISubmit = (e) => {
    e.preventDefault();
    if (!searchQuery) return;
    setIsSearching(true);
    // Mimic real-time asynchronous streaming/AI filtering state changes
    setTimeout(() => setIsSearching(false), 800);
  };

  return (
    <div className="space-y-12">
      {/* Hero Content Section */}
      <div className="text-center max-w-3xl mx-auto space-y-4 pt-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-500/10 to-indigo-500/10 border border-violet-500/20 px-3 py-1.5 rounded-full text-xs font-medium text-violet-300 mb-2"
        >
          <Sparkles className="w-3.5 h-3.5" /> Next-Gen Natural Language Coupon Filtering
        </motion.div>
        
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
          Find discounts using <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-purple-400 to-cyan-400 text-neon-glow">Contextual AI</span>
        </h1>
        <p className="text-zinc-400 text-lg sm:text-xl max-w-xl mx-auto">
          Stop digging for expired codes. Describe your stack or use case and let our engine extract valid tokens.
        </p>
      </div>

      {/* Semantic AI Search Bar */}
      <div className="max-w-2xl mx-auto">
        <form onSubmit={handleAISubmit} className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 to-cyan-500 rounded-2xl blur opacity-20 group-focus-within:opacity-40 transition duration-300" />
          <div className="relative flex items-center">
            <Search className="absolute left-4 w-5 h-5 text-zinc-500 group-focus-within:text-violet-400 transition-colors" />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Try searching 'Best hosting deals for a React indie hacker app'..."
              className="w-full glass-input pl-12 pr-32 py-4 rounded-2xl text-white placeholder-zinc-500 text-sm focus:outline-none"
            />
            <div className="absolute right-2 flex items-center gap-1.5">
              <Button type="button" variant="ghost" className="!p-2 hidden sm:flex">
                <SlidersHorizontal className="w-4 h-4 text-zinc-400" />
              </Button>
              <Button type="submit" variant="primary" className="!py-2 !px-4 text-xs">
                {isSearching ? 'Analyzing...' : 'Ask AI'}
              </Button>
            </div>
          </div>
        </form>
      </div>

      {/* Coupon Grid Marketplace Showcase */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <h2 className="text-lg font-semibold text-white tracking-wide">Trending Real-Time Verified Codes</h2>
          <div className="flex gap-2 text-xs text-zinc-400">
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> Live Verification Engine</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_COUPONS.map((coupon) => (
            <CouponCard key={coupon.id} coupon={coupon} />
          ))}
        </div>
      </div>
    </div>
  );
};