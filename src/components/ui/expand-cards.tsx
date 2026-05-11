import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface ExpandCardItem {
  /** Unique id used for keying. */
  id: string;
  /** Image src — URL or data URI. */
  image: string;
  /** Optional alt text. */
  alt?: string;
  /** Optional content rendered as overlay when this card is expanded. */
  expandedContent?: ReactNode;
  /** Optional content rendered when this card is collapsed (vertical strip). */
  collapsedContent?: ReactNode;
}

export interface ExpandOnHoverProps {
  items: ExpandCardItem[];
  /** Index that starts expanded — defaults to 0. */
  defaultIndex?: number;
  /** Width of an expanded card. */
  expandedWidth?: string;
  /** Width of a collapsed card. */
  collapsedWidth?: string;
  /** Card height. */
  height?: string;
  className?: string;
}

const REM_PX = 16;
const GAP_PX = 8; // matches gap-2

/** Parse a CSS length string ("26rem" / "320px") to px. */
const toPx = (v: string): number => {
  const m = /^([\d.]+)(rem|px)?$/.exec(v.trim());
  if (!m) return 0;
  const n = parseFloat(m[1]);
  const unit = m[2] ?? "px";
  return unit === "rem" ? n * REM_PX : n;
};

/**
 * Horizontal row of cards. The hovered/tapped card expands into a wide
 * portrait, while the others collapse to a narrow strip showing only the edge
 * of their image. Smooth cross-fade between the states.
 *
 * The component measures its container and proportionally scales down both
 * widths and the height so the row always fits — useful on tablets/phones
 * where the desktop sizes would otherwise overflow.
 */
const ExpandOnHover = ({
  items,
  defaultIndex = 0,
  expandedWidth = "26rem",
  collapsedWidth = "5rem",
  height = "30rem",
  className,
}: ExpandOnHoverProps) => {
  const safeDefault = Math.max(0, Math.min(defaultIndex, items.length - 1));
  const [expanded, setExpanded] = useState(safeDefault);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => setContainerWidth(el.clientWidth);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    window.addEventListener("resize", update);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
    };
  }, []);

  const expandedPx = toPx(expandedWidth);
  const collapsedPx = toPx(collapsedWidth);
  const heightPx = toPx(height);
  const n = items.length;

  // Required width when fully laid out at requested sizes.
  const requiredPx = expandedPx + (n - 1) * collapsedPx + Math.max(0, n - 1) * GAP_PX;

  // Scale down (never up) when the container is narrower than required.
  const scale = containerWidth && requiredPx > containerWidth
    ? Math.max(0.4, containerWidth / requiredPx)
    : 1;

  const effExpanded = expandedPx * scale;
  const effCollapsed = collapsedPx * scale;
  const effHeight = heightPx * scale;

  return (
    <div
      ref={containerRef}
      className={cn(
        "flex w-full items-stretch justify-center gap-2",
        className
      )}
    >
      {items.map((item, idx) => {
        const isActive = idx === expanded;
        return (
          <div
            key={item.id}
            onMouseEnter={() => setExpanded(idx)}
            onFocus={() => setExpanded(idx)}
            onClick={() => setExpanded(idx)}
            tabIndex={0}
            role="button"
            aria-expanded={isActive}
            className="relative cursor-pointer overflow-hidden rounded-3xl outline-none focus-visible:ring-2 focus-visible:ring-primary transition-[width,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] shrink-0"
            style={{
              width: isActive ? effExpanded : effCollapsed,
              height: effHeight,
              boxShadow: isActive
                ? "0 30px 60px -15px rgba(0, 81, 85, 0.45)"
                : "0 10px 25px -10px rgba(0,0,0,0.25)",
            }}
          >
            <img
              src={item.image}
              alt={item.alt ?? ""}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{
                transform: isActive ? "scale(1.02)" : "scale(1.18)",
              }}
              loading="lazy"
            />

            {/* Expanded overlay — visible only on the active card */}
            {item.expandedContent && (
              <div
                className={cn(
                  "absolute inset-0 transition-opacity duration-500",
                  isActive ? "opacity-100" : "opacity-0 pointer-events-none"
                )}
              >
                {item.expandedContent}
              </div>
            )}

            {/* Collapsed-only overlay — visible when card is the narrow strip */}
            {item.collapsedContent && (
              <div
                className={cn(
                  "absolute inset-0 transition-opacity duration-500",
                  isActive ? "opacity-0 pointer-events-none" : "opacity-100"
                )}
              >
                {item.collapsedContent}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ExpandOnHover;
