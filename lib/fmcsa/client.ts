// FMCSA API Client
// Uses official WebKey API only - NO HTML scraping

import type { FMCSACarrierSnapshot } from './types';

const FMCSA_BASE_URL = 'https://mobile.fmcsa.dot.gov/qc/services/carriers';

export class FMCSAClientError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string
  ) {
    super(message);
    this.name = 'FMCSAClientError';
  }
}

/**
 * Fetch carrier snapshot from FMCSA WebKey API
 * Returns raw XML response
 */
export async function fetchCarrierSnapshotXML(
  dotNumber: string
): Promise<string> {
  const webKey = process.env.FMCSA_WEBKEY;

  if (!webKey) {
    throw new FMCSAClientError(
      'FMCSA_WEBKEY environment variable not configured',
      500,
      'MISSING_CONFIG'
    );
  }

  const url = `${FMCSA_BASE_URL}/${dotNumber}?webKey=${webKey}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/xml',
      },
    });

    // Handle HTTP errors
    if (!response.ok) {
      if (response.status === 404) {
        throw new FMCSAClientError(
          `DOT number ${dotNumber} not found in FMCSA database`,
          404,
          'NOT_FOUND'
        );
      }

      if (response.status === 429) {
        throw new FMCSAClientError(
          'FMCSA API rate limit exceeded',
          429,
          'RATE_LIMIT'
        );
      }

      if (response.status >= 500) {
        throw new FMCSAClientError(
          'FMCSA service temporarily unavailable',
          response.status,
          'SERVICE_UNAVAILABLE'
        );
      }

      throw new FMCSAClientError(
        `FMCSA API error: ${response.statusText}`,
        response.status,
        'API_ERROR'
      );
    }

    const xmlText = await response.text();

    if (!xmlText || xmlText.trim().length === 0) {
      throw new FMCSAClientError(
        'Empty response from FMCSA API',
        500,
        'EMPTY_RESPONSE'
      );
    }

    return xmlText;
  } catch (error) {
    if (error instanceof FMCSAClientError) {
      throw error;
    }

    // Network or other errors
    throw new FMCSAClientError(
      `Failed to fetch FMCSA data: ${error instanceof Error ? error.message : 'Unknown error'}`,
      500,
      'NETWORK_ERROR'
    );
  }
}

/**
 * Fetch carrier snapshot with retry logic
 */
export async function fetchCarrierSnapshotWithRetry(
  dotNumber: string,
  maxRetries: number = 3
): Promise<string> {
  let lastError: FMCSAClientError | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fetchCarrierSnapshotXML(dotNumber);
    } catch (error) {
      lastError = error as FMCSAClientError;

      // Don't retry on 404 (not found) or 429 (rate limit)
      if (lastError.status === 404 || lastError.status === 429) {
        throw lastError;
      }

      // Don't retry on last attempt
      if (attempt === maxRetries) {
        throw lastError;
      }

      // Exponential backoff
      const delayMs = Math.min(1000 * Math.pow(2, attempt - 1), 10000);
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }

  throw lastError!;
}
