// Database types for Helios Showcase

export interface Market {
  id: string;
  symbol: string;
  interval: string;
  is_active: boolean;
  config_hash?: string;
}

export interface TradingSession {
  id: string;
  market_id: string;
  started_at: string;
  ended_at?: string;
  mode: 'paper' | 'live' | 'backtest';
  starting_balance: number;
}

export interface Trade {
  id: string;
  session_id: string;
  entry_time: string;
  exit_time: string;
  direction: 'LONG' | 'SHORT';
  entry_price: number;
  exit_price: number;
  size: number | null;
  pnl: number | null;
  pnl_pct: number;
  exit_reason: string;
  created_at: string;
  source?: 'backtest' | 'live';
}

export interface OptimizationRun {
  id: string;
  name: string;
  run_date: string;
  symbol: string;
  interval: string;
  total_combinations: number;
  passed_constraints: number;
  best_sharpe: number;
  best_roi_pct: number;
  best_drawdown_pct: number;
  backtest_start: string;
  backtest_end: string;
  num_candles: number;
  distributions?: OptimizationDistributions;
}

export interface DailySnapshot {
  id: string;
  market_id: string;
  date: string;
  open_balance: number;
  close_balance: number;
  daily_pnl: number;
  daily_pnl_pct: number;
  num_trades: number;
}

// API response types
export interface MarketPerformance {
  market: Market;
  current_position: 'FLAT' | 'LONG' | 'SHORT';
  entry_price?: number;
  unrealized_pnl?: number;
  unrealized_pnl_pct?: number;
  session_pnl: number;
  session_pnl_pct: number;
  total_trades: number;
  win_rate: number;
  sharpe_ratio?: number;
  max_drawdown_pct: number;
  avg_win_pct: number;
  avg_loss_pct: number;
  backtest_start?: string;
  backtest_end?: string;
  num_candles?: number;
  benchmark_return_pct?: number;
}

export interface EquityDataPoint {
  timestamp: string;
  balance: number;
  drawdown_pct: number;
  daily_pnl_pct?: number;
  benchmark_balance?: number;
}

export interface DistributionStats {
  min: number;
  p10: number;
  p25: number;
  p50: number;
  p75: number;
  p90: number;
  max: number;
  mean: number;
  count: number;
}

export interface OptimizationDistributions {
  sharpe_ratio?: DistributionStats;
  pnl_pct?: DistributionStats;
  max_drawdown?: DistributionStats;
  win_rate?: DistributionStats;
}

export interface TradeDisplay {
  id: string;
  entry_time: string;
  exit_time: string;
  direction: 'LONG' | 'SHORT';
  entry_price: number;
  exit_price: number;
  pnl_pct: number;
  exit_reason: string;
}

export interface SystemHealth {
  status: 'healthy' | 'warning' | 'error';
  last_check: string;
  last_trade?: string;
  markets_active: number;
  uptime_hours: number;
}

