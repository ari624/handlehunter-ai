import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { callHandleHunterDb } from '@/lib/handlehunter-db';

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error('STRIPE_SECRET_KEY is not set');
  return new Stripe(key, { apiVersion: '2026-01-28.clover' });
}

export async function POST(req: NextRequest) {
  const stripe = getStripe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';
  const body = await req.text();
  const sig = req.headers.get('stripe-signature');

  if (!sig) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const meta = session.metadata || {};

    const orderData = {
      search_id: meta.search_id,
      stripe_session_id: session.id,
      stripe_payment_id: session.payment_intent as string,
      customer_email: meta.customer_email || session.customer_email,
      tier: meta.tier,
      selected_items: JSON.parse(meta.selected_items || '[]'),
      preferred_email: meta.preferred_email || null,
      email_type: meta.email_type || null,
      intake_notes: meta.intake_notes || null,
      amount_cents: session.amount_total,
      status: 'paid',
      webhook_sent: false,
    };

    let order: { id: string } | null = null;
    try {
      order = await callHandleHunterDb<{ id: string }>('create_order', orderData);
    } catch (dbError) {
      console.error('Order database gateway error:', dbError);
    }

    // Fire Make.com webhook
    const makeWebhookUrl = process.env.MAKE_WEBHOOK_URL;
    if (makeWebhookUrl && order) {
      try {
        await fetch(makeWebhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event: 'new_order',
            order_id: order.id,
            timestamp: new Date().toISOString(),
            customer: {
              email: orderData.customer_email,
              preferred_email: orderData.preferred_email,
              email_type: orderData.email_type,
            },
            tier: orderData.tier,
            amount_cents: orderData.amount_cents,
            selected_items: orderData.selected_items,
            intake_notes: orderData.intake_notes,
            search_url: `https://handlehunter.ai/results/${meta.search_id}`,
          }),
        });

        // Update webhook_sent status
        await callHandleHunterDb('mark_webhook_sent', { order_id: order.id });
      } catch (webhookErr) {
        console.error('Make.com webhook error:', webhookErr);
      }
    }
  }

  return NextResponse.json({ received: true });
}
