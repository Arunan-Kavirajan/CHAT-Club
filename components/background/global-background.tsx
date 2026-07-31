"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "@/components/theme/theme-context";

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

const MARGIN = 28; // minimum gap enforced between any two panes
const EDGE_PADDING = 16; // keep panes off the very edge of the viewport
const PLACEMENT_ATTEMPTS = 60;

type PlacedPane = PaneTemplate & { x: number; y: number; height: number };

function estimateHeight(t: PaneTemplate) {
  // Visible committed lines plus the one currently being typed.
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

function generateLayout(
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

      if (!overlaps) break; // fits — stop searching
      // otherwise keep the last attempt as a best-effort fallback and try again
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

  const templates = useMemo(() => {
    // Fewer panes on small screens so it doesn't feel cramped.
    if (viewport && viewport.w < 640) return PANE_TEMPLATES.slice(0, 3);
    return PANE_TEMPLATES;
  }, [viewport]);

  const layout = useMemo(() => {
    if (!viewport) return [];
    return generateLayout(viewport.w, viewport.h, templates);
  }, [viewport, templates]);

  // Blue Team's background gets built next — for now, Red Team only.
  if (theme !== "dark" || layout.length === 0) return null;

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {layout.map((pane, i) => (
        <TerminalPane key={i} pane={pane} />
      ))}
    </div>
  );
}