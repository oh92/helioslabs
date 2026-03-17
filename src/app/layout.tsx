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
  title: "Helios | AI Agent Platform for Autonomous Research & Monitoring",
  description: "A three-layer AI agent platform — autonomous research agents, deterministic-first monitoring, and plugin strategy architecture — managing a live algorithmic trading system.",
  keywords: ["AI agents", "autonomous research", "algorithmic trading", "LLM monitoring", "Claude AI", "agent architecture", "dYdX", "Hyperliquid"],
  authors: [{ name: "Owen Hobbs" }],
  metadataBase: new URL("https://helios.owen-hobbs.com"),
  openGraph: {
    title: "Helios | AI Agent Platform for Autonomous Research & Monitoring",
    description: "A three-layer AI agent platform with autonomous research, deterministic-first monitoring, and 93% LLM cost reduction.",
    type: "website",
    locale: "en_US",
    siteName: "Helios",
  },
  twitter: {
    card: "summary_large_image",
    title: "Helios | AI Agent Platform for Autonomous Research & Monitoring",
    description: "A three-layer AI agent platform with autonomous research, deterministic-first monitoring, and 93% LLM cost reduction.",
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
