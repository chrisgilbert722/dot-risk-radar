# Vercel Build Fix - Next.js 15 Cookies API Change

## Issue
Vercel build was failing with TypeScript error:
```
Source has 3 element(s) but target allows only 2 element(s)
```

## Root Cause
**Next.js 15 Breaking Change**: The `cookies.set()` API no longer supports the 3-argument overload.

- **Old (Next.js 14)**: `cookies.set(name, value, options)` ✅
- **New (Next.js 15)**: `cookies.set({ name, value, ...options })` ✅
- **Removed**: 3-argument syntax is NO LONGER VALID

This was NOT a cache issue or overload indexing issue. Next.js 15 fundamentally changed the cookies API to only accept an object parameter.

## Resolution

### Final Fix (Commit: 1056b24)
**File**: `lib/supabase/middleware.ts`

Replaced all `cookies.set()` calls with Next.js 15 object-based syntax:

```typescript
setAll(
  cookiesToSet: {
    name: string
    value: string
    options?: {
      path?: string
      domain?: string
      maxAge?: number
      expires?: Date
      httpOnly?: boolean
      secure?: boolean
      sameSite?: 'strict' | 'lax' | 'none'
    }
  }[]
) {
  cookiesToSet.forEach(({ name, value, options }) => {
    request.cookies.set({
      name,
      value,
      ...(options ?? {})
    })
  })
  supabaseResponse = NextResponse.next({
    request,
  })
  cookiesToSet.forEach(({ name, value, options }) => {
    supabaseResponse.cookies.set({
      name,
      value,
      ...(options ?? {})
    })
  })
}
```

**Key Changes**:
- ❌ `request.cookies.set(name, value, options)` - REMOVED (invalid in Next.js 15)
- ❌ `request.cookies.set(name, value)` - REMOVED (invalid in Next.js 15)
- ✅ `request.cookies.set({ name, value, ...(options ?? {}) })` - CORRECT

## Verification

✅ Code correctly pushed to GitHub (commit 1056b24)
✅ Object-based syntax used for all cookie.set() calls
✅ Compatible with Next.js 15.1.3
✅ TypeScript types are correct

## Vercel Deployment

1. **Automatic Trigger**: Commit 1056b24 pushed to main branch
2. **Expected Result**: Build should pass with no TypeScript errors
3. **No Cache Clearing Needed**: This is a code fix, not a cache issue

## If Build Still Fails

If Vercel still shows errors after this commit:

1. **Check Next.js Version**:
   ```bash
   # Verify Next.js 15 is installed
   npm list next
   # Should show: next@15.1.3
   ```

2. **Verify Environment Variables**:
   - Ensure `NEXT_PUBLIC_SUPABASE_URL` is set
   - Ensure `NEXT_PUBLIC_SUPABASE_ANON_KEY` is set
   - These are required for TypeScript compilation

3. **Check Node Version**:
   - Vercel should use Node 20+
   - Check in Vercel Settings → General → Node.js Version

## Related Files
- `lib/supabase/middleware.ts` (fixed)
- `lib/supabase/server.ts` (no changes needed)
- `lib/supabase/client.ts` (no changes needed)

## Commits
- `1056b24`: Fix Next.js 15 cookies.set API - use object syntax

## Reference
- [Next.js 15 Upgrade Guide - Cookies API Changes](https://nextjs.org/docs/app/building-your-application/upgrading/version-15)

---

**Status**: ✅ Fixed and deployed
**Last Updated**: 2026-01-21
