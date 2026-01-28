import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server';
import { requireActiveSubscription } from '@/lib/billing/requireActiveSubscription';

export const dynamic = 'force-dynamic'

interface FMCSACarrierResponse {
  carrier: {
    dotNumber: string
    legalName: string
    dbaName?: string
    physicalAddress?: {
      street?: string
      city?: string
      state?: string
      zipCode?: string
    }
    mailingAddress?: {
      street?: string
      city?: string
      state?: string
      zipCode?: string
    }
    phone?: string
    email?: string
    operatingStatus?: string
    outOfServiceDate?: string
    mcs150Date?: string
    mcs150Mileage?: number
    mcs150MileageYear?: number
    numberOfPowerUnits?: number
    numberOfDrivers?: number
  }
  // Add other fields as needed from FMCSA XML/JSON response
}

export async function GET(request: NextRequest) {
  try {
    // --- AUTH & SUBSCRIPTION CHECK ---
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
    }

    try {
      await requireActiveSubscription(user.id);
    } catch (e) {
      return NextResponse.json({ ok: false, error: 'Upgrade required to access this data' }, { status: 403 });
    }

    // Extract DOT number from query params
    const searchParams = request.nextUrl.searchParams
    const dot = searchParams.get('dot')

    // Validate DOT number
    if (!dot) {
      return NextResponse.json(
        { ok: false, error: 'DOT number is required' },
        { status: 400 }
      )
    }

    // Validate DOT number is numeric and reasonable length (1-8 digits)
    if (!/^\d{1,8}$/.test(dot)) {
      return NextResponse.json(
        { ok: false, error: 'DOT number must be numeric (1-8 digits)' },
        { status: 400 }
      )
    }

    // Use shared FMCSA client
    const { fetchFMCSACarrierData } = await import('@/lib/fmcsa/client');
    const result = await fetchFMCSACarrierData(dot);

    if (!result.success) {
      return NextResponse.json(
        { ok: false, error: result.error },
        { status: result.statusCode }
      );
    }

    return NextResponse.json(
      {
        ok: true,
        carrier: result.data,
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'private, no-cache, no-store, must-revalidate',
        },
      }
    )
  } catch (error) {
    console.error('[FMCSA API] Unexpected error:', error)

    return NextResponse.json(
      {
        ok: false,
        error: 'Internal Server Error',
      },
      { status: 500 }
    )
  }
}
