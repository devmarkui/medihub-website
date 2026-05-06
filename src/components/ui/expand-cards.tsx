import { useState, type ReactNode } from "react";
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

/**
 * Horizontal row of cards. The hovered (or active) card expands into a wide
 * portrait, while the others collapse to a narrow strip showing only the edge
 * of their image. Smooth 500ms cross-fade between the collapsed and expanded
 * states. Falls back to a regular grid on small screens via the consumer.
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

  return (
    <div
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
            tabIndex={0}
            className="relative cursor-pointer overflow-hidden rounded-3xl outline-none focus-visible:ring-2 focus-visible:ring-primary transition-[width,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] shrink-0"
            style={{
              width: isActive ? expandedWidth : collapsedWidth,
              height,
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
