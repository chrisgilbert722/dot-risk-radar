import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const origin = requestUrl.origin

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // Check subscription status
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: subscription } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', user.id)
          .eq('status', 'active')
          .single();

        const isActive = !!subscription;

        if (!isActive) {
          // Redirect to homepage with pricing modal open
          return NextResponse.redirect(`${origin}/?pricing=true`)
        }
      }
    }
  }

  // Default correct path (Dashboard if subscribed, or fallthrough if just logging in and active)
  return NextResponse.redirect(`${origin}/dashboard`)
}
