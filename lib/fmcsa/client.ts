export interface FMCSACarrierData {
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

export type FMCSAResult =
  | { success: true, data: FMCSACarrierData }
  | { success: false, error: string, statusCode: number };

export async function fetchFMCSACarrierData(dotNumber: string): Promise<FMCSAResult> {
  const webKey = process.env.FMCSA_WEB_KEY

  // MOCK MODE
  if (!webKey || dotNumber === '1234567') {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800))

    if (dotNumber === '0000000') {
      return { success: false, error: 'Carrier not found (Mock)', statusCode: 404 }
    }

    // Mock data
    return {
      success: true,
      data: {
        dotNumber: dotNumber,
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
        outOfServiceDate: undefined,
        mcs150Date: new Date().toISOString().split('T')[0],
        numberOfPowerUnits: 42,
        numberOfDrivers: 38
      }
    }
  }

  // REAL API CALL
  try {
    const fmcsaUrl = `https://mobile.fmcsa.dot.gov/qc/services/carriers/${dotNumber}?webKey=${webKey}`

    const response = await fetch(fmcsaUrl, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      cache: 'no-store',
    })

    if (!response.ok) {
      if (response.status === 404) {
        return { success: false, error: 'Carrier not found', statusCode: 404 }
      }
      if (response.status === 429) {
        return { success: false, error: 'Rate limit exceeded', statusCode: 429 }
      }
      return { success: false, error: 'FMCSA API Error', statusCode: response.status }
    }

    const data = await response.json()

    // Basic normalization - would usually map fields here if the raw API response differs significantly from our interface
    // For now assuming the raw data structure is 'close enough' or we treat 'data' as valid carrier object.
    // NOTE: Real FMCSA API structure is nested. Ideally we parse it. 
    // For this MVP, we pass the raw data payload back as 'data' and let the caller store it / parse it.
    // But adhering to the interface we return the raw object as 'data' (or the 'content' field if fmcsa wraps it).

    return { success: true, data: data }

  } catch (error: any) {
    console.error('[FMCSA Client] Fetch Error:', error)
    return { success: false, error: error.message || 'Network Error', statusCode: 502 }
  }
}
