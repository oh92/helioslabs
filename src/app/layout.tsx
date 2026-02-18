import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";
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
  title: "Helios | Algorithmic Trading System",
  description: "AI-assisted algorithmic trading with rigorous backtesting, optimization, and live execution on dYdX perpetuals.",
  keywords: ["algorithmic trading", "quantitative trading", "AI trading", "dYdX", "crypto trading", "backtesting"],
  authors: [{ name: "Owen Hobbs" }],
  metadataBase: new URL("https://helios.owen-hobbs.com"),
  openGraph: {
    title: "Helios | Algorithmic Trading System",
    description: "AI-assisted algorithmic trading with rigorous backtesting, optimization, and live execution.",
    type: "website",
    locale: "en_US",
    siteName: "Helios",
  },
  twitter: {
    card: "summary_large_image",
    title: "Helios | Algorithmic Trading System",
    description: "AI-assisted algorithmic trading with rigorous backtesting, optimization, and live execution.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <ThemeProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
