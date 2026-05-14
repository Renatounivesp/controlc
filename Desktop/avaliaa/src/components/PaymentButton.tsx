"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Base";
import { Loader2, CreditCard } from "lucide-react";

interface PaymentButtonProps {
  companyId: string;
  email?: string;
}

export function PaymentButton({ companyId, email }: PaymentButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ companyId, email: email || 'cliente@avaliapro.com.br' }),
      });

      const data = await response.json();

      if (data.init_point) {
        window.location.href = data.init_point;
      } else {
        alert("Erro ao iniciar pagamento. Verifique as configurações do Mercado Pago.");
      }
    } catch (error) {
      console.error(error);
      alert("Erro de conexão ao tentar iniciar o pagamento.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button 
      onClick={handleSubscribe} 
      disabled={loading} 
      className="w-full sm:w-auto h-12 text-base font-bold bg-green-500 hover:bg-green-600 text-white gap-2 transition-colors"
    >
      {loading ? <Loader2 className="animate-spin" size={20} /> : <CreditCard size={20} />}
      {loading ? "Iniciando..." : "Assinar Premium (R$ 9,90)"}
    </Button>
  );
}
