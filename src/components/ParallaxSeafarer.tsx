import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Anchor, Compass, LifeBuoy, Ship, Waves } from "lucide-react";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?auto=format&fit=crop&w=2000&q=85";
const MID_IMAGE =
  "https://images.unsplash.com/photo-1505761671935-60b3a7427bad?auto=format&fit=crop&w=2000&q=85";

/**
 * Multi-layer parallax hero for the Seafarer Medical section.
 * Layers move at different scroll speeds to give true depth.
 */
export const ParallaxSeafarer = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Background image drifts slowly (slowest layer)
  const bgY = useTransform(scrollYProgress, [0, 1], ["-8%", "20%"]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1.15, 1.3]);

  // Mid layer (waves overlay) moves a bit faster
  const waveY = useTransform(scrollYProgress, [0, 1], ["0%", "-25%"]);

  // Foreground content (title) moves fastest in the opposite direction
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "-40%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6, 1], [1, 1, 0.2]);

  // Floating decorative items
  const floatA = useTransform(scrollYProgress, [0, 1], ["0%", "-60%"]);
  const floatB = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);
  const floatC = useTransform(scrollYProgress, [0, 1], ["0%", "-90%"]);

  return (
    <section
      ref={ref}
      className="relative h-[100vh] min-h-[640px] overflow-hidden bg-slate-950"
    >
      {/* Layer 1 — Background image (slowest) */}
      <motion.div
        style={{ y: bgY, scale: bgScale }}
        className="absolute inset-0 -top-[8%] -bottom-[8%]"
      >
        <img
          src={HERO_IMAGE}
          alt="Cargo ship at sea — Seafarer Medical at MEDIHUB"
          className="w-full h-full object-cover"
          loading="eager"
        />
      </motion.div>

      {/* Layer 2 — Brand tint / depth gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950/85 via-blue-950/55 to-slate-950/40 mix-blend-multiply" />
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-950/30 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent" />

      {/* Layer 3 — Animated wave SVG (mid speed) */}
      <motion.div
        style={{ y: waveY }}
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[60%]"
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 1440 320"
          className="absolute bottom-0 w-full"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="wave-grad-1" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0EA5E9" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#0F172A" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="wave-grad-2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#22D3EE" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#0F172A" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            fill="url(#wave-grad-1)"
            d="M0,160 C320,260 640,80 960,140 C1200,180 1320,200 1440,160 L1440,320 L0,320 Z"
          />
          <path
            fill="url(#wave-grad-2)"
            d="M0,220 C200,180 400,260 720,220 C1040,180 1280,260 1440,220 L1440,320 L0,320 Z"
          />
        </svg>
      </motion.div>

      {/* Decorative floating icons (different speeds) */}
      <motion.div
        style={{ y: floatA }}
        className="absolute top-[18%] right-[12%] hidden md:block pointer-events-none"
        aria-hidden="true"
      >
        <div className="w-14 h-14 rounded-2xl bg-cyan-400/15 backdrop-blur-md border border-cyan-300/30 flex items-center justify-center shadow-xl shadow-cyan-900/40">
          <Compass className="w-7 h-7 text-cyan-200" />
        </div>
      </motion.div>
      <motion.div
        style={{ y: floatB }}
        className="absolute top-[35%] right-[6%] hidden md:block pointer-events-none"
        aria-hidden="true"
      >
        <div className="w-12 h-12 rounded-2xl bg-blue-400/15 backdrop-blur-md border border-blue-300/30 flex items-center justify-center shadow-xl shadow-blue-900/40">
          <Anchor className="w-6 h-6 text-blue-200" />
        </div>
      </motion.div>
      <motion.div
        style={{ y: floatC }}
        className="absolute top-[60%] right-[20%] hidden md:block pointer-events-none"
        aria-hidden="true"
      >
        <div className="w-10 h-10 rounded-xl bg-sky-400/15 backdrop-blur-md border border-sky-300/30 flex items-center justify-center shadow-xl shadow-sky-900/40">
          <LifeBuoy className="w-5 h-5 text-sky-200" />
        </div>
      </motion.div>

      {/* Inset magazine frame */}
      <div className="absolute inset-3 sm:inset-5 lg:inset-6 rounded-[2rem] border border-white/15 pointer-events-none" />

      {/* Layer 4 — Content (fastest) */}
      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative h-full flex items-center"
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-14 pt-28 lg:pt-32 pb-20 w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-3xl"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-px bg-gradient-to-r from-transparent to-cyan-300" />
              <span className="text-[11px] uppercase tracking-[0.35em] font-bold text-cyan-300">
                Seafarer Medical
              </span>
              <div className="w-10 h-px bg-gradient-to-l from-transparent to-cyan-300" />
            </div>

            <h1 className="font-heading text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-[1.04] tracking-tight mb-7 drop-shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
              Fit for the open sea —{" "}
              <span className="bg-gradient-to-r from-cyan-300 via-sky-300 to-blue-300 bg-clip-text text-transparent">
                certified for service.
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-white/85 leading-relaxed max-w-2xl mb-8">
              Comprehensive seafarer medical examinations aligned with{" "}
              <span className="font-semibold text-white">MLC 2006</span> and{" "}
              <span className="font-semibold text-white">ILO/WHO</span> international
              maritime health standards — issued with the certification you need to
              sign on.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <a
                href="#seafarer-services"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold px-6 py-3 rounded-full shadow-xl shadow-cyan-900/50 hover:-translate-y-0.5 transition-transform"
              >
                <Ship className="w-5 h-5" />
                Explore Examinations
              </a>
              <a
                href="#seafarer-cta"
                className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/25 text-white font-semibold px-6 py-3 rounded-full hover:bg-white/20 transition-colors"
              >
                Book Assessment
              </a>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-2">
              {["MLC 2006", "ILO/WHO Aligned", "Flag-State Ready", "Certified Reports"].map(
                (badge) => (
                  <span
                    key={badge}
                    className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-cyan-100 bg-white/10 border border-white/20 px-3 py-1.5 rounded-full backdrop-blur-md"
                  >
                    <Waves className="w-3 h-3" />
                    {badge}
                  </span>
                ),
              )}
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll cue */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden lg:flex flex-col items-center gap-2 pointer-events-none">
        <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-white/50">
          Scroll
        </span>
        <motion.div
          animate={{ scaleY: [0.4, 1, 0.4], opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "top" }}
          className="w-px h-8 bg-gradient-to-b from-white/70 to-transparent"
        />
      </div>
    </section>
  );
};

/**
 * Mid-section parallax band — used between content blocks to keep the
 * "depth" feeling consistent across the Seafarer page.
 */
export const ParallaxBand = ({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1.1, 1.2]);
  const textY = useTransform(scrollYProgress, [0, 1], ["30%", "-30%"]);

  return (
    <section
      ref={ref}
      className="relative h-[55vh] min-h-[380px] overflow-hidden bg-slate-950"
    >
      <motion.div
        style={{ y: bgY, scale: bgScale }}
        className="absolute inset-0 -top-[10%] -bottom-[10%]"
      >
        <img
          src={MID_IMAGE}
          alt="Container ship at port"
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950/80 via-blue-950/55 to-slate-950/70" />

      <motion.div
        style={{ y: textY }}
        className="relative h-full flex items-center justify-center text-center px-6"
      >
        <div className="max-w-3xl">
          <span className="inline-block text-[11px] uppercase tracking-[0.35em] font-bold text-cyan-300 mb-4">
            ✦ International Maritime Standards ✦
          </span>
          <h3 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-4">
            {title}
          </h3>
          <p className="text-white/75 text-base sm:text-lg leading-relaxed">{subtitle}</p>
        </div>
      </motion.div>
    </section>
  );
};

export default ParallaxSeafarer;
