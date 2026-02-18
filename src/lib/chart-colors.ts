"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const lightColors = {
  profit: "#16a34a",
  loss: "#dc2626",
  grid: "#e5e5e5",
  axis: "#e5e5e5",
  label: "#737373",
  cursor: "#737373",
  dotBorder: "#ffffff",
  muted: "#737373",
  cursorFill: "rgba(115,115,115,0.1)",
};

const darkColors = {
  profit: "#22c55e",
  loss: "#ef4444",
  grid: "#262626",
  axis: "#262626",
  label: "#a3a3a3",
  cursor: "#a3a3a3",
  dotBorder: "#0a0a0a",
  muted: "#a3a3a3",
  cursorFill: "rgba(163,163,163,0.1)",
};

export type ChartColors = typeof lightColors;

export function useChartColors(): ChartColors {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return lightColors;
  return resolvedTheme === "dark" ? darkColors : lightColors;
}

export function useChartStyles() {
  const colors = useChartColors();

  return {
    tickStyle: {
      fill: colors.label,
      fontSize: 11,
      fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
    },
    axisLineStyle: { stroke: colors.axis },
    cursorStyle: {
      stroke: colors.cursor,
      strokeWidth: 1,
      strokeDasharray: "4 4",
    },
    cursorFill: colors.cursorFill,
    gridStroke: colors.grid,
    profitColor: colors.profit,
    lossColor: colors.loss,
    dotBorder: colors.dotBorder,
    mutedColor: colors.muted,
  };
}
