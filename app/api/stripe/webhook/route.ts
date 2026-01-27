import { headers } from 'next/headers';
import { stripe } from '@/lib/stripe';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function POST(req: Request) {
    const body = await req.text();
    const signature = (await headers()).get('Stripe-Signature') as string;

    let event: Stripe.Event;

    try {
        if (!process.env.STRIPE_WEBHOOK_SECRET) {
            throw new Error("STRIPE_WEBHOOK_SECRET is missing");
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

    // Initialize Supabase Admin Client
    // We use the manually created admin client for webhooks
    const supabaseAdmin = await (async () => {
        const { createClient: createSupabaseClient } = await import('@supabase/supabase-js');
        return createSupabaseClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );
    })();

    try {
        switch (event.type) {
            case 'checkout.session.completed':
                if (session.mode === 'subscription') {
                    const subscriptionId = session.subscription as string;
                    console.log(`[Stripe Webhook] Processing subscription: ${subscriptionId}`);
                    console.log(`[Stripe Webhook] Metadata:`, session.metadata);

                    // Retrieve the subscription details to get the current period end
                    const sub = await stripe.subscriptions.retrieve(subscriptionId);

                    const userId = session.metadata?.userId || session.client_reference_id;
                    const plan = session.metadata?.plan || 'pro';

                    if (!userId) {
                        console.error('[Stripe Webhook] Error: Missing userId in metadata');
                        return new NextResponse('Webhook Error: Missing userId', { status: 400 });
                    }

                    const { error } = await supabaseAdmin.from('subscriptions').upsert({
                        user_id: userId,
                        stripe_customer_id: session.customer as string,
                        stripe_subscription_id: subscriptionId,
                        status: 'active',
                        plan: plan,
                        current_period_end: new Date((sub as any).current_period_end * 1000).toISOString(),
                    });

                    if (error) {
                        console.error('[Stripe Webhook] Supabase Upsert Error:', error);
                        return new NextResponse(`Supabase Error: ${error.message}`, { status: 500 });
                    }

                    console.log(`[Stripe Webhook] Successfully activated subscription for user: ${userId}`);
                }
                break;

            case 'customer.subscription.updated':
                // Update status and potentially plan if it changed (though traditionally handled via metadata update or separate event, assuming metadata stays on sub)
                await supabaseAdmin
                    .from('subscriptions')
                    .update({
                        status: subscription.status,
                        plan: subscription.metadata?.plan, // Update plan if present in metadata
                        current_period_end: new Date((subscription as any).current_period_end * 1000).toISOString(),
                    })
                    .eq('stripe_subscription_id', subscription.id);
                break;

            case 'customer.subscription.deleted':
                // Mark as canceled
                await supabaseAdmin
                    .from('subscriptions')
                    .update({
                        status: subscription.status,
                        current_period_end: new Date((subscription as any).current_period_end * 1000).toISOString(),
                    })
                    .eq('stripe_subscription_id', subscription.id);
                break;
        }
    } catch (error: any) {
        console.error('Webhook handler failed:', error);
        return new NextResponse('Webhook handler failed', { status: 500 });
    }

    return new NextResponse(null, { status: 200 });
}
