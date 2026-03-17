// Shared formatting utilities for Helios display

export function formatPrice(price: number): string {
  return `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function formatPnlPct(pct: number): string {
  return `${pct >= 0 ? '+' : ''}${pct.toFixed(2)}%`;
}

export function formatReturn(pct: number, decimals = 1): string {
  return `${pct >= 0 ? '+' : ''}${pct.toFixed(decimals)}%`;
}

export function formatTradeTime(iso: string): string {
  return new Date(iso).toLocaleString('en-US', {
    year: '2-digit',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatExitReason(reason: string): string {
  // Strip trailing numeric thresholds (e.g., "primary_crosses_below_0.1" → "primary crosses below")
  const cleaned = reason.replace(/_\d+(\.\d+)?$/, '');
  return cleaned.replace(/_/g, ' ');
}

export function formatBalance(balance: number): string {
  return `$${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
}
