# Helios Labs Showcase - TODO

Last updated: 2026-02-06

---

## Immediate Priority (Get It Running)

- [ ] **Fix node_modules** (if experiencing issues)
  ```bash
  cd /Users/owenhobbs/dev/helioslabs.io
  rm -rf node_modules package-lock.json .next
  npm install
  npm run dev
  ```

- [ ] **Verify all pages load** - Test each route in browser:
  - [ ] `/` - Landing page (minimal resume-style)
  - [ ] `/dashboard` - Live performance dashboard
  - [ ] `/system` - System architecture overview
  - [ ] `/backtests` - Backtest gallery (legacy, may need update)
  - [ ] `/about` - About page (legacy, may need update)

- [ ] **Fix any TypeScript/build errors** - Run `npm run build` to check

---

## Completed

- [x] **Story-driven homepage redesign (v2)**
  - Light theme (white background)
  - Monospace font throughout for tech-forward aesthetic
  - Development workflow visualization with 5 connected steps
  - Live results section with sparkline chart
  - AI Agent Framework section with terminal-style output
  - Code architecture tree view
  - Roadmap section for future development
  - Consistent styling across all pages

- [x] **New minimal design implemented (v1)**
  - Dark theme (#0a0a0a background)
  - JetBrains Mono for data, Montserrat for headings
  - Resume-style single-scroll homepage
  - Sparkline equity chart on homepage

- [x] **Homepage redesign** (`/src/app/page.tsx`)
  - Hero with live trading indicator
  - Performance metrics with sparkline
  - The System (5 numbered steps)
  - AI Agents section
  - Technology stack
  - Minimal header/footer

- [x] **Dashboard page** (`/src/app/dashboard/page.tsx`)
  - Market cards (BTC-USD, ETH-USD)
  - Full equity curve with drawdown
  - Performance metrics grid
  - Recent trades table
  - System health status

- [x] **System page** (`/src/app/system/page.tsx`)
  - Data flow visualization
  - Technology stack cards
  - AI agents with triggers
  - Optimization stats
  - Code architecture modules
  - Design patterns

- [x] **SparklineChart component** - Minimal chart for homepage
- [x] **EquityCurve component** - Full chart with drawdown toggle
- [x] **Updated globals.css** - New color palette and typography
- [x] **Layout simplified** - Removed shared Header/Footer (pages manage their own)

---

## Before Sharing/Demo

- [ ] **Update contact links** in all pages:
  - GitHub: Replace `github.com/heliolabs` with real URL
  - LinkedIn: Add real profile URL
  - Email: Confirm `contact@helioslabs.io` or use personal email

- [ ] **Review mock data** - Ensure numbers are realistic
  - Current: ~7.8% return, 59.6% win rate, 1.87 Sharpe
  - Adjust in `src/lib/mock-data.ts` if needed

- [ ] **Delete old routes** (optional cleanup):
  - `/src/app/live` - replaced by `/dashboard`
  - `/src/app/architecture` - replaced by `/system`
  - Update or remove `/backtests` and `/about` pages

- [ ] **Test mobile responsiveness** - Check on phone/tablet viewport

---

## Deployment

### GitHub
- [ ] Create GitHub repository (public or private)
- [ ] Push code: `git add . && git commit -m "Initial commit" && git push`

### Vercel
- [ ] Sign up at [vercel.com](https://vercel.com) (free tier)
- [ ] Import GitHub repository
- [ ] Configure environment variables (can leave empty for demo mode)
- [ ] Deploy

### Domain (Optional)
- [ ] Purchase domain (e.g., helioslabs.io, ~$40/year for .io)
- [ ] Add custom domain in Vercel project settings
- [ ] Configure DNS records

---

## Supabase Setup (For Production)

- [ ] Create Supabase account at [supabase.com](https://supabase.com)
- [ ] Create new project
- [ ] Go to SQL Editor, run `supabase/schema.sql`
- [ ] Copy project URL and anon key
- [ ] Add to Vercel environment variables:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] Redeploy on Vercel

---

## Helios Integration (Future)

### Webhook Module
Create `helios/integrations/webhook.py`:

```python
import hmac
import hashlib
import httpx
from dataclasses import dataclass

@dataclass
class WebhookConfig:
    enabled: bool
    endpoint: str
    secret: str

class WebhookNotifier:
    def __init__(self, config: WebhookConfig):
        self.config = config
        self.client = httpx.AsyncClient()

    def _sign(self, payload: str) -> str:
        return hmac.new(
            self.config.secret.encode(),
            payload.encode(),
            hashlib.sha256
        ).hexdigest()

    async def send_trade(self, trade: dict) -> bool:
        if not self.config.enabled:
            return True

        payload = json.dumps(trade)
        signature = self._sign(payload)

        response = await self.client.post(
            self.config.endpoint,
            json=trade,
            headers={"X-Webhook-Secret": signature}
        )
        return response.status_code == 200
```

### Modify TradeRecorder
In `helios/strategies/trade_recorder.py`, add webhook dispatch:

```python
async def record_trade(self, trade: TradeRecord):
    # Existing CSV write logic...

    # NEW: Send to webhook if configured
    if self.webhook_notifier:
        sanitized = self._sanitize_trade(trade)
        await self.webhook_notifier.send_trade(sanitized)
```

### Data Migration Scripts
- [ ] Create script to import trades from `data/live_results/*/trades.csv`
- [ ] Create script to import optimization results from `data/optimization_results/*/summary.json`

---

## Nice-to-Have Enhancements

### UI/UX
- [ ] Add loading states/skeletons
- [ ] Add page transitions/animations
- [ ] Add favicon and social preview image
- [ ] Add "Last updated" timestamp to dashboard

### Features
- [ ] Add trade filtering (by market, date range)
- [ ] Add equity curve zoom/pan
- [ ] Add monthly returns heatmap
- [ ] Add trade distribution histogram

### Analytics
- [ ] Add Vercel Analytics
- [ ] Add error tracking (Sentry)

---

## Project Structure

```
helioslabs.io/
├── src/
│   ├── app/
│   │   ├── page.tsx           # Homepage (minimal resume-style)
│   │   ├── dashboard/         # Live performance dashboard
│   │   ├── system/            # System architecture
│   │   ├── backtests/         # Backtest gallery (legacy)
│   │   ├── about/             # About page (legacy)
│   │   ├── api/               # API routes
│   │   ├── layout.tsx         # Root layout (minimal)
│   │   └── globals.css        # Global styles
│   ├── components/
│   │   ├── charts/
│   │   │   ├── SparklineChart.tsx
│   │   │   └── EquityCurve.tsx
│   │   ├── layout/            # Header/Footer (legacy)
│   │   └── ui/                # shadcn components
│   └── lib/
│       ├── mock-data.ts       # Demo data
│       ├── types.ts           # TypeScript types
│       └── utils.ts
├── supabase/
│   └── schema.sql             # Database schema
├── DESIGN_PROPOSAL.md         # Design philosophy
├── README.md                  # Project overview
├── SETUP.md                   # Setup instructions
└── TODO.md                    # This file
```

---

## Commands Cheatsheet

```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm run lint         # Run linter

# Git
git status
git add .
git commit -m "message"
git push

# Clean reinstall
rm -rf node_modules package-lock.json .next
npm install
```
