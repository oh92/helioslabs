// Live strategy taxonomy — single source of truth for the two live strategies
// shown on the dashboard. The site runs two live strategies on two venues:
//
//   funding → ProScore (funding-rate gated) on dYdX, BTC-USD
//   volume  → ProScore2 (volume gated) on Hyperliquid, HYPE perp
//
// The raw config `strategy.name` (e.g. "proscore_btc_hardened_proven",
// "proscore2_btc_vol_top_hl_hype") is IP-sensitive on a public site, so it is
// never stored or exposed. The webhook categorizes the incoming trade into one
// of these stable keys via `categorizeStrategy()` and stores only the key.

export type StrategyKey = 'funding' | 'volume';

export const STRATEGY_KEYS: StrategyKey[] = ['funding', 'volume'];

export interface StrategyMeta {
  key: StrategyKey;
  label: string; // Tab label
  tagline: string; // One-line, non-technical
  venue: string;
  market: string;
}

export const STRATEGY_META: Record<StrategyKey, StrategyMeta> = {
  funding: {
    key: 'funding',
    label: 'Funding Rate',
    tagline: 'Momentum entries confirmed by the perpetual funding rate',
    venue: 'dYdX',
    market: 'BTC-USD',
  },
  volume: {
    key: 'volume',
    label: 'Volume',
    tagline: 'Momentum entries confirmed by a volume surge',
    venue: 'Hyperliquid',
    market: 'HYPE-USD',
  },
};

/**
 * Map an incoming webhook trade to one of the two live strategy keys.
 *
 * Primary signal is the raw config strategy name; market symbol is the
 * fallback. Kept deliberately permissive so a renamed config still lands in
 * the right bucket. Defaults to 'funding' (the original single strategy) when
 * nothing matches, so trades are never silently dropped from the UI.
 */
export function categorizeStrategy(
  strategyName?: string | null,
  market?: string | null,
): StrategyKey {
  const name = (strategyName || '').toLowerCase();
  const mkt = (market || '').toLowerCase();

  // proscore2 / any "vol" config → volume strategy
  if (/proscore2|(^|[_-])vol|volume/.test(name)) return 'volume';
  // explicit funding / proscore (v1) / btc funding config → funding strategy
  if (/funding|proscore_btc|proscore_funding|(^|[_-])proscore($|[_-])/.test(name)) return 'funding';

  // Fallback on market symbol when the strategy name is unrecognized
  if (mkt.includes('hype')) return 'volume';
  if (mkt.includes('btc')) return 'funding';

  return 'funding';
}

/** Normalize an arbitrary value to a valid StrategyKey, or null if invalid. */
export function toStrategyKey(value?: string | null): StrategyKey | null {
  if (value === 'funding' || value === 'volume') return value;
  return null;
}
