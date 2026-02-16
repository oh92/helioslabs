#!/usr/bin/env python3
"""Import live BTC trade data from CSV into Supabase.

Requires:
    pip install supabase python-dotenv

Usage:
    python scripts/import_supabase_trades.py
"""

import csv
import hashlib
import os
from datetime import datetime, timedelta
from pathlib import Path

from dotenv import load_dotenv
from supabase import create_client

# Load environment variables from .env.local
env_path = Path(__file__).resolve().parent.parent / ".env.local"
load_dotenv(env_path)

SUPABASE_URL = os.environ["NEXT_PUBLIC_SUPABASE_URL"]
SUPABASE_SERVICE_KEY = os.environ["SUPABASE_SERVICE_ROLE_KEY"]

CSV_PATH = Path("/Users/owenhobbs/dev/nautilus_trader/data/live_results/BTCUSD_all_trades.csv")

MARKET_ID = "mkt_btc_001"
SESSION_ID = "sess_btc_live_001"


def deterministic_id(entry_time: str, direction: str) -> str:
    """Generate a deterministic trade ID from entry_time + direction."""
    raw = f"{entry_time}:{direction}"
    return f"trd_{hashlib.sha256(raw.encode()).hexdigest()[:12]}"


def main():
    print(f"Connecting to Supabase: {SUPABASE_URL}")
    supabase = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

    # 1. Upsert market record
    print("\n1. Creating market record...")
    supabase.table("markets").upsert({
        "id": MARKET_ID,
        "symbol": "BTC-USD",
        "interval": "15m",
        "is_active": True,
    }).execute()
    print("   Market: BTC-USD (15m)")

    # 2. Upsert trading session
    print("\n2. Creating trading session...")
    supabase.table("trading_sessions").upsert({
        "id": SESSION_ID,
        "market_id": MARKET_ID,
        "started_at": "2026-02-02T03:30:01+00:00",
        "ended_at": None,
        "mode": "live",
        "starting_balance": None,
    }).execute()
    print(f"   Session: {SESSION_ID} (live)")

    # 3. Read CSV and insert trades
    print(f"\n3. Reading trades from {CSV_PATH}...")
    trades = []
    with open(CSV_PATH) as f:
        reader = csv.DictReader(f)
        for row in reader:
            entry_time = row["entry_time"].strip()
            direction = row["type"].strip()
            trade_id = deterministic_id(entry_time, direction)

            trade = {
                "id": trade_id,
                "session_id": SESSION_ID,
                "entry_time": entry_time + "+00:00",
                "exit_time": row["exit_time"].strip() + "+00:00",
                "direction": direction,
                "entry_price": float(row["entry_price"]),
                "exit_price": float(row["exit_price"]),
                "size": None,       # Hidden for privacy
                "pnl": None,        # Hidden - reveals account size
                "pnl_pct": round(float(row["pnl_pct"]), 4),
                "exit_reason": row["exit_reason"].strip(),
            }
            trades.append(trade)
            print(f"   {trade_id}: {direction} @ {trade['entry_price']:.0f} -> {trade['exit_price']:.0f} ({trade['pnl_pct']:+.4f}%)")

    print(f"\n   Inserting {len(trades)} trades...")
    supabase.table("trades").upsert(trades).execute()
    print("   Done.")

    # 4. Generate daily snapshots for equity curve
    print("\n4. Generating daily snapshots...")

    # Group trades by exit date
    trades_by_date: dict[str, list[dict]] = {}
    for t in trades:
        exit_date = t["exit_time"][:10]
        trades_by_date.setdefault(exit_date, []).append(t)

    start_date = datetime(2026, 2, 2)
    end_date = datetime(2026, 2, 13)
    balance = 10000.0
    snapshots = []

    current = start_date
    while current <= end_date:
        date_str = current.strftime("%Y-%m-%d")
        day_trades = trades_by_date.get(date_str, [])

        open_balance = balance
        daily_pnl_pct = sum(t["pnl_pct"] for t in day_trades)
        balance = open_balance * (1 + daily_pnl_pct / 100)
        daily_pnl = balance - open_balance

        snap_id = f"snap_{date_str.replace('-', '')}"
        snapshots.append({
            "id": snap_id,
            "market_id": MARKET_ID,
            "date": date_str,
            "open_balance": round(open_balance, 2),
            "close_balance": round(balance, 2),
            "daily_pnl": round(daily_pnl, 2),
            "daily_pnl_pct": round(daily_pnl_pct, 4),
            "num_trades": len(day_trades),
        })
        print(f"   {date_str}: {len(day_trades)} trades, PnL: {daily_pnl_pct:+.4f}%, Balance: ${balance:,.2f}")

        current += timedelta(days=1)

    print(f"\n   Inserting {len(snapshots)} daily snapshots...")
    supabase.table("daily_snapshots").upsert(snapshots).execute()

    # Summary
    total_pnl_pct = (balance - 10000) / 10000 * 100
    print(f"\n{'='*50}")
    print(f"Import complete!")
    print(f"  Trades:    {len(trades)}")
    print(f"  Snapshots: {len(snapshots)}")
    print(f"  Final:     ${balance:,.2f} ({total_pnl_pct:+.2f}%)")
    print(f"{'='*50}")


if __name__ == "__main__":
    main()
