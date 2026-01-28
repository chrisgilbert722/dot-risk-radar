import { stripe } from '@/lib/stripe';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// ✅ SAFE DATE CONVERTER
const toIso = (unix?: number | null) =>
  unix ? new Date(unix * 1000).toISOString() : null;

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature') as string;

  let event: Stripe.Event;

  try {
    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      throw new Error('STRIPE_WEBHOOK_SECRET is missing');
    }

    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error: any) {
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }

  console.log(`[Stripe Webhook] Received event: ${event.type}`);

  const session = event.data.object as Stripe.Checkout.Session;
  const subscription = event.data.object as Stripe.Subscription;

  const { createClient } = await import('@supabase/supabase-js');

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        if (session.mode !== 'subscription') break;

        const subscriptionId = session.subscription as string;
        const sub = await stripe.subscriptions.retrieve(subscriptionId);

        const userId =
          session.metadata?.userId || session.client_reference_id;

        const priceId = sub.items.data[0]?.price.id;

        if (!userId || !priceId) {
          console.error('[Stripe Webhook] Missing userId or priceId');
          break;
        }

        const { error } = await supabaseAdmin
          .from('subscriptions')
          .upsert({
            user_id: userId,
            stripe_customer_id: session.customer as string,
            stripe_subscription_id: subscriptionId,
            price_id: priceId,
            status: sub.status,
            current_period_start: toIso(sub.current_period_start),
            current_period_end: toIso(sub.current_period_end),
          });

        if (error) throw error;

        console.log(
          `[Stripe Webhook] Subscription activated for user ${userId}`
        );
        break;
      }

      case 'customer.subscription.updated': {
        const priceId = subscription.items.data[0]?.price.id;

        await supabaseAdmin
          .from('subscriptions')
          .update({
            status: subscription.status,
            price_id: priceId,
            current_period_start: toIso(subscription.current_period_start),
            current_period_end: toIso(subscription.current_period_end),
          })
          .eq('stripe_subscription_id', subscription.id);

        break;
      }

      case 'customer.subscription.deleted': {
        await supabaseAdmin
          .from('subscriptions')
          .update({
            status: subscription.status,
            current_period_end: toIso(subscription.current_period_end),
          })
          .eq('stripe_subscription_id', subscription.id);

        break;
      }
    }
  } catch (error) {
    console.error('Webhook handler failed:', error);
    return new NextResponse('Webhook handler failed', { status: 500 });
  }

  return new NextResponse(null, { status: 200 });
}
