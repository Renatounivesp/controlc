import type { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  delay?: number;
  style?: React.CSSProperties;
}

export default function GlassCard({ children, className = '', onClick, delay = 0, style }: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: 'easeOut' }}
      whileHover={onClick ? { 
        y: -6, 
        scale: 1.02,
        boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.6), inset 0 0 0 1px rgba(255, 255, 255, 0.2)'
      } : {}}
      onClick={onClick}
      className={`glass ${className}`}
      style={{
        padding: '24px',
        cursor: onClick ? 'pointer' : 'default',
        ...style
      }}
    >
      {children}
    </motion.div>
  );
}
