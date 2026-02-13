import { createClient } from '@supabase/supabase-js';

// Supabase client configuration
// This will be used when Supabase is set up with the schema from supabase/schema.sql
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Create Supabase client - will be undefined if env vars not set
export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Type definitions for database tables
export interface Market {
  id: string;
  symbol: string;
  interval: string;
  is_active: boolean;
  config_hash: string | null;
  created_at: string;
}

export interface TradingSession {
  id: string;
  market_id: string;
  started_at: string | null;
  ended_at: string | null;
  mode: 'paper' | 'live';
  starting_balance: number;
}

export interface Trade {
  id: string;
  session_id: string;
  entry_time: string | null;
  exit_time: string | null;
  direction: 'LONG' | 'SHORT';
  entry_price: number;
  exit_price: number | null;
  size: number;
  pnl: number | null;
  pnl_pct: number | null;
  exit_reason: string | null;
  created_at: string;
}

export interface OptimizationRun {
  id: string;
  name: string | null;
  run_date: string | null;
  symbol: string | null;
  interval: string | null;
  total_combinations: number | null;
  passed_constraints: number | null;
  best_sharpe: number | null;
  best_roi_pct: number | null;
  best_drawdown_pct: number | null;
  backtest_start: string | null;
  backtest_end: string | null;
  num_candles: number | null;
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

// Mock data for development when Supabase is not configured
const mockMarkets: Market[] = [
  {
    id: 'btc-usdt-1h',
    symbol: 'BTC/USDT',
    interval: '1h',
    is_active: true,
    config_hash: null,
    created_at: new Date().toISOString(),
  },
];

const mockTradingSessions: TradingSession[] = [
  {
    id: 'session-1',
    market_id: 'btc-usdt-1h',
    started_at: new Date().toISOString(),
    ended_at: null,
    mode: 'paper',
    starting_balance: 10000,
  },
];

const mockTrades: Trade[] = [
  {
    id: 'trade-1',
    session_id: 'session-1',
    entry_time: new Date(Date.now() - 3600000).toISOString(),
    exit_time: new Date().toISOString(),
    direction: 'LONG',
    entry_price: 42000,
    exit_price: 42500,
    size: 0.1,
    pnl: 50,
    pnl_pct: 1.19,
    exit_reason: 'take_profit',
    created_at: new Date().toISOString(),
  },
];

const mockOptimizationRuns: OptimizationRun[] = [
  {
    id: 'opt-1',
    name: 'BTC Optimization Run',
    run_date: new Date().toISOString(),
    symbol: 'BTC/USDT',
    interval: '1h',
    total_combinations: 1000,
    passed_constraints: 150,
    best_sharpe: 2.5,
    best_roi_pct: 45.5,
    best_drawdown_pct: 12.3,
    backtest_start: '2024-01-01',
    backtest_end: '2024-12-31',
    num_candles: 8760,
  },
];

const mockDailySnapshots: DailySnapshot[] = [
  {
    id: 'snap-1',
    market_id: 'btc-usdt-1h',
    date: new Date().toISOString().split('T')[0],
    open_balance: 10000,
    close_balance: 10250,
    daily_pnl: 250,
    daily_pnl_pct: 2.5,
    num_trades: 5,
  },
];

// Database query functions with mock fallback
// These will use Supabase when configured, otherwise return mock data

export async function getMarkets(): Promise<Market[]> {
  if (supabase) {
    const { data, error } = await supabase
      .from('markets')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching markets:', error);
      return mockMarkets;
    }
    return data || [];
  }
  return mockMarkets;
}

export async function getActiveMarkets(): Promise<Market[]> {
  if (supabase) {
    const { data, error } = await supabase
      .from('markets')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching active markets:', error);
      return mockMarkets.filter(m => m.is_active);
    }
    return data || [];
  }
  return mockMarkets.filter(m => m.is_active);
}

export async function getTradingSessions(marketId?: string): Promise<TradingSession[]> {
  if (supabase) {
    let query = supabase.from('trading_sessions').select('*');

    if (marketId) {
      query = query.eq('market_id', marketId);
    }

    const { data, error } = await query.order('started_at', { ascending: false });

    if (error) {
      console.error('Error fetching trading sessions:', error);
      return mockTradingSessions;
    }
    return data || [];
  }
  return marketId
    ? mockTradingSessions.filter(s => s.market_id === marketId)
    : mockTradingSessions;
}

export async function getTrades(sessionId?: string): Promise<Trade[]> {
  if (supabase) {
    let query = supabase.from('trades').select('*');

    if (sessionId) {
      query = query.eq('session_id', sessionId);
    }

    const { data, error } = await query.order('exit_time', { ascending: false });

    if (error) {
      console.error('Error fetching trades:', error);
      return mockTrades;
    }
    return data || [];
  }
  return sessionId
    ? mockTrades.filter(t => t.session_id === sessionId)
    : mockTrades;
}

export async function getRecentTrades(limit: number = 10): Promise<Trade[]> {
  if (supabase) {
    const { data, error } = await supabase
      .from('trades')
      .select('*')
      .order('exit_time', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching recent trades:', error);
      return mockTrades.slice(0, limit);
    }
    return data || [];
  }
  return mockTrades.slice(0, limit);
}

export async function getOptimizationRuns(): Promise<OptimizationRun[]> {
  if (supabase) {
    const { data, error } = await supabase
      .from('optimization_runs')
      .select('*')
      .order('run_date', { ascending: false });

    if (error) {
      console.error('Error fetching optimization runs:', error);
      return mockOptimizationRuns;
    }
    return data || [];
  }
  return mockOptimizationRuns;
}

export async function getDailySnapshots(marketId?: string, days: number = 30): Promise<DailySnapshot[]> {
  if (supabase) {
    let query = supabase
      .from('daily_snapshots')
      .select('*')
      .order('date', { ascending: false })
      .limit(days);

    if (marketId) {
      query = query.eq('market_id', marketId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching daily snapshots:', error);
      return mockDailySnapshots;
    }
    return data || [];
  }
  return marketId
    ? mockDailySnapshots.filter(s => s.market_id === marketId).slice(0, days)
    : mockDailySnapshots.slice(0, days);
}

// Utility function to check if Supabase is configured
export function isSupabaseConfigured(): boolean {
  return supabase !== null;
}
