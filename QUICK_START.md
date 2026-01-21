# DOT Risk Radar - Quick Start

## 🚀 Get Running in 5 Minutes

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Environment
```bash
# Copy example env file
cp .env.example .env.local

# Edit .env.local with your Supabase credentials
# Get these from: https://supabase.com/dashboard/project/YOUR_PROJECT/settings/api
```

### 3. Configure Supabase
Go to your Supabase dashboard:
1. **Authentication → Providers**: Enable Email
2. **Authentication → URL Configuration**: Add redirect URLs:
   - Development: `http://localhost:3000/auth/callback`
   - Production: `https://your-project.vercel.app/auth/callback` (after deployment)

### 4. Run Development Server
```bash
npm run dev
```

Open http://localhost:3000

---

## 🎯 Test the App

1. Click "Check DOT Risk (Free)" or "Sign In"
2. Enter your email
3. Check your inbox for magic link
4. Click the link → Redirected to dashboard
5. You're in! 🎉

---

## 🚀 Deploy to Production

### Quick Deploy
```bash
./scripts/deploy.sh
```

### Or Manual
```bash
npm i -g vercel
vercel
```

Then:
1. Add environment variables in Vercel dashboard
2. Update Supabase redirect URLs with Vercel domain
3. Run `vercel --prod`

**Full guide**: [DEPLOYMENT.md](DEPLOYMENT.md)

---

## 📚 Key Files

- **Landing**: [app/page.tsx](app/page.tsx)
- **Dashboard**: [app/(dashboard)/dashboard/page.tsx](app/(dashboard)/dashboard/page.tsx)
- **Auth Config**: [lib/supabase/](lib/supabase/)
- **Middleware**: [middleware.ts](middleware.ts)

---

## 🔑 Environment Variables

Required for authentication:
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxxxx
```

Required for FMCSA carrier data:
```env
FMCSA_WEBKEY=your-fmcsa-webkey-here
```

> Note: Get your FMCSA WebKey from [FMCSA Registration](https://ai.fmcsa.dot.gov/SMS/Tools/Downloads.aspx)

Required for paid monitoring (when implementing subscriptions):

> Note: Stripe variables are only required when enabling paid monitoring tiers.

```env
STRIPE_SECRET_KEY=sk_xxxxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_xxxxx
```

---

## ❓ Troubleshooting

**Magic link not working?**
→ Check Supabase redirect URLs

**Dashboard not loading?**
→ Verify environment variables are set

**Build failing?**
→ Run `npm install` and check for errors

---

## 📖 Documentation

- [README.md](README.md) - Full project overview
- [AUTH_SETUP.md](AUTH_SETUP.md) - Authentication guide
- [DEPLOYMENT.md](DEPLOYMENT.md) - Deployment guide
- [PROJECT_STATUS.md](PROJECT_STATUS.md) - Current status

---

## 🎨 Design Guidelines

- **Calm Enterprise** aesthetic (slate-950 background)
- Prefer "Operation" or "Carrier" where possible (inclusive of owner-operators)
- Risk levels: "High", "Elevated", "Low" only
- No hype words: avoid "AI-powered", "Critical", "Real-time"

---

## ✅ Checklist

- [ ] npm install
- [ ] Create .env.local
- [ ] Configure Supabase
- [ ] npm run dev
- [ ] Test auth flow
- [ ] Deploy to Vercel
- [ ] Update production redirect URLs
- [ ] Test production

---

**Need Help?** Check [README.md](README.md) or [DEPLOYMENT.md](DEPLOYMENT.md)
