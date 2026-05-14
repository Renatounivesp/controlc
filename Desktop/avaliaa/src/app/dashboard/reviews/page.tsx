"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card } from "@/components/ui/Base";
import { Loader2, Star, MessageSquareOff } from "lucide-react";

type Evaluation = {
  id: string;
  rating: number;
  comment: string;
  customer_name: string;
  created_at: string;
};

export default function ReviewsPage() {
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "positive" | "negative">("all");

  useEffect(() => {
    async function fetchReviews() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: company } = await supabase
        .from("companies")
        .select("id")
        .eq("owner_id", user.id)
        .single();

      if (company) {
        const { data } = await supabase
          .from("evaluations")
          .select("*")
          .eq("company_id", company.id)
          .order("created_at", { ascending: false });

        if (data) setEvaluations(data);
      }
      setLoading(false);
    }
    fetchReviews();
  }, []);

  const filteredEvaluations = evaluations.filter((ev) => {
    if (filter === "positive") return ev.rating >= 4;
    if (filter === "negative") return ev.rating <= 3;
    return true;
  });

  const averageRating = evaluations.length > 0 
    ? (evaluations.reduce((acc, curr) => acc + curr.rating, 0) / evaluations.length).toFixed(1)
    : "0.0";

  if (loading) return <Loader2 className="animate-spin" />;

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-bold mb-2">Suas Avaliações</h1>
        <p className="text-muted-foreground text-sm">Acompanhe o que seus clientes estão dizendo sobre você.</p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 flex flex-col justify-center items-center text-center">
          <span className="text-sm font-medium text-muted-foreground mb-2">Média Geral</span>
          <div className="flex items-center gap-2">
            <Star className="text-yellow-500" fill="currentColor" size={28} />
            <span className="text-4xl font-black">{averageRating}</span>
          </div>
        </Card>
        
        <Card className="p-6 flex flex-col justify-center items-center text-center">
          <span className="text-sm font-medium text-muted-foreground mb-2">Total de Avaliações</span>
          <span className="text-4xl font-black text-primary">{evaluations.length}</span>
        </Card>

        <Card className="p-6 flex flex-col justify-center items-center text-center">
          <span className="text-sm font-medium text-muted-foreground mb-2">Positivas vs Negativas</span>
          <div className="flex gap-4">
            <div className="text-center">
              <span className="text-xl font-bold text-green-500">{evaluations.filter(e => e.rating >= 4).length}</span>
              <p className="text-xs text-muted-foreground">Positivas</p>
            </div>
            <div className="w-px bg-border" />
            <div className="text-center">
              <span className="text-xl font-bold text-red-500">{evaluations.filter(e => e.rating <= 3).length}</span>
              <p className="text-xs text-muted-foreground">Negativas</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-2 p-1 bg-muted border border-border rounded-xl w-fit overflow-x-auto max-w-full">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${filter === "all" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
        >
          Todas
        </button>
        <button
          onClick={() => setFilter("positive")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${filter === "positive" ? "bg-green-500/20 text-green-600 dark:text-green-400" : "text-muted-foreground hover:text-foreground"}`}
        >
          Positivas (4-5)
        </button>
        <button
          onClick={() => setFilter("negative")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${filter === "negative" ? "bg-red-500/20 text-red-600 dark:text-red-400" : "text-muted-foreground hover:text-foreground"}`}
        >
          Negativas (1-3)
        </button>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredEvaluations.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-border rounded-3xl bg-muted/50">
            <MessageSquareOff className="mx-auto text-muted-foreground mb-4" size={48} />
            <h3 className="text-xl font-bold text-foreground mb-2">Nenhuma avaliação encontrada</h3>
            <p className="text-muted-foreground text-sm">
              {filter === "all" ? "Você ainda não recebeu nenhuma avaliação." : "Nenhuma avaliação corresponde a este filtro."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredEvaluations.map((review) => (
              <Card key={review.id} className="p-6 relative overflow-hidden group">
                {/* Visual cue for positive/negative */}
                <div className={`absolute top-0 left-0 w-1.5 h-full ${review.rating >= 4 ? 'bg-green-500' : 'bg-red-500'}`} />
                
                <div className="flex justify-between items-start mb-4 pl-2">
                  <div>
                    <h3 className="font-bold text-lg">{review.customer_name || "Cliente Anônimo"}</h3>
                    <span className="text-xs text-muted-foreground">
                      {new Date(review.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="flex gap-1 bg-muted border border-border px-2 py-1 rounded-full">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={12}
                        className={star <= review.rating ? "text-yellow-500" : "text-zinc-800"}
                        fill={star <= review.rating ? "currentColor" : "none"}
                      />
                    ))}
                  </div>
                </div>

                <div className="bg-muted border border-border p-4 rounded-2xl ml-2">
                  <p className="text-muted-foreground text-sm leading-relaxed italic">
                    {review.comment ? `"${review.comment}"` : "Nenhum comentário deixado."}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
