import { createClient } from '@/lib/supabase/server';
import { stripe } from '@/lib/stripe';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const supabase = await createClient();
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const { priceId } = await req.json();

        if (!priceId) {
            return new NextResponse('Price ID is required', { status: 400 });
        }

        // Check if user already has a Stripe Customer ID in subscriptions table
        // (Optional: You might want to store this on a separate 'users' table or metadata, 
        // but we can look it up or create a new one. For simplicity, we'll let Stripe handle 
        // email matching or create a new customer if we haven't stored it yet. 
        // If we want to avoid duplicates, we should fetch it.)

        // Better approach: Look up subscription/customer record
        const { data: subscription } = await supabase
            .from('subscriptions')
            .select('stripe_customer_id')
            .eq('user_id', user.id)
            .single();

        let customerId = subscription?.stripe_customer_id;

        // Create Checkout Session
        const session = await stripe.checkout.sessions.create({
            customer: customerId || undefined,
            customer_email: customerId ? undefined : user.email,
            billing_address_collection: 'auto',
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            success_url: `${req.headers.get('origin')}/dashboard?success=true`,
            cancel_url: `${req.headers.get('origin')}/?canceled=true`,
            metadata: {
                userId: user.id,
            },
            subscription_data: {
                metadata: {
                    userId: user.id,
                },
            },
            allow_promotion_codes: true,
        });

        return NextResponse.json({ url: session.url });
    } catch (error: any) {
        console.error('[STRIPE_ERROR]', error);
        return new NextResponse(JSON.stringify({ error: error.message }), { status: 500 });
    }
}
