"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Button, Card, Input } from "@/components/ui/Base";
import { Star, Loader2, Globe, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [slug, setSlug] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  // Helper to generate a slug from company name
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setCompanyName(name);
    // Basic slugification: lowercase, replace spaces with hyphens, remove special chars
    setSlug(name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // 1. Sign up the user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    let user = authData?.user;

    if (authError) {
      // If user already exists, let's try to sign them in or just use the current session
      if (authError.message.includes("already registered") || authError.status === 422) {
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (signInError) {
          setError("Este e-mail já está em uso com outra senha.");
          setLoading(false);
          return;
        }
        user = signInData.user;
      } else {
        setError(authError.message || "Erro ao criar conta.");
        setLoading(false);
        return;
      }
    }

    if (user) {
      // 2. Check if user already has a company
      const { data: existingCompany } = await supabase
        .from("companies")
        .select("id")
        .eq("owner_id", user.id)
        .single();

      if (existingCompany) {
        router.push("/dashboard");
        return;
      }

      // 3. Create the company profile
      const { error: dbError } = await supabase.from("companies").insert([
        {
          owner_id: user.id,
          name: companyName,
          slug: slug,
          plan: 'basic',
          subscription_status: 'past_due'
        }
      ]);

      if (dbError) {
        console.error("Erro no Banco de Dados:", dbError);
        setError(`Erro: ${dbError.message} (Código: ${dbError.code})`);
        setLoading(false);
        return;
      }

      // Success! Redirect to dashboard
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
        <div className="flex flex-col items-center mb-10">
          <div className="bg-primary text-white p-3 rounded-2xl shadow-xl shadow-primary/20 mb-4">
            <Star size={32} fill="currentColor" />
          </div>
          <h1 className="text-3xl font-black italic tracking-tighter uppercase">AvaliaPró</h1>
        </div>

        <Card className="p-8 md:p-10 border-white/5" glow>
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold mb-2 tracking-tight">Crie sua conta</h2>
            <p className="text-zinc-500 text-sm">Comece a gerenciar suas avaliações hoje.</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-5">
            <Input
              label="Nome da Empresa"
              type="text"
              required
              value={companyName}
              onChange={handleNameChange}
              placeholder="Sua Loja"
            />

            <div className="space-y-2 w-full">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Link Personalizado</label>
              <div className="flex items-center">
                <span className="bg-[#121214] border border-white/5 border-r-0 rounded-l-2xl px-4 py-4 text-zinc-500 text-sm">
                  avaliapro.com/
                </span>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full bg-[#121214] border border-white/5 rounded-r-2xl px-4 py-4 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all text-primary"
                  placeholder="sua-loja"
                />
              </div>
            </div>

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
              minLength={6}
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

            <Button type="submit" disabled={loading} className="w-full h-14 font-black uppercase tracking-widest mt-4">
              {loading ? <Loader2 className="animate-spin" /> : "Finalizar Cadastro"}
            </Button>
          </form>

          <div className="mt-8">
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
              <div className="relative flex justify-center text-[10px] uppercase font-black tracking-widest"><span className="bg-[#121214] px-4 text-zinc-600">Ou use</span></div>
            </div>
            
            <Button variant="glass" className="w-full h-12" type="button">
              <Globe size={18} />
              Google
            </Button>
          </div>
        </Card>

        <p className="mt-8 text-center text-sm text-zinc-500">
          Já tem uma conta?{" "}
          <Link href="/login" className="text-primary font-black hover:underline uppercase tracking-tighter">Fazer Login</Link>
        </p>
      </motion.div>
    </div>
  );
}
