export function RetroGrid() {
  return (
    <div
      className="absolute inset-x-0 bottom-0 overflow-hidden pointer-events-none"
      style={{ height: '360px', zIndex: 0 }}
      aria-hidden="true"
    >
      {/* Fade-out gradient mask at the top */}
      <div
        className="absolute inset-0 z-10"
        style={{
          background: 'linear-gradient(to bottom, var(--background) 0%, transparent 60%)',
        }}
      />

      {/* Perspective container */}
      <div
        className="absolute inset-x-0 bottom-0"
        style={{
          height: '360px',
          perspective: '400px',
          perspectiveOrigin: '50% 50%',
        }}
      >
        {/* Grid plane - rotated into perspective */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            transformStyle: 'preserve-3d',
            transform: 'rotateX(55deg)',
            transformOrigin: '50% 100%',
          }}
        >
          {/* Combined grid lines with scroll animation */}
          <div
            className="retro-grid-surface"
            style={{
              position: 'absolute',
              /* Extend well above the visible area so scroll animation has content */
              top: '-200%',
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: `
                repeating-linear-gradient(
                  to bottom,
                  var(--retro-grid-line) 0px,
                  var(--retro-grid-line) 1px,
                  transparent 1px,
                  transparent 40px
                ),
                repeating-linear-gradient(
                  to right,
                  var(--retro-grid-line) 0px,
                  var(--retro-grid-line) 1px,
                  transparent 1px,
                  transparent 40px
                )
              `,
            }}
          />
        </div>
      </div>

      <style>{`
        :root {
          --retro-grid-line: color-mix(in srgb, var(--border) 20%, transparent);
        }
        .dark {
          --retro-grid-line: color-mix(in srgb, #7c5cfc 15%, transparent);
        }
        @keyframes retro-grid-scroll {
          from { transform: translateY(0); }
          to { transform: translateY(40px); }
        }
        .retro-grid-surface {
          animation: retro-grid-scroll 20s linear infinite;
        }
      `}</style>
    </div>
  );
}
