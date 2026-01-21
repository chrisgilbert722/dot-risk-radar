import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const hasKey = !!process.env.FMCSA_WEB_KEY

  return NextResponse.json(
    {
      ok: true,
      hasKey,
      service: 'fmcsa-integration',
      timestamp: new Date().toISOString(),
    },
    {
      status: 200,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    }
  )
}
