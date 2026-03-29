#!/usr/bin/env python3
"""Re-import all live dYdX trades into Supabase (clean slate).

Computes accurate account-level pnl_pct by reconstructing actual equity
from on-chain deposit history and trade PnL (Option B: TWRR).

Usage:
    python scripts/reimport_live_trades.py
"""

import hashlib
import os
from datetime import datetime, timedelta
from pathlib import Path

from dotenv import load_dotenv
from supabase import create_client

env_path = Path(__file__).resolve().parent.parent / ".env.local"
load_dotenv(env_path)

SUPABASE_URL = os.environ["NEXT_PUBLIC_SUPABASE_URL"]
SUPABASE_SERVICE_KEY = os.environ["SUPABASE_SERVICE_ROLE_KEY"]

MARKET_ID = "mkt_btc_001"
SESSION_ID = "sess_live_proscore2_15m"
STARTING_BALANCE = 10000  # Normalized display balance for website


def deterministic_id(entry_time: str, direction: str) -> str:
    """Match the webhook's ID generation: entry_time:direction:live."""
    raw = f"{entry_time}:{direction}:live"
    return f"trd_{hashlib.sha256(raw.encode()).hexdigest()[:12]}"


# Canonical dYdX trades with dollar PnL from BTC-USD-PERP.DYDX_all_trades.csv
RAW_TRADES = [
    # (entry_time, exit_time, direction, entry_price, exit_price, dollar_pnl, exit_reason)
    ("2026-02-16 16:00:00", "2026-02-16 21:00:00", "SHORT", 67537.0, 68535.0, -5.6886, "mean_reversion"),
    ("2026-02-25 01:30:00", "2026-02-25 05:30:00", "LONG", 65941.0, 65170.0, -5.7825, "stop_loss"),
    ("2026-02-28 06:30:00", "2026-02-28 14:00:00", "SHORT", 64571.0, 65164.0, -7.4718, "mean_reversion"),
    ("2026-03-02 15:15:00", "2026-03-03 02:15:00", "LONG", 68439.0, 68602.0, 0.8476, "mean_reversion"),
    ("2026-03-04 08:00:00", "2026-03-04 15:30:00", "LONG", 69529.0, 72967.0, 23.7222, "take_profit"),
    ("2026-03-05 15:45:00", "2026-03-06 02:15:00", "SHORT", 71471.0, 71346.0, 0.7375, "mean_reversion"),
    ("2026-03-07 19:30:00", "2026-03-08 07:15:00", "SHORT", 67217.0, 67376.0, -2.6712, "mean_reversion"),
    ("2026-03-10 02:45:00", "2026-03-10 04:00:00", "LONG", 70346.0, 69467.0, -7.5594, "stop_loss"),
    ("2026-03-11 13:45:00", "2026-03-11 23:45:00", "LONG", 70477.0, 70264.0, -1.5549, "mean_reversion"),
    ("2026-03-13 00:30:00", "2026-03-13 14:30:00", "LONG", 71556.0, 73732.0, 21.1072, "take_profit"),
    ("2026-03-14 23:30:00", "2026-03-15 13:15:00", "LONG", 71044.0, 71439.0, 6.6755, "mean_reversion"),
    ("2026-03-18 11:45:00", "2026-03-18 15:00:00", "SHORT", 73144.0, 71216.0, 25.064, "take_profit"),
    ("2026-03-21 14:30:00", "2026-03-21 15:00:00", "LONG", 70917.0, 70605.0, -17.5968, "stop_loss"),
    ("2026-03-22 00:00:00", "2026-03-22 02:30:00", "SHORT", 68900.0, 69343.0, -22.4158, "stop_loss"),
    ("2026-03-23 11:15:00", "2026-03-23 12:15:00", "LONG", 70934.0, 70002.0, -19.1992, "stop_loss"),
    ("2026-03-27 08:45:00", "2026-03-27 23:30:00", "SHORT", 67763.0, 66152.0, 22.0707, "primary_crosses_above_-0.1"),
    ("2026-03-28 13:45:01", "2026-03-28 22:00:00", "LONG", 66913.0, 66620.0, -2.7249, "primary_crosses_below_0.1"),
]

# On-chain deposit into subaccount 0 during trading period
# Source: dYdX indexer API for dydx1nm393xg9ue45q2lqsja72mr535ppdncttu4x7c
DEPOSITS = [
    # (date, amount) — only deposits between first trade and now
    ("2026-03-19", 317.716),
]

# Known current equity from dYdX indexer (no open positions)
CURRENT_EQUITY = 475.88


def reconstruct_equity():
    """Work backwards from current equity to find actual balance at each trade."""
    # Reverse through trades, subtracting PnL and deposits to get prior equity
    equity_at_exit = [0.0] * len(RAW_TRADES)
    eq = CURRENT_EQUITY

    for i in range(len(RAW_TRADES) - 1, -1, -1):
        equity_at_exit[i] = eq
        eq -= RAW_TRADES[i][5]  # subtract dollar PnL
        # Subtract deposit if it happened between this trade and the previous one
        # $317.72 deposit on Mar 19, between trade 11 (exit Mar 18) and trade 12 (exit Mar 21)
        if i == 12:
            eq -= 317.716

    return equity_at_exit


def main():
    print(f"Connecting to Supabase: {SUPABASE_URL}")
    supabase = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

    # 1. Delete existing live data
    print("\n1. Deleting existing live trades and snapshots...")
    result = supabase.table("trades").delete().eq("source", "live").execute()
    print(f"   Deleted {len(result.data)} live trades")
    result = supabase.table("daily_snapshots").delete().eq("source", "live").execute()
    print(f"   Deleted {len(result.data)} live snapshots")

    # 2. Reconstruct actual equity and compute pnl_pct
    print("\n2. Reconstructing actual equity from on-chain data...")
    equity_at_exit = reconstruct_equity()

    trades = []
    for i, t in enumerate(RAW_TRADES):
        entry_time, exit_time, direction, entry_price, exit_price, dollar_pnl, exit_reason = t
        eq_at_exit = equity_at_exit[i]
        eq_before = eq_at_exit - dollar_pnl
        pnl_pct = (dollar_pnl / eq_before * 100) if eq_before > 0 else 0.0

        trade_id = deterministic_id(entry_time, direction)
        trade = {
            "id": trade_id,
            "session_id": SESSION_ID,
            "entry_time": entry_time.replace(" ", "T") + "+00:00",
            "exit_time": exit_time.replace(" ", "T") + "+00:00",
            "direction": direction,
            "entry_price": round(entry_price, 2),
            "exit_price": exit_price,
            "size": None,
            "pnl": None,
            "pnl_pct": round(pnl_pct, 4),
            "exit_reason": exit_reason,
            "source": "live",
        }
        trades.append(trade)

        deposit_marker = "  ← after $317.72 deposit" if i == 12 else ""
        print(f"   {trade_id}: {direction:5s} ${eq_before:>7.2f} -> pnl={pnl_pct:>+8.4f}%  {exit_reason}{deposit_marker}")

    print(f"\n3. Inserting {len(trades)} trades...")
    supabase.table("trades").upsert(trades).execute()
    print("   Done.")

    # 4. Build daily snapshots (normalized display balance)
    print("\n4. Building daily snapshots...")

    trades_by_date: dict[str, list[float]] = {}
    for t in trades:
        exit_date = t["exit_time"][:10]
        trades_by_date.setdefault(exit_date, []).append(t["pnl_pct"])

    sorted_dates = sorted(trades_by_date.keys())
    first_date = datetime.strptime(sorted_dates[0], "%Y-%m-%d")
    last_date = datetime.strptime(sorted_dates[-1], "%Y-%m-%d")
    day_zero = first_date - timedelta(days=1)

    snapshots = []
    balance = STARTING_BALANCE

    day_zero_str = day_zero.strftime("%Y-%m-%d")
    snapshots.append({
        "id": f"snap_live_{day_zero_str.replace('-', '')}",
        "market_id": MARKET_ID,
        "date": day_zero_str,
        "open_balance": STARTING_BALANCE,
        "close_balance": STARTING_BALANCE,
        "daily_pnl": 0,
        "daily_pnl_pct": 0,
        "num_trades": 0,
        "source": "live",
    })

    current = first_date
    while current <= last_date:
        date_str = current.strftime("%Y-%m-%d")
        day_pnls = trades_by_date.get(date_str, [])

        open_balance = balance
        for p in day_pnls:
            balance *= (1 + p / 100)
        daily_pnl = balance - open_balance
        daily_pnl_pct = (daily_pnl / open_balance * 100) if open_balance > 0 else 0

        snapshots.append({
            "id": f"snap_live_{date_str.replace('-', '')}",
            "market_id": MARKET_ID,
            "date": date_str,
            "open_balance": round(open_balance, 2),
            "close_balance": round(balance, 2),
            "daily_pnl": round(daily_pnl, 2),
            "daily_pnl_pct": round(daily_pnl_pct, 4),
            "num_trades": len(day_pnls),
            "source": "live",
        })

        if day_pnls:
            print(f"   {date_str}: {len(day_pnls)} trade(s), PnL: {daily_pnl_pct:+.4f}%, Balance: ${balance:,.2f}")

        current += timedelta(days=1)

    print(f"\n5. Inserting {len(snapshots)} daily snapshots...")
    supabase.table("daily_snapshots").upsert(snapshots).execute()

    total_pnl_pct = (balance - STARTING_BALANCE) / STARTING_BALANCE * 100
    print(f"\n{'='*50}")
    print(f"Import complete!")
    print(f"  Trades:    {len(trades)}")
    print(f"  Snapshots: {len(snapshots)}")
    print(f"  Period:    {sorted_dates[0]} to {sorted_dates[-1]}")
    print(f"  Final:     ${balance:,.2f} ({total_pnl_pct:+.2f}%)")
    print(f"  Method:    TWRR (actual equity from dYdX indexer)")
    print(f"{'='*50}")


if __name__ == "__main__":
    main()
