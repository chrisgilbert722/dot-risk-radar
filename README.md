# DOT Risk Radar

Public DOT inspection patterns translated into plain English. Monitor your operation's safety posture with ongoing analysis.

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy `.env.local.example` to `.env.local` and add your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Supabase Configuration

In your Supabase project dashboard:

1. **Enable Email Auth**:
   - Go to Authentication → Providers
   - Enable Email provider
   - Enable "Confirm email" (optional for magic links)

2. **Configure Redirect URLs**:
   - Go to Authentication → URL Configuration
   - Add redirect URLs:
     - `http://localhost:3000/auth/callback` (development)
     - `https://yourdomain.com/auth/callback` (production)

3. **Email Templates** (optional):
   - Go to Authentication → Email Templates
   - Customize the "Magic Link" template

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Project Structure

```
├── app/
│   ├── (dashboard)/
│   │   └── dashboard/          # Protected dashboard page
│   ├── auth/
│   │   └── callback/           # OAuth callback handler
│   ├── login/                  # Login page (magic link)
│   ├── signup/                 # Signup page (magic link)
│   ├── page.tsx               # Landing page
│   ├── layout.tsx             # Root layout
│   └── globals.css            # Global styles
├── components/
│   └── ui/                    # shadcn-ui components
├── lib/
│   ├── supabase/              # Supabase client configs
│   ├── constants/             # App constants and messages
│   ├── flags.ts               # Feature flags
│   └── utils.ts               # Utility functions
├── middleware.ts              # Auth middleware
└── tailwind.config.ts         # Tailwind configuration
```

## Authentication Flow

1. User enters email on `/login` or `/signup`
2. Magic link sent to email via Supabase
3. User clicks link → redirected to `/auth/callback`
4. Callback exchanges code for session
5. User redirected to `/dashboard`

## Feature Flags

Configure features via environment variables in `.env.local`:

```env
FEATURE_COMPLIANCE_VAULT=false
FEATURE_ALERT_DELIVERY=false
FEATURE_DATAQS_ASSIST=false
FEATURE_FLEET_ROLLUPS=false
FEATURE_PROGRAMMATIC_SEO=false
```

## Design Constraints

- **Vibe**: Calm Enterprise (slate-950 background, muted blues)
- **Language**: Prefer "Operation" or "Carrier" where possible (inclusive of owner-operators)
- **Risk Levels**: Only "High", "Elevated", "Low"
- **No Hype**: Avoid "AI-powered", "Immediate", "Critical", "Real-time"

## Deployment

### Quick Deploy to Vercel

```bash
# Option 1: Use deployment script
./scripts/deploy.sh

# Option 2: Manual deployment
npm i -g vercel
vercel
```

**Full deployment guide**: See [DEPLOYMENT.md](DEPLOYMENT.md)

### Environment Variables for Production

Add these in Vercel dashboard (Settings → Environment Variables):
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Feature flags (optional)

Don't forget to update Supabase redirect URLs with your Vercel domain!

## Next Steps

- [ ] Set up Supabase project and configure environment variables
- [ ] Install dependencies with `npm install`
- [ ] Run `npm run dev` to start development server
- [ ] Test authentication flow (signup → email → callback → dashboard)
- [ ] Deploy to Vercel (see [DEPLOYMENT.md](DEPLOYMENT.md))
- [ ] Implement FMCSA data fetching logic
