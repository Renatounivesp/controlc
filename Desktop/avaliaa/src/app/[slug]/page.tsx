"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Button, Card, Input } from "@/components/ui/Base";
import { Star, CheckCircle2, Loader2, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Company } from "@/types";

export default function EvaluationPage() {
  const { slug } = useParams();
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [name, setName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function fetchCompany() {
      const { data } = await supabase
        .from("companies")
        .select("*")
        .eq("slug", slug)
        .returns<Company>()
        .single();

      if (data) setCompany(data);
      setLoading(false);
    }
    if (slug) fetchCompany();
  }, [slug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0 || !company) return;

    setIsSubmitting(true);
    const { error: _error } = await supabase.from("evaluations").insert([
      {
        company_id: company.id,
        rating,
        comment,
        customer_name: name,
      },
    ]);

    if (!_error) {
      setSubmitted(true);
    }
    setIsSubmitting(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  if (!company) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background p-6 text-center">
        <div className="bg-red-500/10 text-red-500 p-4 rounded-full mb-6">
          <ArrowLeft size={32} />
        </div>
        <h1 className="text-3xl font-black italic tracking-tighter uppercase mb-4 text-white">Link Inválido</h1>
        <p className="text-zinc-500 max-w-xs leading-relaxed">Não encontramos nenhuma empresa com este endereço.</p>
      </div>
    );
  }

  // White-Label Theme
  const themeBg = company.theme_hex_bg || "#09090b";
  const themePrimary = company.theme_hex_primary || "#8b5cf6";
  const themeRadius = company.theme_border_radius || "rounded-3xl";
  const bgImageUrl = company.theme_bg_image || "";

  return (
    <div 
      className="min-h-screen p-6 flex flex-col items-center justify-center relative overflow-hidden transition-all duration-500 bg-cover bg-center"
      style={{ 
        backgroundColor: themeBg,
        backgroundImage: bgImageUrl ? `url(${bgImageUrl})` : 'none'
      }}
    >
      {/* Overlay escura para garantir leitura do texto se usar imagem de fundo */}
      {bgImageUrl && <div className="absolute inset-0 bg-black/50 pointer-events-none z-0" />}

      {/* Sombreamentos se não tiver imagem */}
      {!bgImageUrl && <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/5 to-transparent pointer-events-none z-0" />}
      
      <div 
        className="absolute -bottom-20 -right-20 w-[400px] h-[400px] blur-[100px] rounded-full pointer-events-none opacity-20 z-0" 
        style={{ backgroundColor: themePrimary }}
      />

      <AnimatePresence mode="wait">
        {!submitted ? (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-md relative z-10"
          >
            <div className="text-center mb-10">
              <div className="inline-block mb-6 relative">
                {company.logo_url ? (
                  <div className="h-20 w-20 relative mx-auto bg-white/10 backdrop-blur-md p-1.5 rounded-3xl shadow-2xl border border-white/10">
                    <img src={company.logo_url} alt={company.name} className="w-full h-full object-contain drop-shadow-lg rounded-2xl" />
                  </div>
                ) : (
                  <div 
                    className="p-5 rounded-3xl mx-auto flex items-center justify-center backdrop-blur-md shadow-2xl border border-white/10"
                    style={{ backgroundColor: `${themePrimary}44`, color: themePrimary }}
                  >
                    <Star size={36} fill="currentColor" />
                  </div>
                )}
              </div>
              <h1 className="text-3xl font-black italic tracking-tighter uppercase drop-shadow-xl text-white">{company.name}</h1>
              <p className="text-white/70 text-sm mt-2 drop-shadow-md">Como foi sua experiência conosco?</p>
            </div>

            <div className={`bg-[#121214]/80 backdrop-blur-xl border border-white/10 p-8 md:p-10 shadow-2xl w-full ${themeRadius}`}>
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="flex flex-col items-center gap-6">
                  <span className="text-[10px] font-black text-white/50 uppercase tracking-widest">Sua Nota</span>
                  <div className="flex items-center gap-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        className="transition-all transform active:scale-90 hover:scale-110"
                        onMouseEnter={() => setHover(star)}
                        onMouseLeave={() => setHover(0)}
                        onClick={() => setRating(star)}
                      >
                        <Star
                          size={44}
                          color={star <= (hover || rating) ? themePrimary : "rgba(255,255,255,0.1)"}
                          fill={star <= (hover || rating) ? themePrimary : "none"}
                          strokeWidth={star <= (hover || rating) ? 0 : 2}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-white/50 uppercase tracking-widest ml-1">Seu Nome (Opcional)</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ex: Rafael Castro"
                      className={`w-full bg-black/40 border border-white/5 px-5 py-4 outline-none focus:border-white/20 transition-all placeholder:text-white/30 text-white text-sm ${themeRadius}`}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-white/50 uppercase tracking-widest ml-1">Sua Experiência</label>
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className={`w-full bg-black/40 border border-white/5 px-5 py-4 outline-none focus:border-white/20 transition-all h-36 resize-none placeholder:text-white/30 text-white text-sm ${themeRadius}`}
                      placeholder="Conte-nos o que achou dos nossos serviços..."
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={rating === 0 || isSubmitting}
                  className={`w-full h-14 text-base font-black uppercase tracking-widest transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-xl ${themeRadius}`}
                  style={{ backgroundColor: themePrimary, color: "#fff" }}
                >
                  {isSubmitting ? <Loader2 className="animate-spin mx-auto" /> : "Enviar Feedback"}
                </button>
              </form>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-8 relative z-10"
          >
            <div 
              className={`w-24 h-24 flex items-center justify-center mx-auto shadow-[0_0_40px_rgba(0,0,0,0.3)] backdrop-blur-md border border-white/10 ${themeRadius}`}
              style={{ backgroundColor: `${themePrimary}33`, color: themePrimary }}
            >
              <CheckCircle2 size={56} />
            </div>
            <div className="space-y-4">
              <h1 className="text-4xl font-black italic tracking-tighter uppercase text-white drop-shadow-lg">Excelente!</h1>
              <p className="text-white/70 max-w-xs mx-auto leading-relaxed drop-shadow-md">
                Sua avaliação foi enviada com sucesso. Agradecemos imensamente seu tempo!
              </p>
            </div>
            <button 
              onClick={() => window.location.reload()} 
              className={`h-12 px-10 border border-white/10 bg-black/40 backdrop-blur-md hover:bg-white/10 transition-colors font-medium text-white ${themeRadius}`}
            >
              Avaliar Novamente
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
