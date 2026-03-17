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
        destination: '/agents',
        permanent: true,
      },
      {
        source: '/system',
        destination: '/agents',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
