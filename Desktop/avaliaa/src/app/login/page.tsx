"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Button, Card, Input } from "@/components/ui/Base";
import { Star, Loader2, Globe, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError("Credenciais inválidas. Tente novamente.");
      setLoading(false);
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
      
      <Link href="/" className="absolute top-10 left-10 hidden md:flex items-center gap-2 text-zinc-500 hover:text-white transition-colors group">
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
        <span className="text-xs font-bold uppercase tracking-widest">Voltar para Início</span>
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="flex flex-col items-center mb-12">
          <div className="bg-primary text-white p-3 rounded-2xl shadow-xl shadow-primary/20 mb-6">
            <Star size={32} fill="currentColor" />
          </div>
          <h1 className="text-3xl font-black italic tracking-tighter uppercase">AvaliaPró</h1>
        </div>

        <Card className="p-10 border-white/5" glow>
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-bold mb-2 tracking-tight">Bem-vindo de volta</h2>
            <p className="text-zinc-500 text-sm">Insira seus dados para acessar o painel.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <Input
              label="E-mail"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
            />

            <Input
              label="Senha"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />

            {error && (
              <motion.p 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-red-400 text-xs font-bold bg-red-400/5 p-3 rounded-xl border border-red-400/10"
              >
                {error}
              </motion.p>
            )}

            <Button type="submit" disabled={loading} className="w-full h-14 font-black uppercase tracking-widest">
              {loading ? <Loader2 className="animate-spin" /> : "Entrar no Painel"}
            </Button>
          </form>

          <div className="mt-10">
            <div className="relative mb-8">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
              <div className="relative flex justify-center text-[10px] uppercase font-black tracking-widest"><span className="bg-[#121214] px-4 text-zinc-600">Acesso Rápido</span></div>
            </div>
            
            <Button variant="glass" className="w-full h-12">
              <Globe size={18} />
              Entrar com Google
            </Button>
          </div>
        </Card>

        <p className="mt-10 text-center text-sm text-zinc-500">
          Ainda não tem acesso?{" "}
          <Link href="/register" className="text-primary font-black hover:underline uppercase tracking-tighter">Criar minha conta</Link>
        </p>
      </motion.div>
    </div>
  );
}
