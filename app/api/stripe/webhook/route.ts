import { stripe } from '@/lib/stripe';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

// ✅ SAFE DATE CONVERTER
const toIso = (unix?: number | null) =>
    unix ? new Date(unix * 1000).toISOString() : null;

// Helper to upsert subscription state
async function manageSubscriptionStatusChange(
    subscription: Stripe.Subscription,
    supabaseAdmin: any,
    userId?: string
) {
    const subscriptionAny = subscription as any;
    const priceId = subscription.items.data[0]?.price.id;

    // AUTHORITATIVE PLAN MAPPING
    const PLAN_MAP: Record<string, string> = {
        'price_1Stqfa2a1UrjaUn8Nu12GR9M': 'starter',
        'price_1StqiA2a1UrjaUn8guhL2K7e': 'pro',
        'price_1Stqll2a1UrjaUn8us9WnIjP': 'fleet'
    };

    const plan = PLAN_MAP[priceId] || 'starter'; // Default to starter if unknown, but should log warning

    if (!PLAN_MAP[priceId]) {
        console.warn(`[Stripe Webhook] Unknown Price ID: ${priceId}. Defaulting to starter.`);
    }

    const subscriptionData: any = {
        stripe_subscription_id: subscription.id,
        stripe_customer_id: subscription.customer as string,
        price_id: priceId,
        plan: plan, // Mapped plan
        status: subscription.status,
        current_period_start: toIso(subscriptionAny.current_period_start),
        current_period_end: toIso(subscriptionAny.current_period_end),
    };

    // If userId is provided (e.g. from checkout session metadata), upsert with it.
    if (userId) {
        subscriptionData.user_id = userId;
    }

    // Status Mapping Normalization
    if (subscription.status === 'trialing') {
        subscriptionData.status = 'active';
    }

    if (subscription.status === 'unpaid') {
        subscriptionData.status = 'past_due';
    }

    if (subscription.status === 'canceled') {
        subscriptionData.status = 'canceled';
    }

    // Upsert logic
    if (subscriptionData.user_id) {
        // Analytics: Fetch previous state to detect change
        const { data: existingSub } = await supabaseAdmin
            .from('subscriptions')
            .select('plan, status')
            .eq('user_id', subscriptionData.user_id)
            .single();

        // Check for Plan Change (Upgrade/Downgrade)
        if (existingSub && existingSub.plan !== plan) {
            console.log(`[Analytics] event: plan_changed | user_id: ${subscriptionData.user_id} | from: ${existingSub.plan} | to: ${plan}`);
            // potential: await analytics.track({ event: 'plan_changed', userId: subscriptionData.user_id, properties: { from: existingSub.plan, to: plan } });
        }

        // Check for Churn (Active -> Canceled)
        if (existingSub && existingSub.status === 'active' && subscriptionData.status === 'canceled') {
            console.log(`[Analytics] event: subscription_churned | user_id: ${subscriptionData.user_id}`);
        }

        const { error } = await supabaseAdmin
            .from('subscriptions')
            .upsert(subscriptionData, {
                onConflict: 'user_id'
            });
        if (error) throw error;
        console.log(`[Stripe Webhook] Upserted subscription for user ${subscriptionData.user_id} [Plan: ${plan}, Status: ${subscriptionData.status}]`);
    } else {
        // Fallback: Update by subscription ID if user_id is missing (e.g. renewal events)
        const { error } = await supabaseAdmin
            .from('subscriptions')
            .update(subscriptionData)
            .eq('stripe_subscription_id', subscription.id);

        if (error) throw error;
        console.log(`[Stripe Webhook] Updated subscription ${subscription.id} [Plan: ${plan}, Status: ${subscriptionData.status}]`);
    }
}

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

    const supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    try {
        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object as Stripe.Checkout.Session;
                if (session.mode !== 'subscription') break;

                const subscriptionId = session.subscription as string;
                // Always fetch fresh subscription logic
                const sub = (await stripe.subscriptions.retrieve(
                    subscriptionId
                )) as Stripe.Subscription;

                const userId = session.metadata?.userId || session.client_reference_id;

                if (!userId) {
                    console.error('[Stripe Webhook] Missing userId in checkout session');
                    break;
                }

                await manageSubscriptionStatusChange(sub, supabaseAdmin, userId);
                break;
            }

            case 'customer.subscription.created':
            case 'customer.subscription.updated':
            case 'customer.subscription.deleted': {
                const subscription = event.data.object as Stripe.Subscription;
                // For these events, we might not have userId locally if it's not in metadata.
                // ideally subscription.metadata has it if we put it there, or we rely on existing row.
                // Checkout session put it in subscription metadata? No, typically checkout session metadata isn't auto-copied to sub metadata unless configured.
                // However, we rely on checkout.session.completed to create the row with user_id.
                // Subsequent updates will hit 'manageSubscriptionStatusChange' and fall through to the .update() by stripe_subscription_id if logic handles it.
                // Let's ensure manageSubscriptionLogic handles "no user_id provided" by updating via subscription_id.

                await manageSubscriptionStatusChange(subscription, supabaseAdmin);
                break;
            }

            case 'invoice.payment_succeeded':
            case 'invoice.payment_failed': {
                const invoice = event.data.object as Stripe.Invoice;

                // Fix: Check type of subscription before using it
                const subscriptionId = typeof (invoice as any).subscription === 'string'
                    ? (invoice as any).subscription
                    : null;

                if (!subscriptionId) break;

                const sub = (await stripe.subscriptions.retrieve(
                    subscriptionId
                )) as Stripe.Subscription;

                await manageSubscriptionStatusChange(sub, supabaseAdmin);
                break;
            }
        }
    } catch (error) {
        console.error('Webhook handler failed:', error);
        return new NextResponse('Webhook handler failed', { status: 500 });
    }

    return new NextResponse(null, { status: 200 });
}
