# 🚀 DOT Risk Radar

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-15.1.3-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Auth%20%26%20DB-green)](https://supabase.com/)

> Public DOT inspection patterns translated into plain English. Monitor your operation's safety posture with ongoing analysis.

---

## ✨ Features

- 🔐 **Magic Link Authentication** - Passwordless login via Supabase
- 📊 **FMCSA Integration** - Official WebKey API for carrier data
- ⚠️ **Risk Scoring** - Automated assessment based on inspection patterns
- 💾 **Intelligent Caching** - 12-hour data refresh cycle
- 🎨 **Calm Enterprise Design** - Professional UI with Tailwind CSS
- 🚀 **Vercel Ready** - One-click deployment

---

## 📋 Quick Start

### Prerequisites

- Node.js 20+
- Supabase account
- FMCSA WebKey (optional for local dev)

### Installation

\`\`\`bash
# Clone repository
git clone https://github.com/chrisgilbert722/dot-risk-radar.git
cd dot-risk-radar

# Install dependencies
npm install

# Configure environment
cp .env.example .env.local
# Edit .env.local with your credentials

# Run development server
npm run dev
\`\`\`

Visit http://localhost:3000

**Full guide**: See [QUICK_START.md](QUICK_START.md)

---

## 📚 Documentation

- **[QUICK_START.md](QUICK_START.md)** - 5-minute setup guide
- **[VALIDATION_GUIDE.md](VALIDATION_GUIDE.md)** - Testing procedures
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Vercel deployment
- **[AUTH_SETUP.md](AUTH_SETUP.md)** - Authentication details
- **[FMCSA_IMPLEMENTATION.md](FMCSA_IMPLEMENTATION.md)** - Integration guide
- **[LAUNCH_CHECKLIST.md](LAUNCH_CHECKLIST.md)** - Pre-launch tasks

---

## 🏗️ Tech Stack

**Frontend:**
- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- shadcn-ui components
- Lucide icons

**Backend:**
- Supabase (Auth & PostgreSQL)
- FMCSA WebKey API
- Next.js API Routes

**Deployment:**
- Vercel
- GitHub Actions CI/CD

---

## 🔑 Environment Variables

\`\`\`env
# Supabase (Required)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# FMCSA (Required)
FMCSA_WEBKEY=your_fmcsa_webkey

# Stripe (Optional - future)
STRIPE_SECRET_KEY=your_stripe_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_publishable_key
\`\`\`

---

## 🚀 Deployment

### Vercel (Recommended)

\`\`\`bash
# Option 1: Quick deploy
./scripts/deploy.sh

# Option 2: Vercel CLI
npm i -g vercel
vercel --prod
\`\`\`

### Manual Deployment

1. Push to GitHub
2. Import to Vercel dashboard
3. Configure environment variables
4. Deploy!

**Full guide**: [DEPLOYMENT.md](DEPLOYMENT.md)

---

## 🧪 Testing

\`\`\`bash
# Test FMCSA integration
npm run test:fmcsa 3962493

# Build validation
npm run build

# Linting
npm run lint
\`\`\`

---

## 📂 Project Structure

\`\`\`
dot-risk-radar/
├── app/                      # Next.js app directory
│   ├── (dashboard)/         # Protected routes
│   ├── auth/                # Auth callbacks
│   ├── login/               # Login page
│   ├── signup/              # Signup page
│   └── page.tsx             # Landing page
├── components/              # React components
│   └── ui/                  # shadcn-ui components
├── lib/                     # Core libraries
│   ├── fmcsa/              # FMCSA integration
│   ├── risk/               # Risk scoring engine
│   ├── supabase/           # Supabase clients
│   └── constants/          # App constants
├── supabase/               # Database migrations
├── scripts/                # Utility scripts
└── docs/                   # Documentation
\`\`\`

---

## 🎨 Design Guidelines

- **Aesthetic**: Calm Enterprise (slate-950 background, muted blues)
- **Language**: "Operation" or "Carrier" (inclusive of owner-operators)
- **Risk Levels**: High, Elevated, Low only
- **No Hype**: Avoid "AI-powered", "real-time", "critical"

---

## 📝 License

MIT License - see [LICENSE](LICENSE) file for details

---

## 🤝 Contributing

Contributions welcome! Please read our contributing guidelines first.

---

## 📧 Support

- **Issues**: [GitHub Issues](https://github.com/chrisgilbert722/dot-risk-radar/issues)
- **Documentation**: See [docs/](docs/) folder
- **Email**: [Your support email]

---

## 🌟 Acknowledgments

Built with:
- [Next.js](https://nextjs.org/)
- [Supabase](https://supabase.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn-ui](https://ui.shadcn.com/)

---

**Status**: ✅ Production Ready | **Version**: 0.1.0
