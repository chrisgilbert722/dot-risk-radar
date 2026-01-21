import { NextRequest, NextResponse } from 'next/server'

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

    // Check for FMCSA Web Key
    const webKey = process.env.FMCSA_WEB_KEY

    // MOCK MODE: If no key is present, or if using the demo DOT number "1234567", return mock data
    if (!webKey || dot === '1234567') {
      console.log(`[FMCSA API] Using mock data for DOT ${dot} (Web Key: ${webKey ? 'Present' : 'Missing'})`)

      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800))

      if (dot === '0000000') {
        return NextResponse.json(
          { ok: false, error: 'Carrier not found (Mock)' },
          { status: 404 }
        )
      }

      return NextResponse.json(
        {
          ok: true,
          carrier: {
            dotNumber: dot,
            legalName: "ACME LOGISTICS LLC",
            dbaName: "ACME TRANS",
            physicalAddress: {
              street: "123 FREIGHT WAY",
              city: "TRANSPORT CITY",
              state: "TX",
              zipCode: "75001"
            },
            phone: "555-0123",
            email: "safety@acmelogistics.com",
            operatingStatus: "AUTHORIZED FOR Property",
            outOfServiceDate: null,
            mcs150Date: new Date().toISOString().split('T')[0],
            numberOfPowerUnits: 42,
            numberOfDrivers: 38
          },
        },
        { status: 200 }
      )
    }

    // Call FMCSA QCMobile API
    const fmcsaUrl = `https://mobile.fmcsa.dot.gov/qc/services/carriers/${dot}?webKey=${webKey}`

    console.log(`[FMCSA API] Fetching carrier data for DOT ${dot}`)

    const response = await fetch(fmcsaUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      cache: 'no-store',
    })

    // Handle non-200 responses from FMCSA
    if (!response.ok) {
      console.error(`[FMCSA API] FMCSA responded with status ${response.status}`)

      // Return appropriate error without leaking the API key
      if (response.status === 404) {
        return NextResponse.json(
          { ok: false, error: 'Carrier not found with the provided DOT number' },
          { status: 404 }
        )
      }

      if (response.status === 429) {
        return NextResponse.json(
          { ok: false, error: 'Rate limit exceeded. Please try again later.' },
          { status: 429 }
        )
      }

      return NextResponse.json(
        { ok: false, error: 'Failed to fetch carrier data from FMCSA' },
        { status: response.status }
      )
    }

    // Parse response
    const data = await response.json()

    console.log(`[FMCSA API] Successfully fetched carrier data for DOT ${dot}`)

    // Return successful response
    return NextResponse.json(
      {
        ok: true,
        carrier: data,
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

    // Return 502 Bad Gateway for upstream failures
    return NextResponse.json(
      {
        ok: false,
        error: 'Failed to connect to FMCSA service. Please try again later.',
      },
      { status: 502 }
    )
  }
}
