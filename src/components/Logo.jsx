/**
 * SwitchKey typographic logo: "SK" with shading for a dynamic effect.
 * Use className and optional width/height to control size; inherits color by default.
 */
export default function Logo({ className, width = 24, height = 24, ariaLabel = 'SwitchKey' }) {
  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden={!ariaLabel}
      role={ariaLabel ? 'img' : undefined}
      aria-label={ariaLabel || undefined}
    >
      <defs>
        <linearGradient id="sk-logo-shade" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="1" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.65" />
        </linearGradient>
        <filter id="sk-logo-shadow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="1" stdDeviation="0.6" floodColor="currentColor" floodOpacity="0.3" />
        </filter>
      </defs>
      {/* Soft shadow layer: depth between the letters */}
      <text
        x="4"
        y="22"
        fill="currentColor"
        fillOpacity="0.22"
        filter="url(#sk-logo-shadow)"
        fontFamily="system-ui, -apple-system, 'Segoe UI', sans-serif"
        fontSize="18"
        fontWeight="800"
        letterSpacing="-0.03em"
      >
        SK
      </text>
      {/* Main type with vertical gradient for shading */}
      <text
        x="4"
        y="22"
        fill="url(#sk-logo-shade)"
        fontFamily="system-ui, -apple-system, 'Segoe UI', sans-serif"
        fontSize="18"
        fontWeight="800"
        letterSpacing="-0.03em"
      >
        SK
      </text>
    </svg>
  );
}
