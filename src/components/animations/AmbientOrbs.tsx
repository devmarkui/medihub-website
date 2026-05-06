/**
 * Slow-drifting blurred color orbs that hover above page content with
 * `mix-blend-mode: soft-light` — this lets the orbs subtly tint every
 * section (light AND dark) without harming text legibility, instead of
 * being hidden behind opaque section backgrounds.
 *
 * `pointer-events: none` keeps clicks/hovers passing through.
 * z-[5] sits above section backgrounds but below the navbar (z-50) and modals.
 *
 * Pure CSS animations on transform + opacity → GPU-accelerated, no JS loop.
 */
export const AmbientOrbs = () => {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[5] overflow-hidden"
      style={{ mixBlendMode: "soft-light" }}
    >
      <span className="ambient-orb ambient-orb--a" />
      <span className="ambient-orb ambient-orb--b" />
      <span className="ambient-orb ambient-orb--c" />
      <span className="ambient-orb ambient-orb--d" />
    </div>
  );
};

export default AmbientOrbs;
