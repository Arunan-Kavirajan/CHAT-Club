export type MaterializeShard = {
  id: number;
  x: number;
  y: number;
  w: number;
  h: number;
  startDx: number;
  startDy: number;
  duration: number;
  delay: number;
  color: string;
};

const COLS = 14;
const ROWS = 7;
const RED = { r: 255, g: 46, b: 70 };
const BLUE = { r: 56, g: 189, b: 248 };

function lerpColor(t: number) {
  const r = Math.round(RED.r + (BLUE.r - RED.r) * t);
  const g = Math.round(RED.g + (BLUE.g - RED.g) * t);
  const b = Math.round(RED.b + (BLUE.b - RED.b) * t);
  return `rgb(${r}, ${g}, ${b})`;
}

/**
 * A grid of small fragments spanning the logo's full bounding box. They
 * don't need to be individually shaped to the logo's silhouette — the
 * parent container's own clip-path (the exact logo path) does that job,
 * so any fragment landing outside the silhouette is simply invisible.
 * Much simpler than computing per-fragment polygon intersections, same
 * visual result.
 */
export function generateMaterializeShards(boxW: number, boxH: number): MaterializeShard[] {
  const cellW = boxW / COLS;
  const cellH = boxH / ROWS;
  const shards: MaterializeShard[] = [];
  let id = 0;

  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const angle = Math.random() * Math.PI * 2;
      const distance = 260 + Math.random() * 260;
      const colorT = col / (COLS - 1);

      shards.push({
        id: id++,
        x: col * cellW,
        y: row * cellH,
        w: cellW + 0.5,
        h: cellH + 0.5,
        startDx: Math.cos(angle) * distance,
        startDy: Math.sin(angle) * distance,
        duration: 0.7 + Math.random() * 0.6,
        delay: Math.random() * 0.5,
        color: lerpColor(colorT),
      });
    }
  }

  return shards;
}