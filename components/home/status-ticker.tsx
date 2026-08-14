const TICKER_ITEMS = [
  "CYBER_CORE :: ACTIVE LABS",
  "DEV_OPS :: SYSTEMS & INFRASTRUCTURE",
  "ADV_TECH :: AI & HARDWARE INNOVATION",
];

export function StatusTicker() {
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS];

  return (
    <div className="border-y border-foreground/10 overflow-hidden bg-muted/20">
      <div className="ticker-track flex items-center gap-10 py-3 whitespace-nowrap">
        {items.map((item, i) => (
          <span key={i} className="flex items-center gap-10">
            <span className="font-mono text-xs tracking-wider text-foreground/50">
              <span className="text-accent">&gt;</span> {item}
            </span>
            <span className="text-foreground/20">/</span>
          </span>
        ))}
      </div>
    </div>
  );
}