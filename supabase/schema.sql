-- HeliosLabs Trading Dashboard Database Schema
-- Run this SQL in your Supabase SQL Editor to create all required tables

-- Markets being traded
CREATE TABLE markets (
    id TEXT PRIMARY KEY,
    symbol TEXT NOT NULL,
    interval TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    config_hash TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Live trading sessions
CREATE TABLE trading_sessions (
    id TEXT PRIMARY KEY,
    market_id TEXT REFERENCES markets(id),
    started_at TIMESTAMP,
    ended_at TIMESTAMP,
    mode TEXT CHECK (mode IN ('paper', 'live')),
    starting_balance DECIMAL(20, 8)
);

-- Individual trades
CREATE TABLE trades (
    id TEXT PRIMARY KEY,
    session_id TEXT REFERENCES trading_sessions(id),
    entry_time TIMESTAMP,
    exit_time TIMESTAMP,
    direction TEXT CHECK (direction IN ('LONG', 'SHORT')),
    entry_price DECIMAL(20, 8),
    exit_price DECIMAL(20, 8),
    size DECIMAL(20, 8),
    pnl DECIMAL(20, 8),
    pnl_pct DECIMAL(10, 4),
    exit_reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Optimization results (aggregated only)
CREATE TABLE optimization_runs (
    id TEXT PRIMARY KEY,
    name TEXT,
    run_date TIMESTAMP,
    symbol TEXT,
    interval TEXT,
    total_combinations INTEGER,
    passed_constraints INTEGER,
    best_sharpe DECIMAL(10, 4),
    best_roi_pct DECIMAL(10, 4),
    best_drawdown_pct DECIMAL(10, 4),
    backtest_start DATE,
    backtest_end DATE,
    num_candles INTEGER
);

-- Daily performance snapshots
CREATE TABLE daily_snapshots (
    id TEXT PRIMARY KEY,
    market_id TEXT REFERENCES markets(id),
    date DATE,
    open_balance DECIMAL(20, 8),
    close_balance DECIMAL(20, 8),
    daily_pnl DECIMAL(20, 8),
    daily_pnl_pct DECIMAL(10, 4),
    num_trades INTEGER
);

-- Create indexes for common queries
CREATE INDEX idx_trades_session ON trades(session_id);
CREATE INDEX idx_trades_exit_time ON trades(exit_time DESC);
CREATE INDEX idx_snapshots_date ON daily_snapshots(date DESC);
CREATE INDEX idx_sessions_market ON trading_sessions(market_id);

-- Enable Row Level Security (RLS) for all tables
-- Note: You'll need to create policies based on your authentication requirements

ALTER TABLE markets ENABLE ROW LEVEL SECURITY;
ALTER TABLE trading_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE trades ENABLE ROW LEVEL SECURITY;
ALTER TABLE optimization_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_snapshots ENABLE ROW LEVEL SECURITY;

-- Example policies for authenticated users (adjust as needed)
-- These allow authenticated users to read all data

CREATE POLICY "Allow authenticated read access to markets"
    ON markets FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Allow authenticated read access to trading_sessions"
    ON trading_sessions FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Allow authenticated read access to trades"
    ON trades FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Allow authenticated read access to optimization_runs"
    ON optimization_runs FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Allow authenticated read access to daily_snapshots"
    ON daily_snapshots FOR SELECT
    TO authenticated
    USING (true);

-- For development/testing: Allow anonymous read access
-- Comment these out in production if you want to require authentication

CREATE POLICY "Allow anon read access to markets"
    ON markets FOR SELECT
    TO anon
    USING (true);

CREATE POLICY "Allow anon read access to trading_sessions"
    ON trading_sessions FOR SELECT
    TO anon
    USING (true);

CREATE POLICY "Allow anon read access to trades"
    ON trades FOR SELECT
    TO anon
    USING (true);

CREATE POLICY "Allow anon read access to optimization_runs"
    ON optimization_runs FOR SELECT
    TO anon
    USING (true);

CREATE POLICY "Allow anon read access to daily_snapshots"
    ON daily_snapshots FOR SELECT
    TO anon
    USING (true);
