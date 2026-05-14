import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Preference } from 'mercadopago';

const client = new MercadoPagoConfig({ 
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN || '' 
});

export async function POST(request: Request) {
  try {
    const { companyId, email } = await request.json();

    if (!process.env.MERCADO_PAGO_ACCESS_TOKEN) {
      return NextResponse.json({ error: 'Token do Mercado Pago não configurado' }, { status: 500 });
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    
    const preference = new Preference(client);
    
    const response = await preference.create({
      body: {
        items: [
          {
            id: 'subscription_premium',
            title: 'AvaliaPró Assinatura Mensal',
            unit_price: 9.90,
            quantity: 1,
            currency_id: 'BRL'
          }
        ],
        payer: {
          email: email
        },
        back_urls: {
          success: `${siteUrl}/dashboard?payment=success`,
          failure: `${siteUrl}/dashboard?payment=failure`,
          pending: `${siteUrl}/dashboard?payment=pending`,
        },
        external_reference: companyId,
        notification_url: `${siteUrl}/api/webhook/mercadopago`,
      }
    });

    return NextResponse.json({ init_point: response.init_point });
  } catch (error) {
    console.error('Erro no checkout:', error);
    return NextResponse.json({ error: 'Falha ao criar preferência de pagamento' }, { status: 500 });
  }
}
