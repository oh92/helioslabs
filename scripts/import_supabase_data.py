#!/usr/bin/env python3
"""Unified import script for backtest and optimization data into Supabase.

Requires:
    pip install supabase python-dotenv

Usage:
    # Import a backtest result (trades + equity curve)
    python scripts/import_supabase_data.py backtest /path/to/backtest_folder/

    # Import an optimization summary (headline metrics only)
    python scripts/import_supabase_data.py optimization /path/to/optimization_folder/
"""

import csv
import hashlib
import json
import os
import sys
from datetime import datetime, timedelta
from pathlib import Path

import numpy as np

from dotenv import load_dotenv
from supabase import create_client

# Load environment variables from .env.local
env_path = Path(__file__).resolve().parent.parent / ".env.local"
load_dotenv(env_path)

SUPABASE_URL = os.environ["NEXT_PUBLIC_SUPABASE_URL"]
SUPABASE_SERVICE_KEY = os.environ["SUPABASE_SERVICE_ROLE_KEY"]

MARKET_ID = "mkt_btc_001"

# Columns that contain sensitive IP — never import these
SENSITIVE_COLUMNS = {
    "size", "entry_zscore", "entry_momentum", "entry_fee", "exit_fee",
    "total_fees", "entry_bar_idx", "entry_sma_roc", "entry_adx",
    "exit_zscore", "pnl",
}


def deterministic_id(entry_time: str, direction: str, source: str = "backtest") -> str:
    """Generate a deterministic trade ID from entry_time + direction + source."""
    raw = f"{entry_time}:{direction}:{source}"
    return f"trd_{hashlib.sha256(raw.encode()).hexdigest()[:12]}"


def import_backtest(folder: Path):
    """Import backtest trades and generate daily snapshots."""
    print(f"Importing backtest from: {folder}")
    supabase = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

    # 1. Find and read summary
    summary_path = folder / "summaries" / "summary.json"
    if not summary_path.exists():
        summary_path = folder / "summary.json"
    if not summary_path.exists():
        print(f"ERROR: No summary.json found in {folder}")
        sys.exit(1)

    with open(summary_path) as f:
        summary = json.load(f)

    symbol = summary.get("symbol", "BTCUSDT")
    interval = summary.get("interval", "15m")
    timeframe = summary.get("backtest_timeframe", {})
    data_start = timeframe.get("data_start", "")
    data_end = timeframe.get("data_end", "")
    num_candles = timeframe.get("num_candles", 0)
    starting_balance = summary.get("starting_balance", 10000.0)

    print(f"  Symbol: {symbol}, Interval: {interval}")
    print(f"  Period: {data_start} to {data_end} ({num_candles} candles)")
    print(f"  Trades: {summary.get('num_trades', '?')}, ROI: {summary.get('pnl_pct', 0):.2f}%")

    # 2. Upsert market record
    print("\n1. Upserting market record...")
    supabase.table("markets").upsert({
        "id": MARKET_ID,
        "symbol": "BTC-USD",
        "interval": "15m",
        "is_active": True,
    }).execute()

    # 3. Create backtest trading session
    session_id = f"sess_backtest_{hashlib.sha256(str(folder).encode()).hexdigest()[:8]}"
    print(f"\n2. Creating backtest session: {session_id}")
    supabase.table("trading_sessions").upsert({
        "id": session_id,
        "market_id": MARKET_ID,
        "started_at": data_start.replace(" ", "T") + "+00:00" if data_start else None,
        "ended_at": data_end.replace(" ", "T") + "+00:00" if data_end else None,
        "mode": "backtest",
        "starting_balance": starting_balance,
    }).execute()

    # 4. Read trades CSV and convert to account-level pnl_pct
    # We read the dollar pnl column to compute accurate account-level percentages,
    # but we do NOT store dollar pnl or position sizes (IP protection).
    trades_path = folder / "trades.csv"
    if not trades_path.exists():
        print(f"ERROR: No trades.csv found in {folder}")
        sys.exit(1)

    print(f"\n3. Reading trades from {trades_path}...")
    trades = []
    running_balance = starting_balance
    with open(trades_path) as f:
        reader = csv.DictReader(f)
        for row in reader:
            entry_time = row["entry_time"].strip()
            direction = row["type"].strip()
            trade_id = deterministic_id(entry_time, direction, "backtest")

            # Use dollar pnl to compute account-level return percentage
            dollar_pnl = float(row["pnl"])
            acct_pnl_pct = (dollar_pnl / running_balance) * 100
            running_balance += dollar_pnl

            trade = {
                "id": trade_id,
                "session_id": session_id,
                "entry_time": entry_time.replace(" ", "T") + "+00:00",
                "exit_time": row["exit_time"].strip().replace(" ", "T") + "+00:00",
                "direction": direction,
                "entry_price": float(row["entry_price"]),
                "exit_price": float(row["exit_price"]),
                "size": None,       # Hidden for IP protection
                "pnl": None,        # Hidden — reveals account size
                "pnl_pct": round(acct_pnl_pct, 4),
                "exit_reason": row["exit_reason"].strip(),
                "source": "backtest",
            }
            trades.append(trade)
            print(f"   {trade_id}: {direction} @ {trade['entry_price']:.0f} -> {trade['exit_price']:.0f} acct:{acct_pnl_pct:+.4f}% bal:${running_balance:,.2f}")

    print(f"\n   Final balance from trades: ${running_balance:,.2f} (expected: ${summary.get('final_balance', 'N/A')})")
    print(f"   Upserting {len(trades)} trades...")
    # Batch upsert in chunks of 50
    for i in range(0, len(trades), 50):
        batch = trades[i:i+50]
        supabase.table("trades").upsert(batch).execute()
    print("   Done.")

    # 5. Generate daily snapshots from actual running balance
    # We use the account-level pnl_pct already computed per trade
    print("\n4. Generating daily snapshots...")

    # Group trades by exit date, preserving order for balance tracking
    trades_by_date: dict[str, list[dict]] = {}
    for t in trades:
        exit_date = t["exit_time"][:10]
        trades_by_date.setdefault(exit_date, []).append(t)

    # Determine date range from actual trade dates
    all_dates = sorted(trades_by_date.keys())
    if not all_dates:
        print("   No trades to generate snapshots from.")
        return

    start_date = datetime.strptime(all_dates[0], "%Y-%m-%d")
    end_date = datetime.strptime(all_dates[-1], "%Y-%m-%d")

    # Reconstruct daily balance using account-level pnl_pct from trades
    balance = starting_balance
    snapshots = []

    # Add day-0 snapshot at starting balance (day before first trade)
    day_zero = start_date - timedelta(days=1)
    day_zero_str = day_zero.strftime("%Y-%m-%d")
    snapshots.append({
        "id": f"snap_bt_{day_zero_str.replace('-', '')}",
        "market_id": MARKET_ID,
        "date": day_zero_str,
        "open_balance": round(starting_balance, 2),
        "close_balance": round(starting_balance, 2),
        "daily_pnl": 0,
        "daily_pnl_pct": 0,
        "num_trades": 0,
        "source": "backtest",
    })

    current = start_date

    while current <= end_date:
        date_str = current.strftime("%Y-%m-%d")
        day_trades = trades_by_date.get(date_str, [])

        open_balance = balance
        # Apply each trade's account-level pnl_pct sequentially
        for t in day_trades:
            balance = balance * (1 + t["pnl_pct"] / 100)
        daily_pnl = balance - open_balance
        daily_pnl_pct = (daily_pnl / open_balance * 100) if open_balance != 0 else 0

        snap_id = f"snap_bt_{date_str.replace('-', '')}"
        snapshots.append({
            "id": snap_id,
            "market_id": MARKET_ID,
            "date": date_str,
            "open_balance": round(open_balance, 2),
            "close_balance": round(balance, 2),
            "daily_pnl": round(daily_pnl, 2),
            "daily_pnl_pct": round(daily_pnl_pct, 4),
            "num_trades": len(day_trades),
            "source": "backtest",
        })

        if day_trades:
            print(f"   {date_str}: {len(day_trades)} trades, PnL: {daily_pnl_pct:+.4f}%, Balance: ${balance:,.2f}")

        current += timedelta(days=1)

    print(f"\n   Upserting {len(snapshots)} daily snapshots...")
    for i in range(0, len(snapshots), 50):
        batch = snapshots[i:i+50]
        supabase.table("daily_snapshots").upsert(batch).execute()

    # Summary
    total_pnl_pct = (balance - starting_balance) / starting_balance * 100
    print(f"\n{'='*50}")
    print(f"Backtest import complete!")
    print(f"  Trades:    {len(trades)}")
    print(f"  Snapshots: {len(snapshots)}")
    print(f"  Final:     ${balance:,.2f} ({total_pnl_pct:+.2f}%)")
    print(f"  Expected:  ${summary.get('final_balance', 'N/A')} ({summary.get('pnl_pct', 'N/A')}%)")
    print(f"{'='*50}")


def compute_distributions(folder: Path) -> dict | None:
    """Compute percentile distributions from results.csv for safe metrics only.

    Reads results.csv, filters to passed_constraints == True, and computes
    percentile stats for ONLY: sharpe_ratio, pnl_pct, max_drawdown, win_rate.
    Never reads or stores parameter columns.
    """
    results_path = folder / "results.csv"
    if not results_path.exists():
        print("  No results.csv found — skipping distributions.")
        return None

    # Read only the safe columns + filter column
    safe_metrics = ["sharpe_ratio", "pnl_pct", "max_drawdown", "win_rate"]
    needed_cols = safe_metrics + ["passed_constraints"]

    rows = []
    with open(results_path) as f:
        reader = csv.DictReader(f)
        # Verify columns exist
        if not all(c in reader.fieldnames for c in needed_cols):
            missing = [c for c in needed_cols if c not in reader.fieldnames]
            print(f"  results.csv missing columns: {missing} — skipping distributions.")
            return None
        for row in reader:
            if row["passed_constraints"].strip() == "True":
                rows.append({k: float(row[k]) for k in safe_metrics})

    if len(rows) < 10:
        print(f"  Only {len(rows)} passing configs — need 10+ for distributions.")
        return None

    print(f"  Computing distributions from {len(rows)} passing configurations...")

    distributions = {}
    for metric in safe_metrics:
        values = np.array([r[metric] for r in rows])
        distributions[metric] = {
            "min": round(float(np.min(values)), 4),
            "p10": round(float(np.percentile(values, 10)), 4),
            "p25": round(float(np.percentile(values, 25)), 4),
            "p50": round(float(np.percentile(values, 50)), 4),
            "p75": round(float(np.percentile(values, 75)), 4),
            "p90": round(float(np.percentile(values, 90)), 4),
            "max": round(float(np.max(values)), 4),
            "mean": round(float(np.mean(values)), 4),
            "count": len(values),
        }
        stats = distributions[metric]
        print(f"    {metric}: median={stats['p50']}, IQR=[{stats['p25']}, {stats['p75']}], range=[{stats['min']}, {stats['max']}]")

    return distributions


def import_optimization(folder: Path):
    """Import optimization headline metrics (no strategy parameters)."""
    print(f"Importing optimization from: {folder}")
    supabase = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

    # Read summary.json
    summary_path = folder / "summary.json"
    if not summary_path.exists():
        print(f"ERROR: No summary.json found in {folder}")
        sys.exit(1)

    with open(summary_path) as f:
        summary = json.load(f)

    config = summary.get("config", {})
    best = summary.get("best_result", {})
    timeframe = best.get("backtest_timeframe", {})
    constraints = config.get("constraints", {})

    name = config.get("name", folder.name)
    timestamp = summary.get("timestamp", "")

    # Generate deterministic ID
    opt_id = f"opt_{hashlib.sha256(name.encode()).hexdigest()[:8]}"

    # Parse timestamp
    run_date = None
    if timestamp:
        try:
            run_date = datetime.fromisoformat(timestamp).isoformat()
        except (ValueError, TypeError):
            run_date = None

    record = {
        "id": opt_id,
        "name": name,
        "run_date": run_date,
        "symbol": config.get("strategy", "proscore2") + " / " + best.get("symbol", "BTCUSDT"),
        "interval": best.get("interval", "15m"),
        "total_combinations": summary.get("total_combinations", 0),
        "passed_constraints": summary.get("passed_constraints", 0),
        "best_sharpe": round(best.get("sharpe_ratio", 0), 4),
        "best_roi_pct": round(best.get("pnl_pct", 0), 4),
        "best_drawdown_pct": round(best.get("max_drawdown", 0), 4),
        "backtest_start": timeframe.get("data_start", "")[:10] if timeframe.get("data_start") else None,
        "backtest_end": timeframe.get("data_end", "")[:10] if timeframe.get("data_end") else None,
        "num_candles": timeframe.get("num_candles", 0),
    }

    # Compute distributions from results.csv (safe metrics only)
    distributions = compute_distributions(folder)
    if distributions:
        record["distributions"] = json.dumps(distributions)

    print(f"\n  Name: {name}")
    print(f"  Combinations: {record['total_combinations']:,}")
    print(f"  Passed: {record['passed_constraints']:,} ({record['passed_constraints']/max(record['total_combinations'],1)*100:.1f}%)")
    print(f"  Best Sharpe: {record['best_sharpe']}")
    print(f"  Best ROI: {record['best_roi_pct']:.2f}%")
    print(f"  Best DD: {record['best_drawdown_pct']:.2f}%")
    print(f"\n  Constraints:")
    for k, v in constraints.items():
        print(f"    {k}: {v}")

    print(f"\n  Upserting optimization record: {opt_id}")
    supabase.table("optimization_runs").upsert(record).execute()

    print(f"\n{'='*50}")
    print(f"Optimization import complete!")
    print(f"  ID: {opt_id}")
    if distributions:
        print(f"  Distributions: {len(distributions)} metrics computed from results.csv")
    print(f"  NOTE: No strategy parameters or parameter ranges imported (IP protection)")
    print(f"{'='*50}")


def main():
    if len(sys.argv) < 3:
        print("Usage:")
        print("  python scripts/import_supabase_data.py backtest /path/to/backtest_folder/")
        print("  python scripts/import_supabase_data.py optimization /path/to/optimization_folder/")
        sys.exit(1)

    command = sys.argv[1]
    folder = Path(sys.argv[2]).resolve()

    if not folder.exists():
        print(f"ERROR: Folder does not exist: {folder}")
        sys.exit(1)

    if command == "backtest":
        import_backtest(folder)
    elif command == "optimization":
        import_optimization(folder)
    else:
        print(f"ERROR: Unknown command '{command}'. Use 'backtest' or 'optimization'.")
        sys.exit(1)


if __name__ == "__main__":
    main()
