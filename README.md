# Helios Labs - Algorithmic Trading Showcase

A professional web application showcasing the Helios algorithmic trading system, demonstrating AI-assisted strategy development, rigorous backtesting/optimization, and live trading capabilities.

**Target Audience**: Potential investors, employers, and technical recruiters.

---

## Quick Start

```bash
# Clean install (recommended if you have issues)
rm -rf node_modules package-lock.json
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the showcase.

---

## What's Been Built

### Pages

| Page | Route | Description |
|------|-------|-------------|
| **Landing** | `/` | Hero section, key metrics, equity chart preview, workflow, features |
| **Live Performance** | `/live` | Real-time dashboard with market cards, equity curve, trades table |
| **Backtests** | `/backtests` | Optimization runs, methodology, constraint filtering, top results |
| **Architecture** | `/architecture` | System overview, tech stack, AI agents, data flow, code patterns |
| **About** | `/about` | Skills, project goals, privacy note, contact links |

### Components

- **Header** - Navigation with mobile menu
- **Footer** - Brand, social links, copyright
- **EquityCurve** - Interactive Recharts chart with drawdown

### API Routes

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/markets` | GET | List trading markets |
| `/api/trades` | GET | Recent trades (supports `?limit=N`) |
| `/api/performance` | GET | Current performance metrics |
| `/api/equity` | GET | Equity curve data (supports `?days=N`) |
| `/api/optimization` | GET | Optimization run history |
| `/api/health` | GET | System health status |
| `/api/webhook/trade` | POST | Receive trades from Helios (requires auth) |

### Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: TailwindCSS 4 + shadcn/ui
- **Charts**: Recharts
- **Icons**: Lucide React
- **Database**: Supabase (PostgreSQL) - schema ready
- **Deployment**: Vercel-ready

---

## Project Structure

```
helioslabs.io/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Landing page
│   │   ├── layout.tsx            # Root layout
│   │   ├── globals.css           # Dark theme styles
│   │   ├── live/page.tsx         # Live dashboard
│   │   ├── backtests/page.tsx    # Backtest gallery
│   │   ├── architecture/page.tsx # Technical deep-dive
│   │   ├── about/page.tsx        # About/contact
│   │   └── api/                  # API routes
│   ├── components/
│   │   ├── ui/                   # shadcn components
│   │   ├── charts/               # Chart components
│   │   └── layout/               # Header, Footer
│   └── lib/
│       ├── types.ts              # TypeScript interfaces
│       ├── mock-data.ts          # Demo data
│       ├── db.ts                 # Database client
│       └── utils.ts              # Utilities
├── supabase/
│   └── schema.sql                # Database schema
├── .env.example                  # Environment template
├── SETUP.md                      # Detailed setup guide
├── TODO.md                       # Remaining tasks
└── package.json
```

---

## What Still Needs To Be Done

See **TODO.md** for the complete checklist. Summary:

### Immediate (Before Demo)
- [ ] Fix node_modules and verify app runs
- [ ] Test all pages render correctly
- [ ] Update contact links with real URLs

### Deployment
- [ ] Push to GitHub repository
- [ ] Deploy to Vercel
- [ ] Set up Supabase project
- [ ] Configure custom domain

### Helios Integration
- [ ] Create webhook module in Helios
- [ ] Import historical trade data
- [ ] Import optimization results
- [ ] Test webhook endpoint

---

## Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

| Variable | Description | When Needed |
|----------|-------------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Production |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key | Production |
| `WEBHOOK_SECRET` | Webhook authentication | Helios integration |

---

## Design Decisions

- **Dark Theme**: Professional trading aesthetic (inspired by nof1.ai Alpha Arena)
- **Mock Data**: Realistic demo data for showcase without exposing real trades
- **Privacy**: Trade data delayed, parameters sanitized, sizes hidden
- **Serverless**: Next.js API routes for low-cost, scalable backend

---

## Links

- **Setup Guide**: [SETUP.md](./SETUP.md)
- **TODO List**: [TODO.md](./TODO.md)
- **Database Schema**: [supabase/schema.sql](./supabase/schema.sql)

---

## License

Private project - not for distribution.
