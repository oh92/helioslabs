-- Migration: split live trades by strategy (funding vs volume)
-- Run in Supabase SQL Editor (https://afjddigifkjcauhiufru.supabase.co)
--
-- Context: live trades from two strategies/venues (dYdX BTC "funding" and
-- Hyperliquid HYPE "volume") were co-mingled into `trades` / `daily_snapshots`
-- with no way to tell them apart. This adds a `strategy_name` category column
-- ('funding' | 'volume') and backfills existing live rows. Going forward the
-- webhook writes the category directly (see src/app/api/webhook/trade/route.ts).
--
-- Safe to re-run (idempotent).

-- 1. Columns ---------------------------------------------------------------
ALTER TABLE trades           ADD COLUMN IF NOT EXISTS strategy_name TEXT;
ALTER TABLE daily_snapshots  ADD COLUMN IF NOT EXISTS strategy_name TEXT;

CREATE INDEX IF NOT EXISTS idx_trades_strategy_name    ON trades(strategy_name);
CREATE INDEX IF NOT EXISTS idx_snapshots_strategy_name ON daily_snapshots(strategy_name);

-- 2. Backfill existing LIVE trades by price cluster ------------------------
-- BTC (funding, dYdX) trades ~ tens of thousands; HYPE (volume, HL) ~ tens.
-- A threshold of 1000 cleanly separates the two. Backtest rows are the single
-- ProScore2 BTC study and are intentionally left NULL (the backtest view is
-- not split by strategy).
--
-- Caveat: the (currently disabled) BTC-on-Hyperliquid "btc-vol" strategy, if
-- any of its historical trades exist, would be priced like BTC and land in
-- 'funding'. The two ACTIVE strategies separate cleanly. Going forward the
-- webhook uses the real config name, so this heuristic only affects history.
UPDATE trades
   SET strategy_name = CASE WHEN entry_price >= 1000 THEN 'funding' ELSE 'volume' END
 WHERE source = 'live'
   AND strategy_name IS NULL;

-- 3. Clear co-mingled live snapshots --------------------------------------
-- Existing live snapshots compounded BOTH strategies into one curve. Delete
-- them; the webhook rebuilds correct per-strategy snapshots on the next live
-- trade, and /api/equity computes per-strategy curves from trades meanwhile.
DELETE FROM daily_snapshots WHERE source = 'live';
