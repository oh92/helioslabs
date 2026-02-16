import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Helios — Algorithmic Trading System';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          height: '100%',
          backgroundColor: '#0a0a0a',
          fontFamily: 'monospace',
          position: 'relative',
        }}
      >
        {/* Grid pattern background */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            opacity: 0.06,
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        {/* Main content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '20px',
          }}
        >
          <div
            style={{
              fontSize: '72px',
              fontWeight: 'bold',
              color: '#ffffff',
              letterSpacing: '8px',
            }}
          >
            HELIOS
          </div>
          <div
            style={{
              fontSize: '24px',
              color: '#888888',
              letterSpacing: '4px',
            }}
          >
            ALGORITHMIC TRADING SYSTEM
          </div>
          <div
            style={{
              display: 'flex',
              gap: '32px',
              marginTop: '32px',
              fontSize: '16px',
              color: '#555555',
            }}
          >
            <span>BACKTESTING</span>
            <span style={{ color: '#333' }}>|</span>
            <span>OPTIMIZATION</span>
            <span style={{ color: '#333' }}>|</span>
            <span>LIVE EXECUTION</span>
          </div>
        </div>

        {/* Bottom URL */}
        <div
          style={{
            position: 'absolute',
            bottom: '32px',
            fontSize: '14px',
            color: '#444444',
            letterSpacing: '2px',
          }}
        >
          helios.owen-hobbs.com
        </div>
      </div>
    ),
    { ...size }
  );
}
