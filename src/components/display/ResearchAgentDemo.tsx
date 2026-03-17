'use client';

import { useState, useEffect, useRef } from 'react';

interface TerminalLine {
  type: 'command' | 'header' | 'round' | 'budget' | 'verdict' | 'blank';
  text: string;
  badge?: 'BACKTEST' | 'OPTIMIZE' | 'CONCLUDE' | 'PLAN' | 'VALIDATE';
  badgeColor?: string;
}

const COMPACT_LINES: TerminalLine[] = [
  { type: 'command', text: '$ helios research --hypothesis "mean-reversion with funding rate filter"' },
  { type: 'blank', text: '' },
  { type: 'header', text: '[PLAN] Evaluating hypothesis: mean-reversion with synthetic funding rate on BTC-USD' },
  { type: 'round', text: 'Establishing baseline performance on default parameters', badge: 'BACKTEST', badgeColor: 'text-blue-500' },
  { type: 'budget', text: '  → 100 trades | Sharpe 1.28 | Win rate 41.0% | Max DD -26.4%' },
  { type: 'blank', text: '' },
  { type: 'round', text: 'Running parameter sweep across funding rate thresholds', badge: 'OPTIMIZE', badgeColor: 'text-yellow-500' },
  { type: 'budget', text: '  → 162 combinations | 5.6% pass rate | Best Sharpe 1.78' },
  { type: 'blank', text: '' },
  { type: 'round', text: 'Walk-forward IS/OOS validation on optimal configuration', badge: 'VALIDATE', badgeColor: 'text-blue-500' },
  { type: 'budget', text: '  → 54 trades | Sharpe 1.78 | Win rate 51.9% | Max DD -16.0%' },
  { type: 'round', text: 'Hypothesis confirmed — funding rate filter improves risk-adjusted returns', badge: 'CONCLUDE', badgeColor: 'text-green-600' },
  { type: 'verdict', text: '✓ VERDICT: Deploy to live monitoring (Phase B)' },
  { type: 'budget', text: '  Budget: 7 rounds | 8 LLM calls | 5 optimization sweeps' },
];

const FULL_LINES: TerminalLine[] = [
  { type: 'command', text: '$ helios research --hypothesis "mean-reversion with funding rate filter" --budget 10' },
  { type: 'blank', text: '' },
  { type: 'header', text: '[PLAN] Evaluating hypothesis: mean-reversion with synthetic funding rate on BTC-USD' },
  { type: 'budget', text: '  Budget: 10 rounds | Model: Haiku plans, Sonnet decides' },
  { type: 'blank', text: '' },
  { type: 'round', text: 'Establishing baseline with default parameters', badge: 'BACKTEST', badgeColor: 'text-blue-500' },
  { type: 'budget', text: '  → 100 trades | Sharpe 1.28 | Win rate 41.0% | Max DD -26.4%' },
  { type: 'budget', text: '  Assessment: Viable signal, drawdown needs improvement' },
  { type: 'blank', text: '' },
  { type: 'round', text: 'Testing tighter risk controls with funding rate gate', badge: 'BACKTEST', badgeColor: 'text-blue-500' },
  { type: 'budget', text: '  → 54 trades | Sharpe 1.75 | Win rate 51.9% | Max DD -15.3%' },
  { type: 'budget', text: '  Assessment: Funding rate filter reduces noise, Sharpe trending up' },
  { type: 'blank', text: '' },
  { type: 'round', text: 'Broad parameter sweep across promising region', badge: 'OPTIMIZE', badgeColor: 'text-yellow-500' },
  { type: 'budget', text: '  → 162 combinations | 5.6% pass rate | Best Sharpe 1.78' },
  { type: 'budget', text: '  Assessment: Tight pass rate indicates selective filtering' },
  { type: 'blank', text: '' },
  { type: 'round', text: 'Validating best config on full 24-month dataset', badge: 'BACKTEST', badgeColor: 'text-blue-500' },
  { type: 'budget', text: '  → 54 trades | Sharpe 1.78 | Win rate 51.9% | Max DD -16.0% | ROI +156%' },
  { type: 'budget', text: '  Assessment: All constraints passed, consistent across timeframes' },
  { type: 'blank', text: '' },
  { type: 'round', text: 'Running walk-forward validation (IS/OOS split)', badge: 'VALIDATE', badgeColor: 'text-blue-500' },
  { type: 'budget', text: '  → OOS degradation ratio 1.22x | 2/3 folds profitable | Confidence: HIGH' },
  { type: 'blank', text: '' },
  { type: 'round', text: 'Monte Carlo bootstrap (1,000 resamples)', badge: 'VALIDATE', badgeColor: 'text-blue-500' },
  { type: 'budget', text: '  → p50 Sharpe: 17.3 | p5 floor: 13.5 | Statistically robust' },
  { type: 'budget', text: '  Assessment: Narrow confidence intervals, edge confirmed' },
  { type: 'blank', text: '' },
  { type: 'round', text: 'Hypothesis confirmed — deploy to live monitoring', badge: 'CONCLUDE', badgeColor: 'text-green-600' },
  { type: 'blank', text: '' },
  { type: 'verdict', text: '✓ VERDICT: Deploy to live monitoring (Phase B)' },
  { type: 'budget', text: '  Budget used: 7/10 rounds | 8 LLM calls | 5 optimization sweeps' },
  { type: 'budget', text: '  State: CONCLUDED | Next: Live deployment validation' },
];

const LOOP_PAUSE_MS = 4000;

interface ResearchAgentDemoProps {
  compact?: boolean;
}

export function ResearchAgentDemo({ compact = false }: ResearchAgentDemoProps) {
  const lines = compact ? COMPACT_LINES : FULL_LINES;
  const totalLines = lines.length;
  const [visibleCount, setVisibleCount] = useState(0);
  const [fading, setFading] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Clean up on unmount
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (fading) return;

    if (visibleCount < totalLines) {
      // Reveal next line
      const line = lines[visibleCount];
      const delay = line.type === 'blank' ? 200 :
                    line.type === 'command' ? 1400 :
                    line.type === 'verdict' ? 1000 :
                    line.type === 'round' ? 700 : 400;

      timerRef.current = setTimeout(() => {
        setVisibleCount(prev => prev + 1);
      }, delay);
    } else {
      // All lines visible — pause, then fade and restart
      timerRef.current = setTimeout(() => {
        setFading(true);
        // After fade-out completes, reset
        setTimeout(() => {
          setVisibleCount(0);
          setFading(false);
        }, 600);
      }, LOOP_PAUSE_MS);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [visibleCount, totalLines, lines, fading]);

  const isComplete = visibleCount >= totalLines;

  return (
    <div className="border border-border rounded-lg bg-card/30 overflow-hidden">
      {/* Title bar */}
      <div className="px-4 py-2 border-b border-border bg-muted/20 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="h-2 w-2 rounded-full bg-green-600" />
          <span className="font-mono">research-agent</span>
        </div>
        {!isComplete && (
          <span className="text-[10px] text-muted-foreground/40 font-mono tabular-nums">
            {visibleCount}/{totalLines}
          </span>
        )}
      </div>

      {/* Terminal body — all lines rendered, visibility controlled by opacity */}
      <div
        className={`p-4 font-mono text-xs overflow-x-auto transition-opacity duration-500 ${fading ? 'opacity-0' : 'opacity-100'}`}
      >
        <div className="space-y-0.5 min-w-[380px]">
          {lines.map((line, i) => {
            const visible = i < visibleCount;
            return (
              <div
                key={i}
                className={`transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'} ${line.type === 'blank' ? 'h-3' : ''}`}
              >
                {line.type === 'command' && (
                  <div className="text-muted-foreground">{line.text}</div>
                )}
                {line.type === 'header' && (
                  <div className="text-foreground font-semibold">{line.text}</div>
                )}
                {line.type === 'round' && (
                  <div className="flex items-baseline gap-2">
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold bg-muted ${line.badgeColor || 'text-foreground'}`}>
                      {line.badge}
                    </span>
                    <span className="text-muted-foreground">{line.text}</span>
                  </div>
                )}
                {line.type === 'budget' && (
                  <div className="text-muted-foreground/70">{line.text}</div>
                )}
                {line.type === 'verdict' && (
                  <div className="text-green-600 font-semibold">{line.text}</div>
                )}
              </div>
            );
          })}
          {/* Blinking cursor — only while animating */}
          {!isComplete && !fading && (
            <div className="inline-block w-1.5 h-3.5 bg-foreground/50 animate-pulse mt-0.5" />
          )}
        </div>
      </div>
    </div>
  );
}
