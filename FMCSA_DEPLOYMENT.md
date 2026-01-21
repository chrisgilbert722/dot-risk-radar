# FMCSA Integration - Production Deployment Guide

## Overview

The FMCSA QCMobile API integration is now live in production. This guide covers deployment to Vercel and testing the integration.

---

## Security

**CRITICAL**: The FMCSA Web Key is a **server-side secret** and must NEVER be exposed to the client.

- ✅ Environment variable name: `FMCSA_WEB_KEY` (no `NEXT_PUBLIC_` prefix)
- ✅ Only accessible in API routes and server components
- ✅ Never logged or included in error responses
- ✅ Validated before use with safe fallback

---

## Vercel Deployment Steps

### 1. Add Environment Variable

1. Go to your Vercel Dashboard
2. Navigate to your project (dot-risk-radar)
3. Go to **Settings** → **Environment Variables**
4. Add new variable:
   - **Name**: `FMCSA_WEB_KEY`
   - **Value**: Your FMCSA WebKey (obtain from FMCSA)
   - **Environments**: Select **Production**, **Preview**, and **Development**
5. Click **Save**

### 2. Redeploy

After adding the environment variable:

```bash
# Push latest code to trigger deployment
git push origin main

# Or manually redeploy in Vercel Dashboard
# Project → Deployments → Latest → Redeploy
```

---

## API Routes

### 1. Carrier Lookup: `/api/fmcsa/carrier`

**Endpoint**: `GET /api/fmcsa/carrier?dot={DOT_NUMBER}`

**Query Parameters**:
- `dot` (required): US DOT number (1-8 digits)

**Success Response** (200):
```json
{
  "ok": true,
  "carrier": {
    "carrier": {
      "dotNumber": "1234567",
      "legalName": "ACME TRUCKING INC",
      "operatingStatus": "ACTIVE",
      ...
    }
  }
}
```

**Error Responses**:
- `400`: Invalid DOT number format
- `404`: Carrier not found
- `429`: Rate limit exceeded
- `500`: Missing FMCSA_WEB_KEY
- `502`: Upstream FMCSA service failure

### 2. Health Check: `/api/fmcsa/health`

**Endpoint**: `GET /api/fmcsa/health`

**Response** (200):
```json
{
  "ok": true,
  "hasKey": true,
  "service": "fmcsa-integration",
  "timestamp": "2026-01-21T12:00:00.000Z"
}
```

**Purpose**: Verify FMCSA integration is configured correctly without exposing the key value.

---

## Testing

### Test Health Endpoint

```bash
# Production
curl https://your-project.vercel.app/api/fmcsa/health

# Expected: { "ok": true, "hasKey": true, ... }
```

### Test Carrier Lookup

```bash
# Test with a known DOT number (e.g., Schneider National)
curl "https://your-project.vercel.app/api/fmcsa/carrier?dot=3962493"

# Expected: 200 with carrier data
```

### Test Error Handling

```bash
# Invalid DOT format
curl "https://your-project.vercel.app/api/fmcsa/carrier?dot=abc123"
# Expected: 400 Bad Request

# Non-existent DOT
curl "https://your-project.vercel.app/api/fmcsa/carrier?dot=99999999"
# Expected: 404 Not Found
```

---

## Landing Page Integration

The landing page form at `/` now calls the FMCSA API:

1. User enters DOT number and email
2. Form submits to `/api/fmcsa/carrier?dot={number}`
3. Success: Displays carrier name in green alert
4. Error: Displays error message in red alert
5. Loading state: Shows spinner and disables form

**No authentication required** for the landing page lookup.

---

## Error Handling

All error scenarios are handled gracefully:

1. **Missing FMCSA_WEB_KEY**:
   - Returns 500 with helpful message
   - Logs error to console for debugging
   - Does NOT expose that the key is missing to end users

2. **Invalid DOT Number**:
   - Validates format (1-8 digits)
   - Returns 400 with clear message

3. **FMCSA API Errors**:
   - 404: Carrier not found
   - 429: Rate limit exceeded
   - Other: Generic "failed to fetch" message
   - Never leaks API key in error responses

4. **Network Failures**:
   - Caught and returned as 502 Bad Gateway
   - Safe error message for users

---

## Monitoring

Check Vercel logs for FMCSA API activity:

```bash
# In Vercel Dashboard
Project → Logs → Filter by "/api/fmcsa"
```

**Log Messages**:
- `[FMCSA API] Fetching carrier data for DOT {number}` - Request started
- `[FMCSA API] Successfully fetched carrier data for DOT {number}` - Success
- `[FMCSA API] FMCSA responded with status {code}` - Upstream error
- `[FMCSA API] FMCSA_WEB_KEY environment variable is not configured` - Config error
- `[FMCSA API] Unexpected error:` - Caught exception

---

## Security Checklist

- [x] FMCSA_WEB_KEY stored as server-side secret
- [x] No NEXT_PUBLIC_ prefix on FMCSA_WEB_KEY
- [x] API key never logged or exposed in responses
- [x] Input validation on DOT number
- [x] Rate limiting handled gracefully
- [x] Error messages don't leak internal details
- [x] `cache: "no-store"` prevents caching sensitive data

---

## Next Steps

After deployment:

1. Verify health endpoint returns `hasKey: true`
2. Test carrier lookup with known DOT numbers
3. Test landing page form end-to-end
4. Monitor logs for any errors
5. Consider adding:
   - Rate limiting on API route
   - Caching layer (12-hour cache as per design)
   - Analytics tracking for API usage

---

## Troubleshooting

### Health endpoint shows `hasKey: false`

**Solution**: FMCSA_WEB_KEY not set in Vercel environment variables. Add it and redeploy.

### Carrier lookup returns 500

**Solution**: Check Vercel logs for specific error. Likely missing FMCSA_WEB_KEY.

### Carrier lookup returns 502

**Solution**: FMCSA upstream service may be down. Check FMCSA API status.

### Landing page form doesn't work

**Solution**: Check browser console for errors. Verify API routes are accessible.

---

**Status**: ✅ Ready for production deployment
**Last Updated**: 2026-01-21
