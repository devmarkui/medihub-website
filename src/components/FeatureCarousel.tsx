import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  HeartHandshake,
  Globe2,
  Sparkles,
  Calendar,
  Languages,
  FileCheck,
  ClipboardCheck,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Feature = {
  id: string;
  label: string;
  icon: LucideIcon;
  image: string;
  description: string;
};

const FEATURES: Feature[] = [
  {
    id: "certified",
    label: "Authorized & Certified",
    icon: ShieldCheck,
    image:
      "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1200&q=80",
    description:
      "GAMCA / WAFID compliant for GCC, structured for Japan SSW & TITP, and full EU embassy documentation.",
  },
  {
    id: "continuum",
    label: "End-to-End Continuum",
    icon: HeartHandshake,
    image:
      "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&w=1200&q=80",
    description:
      "From pre-medicals to destination chronic care — we don't hand you off, we walk with you.",
  },
  {
    id: "expertise",
    label: "Cross-Border Expertise",
    icon: Globe2,
    image:
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80",
    description:
      "Travel medicine specialists who understand destination realities, not just clinical checklists.",
  },
  {
    id: "centred",
    label: "Person-Centred Care",
    icon: Sparkles,
    image:
      "https://images.unsplash.com/photo-1581595220892-b0739db3ba8c?auto=format&fit=crop&w=1200&q=80",
    description:
      "Cultural sensitivity, confidentiality, and compassion are built into every interaction.",
  },
  {
    id: "concierge",
    label: "Concierge Booking",
    icon: Calendar,
    image:
      "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1200&q=80",
    description:
      "Reach out and we'll confirm your appointment personally — usually within 24 hours.",
  },
  {
    id: "multilingual",
    label: "Multilingual Team",
    icon: Languages,
    image:
      "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=1200&q=80",
    description:
      "English, සිංහල, and 中文 spoken — we communicate in the language you trust.",
  },
  {
    id: "embassy",
    label: "Embassy-Ready",
    icon: FileCheck,
    image:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80",
    description:
      "Documentation prepared to embassy standards — every form, every certificate, every signature.",
  },
  {
    id: "safety",
    label: "Pre-medical Safety Net",
    icon: ClipboardCheck,
    image:
      "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&w=1200&q=80",
    description:
      "Spot borderline issues before your official medical — and address them in time.",
  },
];

const AUTO_PLAY_INTERVAL = 3000;
const ITEM_HEIGHT = 65;

const wrap = (min: number, max: number, v: number) => {
  const rangeSize = max - min;
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
};

export default function FeatureCarousel() {
  const [step, setStep] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const currentIndex =
    ((step % FEATURES.length) + FEATURES.length) % FEATURES.length;

  const nextStep = useCallback(() => {
    setStep((prev) => prev + 1);
  }, []);

  const handleChipClick = (index: number) => {
    const diff = (index - currentIndex + FEATURES.length) % FEATURES.length;
    if (diff > 0) setStep((s) => s + diff);
  };

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(nextStep, AUTO_PLAY_INTERVAL);
    return () => clearInterval(interval);
  }, [nextStep, isPaused]);

  const getCardStatus = (index: number) => {
    const diff = index - currentIndex;
    const len = FEATURES.length;

    let normalizedDiff = diff;
    if (diff > len / 2) normalizedDiff -= len;
    if (diff < -len / 2) normalizedDiff += len;

    if (normalizedDiff === 0) return "active";
    if (normalizedDiff === -1) return "prev";
    if (normalizedDiff === 1) return "next";
    return "hidden";
  };

  return (
    <div className="w-full max-w-7xl mx-auto md:p-2">
      <div className="relative overflow-hidden rounded-[2.5rem] lg:rounded-[3.5rem] flex flex-col lg:flex-row min-h-[600px] lg:aspect-video border border-slate-200 shadow-2xl shadow-emerald-900/10">
        {/* ── Left: chip menu (brand teal/emerald) ── */}
        <div className="w-full lg:w-[42%] min-h-[350px] md:min-h-[450px] lg:h-full relative z-30 flex flex-col items-start justify-center overflow-hidden px-8 md:px-16 lg:pl-16 bg-gradient-to-br from-emerald-500 via-teal-500 to-emerald-600">
          {/* Decorative grid */}
          <div
            className="absolute inset-0 opacity-[0.08] pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
              backgroundSize: "44px 44px",
            }}
          />
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-white/10 rounded-full blur-[80px]" />
          <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-teal-300/30 rounded-full blur-[100px]" />

          {/* Top + bottom fades */}
          <div className="absolute inset-x-0 top-0 h-12 md:h-20 lg:h-16 bg-gradient-to-b from-emerald-500 via-emerald-500/80 to-transparent z-40 pointer-events-none" />
          <div className="absolute inset-x-0 bottom-0 h-12 md:h-20 lg:h-16 bg-gradient-to-t from-emerald-600 via-emerald-600/80 to-transparent z-40 pointer-events-none" />

          <div className="relative w-full h-full flex items-center justify-center lg:justify-start z-20">
            {FEATURES.map((feature, index) => {
              const isActive = index === currentIndex;
              const distance = index - currentIndex;
              const wrappedDistance = wrap(
                -(FEATURES.length / 2),
                FEATURES.length / 2,
                distance,
              );

              const Icon = feature.icon;

              return (
                <motion.div
                  key={feature.id}
                  style={{
                    height: ITEM_HEIGHT,
                    width: "fit-content",
                  }}
                  animate={{
                    y: wrappedDistance * ITEM_HEIGHT,
                    opacity: 1 - Math.abs(wrappedDistance) * 0.22,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 90,
                    damping: 22,
                    mass: 1,
                  }}
                  className="absolute flex items-center justify-start"
                >
                  <button
                    onClick={() => handleChipClick(index)}
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                    className={cn(
                      "relative flex items-center gap-3 px-5 md:px-8 lg:px-7 py-3 md:py-4 lg:py-3.5 rounded-full transition-all duration-700 text-left border whitespace-nowrap",
                      isActive
                        ? "bg-white text-emerald-700 border-white shadow-xl shadow-emerald-900/20 z-10"
                        : "bg-transparent text-white/65 border-white/25 hover:border-white/50 hover:text-white",
                    )}
                  >
                    <div
                      className={cn(
                        "flex items-center justify-center transition-colors duration-500",
                        isActive ? "text-emerald-600" : "text-white/65",
                      )}
                    >
                      <Icon size={18} strokeWidth={2} />
                    </div>

                    <span className="font-bold text-[13px] md:text-[14px] tracking-tight uppercase">
                      {feature.label}
                    </span>
                  </button>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* ── Right: image card stack ── */}
        <div className="flex-1 min-h-[500px] md:min-h-[600px] lg:h-full relative bg-gradient-to-br from-slate-50 to-emerald-50/30 flex items-center justify-center py-16 md:py-24 lg:py-16 px-6 md:px-12 lg:px-10 overflow-hidden border-t lg:border-t-0 lg:border-l border-slate-200/70">
          {/* Soft accent blob */}
          <div className="absolute -top-20 -right-20 w-72 h-72 bg-emerald-200/30 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-teal-200/30 rounded-full blur-[100px] pointer-events-none" />

          <div className="relative w-full max-w-[420px] aspect-[4/5] flex items-center justify-center">
            {FEATURES.map((feature, index) => {
              const status = getCardStatus(index);
              const isActive = status === "active";
              const isPrev = status === "prev";
              const isNext = status === "next";

              return (
                <motion.div
                  key={feature.id}
                  initial={false}
                  animate={{
                    x: isActive ? 0 : isPrev ? -100 : isNext ? 100 : 0,
                    scale: isActive ? 1 : isPrev || isNext ? 0.85 : 0.7,
                    opacity: isActive ? 1 : isPrev || isNext ? 0.4 : 0,
                    rotate: isPrev ? -3 : isNext ? 3 : 0,
                    zIndex: isActive ? 20 : isPrev || isNext ? 10 : 0,
                    pointerEvents: isActive ? "auto" : "none",
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 25,
                    mass: 0.8,
                  }}
                  className="absolute inset-0 rounded-[2rem] md:rounded-[2.8rem] overflow-hidden border-4 md:border-8 border-white bg-white origin-center shadow-2xl shadow-emerald-900/20"
                >
                  <img
                    src={feature.image}
                    alt={feature.label}
                    loading="eager"
                    draggable={false}
                    className={cn(
                      "w-full h-full object-cover transition-all duration-700",
                      isActive
                        ? "grayscale-0 blur-0"
                        : "grayscale blur-[2px] brightness-75",
                    )}
                  />

                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute inset-x-0 bottom-0 p-8 md:p-10 pt-28 bg-gradient-to-t from-black/95 via-black/50 to-transparent flex flex-col justify-end pointer-events-none"
                      >
                        <div className="bg-white text-slate-900 px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-[0.2em] w-fit shadow-lg mb-3 border border-slate-200">
                          {String(index + 1).padStart(2, "0")} • {feature.label}
                        </div>
                        <p className="text-white font-semibold text-lg md:text-xl lg:text-[22px] leading-tight drop-shadow-md tracking-tight">
                          {feature.description}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Top-left status indicator */}
                  <div
                    className={cn(
                      "absolute top-6 md:top-8 left-6 md:left-8 flex items-center gap-3 transition-opacity duration-300",
                      isActive ? "opacity-100" : "opacity-0",
                    )}
                  >
                    <div className="w-2 h-2 rounded-full bg-white shadow-[0_0_10px_white]" />
                    <span className="text-white/85 text-[10px] font-bold uppercase tracking-[0.3em]">
                      MEDIHUB Care
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
