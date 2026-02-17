import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { TIERS, TierKey } from '@/lib/types';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2026-01-28.clover',
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      searchId,
      tier,
      customerEmail,
      selectedItems,
      preferredEmail,
      emailType,
      intakeNotes,
    } = body;

    if (!searchId || !tier || !customerEmail || !selectedItems) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (!TIERS[tier as TierKey]) {
      return NextResponse.json({ error: 'Invalid tier' }, { status: 400 });
    }

    const tierData = TIERS[tier as TierKey];
    const origin = req.headers.get('origin') || 'https://handlehunter.ai';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: customerEmail,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `HandleHunter — ${tierData.name}`,
              description: `Brand handle concierge service: ${tierData.name}`,
            },
            unit_amount: tierData.amount_cents,
          },
          quantity: 1,
        },
      ],
      metadata: {
        search_id: searchId,
        tier,
        customer_email: customerEmail,
        selected_items: JSON.stringify(selectedItems),
        preferred_email: preferredEmail || '',
        email_type: emailType || '',
        intake_notes: intakeNotes || '',
      },
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}&search_id=${searchId}`,
      cancel_url: `${origin}/results/${searchId}`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error('Checkout error:', err);
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 });
  }
}
