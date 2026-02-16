# Claude Code Reference for helios.owen-hobbs.com

This file provides Claude Code with essential context for working on the Helios Labs showcase website. Read this before making any changes.

---

## What This Site Is

**helios.owen-hobbs.com** is a portfolio showcase website for an algorithmic trading system called Helios. It tells the story: "I rigorously tested this system (backtest results) → I'm now trading it live (transparent results)."

The site exists to impress **four audiences simultaneously**:

1. **Investors** — Want to see risk-adjusted returns, drawdown control, systematic methodology, and evidence the system works before real capital was deployed
2. **Employers** — Want to see engineering rigor, full-stack capability, clean architecture, and the ability to ship a complex system end-to-end
3. **Professional Traders** — Want to see realistic metrics (not cherry-picked), honest live results even when negative, proper optimization methodology, and IP protection
4. **Web/App Designers** — Want to see clean UI, responsive design, fast load times, scalable data architecture, and thoughtful UX

Every decision — what data to show, how to present it, what to hide — should be evaluated against all four viewpoints.

**Critical assumption: Most visitors are NOT deeply technical.** An investor may not know what a Sharpe ratio is. An employer may not understand Z-scores. The site must communicate clearly to both technical and non-technical audiences. Use plain language first, technical detail second. When in doubt, add a one-line explanation.

---

## Audience Communication Guide

Not everyone viewing this site has the same background. Here's how to communicate with each audience:

### Writing for Non-Technical Viewers
- **Lead with outcomes, not methods.** "107% return over 7 months" before "Sharpe ratio of 3.13"
- **Explain jargon inline.** "Sharpe Ratio (risk-adjusted return)" not just "Sharpe Ratio"
- **Use analogies.** "Max Drawdown is the worst peak-to-trough decline — how much you'd have lost at the worst moment"
- **Visual hierarchy matters.** Big green/red numbers catch eyes before labels do
- **Tooltips and subtexts** are the right place for technical detail — not the headline

### TLDR for Each Metric (use as subtexts/tooltips)
| Metric | TLDR for Non-Technical Viewer |
|--------|-------------------------------|
| Sharpe Ratio | How much return you get per unit of risk. Above 2.0 is excellent. |
| Max Drawdown | The worst drop from peak. Lower is better — shows risk control. |
| Win Rate | Percentage of trades that made money. |
| ROI / Total Return | Total profit as a percentage of starting capital. |
| Avg Win / Avg Loss | How much a typical winning trade makes vs. what a losing trade costs. |
| Combinations Tested | How many different parameter settings were systematically evaluated. |
| Passed Constraints | How many settings met minimum quality standards (not cherry-picked). |

### What Each Audience Cares About Most
| Audience | Primary Interest | Secondary Interest |
|----------|-----------------|-------------------|
| Investor | Risk-adjusted returns (Sharpe, DD) | Methodology rigor, sample size |
| Employer | End-to-end engineering | Architecture decisions, code quality |
| Trader | Realistic metrics, honest reporting | Optimization methodology, edge evidence |
| Non-technical | "Does it work?" (Return %) | Clean design, clear explanations |

### Design Rule: Progressive Disclosure
Show information in layers:
1. **Headline**: One big number (e.g., "+107% Return")
2. **Context**: Brief label (e.g., "7-month backtest · BTC-USD 15m")
3. **Detail**: Supporting metrics grid (Sharpe, DD, Win Rate, Trades)
4. **Deep dive**: Full trades table, optimization summary, equity curve

This way a non-technical viewer gets the story in 2 seconds, while a trader can dig into every trade.

---

## The Helios Workflow (What the Site Showcases)

```
1. STRATEGY DESIGN     → Define hypothesis, entry/exit rules, indicators
2. BUILD               → Matching backtest + live trading implementations
3. OPTIMIZE            → Parameter sweeps with constraint filtering
4. TEST/VERIFY         → Paper trading, out-of-sample validation
5. LIVE DEPLOYMENT     → Real capital on dYdX v4
6. MONITOR (AGENTS)    → AI-powered continuous monitoring with Claude
7. REPEAT              → Refine based on live performance data
```

The site is NOT just a dashboard — it's a narrative that walks viewers through this entire lifecycle.

---

## Available Data (Reference During Build)

Claude Code has read access to the full Helios data directory at **`/Users/owenhobbs/dev/nautilus_trader/data/`**. Use this to verify metrics, find new data to import, review agent feedback, and ensure the website accurately represents reality.

```
nautilus_trader/data/
├── backtest_results/            # 43 test suites, 597K+ files
│   ├── BTCUSDT_15m_20250701-20260127/    # Current best (ProScore2 R004)
│   ├── BTCUSDT_15m_20250918-20251204/    # Older BTC runs
│   ├── ETHUSDT_15m_20250701-20260210/    # ETH runs
│   └── [40 more date-range directories]
│   Each contains: trades.csv, summaries/summary.json, data.csv, htmlreports/, images/
│
├── optimization_results/        # 84 optimization runs, 320 files
│   ├── proscore2_btc_15m_004_20260209_142646/   # Current best (imported)
│   ├── proscore2_eth_15m_001_20260209_213340/   # ETH optimization
│   └── [82 more optimization directories]
│   Each contains: summary.json, config.yaml, results.csv, results.json
│
├── monitoring/                  # 427 agent feedback files
│   ├── backtest_comparison_*.md       # ~208 comparison reports
│   ├── bug_detection_*.md             # Hourly bug detection reports
│   ├── supervisor_report_*.md         # Supervisor analysis reports
│   └── backtest_comparison/           # 10 comparison test suites
│
├── live_results/                # 11 live trading sessions
│   ├── BTCUSD_all_trades.csv          # Aggregated BTC live trades (canonical)
│   ├── ETHUSD_all_trades.csv          # Aggregated ETH live trades
│   └── BTCUSD_15m_20260204_054003/    # Most recent live session
│
├── historical/                  # 11 market data CSVs
│   ├── BTCUSDT_15m_20250701-202610127.csv  # 7-month BTC data
│   └── ETHUSDT_15m_20250701_20260210.csv   # 7-month ETH data
│
└── logs/
    └── trading_proscore.log     # 3.2MB active trading log
```

### How to Use This Data
- **Verify website metrics**: Read a `summary.json` to confirm the Sharpe/ROI/DD shown on the site matches reality
- **Find new backtests to import**: Browse `backtest_results/` for strong results worth showcasing
- **Read agent feedback**: Review `monitoring/supervisor_report_*.md` files for system health insights that could inform UI content
- **Import new data**: Use the import script with any backtest or optimization folder path
- **Check live trading status**: Read `live_results/BTCUSD_all_trades.csv` for current live trade count and performance
- **Cross-reference optimization configs**: Read `config.yaml` files to understand what constraints were used (safe to show constraint names and thresholds)

### What NOT to Extract From This Data
- Strategy parameters from `summary.json` → `strategy_parameters` section
- Parameter ranges from `config.yaml` → `parameters` section
- Individual results from `results.csv` (contains full parameter combos)
- Any Z-score, momentum, or indicator values from trade data

---

## Tech Stack

| Layer | Technology | Notes |
|-------|-----------|-------|
| Framework | Next.js 16.1.6 (App Router) | TypeScript strict, Turbopack |
| Styling | Tailwind CSS v4 + shadcn/ui | Dark monospace aesthetic |
| Charts | Recharts 3.7 | EquityCurve (full) + SparklineChart (mini) |
| Database | Supabase (PostgreSQL) | With mock data fallback |
| Icons | Lucide React | |
| Fonts | Geist Sans/Mono | |
| Import Scripts | Python + supabase-py | Via `scripts/import_supabase_data.py` |

---

## Project Structure

```
helios.owen-hobbs.com/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Homepage: hero + workflow + results toggle + tech + agents
│   │   ├── dashboard/page.tsx    # Dashboard: backtest/live toggle + charts + metrics + trades
│   │   ├── system/page.tsx       # Architecture: data flow + tech stack + agents + patterns
│   │   ├── about/page.tsx        # About: skills + goals + contact
│   │   ├── layout.tsx            # Root layout with metadata
│   │   ├── globals.css           # Tailwind + custom properties + animations
│   │   └── api/
│   │       ├── trades/route.ts       # GET /api/trades?source=backtest&limit=20
│   │       ├── equity/route.ts       # GET /api/equity?source=backtest&days=365
│   │       ├── performance/route.ts  # GET /api/performance?source=backtest
│   │       ├── optimization/route.ts # GET /api/optimization
│   │       ├── markets/route.ts      # GET /api/markets
│   │       ├── health/route.ts       # GET /api/health
│   │       └── webhook/trade/route.ts # POST webhook receiver
│   ├── components/
│   │   ├── charts/
│   │   │   ├── EquityCurve.tsx       # Full equity + drawdown chart (dual Y-axis)
│   │   │   └── SparklineChart.tsx    # Mini sparkline for homepage
│   │   ├── display/                  # Shared display components (used across pages)
│   │   │   ├── SectionHeading.tsx    # Consistent section headings with optional action
│   │   │   ├── MetricCard.tsx        # Metric display (default + bordered variants)
│   │   │   ├── InfoCard.tsx          # Title+description cards (default + compact variants)
│   │   │   ├── StepIndicator.tsx     # Timeline + numbered step layouts
│   │   │   ├── ViewToggle.tsx        # Backtest/live toggle (sm + md sizes)
│   │   │   ├── SystemStatus.tsx      # System health indicator
│   │   │   └── MarketCard.tsx        # Market performance card with position badge
│   │   ├── layout/
│   │   │   ├── Header.tsx            # Global nav: Home, Dashboard, System, About
│   │   │   └── Footer.tsx
│   │   └── ui/                       # shadcn components (badge, button, card, table, tabs)
│   └── lib/
│       ├── types.ts                  # All TypeScript interfaces
│       ├── format.ts                 # Shared formatting (prices, PnL, dates, etc.)
│       ├── db.ts                     # Supabase client + mock data fallback
│       ├── mock-data.ts              # Demo data for when Supabase isn't configured
│       └── utils.ts                  # cn() helper
├── scripts/
│   ├── import_supabase_data.py       # Unified import: backtest + optimization
│   └── import_supabase_trades.py     # Legacy live trade importer
├── supabase/
│   ├── schema.sql                    # Full database schema
│   └── migrations/                   # Incremental migrations
├── next.config.ts                    # Redirects: /live→dashboard, /backtests→dashboard, /architecture→/system
└── .env.local                        # Supabase credentials (never commit)
```

---

## Site Flow (Pages)

| Page | URL | Purpose | Default View |
|------|-----|---------|-------------|
| Homepage | `/` | First impression: hero + workflow + results toggle + tech stack + agents | Backtest results |
| Dashboard | `/dashboard` | Deep dive: equity curve + metrics + trades table + optimization summary | `?view=backtest` |
| System | `/system` | Architecture: data flow + tech cards + agent framework + code structure | — |
| About | `/about` | Skills demonstrated + project goals + contact info | — |

**Redirects**: `/live` → `/dashboard?view=live`, `/backtests` → `/dashboard?view=backtest`, `/architecture` → `/system`

---

## Data Architecture

### Source Toggle
All data APIs accept `?source=backtest` (default) or `?source=live`. This is the core UX pattern — visitors toggle between strong backtest evidence and transparent live results.

### Database Tables (Supabase)
- **markets** — Trading pair definitions (BTC-USD, etc.)
- **trading_sessions** — Session records with mode: `paper | live | backtest`
- **trades** — Individual trades with `source: 'backtest' | 'live'`
- **daily_snapshots** — Daily equity snapshots with `source` column
- **optimization_runs** — Headline optimization metrics (safe to show)

### Current Data in Production
- **43 backtest trades** — ProScore2 R004, Jul 2025–Jan 2026, Sharpe 3.13, ROI 107%
- **5 live trades** — Feb 2026, -6.6% return (transparent, honest)
- **1 optimization run** — 3,750 combinations, 3,027 passed (80.7%)
- **209 backtest daily snapshots** — 7-month equity curve
- **12 live daily snapshots** — 2-week equity curve

### Mock Data Fallback
If Supabase isn't configured (no env vars), all APIs return mock data from `src/lib/mock-data.ts`. This ensures the site always renders for development and demos.

### Adding New Data
```bash
# Import a new backtest result
python scripts/import_supabase_data.py backtest /path/to/backtest_folder/

# Import a new optimization summary
python scripts/import_supabase_data.py optimization /path/to/optimization_folder/
```

The import script:
- Reads `summaries/summary.json` (or `summary.json`) and `trades.csv`
- Strips sensitive columns (Z-scores, position sizes, dollar PnL, fees, bar indices)
- Generates deterministic IDs (hash of entry_time + direction + source)
- Creates daily snapshots from cumulative trade PnL
- Upserts into Supabase (safe to re-run)

**Backtest folder structure expected:**
```
backtest_folder/
├── summaries/summary.json    # (or summary.json at root)
└── trades.csv                # Columns: entry_time, type, entry_price, exit_price, pnl_pct, exit_reason, ...
```

**Optimization folder structure expected:**
```
optimization_folder/
└── summary.json              # Contains config.constraints, best_result, total_combinations, passed_constraints
```

---

## IP Protection Rules

This is critical. The system's edge is in its parameters and signal logic. **Never expose:**

| NEVER SHOW | WHY |
|------------|-----|
| strategy_parameters | Reveals exact trading logic |
| Z-scores (entry_zscore, exit_zscore) | Signal generation values |
| Momentum values (entry_momentum) | Directional filter details |
| Parameter ranges/values from optimization | Can be reverse-engineered |
| Position sizes (size field) | Reveals account size |
| Dollar PnL (pnl field) | Reveals account size |
| Fees (entry_fee, exit_fee, total_fees) | Reveals trading volume |
| Bar indices (entry_bar_idx) | Implementation detail |
| ATR multipliers, SMA drift values | Strategy parameters |

**Safe to show:**

| SAFE TO SHOW | WHY |
|-------------|-----|
| Direction (LONG/SHORT) | Public information once trade exits |
| Entry/exit prices | Public market data |
| PnL % (pnl_pct) | Percentage doesn't reveal account size |
| Exit reason (mean_reversion, atr_sl, atr_tp) | Generic category names |
| Timestamps | Public information |
| Headline optimization metrics | Total combinations, pass rate, constraint names |
| Constraint criteria names + thresholds | Filtering thresholds, not strategy params |

---

## Design Principles

### Visual Language
- **Monospace-forward**: Terminal/data aesthetic using SFMono-Regular, Menlo, Consolas
- **Dark backgrounds** with clean borders (not heavy shadows)
- **Green (#16a34a)** for profits/positive, **Red (#dc2626)** for losses/negative
- **Muted foreground** for labels, **full foreground** for values
- **Minimal chrome**: No unnecessary decoration, let data breathe
- **Pulse-dot animation** for live indicators (green dot)

### UX Patterns
- **Backtest as default view** — Show the strongest evidence first while live track record is short
- **Toggle stored in URL** — `?view=backtest|live` for shareability
- **Loading states** — Show "Loading {view} data..." not blank screens
- **Mock data fallback** — Site always renders, even without Supabase
- **1-hour delay on live data** — Real trades delayed for IP protection
- **Context banners** — "ProScore2 | BTC-USD 15m | Jul 2025 – Jan 2026 | 20,240 candles"

### Component Patterns
- Shared display components live in `src/components/display/` — `SectionHeading`, `MetricCard`, `InfoCard`, `StepIndicator`, `ViewToggle`, `SystemStatus`, `MarketCard`
- Shared formatting utilities live in `src/lib/format.ts` — `formatPrice`, `formatPnlPct`, `formatReturn`, `formatTradeTime`, `formatExitReason`, `formatBalance`
- Page-specific components (e.g. `ModuleCard` in system page) stay inline in their page file
- Charts use Recharts with `ResponsiveContainer` for fluid sizing
- `useSearchParams()` requires `<Suspense>` boundary in Next.js 16
- All pages that use `useSearchParams` must wrap content in Suspense

---

## Development Commands

```bash
npm run dev        # Start dev server (Turbopack)
npm run build      # Production build (checks TypeScript + generates static pages)
npm run lint       # ESLint
```

### Build Verification
Always run `npm run build` before deploying. It catches:
- TypeScript errors
- Missing Suspense boundaries for `useSearchParams()`
- Static generation failures
- Import errors

---

## Decision Framework: "Should I show this data?"

When adding any new data point or metric to the UI, run through this checklist:

1. **IP Protection**: Does this reveal strategy parameters, signal logic, or account size? → **Don't show it**
2. **Investor Value**: Would an investor want to see this to evaluate the system? → Show it prominently
3. **Employer Value**: Does this demonstrate engineering skill or systematic thinking? → Show it
4. **Trader Credibility**: Would a professional trader find this metric meaningful or would they see it as vanity? → Only show meaningful metrics
5. **Design Clarity**: Does adding this make the page clearer or more cluttered? → Prefer clarity

### Metric Priority (what matters most)
1. **Sharpe Ratio** — Risk-adjusted return (the gold standard)
2. **Max Drawdown** — Risk control evidence
3. **Total Return %** — Headline number
4. **Win Rate** — Consistency indicator
5. **Trade Count** — Statistical significance
6. **Avg Win / Avg Loss** — Reward-to-risk ratio

---

## Scalability Notes

### Adding a New Strategy
1. Run backtest → `python scripts/import_supabase_data.py backtest /path/to/results/`
2. Run optimization → `python scripts/import_supabase_data.py optimization /path/to/optimization/`
3. Data appears automatically in dashboard (queries by source, not strategy name)
4. For multi-strategy support, add a `strategy` filter to APIs and UI

### Adding a New Market
1. Import script already creates market records
2. Dashboard currently hardcodes "BTC-USD" — would need to be made dynamic
3. API routes query by `market_id` — already supports multiple markets

### When Live Results Improve
Once live track record is strong enough (positive returns, 20+ trades):
- Consider switching default view to `live`
- Add a comparison view showing backtest vs live side-by-side
- Remove the "1-hour delay" for older trades (keep delay for recent only)

---

## Common Tasks

### "Add a new backtest result"
```bash
python scripts/import_supabase_data.py backtest /path/to/folder/
```
Then verify: `curl localhost:3000/api/trades?source=backtest`

### "Update live trades"
Live trades are ingested automatically via the webhook at `POST /api/webhook/trade`. The trading system sends completed trades to this endpoint, which upserts them into Supabase and rebuilds the equity curve snapshots.

**Manual fallback** (if webhook is unavailable):
```bash
python scripts/import_supabase_trades.py
```
This reads from the canonical live trades CSV and upserts into Supabase.

### "Change the default view"
Edit the `source` default in each API route file (`src/app/api/*/route.ts`):
```typescript
const source = searchParams.get('source') || 'backtest';  // Change to 'live' when ready
```
And update the homepage default state:
```typescript
const [view, setView] = useState<ViewMode>('backtest');  // Change to 'live'
```

### "Add a new page"
1. Create `src/app/pagename/page.tsx`
2. Add to `navLinks` array in `src/components/layout/Header.tsx`
3. If using URL params, wrap in `<Suspense>`

### "Run the migration on a fresh Supabase instance"
Run `supabase/schema.sql` in the SQL Editor — it creates all tables, indexes, and RLS policies.

---

## Environment Variables

```bash
# Required for Supabase connection (site works without these using mock data)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_xxx
SUPABASE_SERVICE_ROLE_KEY=sb_secret_xxx          # Server-side only, for import scripts

# Optional
WEBHOOK_SECRET=your_webhook_secret_here           # For /api/webhook/trade
```

Never commit `.env.local`. The `.env.example` file documents required variables.

---

## Quality Checklist (Before Any Deploy)

### Build & Code
- [ ] `npm run build` passes with zero errors
- [ ] No TypeScript warnings in changed files
- [ ] Suspense boundaries wrap any `useSearchParams()` usage
- [ ] Mock data fallback works (test by removing env vars)

### Data Integrity
- [ ] `?source=backtest` returns backtest trades (no live data mixed in)
- [ ] `?source=live` returns live trades with 1-hour delay applied
- [ ] No sensitive fields in any API response (size, pnl, Z-scores, etc.)
- [ ] Optimization runs show headline metrics only (no strategy_parameters)

### UX / All Four Viewpoints
- [ ] **Investor**: Can they see Sharpe, drawdown, return within 5 seconds?
- [ ] **Employer**: Does the site feel polished and professionally built?
- [ ] **Trader**: Are metrics honest? Are negative live results shown transparently?
- [ ] **Non-technical**: Are big numbers clear? Is jargon explained?
- [ ] Toggle works: backtest → live → backtest, URL updates, data refreshes
- [ ] Mobile responsive: toggle, metrics grid, and trades table work on small screens
- [ ] Loading states shown during data fetches (no blank/broken screens)
- [ ] Footer reflects the correct data context per view

### Cross-Page Consistency
- [ ] Homepage results section matches dashboard numbers for same view
- [ ] Navigation links work from every page
- [ ] Redirects work: `/live`, `/backtests`, `/architecture` all redirect correctly

---

## Future Considerations

### When to Flip the Default View to Live
Switch from `backtest` to `live` as the default when ALL of these are true:
- Live track record has 20+ trades (statistical significance)
- Live return is positive
- Live Sharpe is above 1.0
- At least 3 months of live trading history

### Multi-Strategy Support
Current architecture assumes one strategy. To support multiple:
1. Add `strategy_name` column to trades and daily_snapshots
2. Add strategy filter to API routes
3. Add strategy selector to dashboard UI
4. Each strategy gets its own optimization run records

### Multi-Market Support
Current UI hardcodes "BTC-USD". To support ETH, SOL, etc.:
1. API already supports `market_id` filtering
2. Dashboard needs a market selector or multi-market grid
3. Homepage could show a portfolio-level summary across markets
