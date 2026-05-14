import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Use service role for admin bypass
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, data } = body;

    // We only care about payments
    if (type === 'payment') {
      const paymentId = data.id;
      
      // Fetch payment details from Mercado Pago
      const mpResponse = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
        headers: {
          Authorization: `Bearer ${process.env.MERCADO_PAGO_ACCESS_TOKEN}`
        }
      });
      
      const paymentData = await mpResponse.json();
      
      if (paymentData.status === 'approved') {
        const companyId = paymentData.external_reference;
        
        // Update company status in Supabase
        const { error } = await supabaseAdmin
          .from('companies')
          .update({ 
            subscription_status: 'active',
            plan: 'premium'
          })
          .eq('id', companyId);

        if (error) {
          console.error('Erro ao atualizar empresa via webhook:', error);
          return NextResponse.json({ error: 'Erro ao atualizar banco de dados' }, { status: 500 });
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook failed' }, { status: 500 });
  }
}
