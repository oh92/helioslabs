# Helios Labs - Design Proposal

## The Problem with Current Design

The current design suffers from:
1. **Too busy** - Badges, gradients, multiple sections competing for attention
2. **Generic startup look** - Could be any SaaS product
3. **Tells, doesn't show** - Marketing speak instead of proof
4. **Buries the lead** - What you actually built gets lost

## New Design Philosophy

### "The Resume Approach"

Imagine you have 30 seconds of an investor's attention. What do they need to see?

1. **What is it?** - One sentence
2. **Does it work?** - Real numbers
3. **How does it work?** - Clear system overview
4. **What's unique?** - AI integration, methodology
5. **Who built it?** - Credibility, contact

### Design Principles

| Principle | Execution |
|-----------|-----------|
| **Minimal** | Remove everything that doesn't earn its place |
| **Data-forward** | Numbers are the hero, not words |
| **Terminal aesthetic** | Monospace fonts, high contrast, no decoration |
| **Single scroll** | Everything important above the fold or one scroll away |
| **Credibility signals** | Show the work, not claims about it |

---

## Visual Design

### Color Palette

```
Background:    #0a0a0a  (near black)
Surface:       #141414  (cards, sections)
Border:        #262626  (subtle dividers)

Text Primary:  #fafafa  (white)
Text Muted:    #737373  (gray)

Profit:        #22c55e  (green)
Loss:          #ef4444  (red)
Accent:        #22c55e  (same as profit - unified)
```

### Typography

```css
/* Headings - Clean, modern */
font-family: 'Montserrat', system-ui, sans-serif;
font-weight: 600;

/* Body text - Readable */
font-family: 'Inter', system-ui, sans-serif;
font-weight: 400;

/* Data, numbers, code - Terminal feel */
font-family: 'JetBrains Mono', 'Courier New', monospace;
font-variant-numeric: tabular-nums;
```

### Layout

- Max width: 1000px (focused, not sprawling)
- Generous whitespace
- Clear visual hierarchy
- No decorative elements

---

## Homepage Structure

### Hero (Above the fold)

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                  │
│  HELIOS                                                          │
│                                                                  │
│  An algorithmic trading system built with AI-assisted            │
│  development, rigorous backtesting, and live execution.          │
│                                                                  │
│  ● Trading live on dYdX                                          │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

Simple. Clear. No buttons yet - let the work speak first.

### Live Performance (The Proof)

```
┌─────────────────────────────────────────────────────────────────┐
│  PERFORMANCE                                    30-day results  │
│  ─────────────────────────────────────────────────────────────  │
│                                                                  │
│    +7.85%        59.6%         1.87         -4.25%              │
│    Return       Win Rate      Sharpe       Max DD               │
│                                                                  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                                                           │  │
│  │   [Sparkline equity curve - minimal, just the line]       │  │
│  │                                                           │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
│    47 trades · BTC-USD, ETH-USD · 15min timeframe               │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

Key changes:
- Compact sparkline, not full chart
- Key metrics in a row
- Minimal labeling

### The System (How it works)

```
┌─────────────────────────────────────────────────────────────────┐
│  THE SYSTEM                                                      │
│  ─────────────────────────────────────────────────────────────  │
│                                                                  │
│  01  DESIGN                                                      │
│      AI-assisted strategy development using Claude               │
│      for signal logic, entry/exit rules, and parameter tuning   │
│                                                                  │
│  02  BACKTEST                                                    │
│      Historical simulation across 12+ months of market data     │
│      using NautilusTrader's tick-level precision engine         │
│                                                                  │
│  03  OPTIMIZE                                                    │
│      36,250 parameter combinations tested                        │
│      2,494 passed constraint filtering (min trades, max DD)     │
│                                                                  │
│  04  EXECUTE                                                     │
│      Live trading on dYdX v4 perpetuals                         │
│      Sub-second order execution with risk controls              │
│                                                                  │
│  05  MONITOR                                                     │
│      AI agents for health checks, bug detection, trade analysis │
│      Continuous oversight without manual intervention           │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

Key changes:
- Numbered steps (clear progression)
- Concrete numbers (36,250 not "thousands")
- What each step actually does

### AI Agents (The Differentiator)

```
┌─────────────────────────────────────────────────────────────────┐
│  AI AGENTS                                     Powered by Claude │
│  ─────────────────────────────────────────────────────────────  │
│                                                                  │
│  bug_detector                                                    │
│  Analyzes code changes and runtime logs for potential issues.   │
│  Catches errors before they affect live trading.                │
│                                                                  │
│  health_checker                                                  │
│  Monitors system vitals: API connectivity, memory usage,        │
│  process heartbeats. Alerts on anomalies.                       │
│                                                                  │
│  trade_analyst                                                   │
│  Reviews completed trades for patterns. Identifies what's       │
│  working and what needs adjustment.                             │
│                                                                  │
│  ─────────────────────────────────────────────────────────────  │
│  Future: strategy_advisor, market_regime_detector               │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

This is unique and impressive. Give it prominence.

### Technology (Brief, credible)

```
┌─────────────────────────────────────────────────────────────────┐
│  BUILT WITH                                                      │
│  ─────────────────────────────────────────────────────────────  │
│                                                                  │
│  Python · NautilusTrader · dYdX v4 · Claude · Next.js · Postgres│
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

No badges, no categories. Just a clean list.

### Footer

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                  │
│  View detailed performance →    System architecture →           │
│                                                                  │
│  ─────────────────────────────────────────────────────────────  │
│                                                                  │
│  GitHub · LinkedIn · Email                          © 2025      │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Page Structure

### Option A: Single Page (Recommended)

Everything on one scrolling page. Sections:
1. Hero
2. Performance
3. The System
4. AI Agents
5. Tech Stack
6. Links/Contact

**Pros**:
- Forces focus
- No navigation needed
- Mobile-friendly
- Resume-like

**Cons**:
- Can't deep-dive

### Option B: Minimal Multi-Page

- **/** - The resume (above)
- **/dashboard** - Full live performance with detailed charts
- **/system** - Deep technical architecture (for those who want it)

**Pros**:
- Detailed info available
- SEO benefits

**Cons**:
- More to maintain

### Recommendation: Option B

Keep the detailed dashboard (it's impressive), but make the homepage the focused "resume" that links to it.

---

## Data Sources

### Current State (Demo Mode)
```
src/lib/mock-data.ts
├── mockEquityData     → Preloaded 30-day equity curve
├── mockTrades         → Sample recent trades
├── mockPerformance    → Current metrics
└── mockOptimizationRuns → Backtest history
```

### Future State (Live Mode)
```
Supabase (PostgreSQL)
├── trades             → Populated via webhook
├── daily_snapshots    → Daily equity snapshots
├── markets            → Active trading pairs
└── optimization_runs  → Historical backtest results

Helios → Webhook → /api/webhook/trade → Supabase
                                      ↓
                            Next.js API → Frontend
```

### Transition Strategy

1. **Now**: Mock data for demo
2. **Phase 1**: Import historical trades from Helios CSV files
3. **Phase 2**: Webhook integration for real-time updates
4. **Phase 3**: API polling for near-real-time dashboard

---

## Component Simplification

### Remove
- Animated gradient backgrounds
- Badge overload
- Card hover effects
- Decorative icons
- Multiple CTAs

### Keep
- Equity curve chart (simplified)
- Performance metrics
- System workflow
- AI agent descriptions

### Add
- Sparkline chart (compact equity)
- "Last updated" timestamp
- Data source indicator (Demo/Live)

---

## Font Implementation

```css
/* In globals.css or layout */

@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&family=Montserrat:wght@500;600;700&family=Inter:wght@400;500&display=swap');

:root {
  --font-heading: 'Montserrat', system-ui, sans-serif;
  --font-body: 'Inter', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', 'Courier New', monospace;
}

h1, h2, h3 {
  font-family: var(--font-heading);
}

body {
  font-family: var(--font-body);
}

.data, .metric, code {
  font-family: var(--font-mono);
  font-variant-numeric: tabular-nums;
}
```

---

## Implementation Plan

### Phase 1: Redesign Homepage
1. Strip current homepage to essentials
2. Implement new minimal layout
3. Add sparkline equity chart
4. Update typography and colors

### Phase 2: Refine Dashboard
1. Keep current detailed dashboard
2. Update to match new design language
3. Rename route to `/dashboard`

### Phase 3: System Page
1. Consolidate architecture info
2. Add concrete numbers from optimization
3. Make it scannable

### Phase 4: Polish
1. Add loading states
2. Add "Demo Mode" indicator
3. Responsive refinements
4. Performance optimization

---

## Success Criteria

An investor/employer should be able to:
1. Understand what Helios is in 5 seconds
2. See proof it works in 10 seconds
3. Understand the approach in 30 seconds
4. Want to learn more

The design should feel:
- Professional, not flashy
- Confident, not salesy
- Technical, not intimidating
- Focused, not busy

---

## Next Steps

1. [ ] Review and approve this proposal
2. [ ] Implement new homepage design
3. [ ] Update dashboard styling
4. [ ] Add fonts and color scheme
5. [ ] Test and refine
