/**
 * Shared SVG noise filter definition, rendered once and referenced by
 * id from every card — avoids duplicate filter defs if the same filter
 * were declared inside each card component individually.
 */
export function GlitchNoiseDef() {
  return (
    <svg width="0" height="0" className="absolute">
      <filter id="card-noise">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.9"
          numOctaves={2}
          stitchTiles="stitch"
          result="noise"
        />
        <feColorMatrix
          in="noise"
          type="matrix"
          values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 1 0"
        />
        <feComposite operator="in" in2="SourceGraphic" />
      </filter>
    </svg>
  );
}