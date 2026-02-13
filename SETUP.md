# Helios Labs Showcase - Setup Guide

## Overview

This document outlines the steps needed to fully deploy the Helios Labs showcase platform - a professional web application demonstrating an AI-assisted algorithmic trading system.

**Live Demo**: [helioslabs.io](https://helioslabs.io) (once deployed)

---

## Quick Start (Local Development)

```bash
cd helioslabs.io
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the showcase.

---

## Project Structure

```
helioslabs.io/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── page.tsx            # Home / Landing page
│   │   ├── live/page.tsx       # Live Performance Dashboard
│   │   ├── backtests/page.tsx  # Backtest Results Gallery
│   │   ├── architecture/page.tsx # System Architecture
│   │   ├── about/page.tsx      # About / Contact
│   │   └── api/                # API Routes
│   │       ├── markets/
│   │       ├── trades/
│   │       ├── performance/
│   │       ├── equity/
│   │       ├── optimization/
│   │       ├── health/
│   │       └── webhook/trade/
│   ├── components/
│   │   ├── ui/                 # shadcn/ui components
│   │   ├── charts/             # Recharts components
│   │   └── layout/             # Header, Footer
│   └── lib/
│       ├── types.ts            # TypeScript types
│       ├── mock-data.ts        # Demo data
│       ├── db.ts               # Database client
│       └── utils.ts            # Utility functions
├── supabase/
│   └── schema.sql              # Database schema
├── public/                     # Static assets
├── .env.example                # Environment template
└── SETUP.md                    # This file
```

---

## Prerequisites

- **Node.js 18+** - JavaScript runtime
- **npm** - Package manager
- **Supabase account** - Free tier works (for production)
- **Vercel account** - For deployment (free tier)
- **Domain name** - helioslabs.io or similar

---

## Environment Variables

Copy `.env.example` to `.env.local` and configure:

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | For production |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | For production |
| `WEBHOOK_SECRET` | Secret for webhook authentication | For Helios integration |

---

## Deployment Checklist

### 1. Supabase Setup

1. Create account at [supabase.com](https://supabase.com)
2. Create new project
3. Go to **SQL Editor** in dashboard
4. Copy and run `supabase/schema.sql`
5. Copy project URL and anon key to environment variables

### 2. Vercel Deployment

1. Push code to GitHub repository
2. Import project in [vercel.com](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy

### 3. Domain Configuration

1. Purchase domain (e.g., helioslabs.io)
2. Add custom domain in Vercel project settings
3. Configure DNS:
   - A record: `@` → Vercel IP
   - CNAME record: `www` → `cname.vercel-dns.com`

---

## Helios Integration (Future Work)

### Webhook Setup

The showcase receives live trade data via webhooks from the Helios trading system.

**Endpoint**: `POST /api/webhook/trade`
**Headers**: `X-Webhook-Secret: {secret}`

**Payload**:
```json
{
  "market": "BTC-USD",
  "session_id": "sess_001",
  "trade": {
    "entry_time": "2025-01-15T10:30:00Z",
    "exit_time": "2025-01-15T11:45:00Z",
    "direction": "LONG",
    "entry_price": 102450.00,
    "exit_price": 103125.50,
    "pnl_pct": 0.66,
    "exit_reason": "take_profit"
  }
}
```

### Required Helios Changes

1. **Create `helios/integrations/webhook.py`**:
   ```python
   class WebhookNotifier:
       def __init__(self, endpoint: str, secret: str):
           self.endpoint = endpoint
           self.secret = secret

       def send_trade(self, trade: TradeRecord) -> bool:
           # POST trade data with HMAC signature
           pass
   ```

2. **Modify TradeRecorder** to call webhook on trade completion

3. **Add webhook config** to production configuration:
   ```json
   {
     "webhook": {
       "enabled": true,
       "endpoint": "https://helioslabs.io/api/webhook/trade",
       "secret": "${WEBHOOK_SECRET}"
     }
   }
   ```

### Data Migration Scripts

TODO: Create scripts to import:
- Historical trades from `data/live_results/*/trades.csv`
- Optimization results from `data/optimization_results/*/summary.json`
- Backtest results from `data/backtest_results/*/summaries/summary.json`

---

## Security Checklist

- [ ] Webhook secret is unique and secure (32+ chars)
- [ ] Supabase RLS policies are enabled
- [ ] No sensitive parameters exposed in UI
- [ ] Trade data is time-delayed (15-30 min)
- [ ] CORS configured for production domain only
- [ ] Environment variables not committed to git

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 14 (App Router) |
| Styling | TailwindCSS 4 + shadcn/ui |
| Charts | Recharts |
| Database | Supabase (PostgreSQL) |
| Deployment | Vercel |
| Icons | Lucide React |

---

## Cost Estimate (Monthly)

| Service | Tier | Cost |
|---------|------|------|
| Vercel | Hobby | $0 |
| Supabase | Free | $0 |
| Domain | .io | ~$40/year |
| **Total** | | **~$3/month** |

For higher traffic, Vercel Pro ($20/mo) and Supabase Pro ($25/mo) may be needed.

---

## Support

For questions or issues:
- GitHub: [github.com/heliolabs](https://github.com/heliolabs)
- Email: contact@helioslabs.io
