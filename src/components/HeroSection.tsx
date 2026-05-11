import { motion } from "framer-motion";
import { Phone, Calendar, Plane, Globe2, ShieldCheck, ChevronDown } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";
import { AnnouncementBanner } from "@/components/AnnouncementBanner";

const stats = [
  { icon: Plane, value: "1st", label: "Migration Health Hub in Sri Lanka" },
  { icon: Globe2, value: "25+", label: "Destination Countries Served" },
  { icon: ShieldCheck, value: "24/7", label: "Travel Health Assistance" },
];

const HeroSection = ({ onBookClick }: { onBookClick: () => void }) => {
  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-visible pt-[72px] sm:pt-[88px] lg:pt-[100px]">
      {/* Background */}
      <div className="absolute inset-0">
        <img src={heroBg} alt="MEDIHUB Migration Health Hub" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-dark/85 via-slate-dark/70 to-slate-dark/40" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-12 lg:pt-20 pb-20 w-full">
        <div className="max-w-2xl">
          {/* Live announcement banner — managed via /admin/announcement */}
          <AnnouncementBanner />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-7 mt-12"
          >
            <div className="w-2 h-2 rounded-full bg-primary" />
            <span className="text-sm text-white/90 font-medium">Healing Hearts Caring Hands.</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-[1.1] mb-5"
          >
            Sri Lanka's First Dedicated{" "}
            <span className="text-primary">Migration Health Hub.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-white/75 max-w-lg mb-9 leading-relaxed"
          >
            MediHub brings together cutting-edge technology and expert medical care to give you faster, safer, and more convenient access to the treatment you need.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap gap-3"
          >
            <button
              onClick={onBookClick}
              className="btn-primary"
            >
              <Calendar className="w-5 h-5" />
              Book Appointment
            </button>
            <a href="tel:+1234567890" className="btn-outline !border-white/30 !text-white hover:!bg-white/10 hover:!border-white/50">
              <Phone className="w-5 h-5" />
              Travel Assistance 24/7
            </a>
          </motion.div>
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