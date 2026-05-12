import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { Phone, Calendar, Plane, Globe2, ShieldCheck, ChevronDown, ArrowRight } from "lucide-react";
import { AnnouncementBanner } from "@/components/AnnouncementBanner";

type Slide = {
  image: string;
  eyebrow: string;
  title: React.ReactNode;
  description: string;
  cta?: { label: string; to: string };
  align?: "left" | "center";
};

const slides: Slide[] = [
  {
    image: "/hero1.jpeg",
    eyebrow: "Welcome to MEDIHUB",
    title: (
      <>
        Sri Lanka's First Dedicated{" "}
        <span className="text-primary">Migration Health Hub.</span>
      </>
    ),
    description:
      "World-class care built for every migrant, traveler, and family we serve.",
    align: "left",
  },
  {
    image:
      "https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?auto=format&fit=crop&w=1920&q=80",
    eyebrow: "Inbound Migrant Health",
    title: (
      <>
        Just arrived?{" "}
        <span className="text-primary">Welcome to expert care.</span>
      </>
    ),
    description:
      "Arrival check-ups, vaccinations, chronic care, and telehealth — supporting your healthy integration into Sri Lanka.",
    cta: { label: "Learn More", to: "/services?tab=inbound" },
    align: "left",
  },
  {
    image:
      "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1920&q=80",
    eyebrow: "Outbound Migrant Health",
    title: (
      <>
        Going abroad?{" "}
        <span className="text-primary">We've got you covered.</span>
      </>
    ),
    description:
      "From visa medicals to complete pre-departure preparation — every form, every screening, every certificate handled by specialists.",
    cta: { label: "Learn More", to: "/services?tab=outbound" },
    align: "left",
  },
  {
    image:
      "https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=1920&q=80",
    eyebrow: "Travel Health",
    title: (
      <>
        Healthy journeys.{" "}
        <span className="text-primary">Anywhere you go.</span>
      </>
    ),
    description:
      "Pre-travel consultations, vaccinations, and 24/7 assistance for local and international travelers.",
    cta: { label: "Explore Travels", to: "/travels" },
    align: "left",
  },
];

const stats = [
  { icon: Plane, value: "1st", label: "Migration Health Hub in Sri Lanka" },
  { icon: Globe2, value: "25+", label: "Destination Countries Served" },
  { icon: ShieldCheck, value: "24/7", label: "Travel Health Assistance" },
];

const AUTO_ADVANCE_MS = 4000;

const HeroSection = ({ onBookClick }: { onBookClick: () => void }) => {
  const [index, setIndex] = useState(0);
  const [ready, setReady] = useState(false);

  const goTo = useCallback((i: number) => {
    setIndex(((i % slides.length) + slides.length) % slides.length);
  }, []);

  // Preload every slide image, then start the carousel.
  // Prevents the first/last slides from appearing blank before they finish downloading.
  useEffect(() => {
    let cancelled = false;
    Promise.all(
      slides.map(
        (s) =>
          new Promise<void>((resolve) => {
            const img = new Image();
            img.onload = () => resolve();
            img.onerror = () => resolve();
            img.src = s.image;
          })
      )
    ).then(() => {
      if (!cancelled) setReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!ready) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, AUTO_ADVANCE_MS);
    return () => window.clearInterval(id);
  }, [ready]);

  const slide = slides[index];

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center overflow-visible pt-[72px] sm:pt-[88px] lg:pt-[100px]"
    >
      {/* Sliding background images */}
      <div className="absolute inset-0 overflow-hidden">
        <AnimatePresence mode="sync">
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{
              opacity: { duration: 1.1, ease: [0.22, 1, 0.36, 1] },
              scale: { duration: 6, ease: "linear" },
            }}
            className="absolute inset-0"
          >
            <img
              src={slide.image}
              alt={slide.eyebrow}
              className="w-full h-full object-cover"
              draggable={false}
              loading="eager"
              decoding="async"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-dark/90 via-slate-dark/75 to-slate-dark/40" />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-12 lg:pt-20 pb-20 w-full">
        <div className="max-w-2xl">
          <AnnouncementBanner />

          <AnimatePresence mode="wait">
            <motion.div
              key={`eyebrow-${index}`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-7 mt-12"
            >
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-sm text-white/90 font-medium">{slide.eyebrow}</span>
            </motion.div>
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <motion.h1
              key={`title-${index}`}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.55, delay: 0.05 }}
              className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-[1.1] mb-5"
            >
              {slide.title}
            </motion.h1>
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <motion.p
              key={`desc-${index}`}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.55, delay: 0.1 }}
              className="text-lg text-white/80 max-w-lg mb-9 leading-relaxed"
            >
              {slide.description}
            </motion.p>
          </AnimatePresence>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-wrap items-center gap-3"
          >
            <button onClick={onBookClick} className="btn-primary">
              <Calendar className="w-5 h-5" />
              Book Appointment
            </button>

            <AnimatePresence mode="wait">
              {slide.cta ? (
                <motion.div
                  key={`cta-${index}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.4 }}
                >
                  <Link
                    to={slide.cta.to}
                    className="inline-flex items-center gap-2 bg-white text-slate-900 font-semibold px-5 py-2.5 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
                  >
                    {slide.cta.label}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </motion.div>
              ) : (
                <motion.a
                  key="phone"
                  href="tel:+1234567890"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.4 }}
                  className="btn-outline !border-white/30 !text-white hover:!bg-white/10 hover:!border-white/50"
                >
                  <Phone className="w-5 h-5" />
                  Travel Assistance 24/7
                </motion.a>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Slide indicators */}
          <div className="flex items-center gap-2 mt-10">
            {slides.map((s, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Go to slide ${i + 1}: ${s.eyebrow}`}
                className="group relative h-1.5 rounded-full overflow-hidden transition-all duration-500"
                style={{ width: i === index ? 36 : 16 }}
              >
                <span className="absolute inset-0 bg-white/30" />
                {i === index && (
                  <motion.span
                    key={`progress-${index}`}
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: AUTO_ADVANCE_MS / 1000, ease: "linear" }}
                    className="absolute inset-y-0 left-0 bg-white"
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-12 sm:mt-16 bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4 sm:p-6 max-w-2xl"
        >
          <div className="grid grid-cols-3 divide-x divide-white/15">
            {stats.map((stat, i) => (
              <div key={i} className="text-center px-2 sm:px-4">
                <stat.icon className="w-5 h-5 text-primary mx-auto mb-2" />
                <div className="font-heading text-xl sm:text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-[10px] sm:text-xs text-white/60 mt-0.5 leading-tight">{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Scroll down arrow */}
      <motion.a
        href="#what-we-do"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="w-8 h-8 text-white/60 hover:text-white/90 transition-colors cursor-pointer" />
        </motion.div>
      </motion.a>
    </section>
  );
};

export default HeroSection;
