# DOT Risk Radar - Validation Guide

## Pre-Deployment Validation Steps

### 1. Database Setup

**Apply migrations to Supabase:**

```bash
# In Supabase SQL Editor, run migrations in order:
1. supabase/migrations/20260120_phase8_infra.sql
2. supabase/migrations/20260120_phase2_fmcsa.sql
```

**Verify tables created:**
```sql
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;

-- Expected tables:
-- - dot_profiles
-- - notification_preferences
-- - risk_snapshots
-- - vault_documents
-- - vault_folders
```

**Verify indexes:**
```sql
SELECT indexname FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY indexname;

-- Expected indexes:
-- - idx_dot_profiles_dot_number
-- - idx_dot_profiles_last_fetched
-- - idx_risk_snapshots_date
-- - idx_risk_snapshots_dot_number
```

---

### 2. Environment Configuration

**Local Development (.env.local):**

```bash
# Copy example file
cp .env.example .env.local

# Edit with your credentials
# Required:
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
FMCSA_WEBKEY=your-fmcsa-webkey

# Optional (for future):
STRIPE_SECRET_KEY=sk_test_xxxxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
```

**Production (Vercel):**

Go to Vercel Dashboard → Settings → Environment Variables:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `FMCSA_WEBKEY`
- All feature flags (optional)

---

### 3. Install Dependencies

```bash
npm install
```

**Expected packages:**
- Next.js 15.1.3
- React 19
- Supabase SSR & Client
- shadcn-ui components
- Lucide icons
- tsx (for test scripts)

---

### 4. Build Validation

```bash
# TypeScript check
npm run build

# Expected output: ✓ Compiled successfully
# No errors, warnings acceptable
```

**Common issues:**
- Missing environment variables → Add to .env.local
- Type errors → Check imports and types
- Build fails → Check Next.js version compatibility

---

### 5. FMCSA Integration Test

**Run test script:**

```bash
# Test with default DOT number (Schneider National)
npm run test:fmcsa

# Test with specific DOT number
npm run test:fmcsa 123456
```

**Expected output:**

```
🚀 DOT Risk Radar - FMCSA Integration Test

Testing DOT Number: 3962493

Step 1: Fetching FMCSA data...
✅ FMCSA data fetched successfully
   Source: fmcsa

📋 Carrier Profile:
   Legal Name: SCHNEIDER NATIONAL INC
   DBA Name: N/A
   Location: GREEN BAY, WI
   Operating Status: AUTHORIZED FOR PROPERTY
   FMCSA Safety Rating: SATISFACTORY
   Vehicle OOS Rate: 5.23%
   Driver OOS Rate: 2.14%
   Total Inspections: 12543

Step 2: Calculating risk assessment...
✅ Risk assessment complete

⚠️  Risk Assessment:
   Risk Level: Low
   Risk Score: 15/100
   Snapshot Date: 2026-01-20

📌 Risk Factors:
   No significant risk factors identified

💡 Recommended Actions:
   1. Continue ongoing monitoring
   2. Maintain current safety practices

Step 3: Verifying stored snapshot...
✅ Latest snapshot retrieved
   Snapshot ID: uuid-here
   Created At: 2026-01-20T...

✅ All tests passed! FMCSA integration working correctly.
```

**If test fails:**
- Check FMCSA_WEBKEY is valid
- Verify Supabase connection
- Check migration was applied
- Review error logs

---

### 6. Authentication Flow Test

**Manual test steps:**

1. **Signup Flow:**
   ```
   1. Go to http://localhost:3000
   2. Click "Check DOT Risk (Free)"
   3. Enter your email
   4. Click "Send magic link"
   5. Check email inbox
   6. Click magic link
   7. Should redirect to /dashboard
   8. Verify you see user email in nav
   ```

2. **Login Flow:**
   ```
   1. Sign out from dashboard
   2. Go to http://localhost:3000/login
   3. Enter same email
   4. Click "Send magic link"
   5. Check email inbox
   6. Click magic link
   7. Should redirect to /dashboard
   ```

3. **Protected Routes:**
   ```
   1. Sign out
   2. Try to access http://localhost:3000/dashboard
   3. Should redirect to /login
   ```

4. **Sign Out:**
   ```
   1. Sign in
   2. Click "Sign out" in dashboard nav
   3. Should redirect to homepage
   4. Should not be able to access /dashboard
   ```

---

### 7. Cache Behavior Test

**Test 12-hour cache:**

```bash
# First fetch (from FMCSA)
npm run test:fmcsa 123456
# Output: Source: fmcsa

# Second fetch immediately (from cache)
npm run test:fmcsa 123456
# Output: Source: cache
# Output: Cache age: 0.0 hours

# Wait 12+ hours (or manually update last_fetched_at in DB)
# Then fetch again (from FMCSA)
npm run test:fmcsa 123456
# Output: Source: fmcsa
```

**Manual cache test:**
```sql
-- In Supabase SQL Editor
-- Force cache refresh by setting old timestamp
UPDATE dot_profiles
SET last_fetched_at = NOW() - INTERVAL '13 hours'
WHERE dot_number = '123456';

-- Now run test again - should fetch from FMCSA
```

---

### 8. Error Handling Test

**Test invalid DOT number:**

```bash
npm run test:fmcsa 999999999
# Expected: Error message about DOT not found
```

**Test network error (disconnect internet):**

```bash
# Disconnect internet
npm run test:fmcsa 123456
# Expected: Falls back to cache if available
# Or: Error message if no cache
```

**Test rate limiting (make many requests):**

```bash
# Make 10+ rapid requests
for i in {1..10}; do npm run test:fmcsa 123456; done
# Expected: Should eventually hit rate limit
# Or: Cache prevents hitting API
```

---

### 9. Language Compliance Audit

**Automated check:**

```bash
# Search for prohibited terms
grep -r "official" app/ lib/ --exclude-dir=node_modules
grep -r "real-time" app/ lib/ --exclude-dir=node_modules
grep -r "immediate" app/ lib/ --exclude-dir=node_modules
grep -r "critical" app/ lib/ --exclude-dir=node_modules

# Expected: No results (or only in comments/docs)
```

**Manual review:**
- [ ] Landing page copy
- [ ] Dashboard UI text
- [ ] Error messages
- [ ] Risk factor descriptions
- [ ] Action recommendations

---

### 10. Performance Test

**Lighthouse audit:**

```bash
# Build for production
npm run build
npm run start

# Run Lighthouse in Chrome DevTools
# Target: Performance > 90, Accessibility > 95
```

**Load time test:**
```bash
# Measure time to interactive
# Use Chrome DevTools → Network → Disable cache
# Reload homepage
# Expected: < 3 seconds
```

---

## Deployment Validation

### After Vercel Deployment

1. **Environment Variables:**
   ```bash
   # In Vercel dashboard, verify all env vars are set
   # Trigger a new deployment after adding vars
   ```

2. **Supabase Redirect URLs:**
   ```
   Go to Supabase → Authentication → URL Configuration
   Add: https://your-project.vercel.app/auth/callback
   ```

3. **Production Smoke Test:**
   ```
   1. Visit https://your-project.vercel.app
   2. Sign up with real email
   3. Click magic link from email
   4. Verify redirect to dashboard
   5. Test DOT lookup (if UI ready)
   6. Sign out
   ```

4. **Error Monitoring:**
   ```
   # Check Vercel logs for errors
   # Check Supabase logs for auth issues
   # Monitor for 24 hours after launch
   ```

---

## Validation Checklist

### Pre-Deployment

- [ ] Migrations applied successfully
- [ ] Environment variables configured
- [ ] Dependencies installed
- [ ] Build completes without errors
- [ ] FMCSA test script passes
- [ ] Auth flow works end-to-end
- [ ] Cache behavior correct (12h)
- [ ] Error handling works
- [ ] No prohibited language found
- [ ] Performance acceptable

### Post-Deployment

- [ ] Production deployment successful
- [ ] Environment variables in Vercel
- [ ] Supabase redirect URLs updated
- [ ] Production auth flow works
- [ ] FMCSA integration works in prod
- [ ] No errors in logs
- [ ] Performance metrics acceptable
- [ ] SSL certificate active
- [ ] DNS configured (if custom domain)

---

## Troubleshooting

### Issue: FMCSA test fails with "WebKey not configured"

**Solution:**
```bash
# Check .env.local exists and has FMCSA_WEBKEY
cat .env.local | grep FMCSA_WEBKEY

# If missing, add it
echo "FMCSA_WEBKEY=your-key-here" >> .env.local
```

### Issue: Auth magic link not received

**Solution:**
1. Check Supabase email settings
2. Verify email template is enabled
3. Check spam folder
4. Test with different email provider

### Issue: Migration fails

**Solution:**
```sql
-- Check if tables already exist
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public';

-- If tables exist, drop and recreate (dev only!)
DROP TABLE IF EXISTS risk_snapshots CASCADE;
DROP TABLE IF EXISTS dot_profiles CASCADE;

-- Then re-run migration
```

### Issue: Build fails with module errors

**Solution:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Try build again
npm run build
```

---

**Validation Status**: Ready for testing
**Next Step**: Complete checklist above before deploying to production
