"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card, Badge } from "@/components/ui/Base";
import { Star, Calendar, Loader2, TrendingUp, CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import { Company, Evaluation } from "@/types";
import { CircularGauge } from "@/components/ui/CircularGauge";
import { useSearchParams, useRouter } from "next/navigation";

export default function DashboardOverview() {
  const [stats, setStats] = useState<{ total: number; avg: number; lastReviews: Evaluation[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const router = useRouter();
  const paymentStatus = searchParams.get('payment');
  const [showPaymentAlert, setShowPaymentAlert] = useState(!!paymentStatus);

  useEffect(() => {
    async function fetchStats() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: company } = await supabase
        .from("companies")
        .select("*")
        .eq("owner_id", user.id)
        .single();

      if (company) {
        const companyData = company as Company;
        const { data: reviews } = await supabase
          .from("evaluations")
          .select("*")
          .eq("company_id", companyData.id)
          .order("created_at", { ascending: false })
          .returns<Evaluation[]>();

        if (reviews) {
          const total = reviews.length;
          const avg = total > 0 ? reviews.reduce((acc: number, r: Evaluation) => acc + r.rating, 0) / total : 0;
          setStats({ 
            total, 
            avg, 
            lastReviews: reviews.slice(0, 5) 
          });
        }
      }
      setLoading(false);
    }
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  const avgString = stats?.avg.toFixed(1) || "0.0";
  const total = stats?.total || 0;

  // Calculando porcentagens para os medidores
  // Assumindo que 100 avaliações seja um "bom marco" de velocidade para o gauge
  const totalMax = 100; 

  return (
    <div className="space-y-12">
      {showPaymentAlert && paymentStatus === 'success' && (
        <div className="bg-green-500/10 border border-green-500/20 text-green-500 p-4 rounded-2xl flex items-center gap-3">
          <CheckCircle2 size={24} />
          <div className="flex-1">
            <h4 className="font-bold">Pagamento Aprovado!</h4>
            <p className="text-sm opacity-80">Sua assinatura Premium foi ativada com sucesso.</p>
          </div>
          <button onClick={() => { setShowPaymentAlert(false); router.replace('/dashboard'); }} className="opacity-50 hover:opacity-100">
            <XCircle size={20} />
          </button>
        </div>
      )}

      {showPaymentAlert && paymentStatus === 'pending' && (
        <div className="bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 p-4 rounded-2xl flex items-center gap-3">
          <AlertTriangle size={24} />
          <div className="flex-1">
            <h4 className="font-bold">Pagamento Pendente</h4>
            <p className="text-sm opacity-80">Estamos aguardando a confirmação do Mercado Pago.</p>
          </div>
          <button onClick={() => { setShowPaymentAlert(false); router.replace('/dashboard'); }} className="opacity-50 hover:opacity-100">
            <XCircle size={20} />
          </button>
        </div>
      )}

      {showPaymentAlert && paymentStatus === 'failure' && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-2xl flex items-center gap-3">
          <XCircle size={24} />
          <div className="flex-1">
            <h4 className="font-bold">Falha no Pagamento</h4>
            <p className="text-sm opacity-80">Ocorreu um problema com o seu pagamento. Tente novamente.</p>
          </div>
          <button onClick={() => { setShowPaymentAlert(false); router.replace('/dashboard'); }} className="opacity-50 hover:opacity-100">
            <XCircle size={20} />
          </button>
        </div>
      )}

      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <Badge>Value Analytics v3</Badge>
          <h1 className="text-4xl md:text-5xl font-black mt-4 italic tracking-tighter uppercase text-foreground drop-shadow-sm">
            Painel de Desempenho
          </h1>
          <p className="text-muted-foreground mt-2">Acompanhe suas métricas em tempo real.</p>
        </div>
        
        <div className="flex gap-2 p-1 bg-card border border-border rounded-2xl w-fit shadow-sm">
          <button className="px-5 py-2.5 bg-primary text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-primary/20">HOJE</button>
          <button className="px-5 py-2.5 text-muted-foreground text-xs font-bold rounded-xl hover:text-foreground transition-all">7 DIAS</button>
          <button className="px-5 py-2.5 text-muted-foreground text-xs font-bold rounded-xl hover:text-foreground transition-all">30 DIAS</button>
        </div>
      </header>

      {/* Hero Metrics (Circular Gauges) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="flex items-center justify-center py-8 hover:border-primary/30 transition-all">
          <CircularGauge
            value={stats?.avg || 0}
            max={5}
            displayValue={avgString}
            label="Média Global"
            sublabel="Máx: 5.0"
            color="#fbbf24" // amber-400
            glowColor="rgba(251, 191, 36, 0.4)"
          />
        </Card>

        <Card className="flex items-center justify-center py-8 hover:border-primary/30 transition-all">
          <CircularGauge
            value={total}
            max={totalMax}
            label="Total Reviews"
            sublabel={`Meta: ${totalMax}`}
            color="#8b5cf6" // violet-500
            glowColor="rgba(139, 92, 246, 0.4)"
          />
        </Card>

        <Card className="flex items-center justify-center py-8 hover:border-primary/30 transition-all">
          <CircularGauge
            value={85}
            max={100}
            displayValue="85%"
            label="Conversão QR"
            sublabel="Cliques vs Notas"
            color="#3b82f6" // blue-500
            glowColor="rgba(59, 130, 246, 0.4)"
          />
        </Card>

        <Card className="flex items-center justify-center py-8 hover:border-primary/30 transition-all relative overflow-hidden">
          <CircularGauge
            value={24}
            max={100}
            displayValue="+24%"
            label="Engajamento"
            sublabel="vs Mês Anterior"
            color="#10b981" // emerald-500
            glowColor="rgba(16, 185, 129, 0.4)"
          />
          <div className="absolute top-4 right-4 text-emerald-500 opacity-20">
            <TrendingUp size={48} />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <Card className="xl:col-span-2 p-8 h-full">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-foreground">Atividade Recente</h3>
            <button className="text-xs font-bold text-primary hover:underline">Ver todas</button>
          </div>
          
          <div className="space-y-4">
            {stats?.lastReviews && stats.lastReviews.length > 0 ? (
              stats.lastReviews.map((review) => (
                <div key={review.id} className="flex items-start gap-4 p-5 rounded-3xl bg-muted/30 border border-border/50 hover:bg-muted/50 hover:border-primary/20 transition-all group">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-bold shadow-inner">
                    {review.customer_name?.[0] || "?"}
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <div className="flex justify-between items-center">
                      <h4 className="font-bold text-sm text-foreground">{review.customer_name || "Anônimo"}</h4>
                      <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                        <Calendar size={10} />
                        {new Date(review.created_at).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} size={12} className={s <= review.rating ? "text-amber-400" : "text-muted"} fill={s <= review.rating ? "currentColor" : "none"} />
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed italic mt-1">&quot;{review.comment}&quot;</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-20 text-muted-foreground italic border border-dashed border-border rounded-3xl">
                Nenhuma avaliação recebida ainda.
              </div>
            )}
          </div>
        </Card>

        {/* Resumo de Notas (Rating Breakdown) */}
        <Card className="p-8 h-full relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/5 blur-3xl rounded-full" />
          <h3 className="text-xl font-bold text-foreground mb-8 relative z-10">Distribuição de Notas</h3>
          
          <div className="space-y-6 relative z-10">
            {[5, 4, 3, 2, 1].map((rating) => {
              // Simulação de cálculo de distribuição
              const ratingCount = stats?.lastReviews?.filter(r => r.rating === rating).length || 0;
              const totalCount = stats?.lastReviews?.length || 1;
              const percentage = total === 0 ? 0 : Math.round((ratingCount / totalCount) * 100);
              
              // Cores vibrantes diferentes para cada estrela igual na referência
              const barColors = {
                5: "from-amber-400 to-orange-500",
                4: "from-primary to-blue-500",
                3: "from-blue-400 to-cyan-500",
                2: "from-rose-400 to-red-500",
                1: "from-zinc-500 to-zinc-700"
              };

              return (
                <div key={rating} className="space-y-2 group">
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-muted-foreground group-hover:text-foreground transition-colors">
                    <span className="flex items-center gap-1">
                      {rating} <Star size={10} className="text-amber-400" fill="currentColor"/>
                    </span>
                    <span>{percentage}%</span>
                  </div>
                  <div className="h-3 bg-muted rounded-full overflow-hidden">
                    <div 
                      className={`h-full bg-gradient-to-r ${barColors[rating as keyof typeof barColors]} rounded-full transition-all duration-1000 ease-out`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}
