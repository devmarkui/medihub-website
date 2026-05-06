import { motion, useScroll, useSpring } from "framer-motion";

/**
 * Slim gradient bar fixed at the top of the viewport that fills as the user
 * scrolls the page. A signature premium touch — no scroll hijacking, just
 * reads window scroll progress and animates a CSS transform.
 */
export const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 28,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden
      className="fixed top-0 left-0 right-0 h-[3px] origin-left z-[100] pointer-events-none bg-gradient-to-r from-primary via-cyan-400 to-emerald-400 shadow-[0_0_14px_rgba(66,190,173,0.55)]"
      style={{ scaleX }}
    />
  );
};

export default ScrollProgress;
