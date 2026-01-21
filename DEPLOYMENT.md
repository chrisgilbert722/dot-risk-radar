# DOT Risk Radar - Deployment Guide

## Vercel + Supabase Deployment

### Prerequisites
- ✅ GitHub account with repo
- ✅ Vercel account (sign up at vercel.com)
- ✅ Supabase project created

---

## Step 1: Push to GitHub

Since you have GitHub integrated with Antigravity, commit and push your code:

```bash
git add .
git commit -m "Initial DOT Risk Radar setup with Supabase auth"
git push origin main
```

---

## Step 2: Deploy to Vercel

### Option A: Vercel CLI (Recommended)
```bash
# Install Vercel CLI globally
npm i -g vercel

# Deploy from your project directory
vercel

# Follow the prompts:
# - Link to existing project? No
# - Project name: dot-risk-radar
# - Directory: ./
# - Override settings? No

# For production deployment
vercel --prod
```

### Option B: Vercel Dashboard
1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Vercel will auto-detect Next.js
4. Click "Deploy"

---

## Step 3: Configure Environment Variables in Vercel

After deployment, add your environment variables:

### Via Vercel Dashboard:
1. Go to your project settings
2. Navigate to **Settings → Environment Variables**
3. Add the following:

| Name | Value | Environment |
|------|-------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://your-project.supabase.co` | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `your-anon-key` | Production, Preview, Development |
| `FEATURE_COMPLIANCE_VAULT` | `false` | Production, Preview, Development |
| `FEATURE_ALERT_DELIVERY` | `false` | Production, Preview, Development |
| `FEATURE_DATAQS_ASSIST` | `false` | Production, Preview, Development |
| `FEATURE_FLEET_ROLLUPS` | `false` | Production, Preview, Development |
| `FEATURE_PROGRAMMATIC_SEO` | `false` | Production, Preview, Development |

### Via Vercel CLI:
```bash
vercel env add NEXT_PUBLIC_SUPABASE_URL
# Paste your Supabase URL

vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
# Paste your anon key
```

---

## Step 4: Update Supabase Redirect URLs

Add your Vercel deployment URL to Supabase:

1. Go to your Supabase project dashboard
2. Navigate to **Authentication → URL Configuration**
3. Add these redirect URLs:
   ```
   https://your-project.vercel.app/auth/callback
   https://dot-risk-radar.vercel.app/auth/callback
   ```
4. If using custom domain:
   ```
   https://yourdomain.com/auth/callback
   ```

---

## Step 5: Redeploy with Environment Variables

After adding environment variables, trigger a new deployment:

```bash
vercel --prod
```

Or push a new commit to GitHub (auto-deploys if connected).

---

## Custom Domain Setup (Optional)

### Add Custom Domain in Vercel:
1. Go to **Settings → Domains**
2. Add your domain (e.g., `dotriskradar.com`)
3. Follow DNS configuration instructions
4. Add SSL certificate (automatic via Vercel)

### Update Supabase:
Add your custom domain to redirect URLs:
```
https://dotriskradar.com/auth/callback
```

---

## Vercel Build Settings

Your `vercel.json` is already configured:
```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["iad1"]
}
```

### Region Selection:
- `iad1` = Washington, D.C. (US East)
- Change to `sfo1` for San Francisco (US West) if needed
- See [Vercel Regions](https://vercel.com/docs/concepts/edge-network/regions)

---

## Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] Vercel project created and deployed
- [ ] Environment variables added in Vercel
- [ ] Supabase redirect URLs updated
- [ ] Production deployment tested
- [ ] Magic link email tested in production
- [ ] Dashboard loads correctly
- [ ] Sign out works

---

## Troubleshooting

### Issue: Magic links not working
**Solution:** Check Supabase redirect URLs include your Vercel domain

### Issue: Environment variables not loaded
**Solution:** Redeploy after adding variables via `vercel --prod`

### Issue: Build fails
**Solution:** Check build logs in Vercel dashboard, ensure all dependencies in package.json

### Issue: Dashboard shows "Not authenticated"
**Solution:** Clear cookies, sign in again. Check middleware.ts is running.

---

## Monitoring & Analytics

### Vercel Analytics (Optional):
Add to your project:
```bash
npm install @vercel/analytics
```

Update `app/layout.tsx`:
```tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

---

## Preview Deployments

Every Git branch push creates a preview deployment:
- `main` branch → Production
- Other branches → Preview URLs
- Share preview URLs for testing

---

## Continuous Deployment

Vercel auto-deploys when you push to GitHub:
```bash
git add .
git commit -m "Update feature"
git push origin main
# → Automatic deployment triggered
```

---

## Next Steps After Deployment

1. Test the complete auth flow in production
2. Configure custom domain
3. Set up Vercel Analytics
4. Implement FMCSA data fetching
5. Add monitoring/error tracking (Sentry, LogRocket)
6. Configure email templates in Supabase

---

## Production URLs

- **Vercel Default**: `https://your-project.vercel.app`
- **Custom Domain**: `https://yourdomain.com` (after DNS setup)
- **Preview Branches**: `https://your-project-git-branch.vercel.app`

---

## Support Resources

- [Vercel Docs](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Supabase Auth](https://supabase.com/docs/guides/auth)
