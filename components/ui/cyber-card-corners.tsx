/**
 * Four corner brackets that fade + snap in on hover — the shared "extra"
 * layered on top of the glow, reused identically by Events and Gallery
 * cards. Must be rendered inside an ancestor with `relative` and `group`
 * classes for positioning and hover-triggering to work.
 */
export function CyberCardCorners() {
  const base =
    "absolute w-3 h-3 opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 pointer-events-none";

  return (
    <>
      <span
        className={`${base} top-2 left-2 border-t-2 border-l-2 -translate-x-1 -translate-y-1`}
        style={{ borderColor: "var(--accent)" }}
      />
      <span
        className={`${base} top-2 right-2 border-t-2 border-r-2 translate-x-1 -translate-y-1`}
        style={{ borderColor: "var(--accent)" }}
      />
      <span
        className={`${base} bottom-2 left-2 border-b-2 border-l-2 -translate-x-1 translate-y-1`}
        style={{ borderColor: "var(--accent)" }}
      />
      <span
        className={`${base} bottom-2 right-2 border-b-2 border-r-2 translate-x-1 translate-y-1`}
        style={{ borderColor: "var(--accent)" }}
      />
    </>
  );
}