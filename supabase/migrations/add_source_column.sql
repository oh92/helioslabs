-- Add source column to distinguish backtest vs live data
ALTER TABLE trades ADD COLUMN source TEXT DEFAULT 'live';
ALTER TABLE daily_snapshots ADD COLUMN source TEXT DEFAULT 'live';

-- Update mode constraint to allow 'backtest'
ALTER TABLE trading_sessions DROP CONSTRAINT trading_sessions_mode_check;
ALTER TABLE trading_sessions ADD CONSTRAINT trading_sessions_mode_check
  CHECK (mode IN ('paper', 'live', 'backtest'));

-- Index for filtering by source
CREATE INDEX idx_trades_source ON trades(source);
CREATE INDEX idx_snapshots_source ON daily_snapshots(source);

-- Set existing data to 'live'
UPDATE trades SET source = 'live' WHERE source IS NULL;
UPDATE daily_snapshots SET source = 'live' WHERE source IS NULL;
