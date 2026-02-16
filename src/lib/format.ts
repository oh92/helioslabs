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
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatExitReason(reason: string): string {
  return reason.replace(/_/g, ' ');
}

export function formatBalance(balance: number): string {
  return `$${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
}
