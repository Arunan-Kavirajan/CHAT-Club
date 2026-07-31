// Generates a fresh, randomized "shattered glass" layout every time it's
// called — a center impact point, N radial spokes at jittered angles, and
// one jittered inner ring, which together divide the screen into irregular
// shards (like real cracked glass) and also define the crack-line network
// drawn on top of them.
//
// Coordinates for shards are percentages (0-100), since CSS clip-path on a
// full-viewport div is naturally relative to that div's own box — no need
// for pixel math there. Crack lines are real pixels, because SVG
// stroke-dasharray needs an accurate path length to animate a clean "draw"
// effect, and percentage-based coordinates would distort unevenly on
// non-square viewports.

export type Shard = {
  id: number;
  clipPath: string;
  translateX: number; // percent, the shard's flown-out offset
  translateY: number; // percent
  rotate: number; // degrees
  duration: number; // seconds
  delay: number; // seconds
};

export type CrackLine = {
  id: number;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  length: number; // px, used for stroke-dasharray
  drawDelay: number; // seconds, stagger for the radiating draw-in
};

export type ShatterLayout = {
  shards: Shard[];
  cracks: CrackLine[];
  maxShardEnd: number; // seconds — when the last shard finishes moving
};

const N_SPOKES = 12;
const OUTER_R_PCT = 85;

function pointAt(cx: number, cy: number, angleDeg: number, radiusPct: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return {
    xPct: cx + Math.cos(rad) * radiusPct,
    yPct: cy + Math.sin(rad) * radiusPct,
  };
}

export function generateShatterLayout(
  viewportW: number,
  viewportH: number,
): ShatterLayout {
  // Impact point — near center, slightly randomized so it's not
  // mechanically identical on every trigger.
  const cx = 46 + Math.random() * 8;
  const cy = 46 + Math.random() * 8;

  const angles: number[] = [];
  for (let i = 0; i < N_SPOKES; i++) {
    const base = (360 / N_SPOKES) * i;
    const jitter = (Math.random() - 0.5) * 18; // +/- 9deg
    angles.push(base + jitter);
  }
  angles.sort((a, b) => a - b);

  const innerRadii = angles.map(() => 24 + Math.random() * 28); // 24-52%

  const shards: Shard[] = [];
  const cracks: CrackLine[] = [];
  let shardId = 0;
  let crackId = 0;
  let maxShardEnd = 0;

  const toPx = (xPct: number, yPct: number) => ({
    x: (xPct / 100) * viewportW,
    y: (yPct / 100) * viewportH,
  });

  for (let i = 0; i < N_SPOKES; i++) {
    const a0 = angles[i];
    const a1 = i === N_SPOKES - 1 ? angles[0] + 360 : angles[i + 1];
    const r0 = innerRadii[i];
    const r1 = innerRadii[(i + 1) % N_SPOKES];

    const inner0 = pointAt(cx, cy, a0, r0);
    const inner1 = pointAt(cx, cy, a1, r1);
    const outer0 = pointAt(cx, cy, a0, OUTER_R_PCT);
    const outer1 = pointAt(cx, cy, a1, OUTER_R_PCT);

    const midRad = ((a0 + a1) / 2) * (Math.PI / 180);
    const dirX = Math.cos(midRad);
    const dirY = Math.sin(midRad);

// Inner shard: triangle from the impact point to the inner ring.
    const innerDistance = 150 + Math.random() * 80; // 150-230%
    const innerDuration = 1.6 + Math.random() * 0.6; // 1.6-2.2s
    const innerDelay = Math.random() * 0.28;
    shards.push({
      id: shardId++,
      clipPath: `polygon(${cx}% ${cy}%, ${inner0.xPct}% ${inner0.yPct}%, ${inner1.xPct}% ${inner1.yPct}%)`,
      translateX: dirX * innerDistance,
      translateY: dirY * innerDistance,
      rotate: (Math.random() - 0.5) * 55,
      duration: innerDuration,
      delay: innerDelay,
    });
    maxShardEnd = Math.max(maxShardEnd, innerDelay + innerDuration);

    // Outer shard: the quad between the inner ring and the outer edge.
    const outerDistance = 90 + Math.random() * 65; // 90-155%
    const outerDuration = 1.3 + Math.random() * 0.5; // 1.3-1.8s
    const outerDelay = Math.random() * 0.22;
    shards.push({
      id: shardId++,
      clipPath: `polygon(${inner0.xPct}% ${inner0.yPct}%, ${outer0.xPct}% ${outer0.yPct}%, ${outer1.xPct}% ${outer1.yPct}%, ${inner1.xPct}% ${inner1.yPct}%)`,
      translateX: dirX * outerDistance,
      translateY: dirY * outerDistance,
      rotate: (Math.random() - 0.5) * 38,
      duration: outerDuration,
      delay: outerDelay,
    });
    maxShardEnd = Math.max(maxShardEnd, outerDelay + outerDuration);

    // Crack lines: the spoke (center -> outer edge) and the ring segment
    // (inner0 -> inner1), matching the shard boundaries above.
    const centerPx = toPx(cx, cy);
    const outer0Px = toPx(outer0.xPct, outer0.yPct);
    const inner0Px = toPx(inner0.xPct, inner0.yPct);
    const inner1Px = toPx(inner1.xPct, inner1.yPct);

    const spokeLength = Math.hypot(
      outer0Px.x - centerPx.x,
      outer0Px.y - centerPx.y,
    );
    cracks.push({
      id: crackId++,
      x1: centerPx.x,
      y1: centerPx.y,
      x2: outer0Px.x,
      y2: outer0Px.y,
      length: spokeLength,
      drawDelay: Math.random() * 0.05,
    });

    const ringLength = Math.hypot(
      inner1Px.x - inner0Px.x,
      inner1Px.y - inner0Px.y,
    );
    cracks.push({
      id: crackId++,
      x1: inner0Px.x,
      y1: inner0Px.y,
      x2: inner1Px.x,
      y2: inner1Px.y,
      length: ringLength,
      drawDelay: 0.07 + Math.random() * 0.06,
    });
  }

  return { shards, cracks, maxShardEnd };
}