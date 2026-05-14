"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "./ui/Base";
import { Star, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center p-6 pointer-events-none">
      <div className="glass px-6 py-4 rounded-[2rem] flex items-center justify-between w-full max-w-5xl pointer-events-auto">
        <Link href="/" className="flex items-center gap-2 font-black text-2xl tracking-tighter">
          <div className="bg-primary text-white p-1 rounded-lg">
            <Star size={20} fill="currentColor" />
          </div>
          AvaliaPró
        </Link>
        
        <div className="hidden md:flex items-center gap-10 text-xs font-bold uppercase tracking-widest text-zinc-500">
          <Link href="#features" className="hover:text-primary transition-colors">Recursos</Link>
          <Link href="#pricing" className="hover:text-primary transition-colors">Preços</Link>
          <Link href="/admin" className="hover:text-primary transition-colors">Admin</Link>
        </div>

        <div className="hidden md:flex items-center gap-6">
          <Link href="/login" className="text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-white transition-colors">
            Entrar
          </Link>
          <Link href="/register">
            <Button variant="primary" className="py-2.5 px-6">
              Começar Grátis
            </Button>
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 top-32 px-6 pb-6 z-40 md:hidden pointer-events-none"
          >
            <div className="glass p-8 rounded-[2.5rem] flex flex-col gap-6 pointer-events-auto">
              <Link href="#features" onClick={() => setIsOpen(false)} className="text-xl font-bold">Recursos</Link>
              <Link href="#pricing" onClick={() => setIsOpen(false)} className="text-xl font-bold">Preços</Link>
              <Link href="/login" onClick={() => setIsOpen(false)} className="text-xl font-bold">Login</Link>
              <Link href="/register" onClick={() => setIsOpen(false)}>
                <Button className="w-full h-14 text-lg">Criar Conta</Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
