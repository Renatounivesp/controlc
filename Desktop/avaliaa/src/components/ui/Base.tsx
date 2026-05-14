"use client";

import { ReactNode, ComponentProps } from "react";
import { motion } from "framer-motion";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type MotionButtonProps = ComponentProps<typeof motion.button>;

interface ButtonProps extends Omit<MotionButtonProps, 'variant'> {
  variant?: "primary" | "secondary" | "glass" | "danger" | "ghost";
  children: ReactNode;
}

export function Button({ variant = "primary", className, children, ...props }: ButtonProps) {
  const variants = {
    primary: "bg-primary text-white hover:opacity-90 shadow-lg shadow-primary/20",
    secondary: "bg-muted text-foreground hover:bg-muted/80",
    glass: "glass text-foreground glass-hover",
    danger: "bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20",
    ghost: "text-muted-foreground hover:text-foreground hover:bg-muted/50",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "px-6 py-3 rounded-2xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 text-sm",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
}

export function Card({ className, children, glow = false }: { className?: string; children: ReactNode; glow?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={cn(
        "glass p-6 rounded-[2rem]",
        glow && "purple-glow",
        className
      )}
    >
      {children}
    </motion.div>
  );
}

export function Input({ label, ...props }: { label?: string } & ComponentProps<"input">) {
  return (
    <div className="space-y-2 w-full">
      {label && <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">{label}</label>}
      <input
        className="w-full bg-card border border-border rounded-2xl px-5 py-4 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/50 text-foreground"
        {...props}
      />
    </div>
  );
}

export function Badge({ children, variant = "default" }: { children: ReactNode; variant?: "default" | "success" | "warning" }) {
  const variants = {
    default: "bg-muted text-muted-foreground",
    success: "bg-green-500/10 text-green-500",
    warning: "bg-yellow-500/10 text-yellow-500",
  };
  
  return (
    <span className={cn("px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider", variants[variant])}>
      {children}
    </span>
  );
}
