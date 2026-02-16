-- Add distributions JSONB column to optimization_runs
-- Stores percentile statistics for safe metrics (sharpe, ROI, drawdown, win rate)
-- across all passing configurations in an optimization run.
ALTER TABLE optimization_runs ADD COLUMN IF NOT EXISTS distributions JSONB;
