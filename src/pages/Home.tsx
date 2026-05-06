import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import {
  Plane,
  Globe2,
  ShieldCheck,
  Calendar,
  ArrowRight,
  Stethoscope,
  PlaneTakeoff,
  PlaneLanding,
  Star,
  Quote,
  Clock,
  Award,
  Microscope,
  Activity,
  HeartPulse,
  FlaskConical,
} from "lucide-react";
import HeroSection from "@/components/HeroSection";
import FeatureCarousel from "@/components/FeatureCarousel";
import ParallaxHero from "@/components/ParallaxHero";
import { ScrollProgress } from "@/components/animations/ScrollProgress";
import { AmbientOrbs } from "@/components/animations/AmbientOrbs";
import { DoctorsSection } from "@/components/DoctorsSection";

type LayoutContext = { openBooking: (service?: string, mode?: "consultation" | "migration") => void };

/* ------------------------------------------------------------------ */
/* Animated counter                                                    */
/* ------------------------------------------------------------------ */
const Counter = ({ to, suffix = "" }: { to: number; suffix?: string }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const duration = 1800;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      setVal(Math.floor(p * to));
      if (p < 1) requestAnimationFrame(tick);
      else setVal(to);
    };
    requestAnimationFrame(tick);
  }, [inView, to]);

  return (
    <span ref={ref}>
      {val.toLocaleString()}
      {suffix}
    </span>
  );
};

/* ------------------------------------------------------------------ */
/* Destination Marquee                                                 */
/* ------------------------------------------------------------------ */
const DestinationMarquee = () => {
  const destinations = [
    "🇸🇦 Saudi Arabia",
    "🇦🇪 UAE",
    "🇶🇦 Qatar",
    "🇰🇼 Kuwait",
    "🇴🇲 Oman",
    "🇧🇭 Bahrain",
    "🇯🇵 Japan",
    "🇩🇪 Germany",
    "🇮🇹 Italy",
    "🇫🇷 France",
    "🇪🇸 Spain",
    "🇸🇪 Sweden",
    "🇳🇱 Netherlands",
    "🇵🇱 Poland",
    "🇨🇦 Canada",
    "🇦🇺 Australia",
    "🇸🇬 Singapore",
    "🇰🇷 South Korea",
  ];
  const items = [...destinations, ...destinations];

  return (
    <section className="py-10 bg-slate-900 relative overflow-hidden border-y border-slate-800">
      <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-emerald-950/20 to-slate-900" />
      <div className="relative">
        <p className="text-center text-xs uppercase tracking-[0.3em] text-emerald-400 font-bold mb-6">
          ✦ Destinations We Serve ✦
        </p>
        <div className="flex overflow-hidden mask-fade">
          <motion.div
            className="flex gap-8 shrink-0"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          >
            {items.map((dest, i) => (
              <span
                key={i}
                className="text-lg font-semibold text-white/80 whitespace-nowrap flex items-center gap-2"
              >
                {dest}
                <span className="text-emerald-400">•</span>
              </span>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/* What We Do — Migration vs Clinic                                    */
/* ------------------------------------------------------------------ */
const WhatWeDo = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id="what-we-do"
      ref={ref}
      className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white via-slate-50 to-white relative overflow-hidden scroll-mt-20"
    >
      {/* Decorative blobs */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-emerald-100/50 rounded-full blur-[140px]" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-100/40 rounded-full blur-[140px]" />

      {/* Parallax-driven section header */}
      <ParallaxHero />

      <div className="max-w-7xl mx-auto relative">
        {/* Two pillars */}
        <div className="grid lg:grid-cols-12 gap-6">
          {/* MIGRATION — large pillar */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="lg:col-span-7 relative bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 rounded-[2.5rem] p-8 lg:p-10 text-white overflow-hidden group"
          >
            {/* Decorative */}
            <div className="absolute -top-20 -right-20 w-72 h-72 bg-emerald-500/20 rounded-full blur-3xl group-hover:bg-emerald-500/30 transition-all duration-700" />
            <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-teal-500/15 rounded-full blur-3xl" />
            <div
              className="absolute inset-0 opacity-[0.06]"
              style={{
                backgroundImage:
                  "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            />

            <div className="relative">
              {/* Header */}
              <div className="flex items-start justify-between mb-8">
                <div>
                  <div className="inline-flex items-center gap-2 bg-emerald-400/15 backdrop-blur-sm border border-emerald-400/30 rounded-full px-3 py-1 mb-4">
                    <Plane className="w-3.5 h-3.5 text-emerald-300 -rotate-12" />
                    <span className="text-[11px] font-bold text-emerald-200 uppercase tracking-widest">
                      Migration Health
                    </span>
                  </div>
                  <h3 className="font-heading text-3xl lg:text-4xl font-extrabold mb-3 leading-tight">
                    Care that crosses{" "}
                    <span className="bg-gradient-to-r from-emerald-300 to-teal-200 bg-clip-text text-transparent">
                      borders.
                    </span>
                  </h3>
                  <p className="text-white/70 leading-relaxed max-w-md">
                    Specialist health services for every stage of the migration journey — from visa medicals to in-flight escorts and destination care.
                  </p>
                </div>
              </div>

              {/* Two sub-cards: Outbound + Inbound */}
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  {
                    title: "Outbound",
                    tagline: "Going abroad",
                    desc: "Visa medicals, pre-departure prep, vaccinations, fitness-to-fly and medical escorts.",
                    icon: PlaneTakeoff,
                    to: "/services?tab=outbound",
                    badges: ["GAMCA / WAFID", "Japan SSW", "EU Visa"],
                  },
                  {
                    title: "Inbound",
                    tagline: "Arriving here",
                    desc: "Arrival check-ups, vaccinations, chronic care and telehealth for migrants in Sri Lanka.",
                    icon: PlaneLanding,
                    to: "/services?tab=inbound",
                    badges: ["Health Check-ups", "Telehealth", "Vaccinations"],
                  },
                ].map((sub, i) => (
                  <Link
                    key={i}
                    to={sub.to}
                    className="group/sub relative bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/10 hover:border-emerald-400/40 rounded-2xl p-6 transition-all duration-500 cursor-pointer block"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/30 group-hover/sub:scale-110 transition-transform">
                        <sub.icon className="w-6 h-6 text-white" />
                      </div>
                      <ArrowRight className="w-5 h-5 text-white/40 group-hover/sub:text-emerald-300 group-hover/sub:translate-x-1 transition-all" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-300 mb-1 block">
                      {sub.tagline}
                    </span>
                    <h4 className="font-heading text-xl font-extrabold mb-2 group-hover/sub:text-emerald-200 transition-colors">
                      {sub.title}
                    </h4>
                    <p className="text-sm text-white/60 leading-relaxed mb-4">{sub.desc}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {sub.badges.map((b) => (
                        <span
                          key={b}
                          className="text-[10px] font-semibold text-emerald-200 bg-emerald-400/10 border border-emerald-400/20 px-2 py-0.5 rounded-full"
                        >
                          {b}
                        </span>
                      ))}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>

          {/* CLINIC — single pillar */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="lg:col-span-5"
          >
            <Link
              to="/services?tab=clinic"
              className="group block relative bg-white border border-slate-200 hover:border-blue-300 rounded-[2.5rem] p-8 lg:p-10 h-full overflow-hidden hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500"
            >
              {/* Decorative */}
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-100/60 group-hover:bg-blue-200/70 rounded-full blur-3xl transition-all duration-700" />
              <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-cyan-100/40 rounded-full blur-3xl" />

              <div className="relative h-full flex flex-col">
                <div>
                  <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full px-3 py-1 mb-4">
                    <Microscope className="w-3.5 h-3.5 text-blue-600" />
                    <span className="text-[11px] font-bold text-blue-700 uppercase tracking-widest">
                      Clinic & Laboratory
                    </span>
                  </div>
                  <h3 className="font-heading text-3xl lg:text-4xl font-extrabold text-slate-900 mb-3 leading-tight">
                    Care that stays{" "}
                    <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                      close to home.
                    </span>
                  </h3>
                  <p className="text-slate-600 leading-relaxed mb-6">
                    Everyday primary care, comprehensive laboratory diagnostics, and family health check-ups — delivered with the same precision we bring to migration medicine.
                  </p>
                </div>

                {/* Service highlights */}
                <ul className="space-y-2.5 mb-8 flex-1">
                  {[
                    { icon: Stethoscope, label: "General Consultations" },
                    { icon: FlaskConical, label: "Laboratory & Diagnostics" },
                    { icon: HeartPulse, label: "Health Check-up Packages" },
                    { icon: Activity, label: "Chronic Disease Management" },
                  ].map((s, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-3 text-sm font-medium text-slate-700 bg-slate-50/70 border border-slate-100 rounded-xl px-4 py-3 group-hover:bg-blue-50/50 group-hover:border-blue-100 transition-colors"
                    >
                      <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <s.icon className="w-4 h-4 text-blue-600" />
                      </div>
                      {s.label}
                    </li>
                  ))}
                </ul>

                {/* CTA bar */}
                <div className="flex items-center justify-between gap-4 pt-5 border-t border-slate-100">
                  <span className="font-heading text-sm font-bold text-slate-900">Explore Clinic Services</span>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-110 group-hover:shadow-blue-500/50 transition-all">
                    <ArrowRight className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/* Stats                                                               */
/* ------------------------------------------------------------------ */
const Stats = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const stats = [
    { icon: Globe2, value: 25, suffix: "+", label: "Destination Countries", color: "from-emerald-500 to-teal-500" },
    { icon: Stethoscope, value: 10000, suffix: "+", label: "Migrants Served", color: "from-blue-500 to-cyan-500" },
    { icon: Award, value: 8, suffix: "", label: "Visa Categories", color: "from-amber-500 to-orange-500" },
    { icon: ShieldCheck, value: 24, suffix: "/7", label: "Travel Assistance", color: "from-rose-500 to-pink-500" },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white relative" ref={ref}>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 * i }}
              className="relative group"
            >
              <div className="relative bg-gradient-to-br from-slate-50 to-white border border-slate-200 rounded-3xl p-8 hover:shadow-xl hover:-translate-y-2 transition-all duration-500 overflow-hidden">
                <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full bg-gradient-to-br ${s.color} opacity-10 group-hover:opacity-20 transition-opacity blur-2xl`} />
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-5 shadow-lg`}>
                  <s.icon className="w-6 h-6 text-white" />
                </div>
                <div className="font-heading text-4xl font-extrabold text-slate-900 mb-1">
                  <Counter to={s.value} suffix={s.suffix} />
                </div>
                <div className="text-sm font-medium text-slate-500">{s.label}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/* Journey teaser                                                      */
/* ------------------------------------------------------------------ */
const JourneyTeaser = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const stages = [
    { num: "01", title: "Pre-departure", desc: "Health prep, screenings, vaccines" },
    { num: "02", title: "Visa Medicals", desc: "Country-specific assessments" },
    { num: "03", title: "In Transit", desc: "Telehealth & medical escorts" },
    { num: "04", title: "At Destination", desc: "Chronic care & telehealth" },
    { num: "05", title: "Inbound Support", desc: "Emergency & integration" },
  ];

  return (
    <section ref={ref} className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(13,148,136,0.15),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.1),transparent_50%)]" />

      <div className="max-w-7xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14 max-w-3xl mx-auto"
        >
          <span className="inline-block text-xs uppercase tracking-[0.3em] font-bold text-emerald-400 mb-4">
            ✦ The MEDIHUB Journey ✦
          </span>
          <h2 className="font-heading text-4xl sm:text-5xl font-extrabold mb-5 leading-tight">
            We support you at{" "}
            <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
              every stage
            </span>
          </h2>
          <p className="text-lg text-white/60">Before, during, and after your move.</p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {stages.map((stage, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 * i }}
              className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-emerald-400/40 transition-all duration-500"
            >
              <div className="font-heading text-5xl font-black bg-gradient-to-br from-emerald-400 to-teal-500 bg-clip-text text-transparent mb-3">
                {stage.num}
              </div>
              <h3 className="font-heading text-base font-bold mb-2">{stage.title}</h3>
              <p className="text-xs text-white/60 leading-relaxed">{stage.desc}</p>
              {i < stages.length - 1 && (
                <ArrowRight className="hidden md:block absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400/40 group-hover:text-emerald-400 transition-colors" />
              )}
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="text-center mt-12"
        >
          <Link
            to="/about"
            className="inline-flex items-center gap-2 text-emerald-400 font-semibold hover:text-emerald-300 transition-colors"
          >
            Learn more about our journey
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/* Why Choose                                                          */
/* ------------------------------------------------------------------ */
const WhyChoose = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="py-24 px-4 sm:px-6 lg:px-8 bg-white relative overflow-hidden">
      {/* Soft brand glow */}
      <div className="absolute -top-40 left-1/4 w-[500px] h-[500px] bg-emerald-100/60 rounded-full blur-[140px] -z-0" />
      <div className="absolute -bottom-40 right-1/4 w-[500px] h-[500px] bg-teal-100/50 rounded-full blur-[140px] -z-0" />

      <div className="max-w-7xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-14"
        >
          <span className="inline-block text-xs uppercase tracking-[0.3em] font-bold text-primary mb-4">
            ✦ Why MEDIHUB ✦
          </span>
          <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 mb-6 leading-[1.05] tracking-tight">
            Built for{" "}
            <span className="bg-gradient-to-r from-primary to-emerald-600 bg-clip-text text-transparent">
              migration
            </span>
            . Not adapted to it.
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed mb-8 max-w-2xl mx-auto">
            We aren't a clinic that happens to do visa medicals. We are a purpose-built migration health centre — every workflow, every specialist, every form is engineered for cross-border care.
          </p>
          <Link
            to="/about"
            className="inline-flex items-center gap-2 bg-slate-900 text-white font-semibold px-6 py-3 rounded-full hover:bg-slate-800 hover:-translate-y-0.5 transition-all"
          >
            Our Story
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <FeatureCarousel />
        </motion.div>
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/* Testimonials                                                        */
/* ------------------------------------------------------------------ */
const Testimonials = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const items = [
    {
      quote: "MEDIHUB caught a borderline issue at my pre-medical that would have failed my GAMCA. Their team helped me address it in two weeks — and I cleared without a hitch.",
      name: "Nuwan P.",
      role: "Driver, UAE",
    },
    {
      quote: "The Japan SSW process is intricate. MEDIHUB knew exactly what each form needed. I felt like I had a coach, not just a clinic.",
      name: "Tharushi S.",
      role: "Caregiver, Japan",
    },
    {
      quote: "We send 200+ workers a year through MEDIHUB. Priority scheduling and clean documentation — they understand recruitment timelines.",
      name: "Ranil de Silva",
      role: "Director, Recruitment Agency",
    },
  ];

  return (
    <section ref={ref} className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-100 rounded-full blur-[120px] -z-0" />

      <div className="max-w-7xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14 max-w-3xl mx-auto"
        >
          <span className="inline-block text-xs uppercase tracking-[0.3em] font-bold text-primary mb-4">
            ✦ Stories ✦
          </span>
          <h2 className="font-heading text-4xl sm:text-5xl font-extrabold text-slate-900 mb-5">
            Trusted by migrants and{" "}
            <span className="bg-gradient-to-r from-primary to-emerald-600 bg-clip-text text-transparent">
              the institutions
            </span>{" "}
            that move them.
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {items.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.15 * i }}
              whileHover={{ y: -6 }}
              className="bg-white border border-slate-200 rounded-3xl p-7 shadow-sm hover:shadow-xl transition-all duration-300 relative"
            >
              <Quote className="absolute top-6 right-6 w-10 h-10 text-emerald-100" />
              <div className="flex gap-0.5 mb-4">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-slate-700 leading-relaxed mb-6 relative z-10">"{t.quote}"</p>
              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-primary to-emerald-600 flex items-center justify-center text-white font-bold">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <div className="font-bold text-sm text-slate-900">{t.name}</div>
                  <div className="text-xs text-slate-500">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/* Final CTA                                                           */
/* ------------------------------------------------------------------ */
const FinalCTA = ({ onBook }: { onBook: () => void }) => {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative bg-gradient-to-br from-primary via-emerald-600 to-teal-700 rounded-[2.5rem] p-12 lg:p-16 overflow-hidden"
        >
          <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-amber-300/20 blur-3xl" />
          <div className="absolute top-0 left-0 w-full h-full opacity-[0.05]"
               style={{
                 backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
                 backgroundSize: "30px 30px",
               }}
          />

          <div className="relative grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <span className="inline-block text-xs uppercase tracking-[0.3em] font-bold text-amber-200 mb-4">
                ✦ Ready to Begin? ✦
              </span>
              <h2 className="font-heading text-4xl sm:text-5xl font-extrabold text-white mb-5 leading-tight">
                Your migration journey deserves expert care.
              </h2>
              <p className="text-white/80 text-lg leading-relaxed">
                Whether it's a visa medical, pre-departure consultation, clinic visit, or corporate partnership — we're ready to help you take the next step.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 lg:items-end">
              <button
                onClick={onBook}
                className="group inline-flex items-center justify-center gap-2 bg-white text-primary font-bold px-7 py-4 rounded-full shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
              >
                <Calendar className="w-5 h-5" />
                Book Appointment
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-md border-2 border-white/30 text-white font-semibold px-7 py-4 rounded-full hover:bg-white/20 transition-colors"
              >
                Talk to our team
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */
const Home = () => {
  const ctx = useOutletContext<LayoutContext>();
  return (
    <>
      <ScrollProgress />
      <AmbientOrbs />
      <HeroSection onBookClick={ctx.openBooking} />
      <DestinationMarquee />
      <WhatWeDo />
      <Stats />
      <JourneyTeaser />
      <WhyChoose />
      <DoctorsSection />
      <Testimonials />
      <FinalCTA onBook={ctx.openBooking} />
    </>
  );
};

export default Home;
