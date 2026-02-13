import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Helios Labs | Algorithmic Trading System",
  description: "AI-assisted algorithmic trading with rigorous backtesting, optimization, and live execution on dYdX perpetuals.",
  keywords: ["algorithmic trading", "quantitative trading", "AI trading", "dYdX", "crypto trading", "backtesting"],
  authors: [{ name: "Helios Labs" }],
  openGraph: {
    title: "Helios Labs | Algorithmic Trading System",
    description: "AI-assisted algorithmic trading with rigorous backtesting, optimization, and live execution.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Helios Labs | Algorithmic Trading System",
    description: "AI-assisted algorithmic trading with rigorous backtesting, optimization, and live execution.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
}
