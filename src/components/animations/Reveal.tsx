import { motion, useInView, type Variants } from "framer-motion";
import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  /** Distance (px) the element starts below its final position. */
  y?: number;
  /** When true, animation only fires once per page load (default). */
  once?: boolean;
  /** When true, children animate in with a stagger between them. */
  stagger?: boolean;
  staggerDelay?: number;
  as?: "div" | "section" | "ul" | "ol" | "span";
};

const baseVariants = (y: number, delay: number): Variants => ({
  hidden: { opacity: 0, y, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.85,
      delay,
      // Custom premium easing — slow-in, fast-out, no bounce
      ease: [0.22, 1, 0.36, 1],
    },
  },
});

const containerVariants = (delay: number, staggerDelay: number): Variants => ({
  hidden: {},
  show: {
    transition: {
      delayChildren: delay,
      staggerChildren: staggerDelay,
    },
  },
});

/**
 * Reveal — drop-in wrapper that fades + slides + un-blurs its children
 * the first time they scroll into view. Premium curated easing, no springs.
 *
 *   <Reveal>...</Reveal>
 *   <Reveal stagger>{items.map(i => <Reveal.Item key={i}>...</Reveal.Item>)}</Reveal>
 */
export const Reveal = ({
  children,
  className,
  delay = 0,
  y = 28,
  once = true,
  stagger = false,
  staggerDelay = 0.1,
  as = "div",
}: RevealProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once, margin: "-80px" });
  const MotionTag = motion[as] as typeof motion.div;

  return (
    <MotionTag
      ref={ref}
      className={cn(className)}
      initial="hidden"
      animate={inView ? "show" : "hidden"}
      variants={
        stagger ? containerVariants(delay, staggerDelay) : baseVariants(y, delay)
      }
    >
      {children}
    </MotionTag>
  );
};

/** Child of `<Reveal stagger>` — animates in as part of the stagger sequence. */
Reveal.Item = function RevealItem({
  children,
  className,
  y = 24,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  y?: number;
  as?: "div" | "li" | "span";
}) {
  const MotionTag = motion[as] as typeof motion.div;
  return (
    <MotionTag
      className={cn(className)}
      variants={{
        hidden: { opacity: 0, y, filter: "blur(4px)" },
        show: {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
        },
      }}
    >
      {children}
    </MotionTag>
  );
};

export default Reveal;
