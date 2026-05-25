import { Link, useLocation } from 'react-router-dom';
import { Sparkles, LayoutDashboard, Search, Gift, Menu } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const RootLayout = ({ children }) => {
  const location = useLocation();

  const navItems = [
    { name: 'Explore', path: '/', icon: Search },
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  ];

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 selection:bg-violet-500/30 selection:text-white overflow-x-hidden relative">
      {/* Ambient background glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-40 right-1/4 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[150px] pointer-events-none" />

      {/* Sticky Header */}
      <nav className="sticky top-0 z-50 border-b border-white/5 glass-panel">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl tracking-tight text-white">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-violet-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-violet-600/20">
              <Gift className="w-4 h-4 text-white" />
            </div>
            <span>Voucher<span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">AI</span></span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link 
                  key={item.path} 
                  to={item.path} 
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive ? 'text-white bg-white/5' : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.name}
                </Link>
              );
            })}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Button variant="ghost">Sign In</Button>
            <Button variant="primary">
              <Sparkles className="w-4 h-4" /> Get Premium
            </Button>
          </div>

          {/* Mobile Menu Icon */}
          <button className="md:hidden p-2 text-zinc-400 hover:text-white">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </nav>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {children}
      </main>
    </div>
  );
};