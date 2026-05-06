import { Plane, Stethoscope, FlaskConical } from "lucide-react";

const ParallaxHero = () => {
  return (
    <div className="relative w-full overflow-hidden" style={{ minHeight: "560px" }}>
      {/* Layer 1 — gradient halo */}
      <div
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
        aria-hidden="true"
      >
        <div className="relative w-[1100px] h-[1100px] max-w-[160%]">
          <div
            className="absolute inset-0 rounded-full blur-[100px]"
            style={{
              background:
                "radial-gradient(circle at center, rgba(167, 243, 208, 0.7) 0%, rgba(204, 251, 241, 0.4) 45%, rgba(255,255,255,0) 75%)",
            }}
          />
          <div
            className="absolute inset-12 rounded-full blur-[80px]"
            style={{
              background:
                "radial-gradient(circle at center, rgba(110, 231, 183, 0.4) 0%, rgba(167, 243, 208, 0.1) 50%, rgba(255,255,255,0) 80%)",
            }}
          />
        </div>
      </div>

      {/* Layer 2 — horizon SVG */}
      <div
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 1200 600"
          className="w-full max-w-6xl opacity-[0.18]"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <linearGradient id="parallax-grad-1" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#42BEAD" />
              <stop offset="100%" stopColor="#40C7F4" />
            </linearGradient>
            <linearGradient id="parallax-grad-2" x1="0" y1="1" x2="1" y2="0">
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="100%" stopColor="#0EA5E9" />
            </linearGradient>
          </defs>
          <path
            d="M0 420 Q 300 280, 600 380 T 1200 360 L 1200 600 L 0 600 Z"
            fill="url(#parallax-grad-1)"
            opacity="0.6"
          />
          <circle cx="950" cy="200" r="120" fill="url(#parallax-grad-2)" opacity="0.35" />
          <circle cx="220" cy="160" r="72" fill="#42BEAD" opacity="0.25" />
          <path
            d="M 120 300 Q 600 80, 1080 300"
            fill="none"
            stroke="#0F766E"
            strokeWidth="2"
            strokeDasharray="2 8"
            opacity="0.6"
          />
        </svg>
      </div>

      {/* Title */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center max-w-4xl mx-auto px-6 py-32">
        <span className="inline-block text-xs uppercase tracking-[0.35em] font-bold text-primary mb-5">
          ✦ What We Do ✦
        </span>
        <h2 className="font-heading text-5xl sm:text-6xl lg:text-7xl font-extrabold text-slate-900 mb-6 leading-[1.02] tracking-tight">
          Two pillars.{" "}
          <span className="bg-gradient-to-r from-primary to-emerald-600 bg-clip-text text-transparent">
            One trusted hub.
          </span>
        </h2>
        <p className="text-lg sm:text-xl text-slate-600 leading-relaxed max-w-2xl">
          From cross-border migration health to everyday clinical care — MEDIHUB
          combines specialist migration expertise with a fully equipped clinic
          and laboratory under one roof.
        </p>
      </div>

      {/* Icon trio */}
      <div
        className="pointer-events-none absolute bottom-10 inset-x-0 flex items-center justify-center z-20"
        aria-hidden="true"
      >
        <div className="flex items-center gap-3 sm:gap-4 px-5 py-2.5 rounded-full bg-white/70 backdrop-blur-md border border-emerald-200/60 shadow-lg shadow-emerald-500/10">
          <Plane className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 -rotate-12" />
          <div className="w-6 sm:w-8 h-px bg-gradient-to-r from-emerald-400 to-teal-400" />
          <Stethoscope className="w-4 h-4 sm:w-5 sm:h-5 text-teal-600" />
          <div className="w-6 sm:w-8 h-px bg-gradient-to-l from-emerald-400 to-teal-400" />
          <FlaskConical className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white via-white/60 to-transparent" />
    </div>
  );
};

export default ParallaxHero;
