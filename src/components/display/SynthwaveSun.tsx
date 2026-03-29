export function SynthwaveSun() {
  /* Horizontal slice lines -- thicker toward the bottom to simulate perspective.
     Positions are percentages from the top of the full circle diameter. Since we
     clip the bottom half, only the top 0-50% is visible. The slices sit in the
     lower portion of that visible half (roughly 38-48% of the full circle). */
  const slices = [
    { top: '38%', height: '2px' },
    { top: '50%', height: '3px' },
    { top: '60%', height: '4px' },
    { top: '70%', height: '6px' },
    { top: '78%', height: '8px' },
    { top: '86%', height: '11px' },
  ];

  return (
    <div
      className="absolute left-1/2 -translate-x-1/2 pointer-events-none"
      style={{ width: '360px', height: '180px', zIndex: 0 }}
      aria-hidden="true"
    >
      {/* Sun body -- top half of circle, clipped with overflow */}
      <div
        className="synthwave-sun"
        style={{
          position: 'absolute',
          width: '360px',
          height: '360px',
          borderRadius: '50%',
          background: 'linear-gradient(to bottom, #ff9d00 0%, #ff6a00 40%, #ff3d8f 100%)',
          clipPath: 'inset(0 0 50% 0)',
        }}
      >
        {/* Horizontal line slices through the sun */}
        {slices.map((slice, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              top: slice.top,
              left: 0,
              right: 0,
              height: slice.height,
              background: 'var(--background)',
            }}
          />
        ))}
      </div>

      <style>{`
        .synthwave-sun {
          opacity: 0.04;
        }
        .dark .synthwave-sun {
          opacity: 0.07;
        }
      `}</style>
    </div>
  );
}
