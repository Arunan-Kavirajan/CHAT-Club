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
  tier: "structural" | "detail";
};

const RED = { r: 255, g: 46, b: 70 };
const BLUE = { r: 56, g: 189, b: 248 };

function lerpColor(t: number) {
  const r = Math.round(RED.r + (BLUE.r - RED.r) * t);
  const g = Math.round(RED.g + (BLUE.g - RED.g) * t);
  const b = Math.round(RED.b + (BLUE.b - RED.b) * t);
  return `rgb(${r}, ${g}, ${b})`;
}

function buildGrid(
  boxW: number,
  boxH: number,
  cols: number,
  rows: number,
  tier: "structural" | "detail",
  idStart: number,
  distanceRange: [number, number],
  durationRange: [number, number],
  delayRange: [number, number],
): MaterializeShard[] {
  const cellW = boxW / cols;
  const cellH = boxH / rows;
  const shards: MaterializeShard[] = [];
  let id = idStart;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const angle = Math.random() * Math.PI * 2;
      const distance =
        distanceRange[0] + Math.random() * (distanceRange[1] - distanceRange[0]);
      const colorT = col / (cols - 1);

      shards.push({
        id: id++,
        x: col * cellW,
        y: row * cellH,
        w: cellW + 0.5,
        h: cellH + 0.5,
        startDx: Math.cos(angle) * distance,
        startDy: Math.sin(angle) * distance,
        duration:
          durationRange[0] + Math.random() * (durationRange[1] - durationRange[0]),
        delay: delayRange[0] + Math.random() * (delayRange[1] - delayRange[0]),
        color: lerpColor(colorT),
        tier,
      });
    }
  }

  return shards;
}

/**
 * Two-tier assembly: a coarse grid of larger "structural" pieces arrives
 * first and fast, roughly blocking in the logo's shape — then a fine
 * grid of small "detail" shards arrives after, filling in texture. Reads
 * as a deliberate two-stage construction instead of one uniform swarm.
 * The parent's clip-path (the real logo path) does all the actual
 * shaping — any fragment outside the silhouette is simply invisible.
 */
export function generateMaterializeShards(boxW: number, boxH: number): MaterializeShard[] {
  const structural = buildGrid(boxW, boxH, 7, 4, "structural", 0, [200, 380], [0.55, 0.8], [0, 0.15]);
  const detail = buildGrid(boxW, boxH, 20, 10, "detail", 1000, [140, 320], [0.6, 1.0], [0.2, 0.55]);
  return [...structural, ...detail];
}