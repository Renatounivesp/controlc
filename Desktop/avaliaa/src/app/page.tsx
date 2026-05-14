"use client";

import { Navbar } from "@/components/Navbar";
import { Button, Card, Badge } from "@/components/ui/Base";
import { Star, BarChart3, QrCode, ShieldCheck, ArrowRight, Check } from "lucide-react";
import { GoogleIcon } from "@/components/ui/GoogleIcon";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-background overflow-hidden selection:bg-primary/30">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] gradient-bg pointer-events-none opacity-50" />
      <div className="absolute top-[10%] right-[10%] w-[500px] h-[500px] bg-primary/10 blur-[150px] rounded-full pointer-events-none" />
      
      <Navbar />

      <main className="relative z-10 pt-32 pb-20 px-6">
        {/* Hero Section */}
        <section className="max-w-4xl mx-auto text-center mb-40">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/5 bg-white/5 text-[10px] font-bold uppercase tracking-widest mb-10 text-primary"
          >
            <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
            Lançamento AvaliaPró v2.0
          </motion.div>
          
          <h1 className="text-5xl md:text-8xl font-black tracking-tight mb-6 leading-[1.1]">
            Multiplique suas <br />
            avaliações no <span className="inline-flex items-center gap-2 bg-white px-4 py-1 md:py-2 rounded-full shadow-2xl shadow-primary/20 align-middle -translate-y-1 md:-translate-y-2 mt-2 md:mt-0"><GoogleIcon className="w-6 h-6 md:w-9 md:h-9" /> <span className="text-zinc-900 text-3xl md:text-6xl tracking-tight">Google</span></span>
          </h1>
          
          <p className="text-lg md:text-xl text-zinc-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            Filtre avaliações negativas no sistema e direcione automaticamente apenas os clientes satisfeitos para sua página oficial do Google Meu Negócio.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
            <Link href="/register" className="w-full sm:w-auto relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary to-blue-500 rounded-3xl blur opacity-30 group-hover:opacity-60 transition duration-1000 group-hover:duration-200" />
              <Button className="w-full h-14 px-10 text-lg rounded-[1.5rem] relative">
                Começar a bombar no Google
                <ArrowRight size={20} />
              </Button>
            </Link>
            <Link href="#features" className="w-full sm:w-auto">
              <Button variant="glass" className="w-full h-14 px-10 text-lg rounded-[1.5rem]">
                Ver Recursos
              </Button>
            </Link>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="max-w-6xl mx-auto mb-40">
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="space-y-6 group cursor-default" glow>
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                <QrCode size={28} />
              </div>
              <h3 className="text-2xl font-bold">QR Code Pro</h3>
              <p className="text-zinc-400 leading-relaxed">
                Geração instantânea de códigos dinâmicos com a sua marca para acesso imediato.
              </p>
            </Card>

            <Card className="space-y-6 group cursor-default" glow>
              <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-primary/10">
                <GoogleIcon className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold">Direcionamento Smart</h3>
              <p className="text-zinc-400 leading-relaxed">
                Notas 4 e 5 estrelas são automaticamente convidadas a publicar no Google. Notas baixas ficam retidas no seu painel privado.
              </p>
            </Card>

            <Card className="space-y-6 group cursor-default" glow>
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                <ShieldCheck size={28} />
              </div>
              <h3 className="text-2xl font-bold">Filtro Smart</h3>
              <p className="text-zinc-400 leading-relaxed">
                Proteção avançada contra spam e conteúdos impróprios em tempo real.
              </p>
            </Card>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="max-w-4xl mx-auto text-center">
          <Badge variant="success">Oferta de Lançamento</Badge>
          <h2 className="text-4xl md:text-5xl font-bold mt-6 mb-16 italic tracking-tight">O preço que cabe no seu bolso.</h2>

          <div className="max-w-xl mx-auto">
            <Card className="p-10 border-primary/20 bg-primary/[0.03] relative overflow-hidden purple-glow" glow>
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/20 blur-3xl rounded-full" />
              
              <div className="flex justify-between items-start mb-10">
                <div className="text-left">
                  <h3 className="text-3xl font-black mb-2">Plano Full</h3>
                  <p className="text-zinc-500 text-sm">Acesso total a todas as ferramentas</p>
                </div>
                <div className="text-right">
                  <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-black text-primary">R$9,90</span>
                    <span className="text-zinc-500 font-bold">/mês</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                {[
                  "Avaliações Ilimitadas",
                  "Dashboard em Tempo Real",
                  "QR Codes Personalizados",
                  "Suporte 24/7 VIP",
                  "Exportação de Dados",
                  "Marca Branca (Whitelabel)"
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm text-zinc-300">
                    <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                      <Check size={12} strokeWidth={4} />
                    </div>
                    {feature}
                  </div>
                ))}
              </div>

              <Link href="/register">
                <Button className="w-full h-14 text-lg">Assinar Agora</Button>
              </Link>
            </Card>
          </div>
        </section>
      </main>

      <footer className="py-20 border-t border-white/5 text-center">
        <div className="flex items-center justify-center gap-2 font-black text-2xl mb-8">
          <div className="bg-primary text-white p-1 rounded-lg">
            <Star size={24} fill="currentColor" />
          </div>
          AvaliaPró
        </div>
        <p className="text-zinc-500 text-sm">© 2024 AvaliaPró SaaS. Excelência em cada detalhe.</p>
      </footer>
    </div>
  );
}
