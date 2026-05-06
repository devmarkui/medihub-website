import { motion } from "framer-motion";
import { ChevronRight, Plane } from "lucide-react";
import { Link } from "react-router-dom";

interface PageHeroProps {
  eyebrow: string;
  title: React.ReactNode;
  description: string;
  breadcrumb: string;
  imageSrc?: string;
  imageAlt?: string;
}

const defaultImage =
  "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1800&q=80";

const PageHero = ({
  eyebrow,
  title,
  description,
  breadcrumb,
  imageSrc = defaultImage,
  imageAlt = "MEDIHUB clinical team",
}: PageHeroProps) => {
  return (
    <section className="relative overflow-hidden bg-brand-dark min-h-[680px] lg:min-h-[720px]">
      {/* ── Full-bleed background image with slow Ken Burns ── */}
      <motion.div
        initial={{ opacity: 0, scale: 1.08 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0"
      >
        <img
          src={imageSrc}
          alt={imageAlt}
          loading="eager"
          className="w-full h-full object-cover"
        />
      </motion.div>

      {/* ── Multi-layer brand tint for editorial depth ── */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-dark/90 via-[#003a3d]/55 to-brand-dark/40 mix-blend-multiply" />
      <div className="absolute inset-0 bg-gradient-to-r from-brand-dark/80 via-brand-dark/30 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-brand-dark via-brand-dark/70 to-transparent" />
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-brand-dark/70 to-transparent" />

      {/* ── Decorative blobs ── */}
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-brand-teal/15 rounded-full blur-[120px]" />
      <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] bg-brand-cyan/12 rounded-full blur-[120px]" />

      {/* ── Subtle grid texture ── */}
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* ── Inset magazine-cover frame ── */}
      <div className="absolute inset-3 sm:inset-5 lg:inset-6 rounded-[2rem] border border-white/15 pointer-events-none" />
      <div className="absolute inset-3 sm:inset-5 lg:inset-6 rounded-[2rem] ring-1 ring-inset ring-white/5 pointer-events-none" />

      {/* ── Top hairline accent ── */}
      <div className="absolute top-3 sm:top-5 lg:top-6 inset-x-20 sm:inset-x-32 lg:inset-x-44 h-px bg-gradient-to-r from-transparent via-brand-cyan/50 to-transparent" />

      {/* ── Content ── */}
      <div className="relative pt-32 lg:pt-40 pb-28 lg:pb-36 max-w-7xl mx-auto px-6 sm:px-10 lg:px-14">
        <div className="max-w-3xl">
          <motion.nav
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2 text-sm text-white/50 mb-7"
          >
            <Link to="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-white/80">{breadcrumb}</span>
          </motion.nav>

          {/* Editorial eyebrow with side dashes */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex items-center gap-3 mb-6"
          >
            <div className="w-10 h-px bg-gradient-to-r from-transparent to-brand-teal" />
            <span className="text-[11px] uppercase tracking-[0.35em] font-bold text-brand-teal">
              {eyebrow}
            </span>
            <div className="w-10 h-px bg-gradient-to-l from-transparent to-brand-teal" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="font-heading text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-[1.04] tracking-tight mb-7 drop-shadow-[0_4px_30px_rgba(0,0,0,0.45)]"
          >
            {title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-lg sm:text-xl text-white/80 leading-relaxed max-w-2xl"
          >
            {description}
          </motion.p>
        </div>
      </div>

      {/* ── Floating glass info plaque (bottom-right) ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.55 }}
        className="absolute bottom-10 lg:bottom-14 right-6 sm:right-12 lg:right-16 hidden md:block"
      >
        <div className="relative max-w-[280px] bg-white/[0.07] backdrop-blur-2xl border border-white/15 rounded-2xl p-5 shadow-2xl shadow-black/60">
          <div className="absolute -top-px left-8 right-8 h-px bg-gradient-to-r from-transparent via-brand-cyan/60 to-transparent" />
          <div className="flex items-start gap-3 mb-3">
            <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-brand-teal to-brand-cyan flex items-center justify-center shadow-lg shadow-brand-cyan/30">
              <Plane className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0">
              <div className="text-[9px] uppercase tracking-[0.25em] font-bold text-white/60">
                MEDIHUB
              </div>
              <div className="text-sm font-extrabold text-white">
                Migration Health Hub
              </div>
            </div>
          </div>
          <p className="text-[11px] text-white/70 leading-relaxed">
            Sri Lanka's first dedicated, concierge-led partner for migration medicine.
          </p>
        </div>
      </motion.div>

      {/* ── Scroll cue ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden lg:flex flex-col items-center gap-2 pointer-events-none"
      >
        <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-white/45">
          Scroll
        </span>
        <motion.div
          animate={{ scaleY: [0.4, 1, 0.4], opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "top" }}
          className="w-px h-8 bg-gradient-to-b from-white/70 to-transparent"
        />
      </motion.div>
    </section>
  );
};

export default PageHero;
