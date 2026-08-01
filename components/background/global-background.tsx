"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "@/components/theme/theme-context";
import { THEME_TOKENS } from "@/lib/theme-tokens";

/* ---------------------------------------------------------------------- */
/* Red Team — scattered live terminal panes                               */
/* ---------------------------------------------------------------------- */

// Purely decorative flavor text — fictional pseudo-terminal output, not
// real exploit code or functioning tooling.
const LINE_POOL = [
  "root@chat:~# nmap -sS 10.0.0.0/24",
  "[+] host up (0.014s latency)",
  "[x] connection refused :: 10.0.4.12:22",
  "[+] handshake established",
  "[*] brute-forcing credentials... 34%",
  "WARNING: certificate mismatch",
  "0xDEADBEEF :: decrypted",
  "[!] intrusion detected on eth0",
  "session token expired",
  "packet loss: 2.1%",
  "[+] port 443 open :: https",
  "[x] port 8080 filtered",
  "scanning subnet 192.168.1.0/24 ...",
  "[+] payload delivered",
  "analyzing traffic capture.pcap",
  "hash cracked :: 7a9f...c31e",
  "[*] enumerating services",
  "CVE lookup :: no match found",
  "firewall rule bypassed",
  "[!] anomaly flagged :: review",
  "root access :: pending",
  "closing session #4471",
  "[+] exploit chain verified",
  "checksum ok",
  "spawning reverse shell...",
  "[x] auth failed (3/5 attempts)",
  "syn flood detected",
  "log rotated :: security.log",
  "[+] patch applied",
  "quarantine :: file isolated",
];

type PaneTemplate = {
  width: number;
  fontSize: number;
  opacity: number;
  maxLines: number;
  typingMs: number;
  holdMs: number;
  poolStart: number;
};

const PANE_TEMPLATES: PaneTemplate[] = [
  { width: 240, fontSize: 11, opacity: 0.42, maxLines: 6, typingMs: 32, holdMs: 1400, poolStart: 0 },
  { width: 260, fontSize: 11, opacity: 0.34, maxLines: 5, typingMs: 40, holdMs: 1800, poolStart: 6 },
  { width: 220, fontSize: 10, opacity: 0.3, maxLines: 5, typingMs: 36, holdMs: 1600, poolStart: 12 },
  { width: 250, fontSize: 11, opacity: 0.4, maxLines: 6, typingMs: 30, holdMs: 1500, poolStart: 18 },
  { width: 200, fontSize: 10, opacity: 0.26, maxLines: 4, typingMs: 45, holdMs: 2000, poolStart: 24 },
  { width: 210, fontSize: 10, opacity: 0.28, maxLines: 4, typingMs: 42, holdMs: 1900, poolStart: 3 },
];

const MARGIN = 28;
const EDGE_PADDING = 16;
const PLACEMENT_ATTEMPTS = 60;

type PlacedPane = PaneTemplate & { x: number; y: number; height: number };

function estimateHeight(t: PaneTemplate) {
  return (t.maxLines + 1) * t.fontSize * 1.7;
}

function rectsOverlap(
  ax: number,
  ay: number,
  aw: number,
  ah: number,
  bx: number,
  by: number,
  bw: number,
  bh: number,
) {
  return !(
    ax + aw + MARGIN < bx ||
    ax > bx + bw + MARGIN ||
    ay + ah + MARGIN < by ||
    ay > by + bh + MARGIN
  );
}

function generatePaneLayout(
  viewportW: number,
  viewportH: number,
  templates: PaneTemplate[],
): PlacedPane[] {
  const placed: PlacedPane[] = [];

  for (const template of templates) {
    const height = estimateHeight(template);
    const maxX = Math.max(EDGE_PADDING, viewportW - template.width - EDGE_PADDING);
    const maxY = Math.max(EDGE_PADDING, viewportH - height - EDGE_PADDING);

    let x = EDGE_PADDING;
    let y = EDGE_PADDING;

    for (let attempt = 0; attempt < PLACEMENT_ATTEMPTS; attempt++) {
      const candidateX = EDGE_PADDING + Math.random() * (maxX - EDGE_PADDING);
      const candidateY = EDGE_PADDING + Math.random() * (maxY - EDGE_PADDING);
      x = candidateX;
      y = candidateY;

      const overlaps = placed.some((p) =>
        rectsOverlap(candidateX, candidateY, template.width, height, p.x, p.y, p.width, p.height),
      );

      if (!overlaps) break;
    }

    placed.push({ ...template, x, y, height });
  }

  return placed;
}

type CommittedLine = { text: string; flash: boolean; key: number };

function TerminalPane({ pane }: { pane: PlacedPane }) {
  const pool = useRef(
    [...LINE_POOL.slice(pane.poolStart), ...LINE_POOL.slice(0, pane.poolStart)],
  ).current;

  const [lines, setLines] = useState<CommittedLine[]>([]);
  const [typed, setTyped] = useState(0);
  const lineIndexRef = useRef(0);
  const typedRef = useRef(0);
  const keyRef = useRef(0);
  const phaseRef = useRef<"typing" | "holding">("typing");

  useEffect(() => {
    let cancelled = false;
    let timeoutId: ReturnType<typeof setTimeout>;

    function tick() {
      if (cancelled) return;
      const currentLine = pool[lineIndexRef.current % pool.length];

      if (phaseRef.current === "typing") {
        const next = typedRef.current + 1;
        typedRef.current = next;
        setTyped(next);

        if (next >= currentLine.length) {
          phaseRef.current = "holding";
          timeoutId = setTimeout(tick, pane.holdMs);
        } else {
          timeoutId = setTimeout(tick, pane.typingMs);
        }
      } else {
        keyRef.current += 1;
        const flash = Math.random() < 0.2;
        setLines((prev) =>
          [...prev, { text: currentLine, flash, key: keyRef.current }].slice(
            -pane.maxLines,
          ),
        );
        lineIndexRef.current += 1;
        typedRef.current = 0;
        setTyped(0);
        phaseRef.current = "typing";
        timeoutId = setTimeout(tick, pane.typingMs);
      }
    }

    timeoutId = setTimeout(tick, pane.typingMs);
    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const currentLine = pool[lineIndexRef.current % pool.length];

  return (
    <div
      className="absolute font-mono leading-relaxed select-none"
      style={{
        left: pane.x,
        top: pane.y,
        width: pane.width,
        fontSize: pane.fontSize,
        opacity: pane.opacity,
        color: "var(--accent)",
      }}
    >
      {lines.map((line) => (
        <div key={line.key} className={line.flash ? "term-line-flash" : "term-line"}>
          {line.text}
        </div>
      ))}
      <div className="term-line">
        {currentLine.slice(0, typed)}
        <span className="term-cursor">_</span>
      </div>
    </div>
  );
}

function RedTeamLayer({ viewport }: { viewport: { w: number; h: number } }) {
  const templates = viewport.w < 640 ? PANE_TEMPLATES.slice(0, 3) : PANE_TEMPLATES;
  const layout = useMemo(
    () => generatePaneLayout(viewport.w, viewport.h, templates),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [viewport.w, viewport.h, templates.length],
  );

  return (
    <>
      {layout.map((pane, i) => (
        <TerminalPane key={i} pane={pane} />
      ))}
    </>
  );
}

/* ---------------------------------------------------------------------- */
/* Blue Team — corner radar sweeps                                        */
/* ---------------------------------------------------------------------- */

function hexToRgba(hex: string, alpha: number) {
  const clean = hex.replace("#", "");
  const r = parseInt(clean.substring(0, 2), 16);
  const g = parseInt(clean.substring(2, 4), 16);
  const b = parseInt(clean.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

type RadarConfig = {
  originXPercent: number;
  originYPercent: number;
  sweepDurationSec: number;
  blipCount: number;
  ringCount: number;
};

const RADAR_CONFIGS: RadarConfig[] = [
  { originXPercent: 6, originYPercent: 8, sweepDurationSec: 14, blipCount: 9, ringCount: 3 },
  { originXPercent: 94, originYPercent: 90, sweepDurationSec: 18, blipCount: 9, ringCount: 3 },
];

type Blip = {
  angleDeg: number;
  radiusFrac: number;
  size: number;
  pulseDurationSec: number;
  pulseDelaySec: number;
};

function generateBlips(count: number): Blip[] {
  return Array.from({ length: count }, () => {
    const pulseDurationSec = 2.2 + Math.random() * 1.8; // 2.2-4s — independent of the sweep
    return {
      angleDeg: Math.random() * 360,
      radiusFrac: 0.25 + Math.random() * 0.65,
      size: 4 + Math.random() * 4,
      pulseDurationSec,
      // Negative delay starts each blip already partway into its cycle,
      // so all blips on a radar don't flash in unison.
      pulseDelaySec: -(Math.random() * pulseDurationSec),
    };
  });
}

function Radar({
  config,
  radius,
  accentHex,
}: {
  config: RadarConfig;
  radius: number;
  accentHex: string;
}) {
  const blips = useMemo(
    () => generateBlips(config.blipCount),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [config.blipCount],
  );

  const rings = Array.from({ length: config.ringCount }, (_, i) => {
    const scale = (i + 1) / config.ringCount;
    return (
      <div
        key={i}
        className="absolute rounded-full"
        style={{
          left: radius,
          top: radius,
          width: radius * 2 * scale,
          height: radius * 2 * scale,
          transform: "translate(-50%, -50%)",
          border: `1px solid ${hexToRgba(accentHex, 0.12)}`,
        }}
      />
    );
  });

  return (
    <div
      className="absolute"
      style={{
        left: `${config.originXPercent}%`,
        top: `${config.originYPercent}%`,
        width: radius * 2,
        height: radius * 2,
        transform: "translate(-50%, -50%)",
      }}
    >
      {rings}

      {/* Rotating sweep trail */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: `conic-gradient(from 0deg, ${hexToRgba(accentHex, 0.3)} 0deg, ${hexToRgba(accentHex, 0)} 46deg, ${hexToRgba(accentHex, 0)} 360deg)`,
          animation: `radar-rotate ${config.sweepDurationSec}s linear infinite`,
        }}
      />

      {/* Contact blips — flash timed to when the sweep passes their angle */}
      {blips.map((blip, i) => {
        const angleRad = (blip.angleDeg * Math.PI) / 180;
        const left = radius + Math.cos(angleRad) * blip.radiusFrac * radius;
        const top = radius + Math.sin(angleRad) * blip.radiusFrac * radius;
        return (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              left,
              top,
              width: blip.size,
              height: blip.size,
              opacity: 0,
              background: accentHex,
              transform: "translate(-50%, -50%)",
              animation: `radar-blip ${blip.pulseDurationSec}s ease-out infinite`,
              animationDelay: `${blip.pulseDelaySec}s`,
            }}
          />
        );
      })}
    </div>
  );
}

function BlueTeamLayer({ viewport }: { viewport: { w: number; h: number } }) {
  const radius = Math.max(viewport.w, viewport.h) * 0.38;
  const accentHex = THEME_TOKENS.light.accent;

  return (
    <>
      {RADAR_CONFIGS.map((config, i) => (
        <Radar key={i} config={config} radius={radius} accentHex={accentHex} />
      ))}
    </>
  );
}

/* ---------------------------------------------------------------------- */
/* Shared shell                                                           */
/* ---------------------------------------------------------------------- */

export function GlobalBackground() {
  const { theme } = useTheme();
  const [viewport, setViewport] = useState<{ w: number; h: number } | null>(null);

  useEffect(() => {
    function measure() {
      setViewport({ w: window.innerWidth, h: window.innerHeight });
    }
    measure();

    let resizeTimer: ReturnType<typeof setTimeout>;
    function onResize() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(measure, 200);
    }
    window.addEventListener("resize", onResize);
    return () => {
      clearTimeout(resizeTimer);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  if (!viewport) return null;

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {theme === "dark" ? (
        <RedTeamLayer viewport={viewport} />
      ) : (
        <BlueTeamLayer viewport={viewport} />
      )}
    </div>
  );
}