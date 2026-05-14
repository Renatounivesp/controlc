"use client";

import { motion } from "framer-motion";

interface CircularGaugeProps {
  value: number;
  displayValue?: string | number;
  max: number;
  label: string;
  sublabel?: string;
  color: string;
  glowColor: string;
}

export function CircularGauge({ value, displayValue, max, label, sublabel, color, glowColor }: CircularGaugeProps) {
  const percentage = Math.min((value / max) * 100, 100);
  const radius = 60;
  const strokeWidth = 14;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative flex flex-col items-center justify-center p-2">
      {/* Outer Glow Effect */}
      <div 
        className="absolute w-32 h-32 rounded-full blur-[40px] opacity-30 dark:opacity-20 pointer-events-none transition-all duration-500"
        style={{ backgroundColor: glowColor }}
      />
      
      <svg className="w-40 h-40 transform -rotate-90 drop-shadow-xl" viewBox="0 0 160 160">
        {/* Subtle inner background ring */}
        <circle
          cx="80"
          cy="80"
          r={radius - 8}
          stroke="currentColor"
          strokeWidth="1"
          fill="transparent"
          className="text-muted opacity-30"
        />

        {/* Background Track with tick marks effect (dashed) */}
        <circle
          cx="80"
          cy="80"
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-muted opacity-20"
          strokeDasharray="2 6"
        />
        
        {/* Foreground Progress */}
        <motion.circle
          cx="80"
          cy="80"
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
          style={{
            filter: `drop-shadow(0 0 10px ${glowColor}) drop-shadow(0 0 20px ${glowColor})`,
          }}
        />
      </svg>
      
      {/* Center Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <motion.span 
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="text-3xl font-black text-foreground drop-shadow-md tracking-tighter"
        >
          {displayValue !== undefined ? displayValue : value}
        </motion.span>
        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-0.5">
          {label}
        </span>
        {sublabel && (
          <span className="text-[9px] font-mono text-muted-foreground/50 mt-4 absolute bottom-6">
            {sublabel}
          </span>
        )}
      </div>
    </div>
  );
}
