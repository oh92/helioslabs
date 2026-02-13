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
  mode: 'paper' | 'live';
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
  size: number;
  pnl: number;
  pnl_pct: number;
  exit_reason: string;
  created_at: string;
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
}

export interface EquityDataPoint {
  timestamp: string;
  balance: number;
  drawdown_pct: number;
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

// Component prop types
export interface MetricCardProps {
  label: string;
  value: string | number;
  change?: number;
  prefix?: string;
  suffix?: string;
  variant?: 'default' | 'profit' | 'loss';
}

export interface WorkflowStep {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface TechBadge {
  name: string;
  icon?: string;
  url?: string;
}
