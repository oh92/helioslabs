// Mock data for Helios Labs trading showcase
import type {
  Market,
  Trade,
  EquityDataPoint,
  OptimizationRun,
  MarketPerformance,
  SystemHealth,
} from './types';

// Helper to generate ISO date strings
const daysAgo = (days: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString();
};

const hoursAgo = (hours: number): string => {
  const date = new Date();
  date.setHours(date.getHours() - hours);
  return date.toISOString();
};

// Markets
export const mockMarkets: Market[] = [
  {
    id: 'mkt_btc_001',
    symbol: 'BTC-USD',
    interval: '15min',
    is_active: true,
    config_hash: 'a3f2c1b8',
  },
  {
    id: 'mkt_eth_001',
    symbol: 'ETH-USD',
    interval: '15min',
    is_active: true,
    config_hash: 'b7d4e2a9',
  },
];

// Trades - Mix of wins and losses over past 7 days
export const mockTrades: Trade[] = [
  // BTC Trades
  {
    id: 'trd_001',
    session_id: 'sess_btc_001',
    entry_time: daysAgo(6.8),
    exit_time: daysAgo(6.7),
    direction: 'LONG',
    entry_price: 97250.50,
    exit_price: 98105.25,
    size: null,
    pnl: null,
    pnl_pct: 0.88,
    exit_reason: 'take_profit',
    created_at: daysAgo(6.7),
  },
  {
    id: 'trd_002',
    session_id: 'sess_btc_001',
    entry_time: daysAgo(5.9),
    exit_time: daysAgo(5.75),
    direction: 'SHORT',
    entry_price: 99450.00,
    exit_price: 99820.50,
    size: null,
    pnl: null,
    pnl_pct: -0.37,
    exit_reason: 'stop_loss',
    created_at: daysAgo(5.75),
  },
  {
    id: 'trd_003',
    session_id: 'sess_btc_001',
    entry_time: daysAgo(5.2),
    exit_time: daysAgo(5.0),
    direction: 'LONG',
    entry_price: 98750.00,
    exit_price: 100125.75,
    size: null,
    pnl: null,
    pnl_pct: 1.39,
    exit_reason: 'take_profit',
    created_at: daysAgo(5.0),
  },
  {
    id: 'trd_004',
    session_id: 'sess_btc_001',
    entry_time: daysAgo(4.1),
    exit_time: daysAgo(3.9),
    direction: 'SHORT',
    entry_price: 101250.00,
    exit_price: 99875.50,
    size: null,
    pnl: null,
    pnl_pct: 1.36,
    exit_reason: 'take_profit',
    created_at: daysAgo(3.9),
  },
  {
    id: 'trd_005',
    session_id: 'sess_btc_001',
    entry_time: daysAgo(2.8),
    exit_time: daysAgo(2.6),
    direction: 'LONG',
    entry_price: 99500.00,
    exit_price: 99125.25,
    size: null,
    pnl: null,
    pnl_pct: -0.38,
    exit_reason: 'stop_loss',
    created_at: daysAgo(2.6),
  },
  {
    id: 'trd_006',
    session_id: 'sess_btc_001',
    entry_time: daysAgo(1.5),
    exit_time: daysAgo(1.3),
    direction: 'LONG',
    entry_price: 100850.00,
    exit_price: 102975.50,
    size: null,
    pnl: null,
    pnl_pct: 2.11,
    exit_reason: 'take_profit',
    created_at: daysAgo(1.3),
  },
  {
    id: 'trd_007',
    session_id: 'sess_btc_001',
    entry_time: daysAgo(0.4),
    exit_time: daysAgo(0.2),
    direction: 'SHORT',
    entry_price: 103500.00,
    exit_price: 102750.25,
    size: null,
    pnl: null,
    pnl_pct: 0.72,
    exit_reason: 'take_profit',
    created_at: daysAgo(0.2),
  },
  // ETH Trades
  {
    id: 'trd_008',
    session_id: 'sess_eth_001',
    entry_time: daysAgo(6.5),
    exit_time: daysAgo(6.3),
    direction: 'LONG',
    entry_price: 3525.50,
    exit_price: 3598.75,
    size: null,
    pnl: null,
    pnl_pct: 2.08,
    exit_reason: 'take_profit',
    created_at: daysAgo(6.3),
  },
  {
    id: 'trd_009',
    session_id: 'sess_eth_001',
    entry_time: daysAgo(5.5),
    exit_time: daysAgo(5.35),
    direction: 'SHORT',
    entry_price: 3675.00,
    exit_price: 3625.50,
    size: null,
    pnl: null,
    pnl_pct: 1.35,
    exit_reason: 'take_profit',
    created_at: daysAgo(5.35),
  },
  {
    id: 'trd_010',
    session_id: 'sess_eth_001',
    entry_time: daysAgo(4.2),
    exit_time: daysAgo(4.05),
    direction: 'LONG',
    entry_price: 3590.00,
    exit_price: 3565.25,
    size: null,
    pnl: null,
    pnl_pct: -0.69,
    exit_reason: 'stop_loss',
    created_at: daysAgo(4.05),
  },
  {
    id: 'trd_011',
    session_id: 'sess_eth_001',
    entry_time: daysAgo(3.1),
    exit_time: daysAgo(2.9),
    direction: 'LONG',
    entry_price: 3545.00,
    exit_price: 3635.75,
    size: null,
    pnl: null,
    pnl_pct: 2.56,
    exit_reason: 'take_profit',
    created_at: daysAgo(2.9),
  },
  {
    id: 'trd_012',
    session_id: 'sess_eth_001',
    entry_time: daysAgo(2.0),
    exit_time: daysAgo(1.85),
    direction: 'SHORT',
    entry_price: 3710.00,
    exit_price: 3745.50,
    size: null,
    pnl: null,
    pnl_pct: -0.96,
    exit_reason: 'stop_loss',
    created_at: daysAgo(1.85),
  },
  {
    id: 'trd_013',
    session_id: 'sess_eth_001',
    entry_time: daysAgo(0.8),
    exit_time: daysAgo(0.6),
    direction: 'LONG',
    entry_price: 3685.00,
    exit_price: 3758.25,
    size: null,
    pnl: null,
    pnl_pct: 1.99,
    exit_reason: 'take_profit',
    created_at: daysAgo(0.6),
  },
];

// Equity curve - 30 days of daily data
// Starting balance: 10000, with realistic growth and drawdowns
export const mockEquityData: EquityDataPoint[] = (() => {
  const data: EquityDataPoint[] = [];
  let balance = 10000;
  let benchmarkBalance = 10000;
  let peak = balance;

  // Daily returns with realistic variance
  const dailyReturns = [
    0.45, -0.22, 0.78, 0.31, -0.15, 0.52, 0.18, -0.41, 0.65, 0.28,
    -0.35, 0.89, 0.42, -0.18, 0.55, -0.62, -0.28, 0.95, 0.38, 0.21,
    -0.45, 0.72, 0.15, 0.48, -0.25, 0.68, 0.35, -0.12, 0.82, 0.55
  ];

  // BTC buy-and-hold daily returns (nets to roughly -4.5%)
  const btcDailyReturns = [
    -0.30, 0.50, -0.80, -0.20, 0.30, -0.60, 0.10, -0.40, -0.10, 0.20,
    -0.50, 0.30, -0.70, 0.10, -0.30, -0.20, 0.40, -0.60, -0.10, 0.20,
    -0.40, 0.10, -0.30, -0.50, 0.20, -0.20, -0.30, 0.10, -0.40, -0.10
  ];

  for (let i = 29; i >= 0; i--) {
    const idx = 29 - i;
    const returnPct = dailyReturns[idx];
    const btcReturn = btcDailyReturns[idx];
    balance = balance * (1 + returnPct / 100);
    benchmarkBalance = benchmarkBalance * (1 + btcReturn / 100);
    peak = Math.max(peak, balance);
    const drawdown = ((peak - balance) / peak) * 100;

    data.push({
      timestamp: daysAgo(i),
      balance: Math.round(balance * 100) / 100,
      drawdown_pct: Math.round(drawdown * 100) / 100,
      daily_pnl_pct: returnPct,
      benchmark_balance: Math.round(benchmarkBalance * 100) / 100,
    });
  }

  return data;
})();

// Optimization runs
export const mockOptimizationRuns: OptimizationRun[] = [
  {
    id: 'opt_001',
    name: 'BTC Momentum Q1 2025',
    run_date: daysAgo(14),
    symbol: 'BTC-USD',
    interval: '15min',
    total_combinations: 12500,
    passed_constraints: 847,
    best_sharpe: 2.34,
    best_roi_pct: 45.8,
    best_drawdown_pct: 8.2,
    backtest_start: '2024-01-01T00:00:00Z',
    backtest_end: '2024-12-31T23:59:59Z',
    num_candles: 35040,
    distributions: {
      sharpe_ratio: { min: 1.52, p10: 1.68, p25: 1.82, p50: 2.01, p75: 2.18, p90: 2.31, max: 2.34, mean: 1.98, count: 847 },
      pnl_pct: { min: 12.5, p10: 18.3, p25: 25.1, p50: 33.4, p75: 39.8, p90: 43.2, max: 45.8, mean: 31.7, count: 847 },
      max_drawdown: { min: 5.1, p10: 7.2, p25: 9.4, p50: 12.1, p75: 15.3, p90: 17.8, max: 19.9, mean: 12.4, count: 847 },
      win_rate: { min: 31.2, p10: 35.8, p25: 39.1, p50: 42.5, p75: 48.2, p90: 53.1, max: 58.7, mean: 43.1, count: 847 },
    },
  },
  {
    id: 'opt_002',
    name: 'ETH Mean Reversion',
    run_date: daysAgo(21),
    symbol: 'ETH-USD',
    interval: '15min',
    total_combinations: 8750,
    passed_constraints: 523,
    best_sharpe: 1.89,
    best_roi_pct: 38.2,
    best_drawdown_pct: 11.5,
    backtest_start: '2024-01-01T00:00:00Z',
    backtest_end: '2024-12-31T23:59:59Z',
    num_candles: 35040,
  },
  {
    id: 'opt_003',
    name: 'BTC Breakout Strategy',
    run_date: daysAgo(7),
    symbol: 'BTC-USD',
    interval: '15min',
    total_combinations: 15000,
    passed_constraints: 1124,
    best_sharpe: 2.12,
    best_roi_pct: 52.3,
    best_drawdown_pct: 9.8,
    backtest_start: '2024-06-01T00:00:00Z',
    backtest_end: '2025-01-31T23:59:59Z',
    num_candles: 23520,
  },
];

// Current market performance
export const mockPerformance: MarketPerformance = {
  market: mockMarkets[0],
  current_position: 'LONG',
  entry_price: 102450.00,
  unrealized_pnl: undefined,
  unrealized_pnl_pct: 1.21,
  session_pnl: 0,
  session_pnl_pct: 8.39,
  total_trades: 47,
  win_rate: 59.6,
  sharpe_ratio: 1.87,
  max_drawdown_pct: 4.25,
  avg_win_pct: 1.52,
  avg_loss_pct: -0.68,
  benchmark_return_pct: -5.2,
};

// System health
export const mockSystemHealth: SystemHealth = {
  status: 'healthy',
  last_check: hoursAgo(0.05),
  last_trade: hoursAgo(4.8),
  markets_active: 2,
  uptime_hours: 168.5,
};
