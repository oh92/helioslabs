import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/live',
        destination: '/dashboard?view=live',
        permanent: true,
      },
      {
        source: '/backtests',
        destination: '/dashboard?view=backtest',
        permanent: true,
      },
      {
        source: '/architecture',
        destination: '/system',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
