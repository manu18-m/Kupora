import { motion } from 'framer-motion';

export const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseStyles = 'px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2';
  
  const variants = {
    primary: 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-500 hover:to-indigo-500 shadow-[0_0_20px_rgba(109,40,217,0.3)]',
    secondary: 'glass-panel text-zinc-200 hover:bg-white/10 border-white/10',
    ghost: 'text-zinc-400 hover:text-white hover:bg-white/5'
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
};