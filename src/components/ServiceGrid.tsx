import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { LucideIcon } from "lucide-react";

export type ServiceGridItem = {
  icon: LucideIcon;
  title: string;
  desc: string;
};

type Accent = "emerald" | "blue" | "teal" | "amber" | "violet" | "slate";

type AccentStyles = {
  eyebrow: string;
  iconBg: string;
  iconText: string;
  glow: string;
  ring: string;
  hoverShadow: string;
  gradient: string;
};

const accents: Record<Accent, AccentStyles> = {
  emerald: {
    eyebrow: "text-emerald-600",
    iconBg: "bg-emerald-50 group-hover:bg-gradient-to-br group-hover:from-emerald-500 group-hover:to-teal-600",
    iconText: "text-emerald-600 group-hover:text-white",
    glow: "from-emerald-100/50 to-teal-100/50",
    ring: "hover:border-emerald-300",
    hoverShadow: "hover:shadow-emerald-500/10",
    gradient: "from-emerald-500 to-teal-600",
  },
  blue: {
    eyebrow: "text-blue-600",
    iconBg: "bg-blue-50 group-hover:bg-gradient-to-br group-hover:from-blue-500 group-hover:to-cyan-600",
    iconText: "text-blue-600 group-hover:text-white",
    glow: "from-blue-100/50 to-cyan-100/50",
    ring: "hover:border-blue-300",
    hoverShadow: "hover:shadow-blue-500/10",
    gradient: "from-blue-500 to-cyan-600",
  },
  teal: {
    eyebrow: "text-teal-600",
    iconBg: "bg-teal-50 group-hover:bg-gradient-to-br group-hover:from-teal-500 group-hover:to-emerald-600",
    iconText: "text-teal-600 group-hover:text-white",
    glow: "from-teal-100/50 to-emerald-100/50",
    ring: "hover:border-teal-300",
    hoverShadow: "hover:shadow-teal-500/10",
    gradient: "from-teal-500 to-emerald-600",
  },
  amber: {
    eyebrow: "text-amber-600",
    iconBg: "bg-amber-50 group-hover:bg-gradient-to-br group-hover:from-amber-500 group-hover:to-orange-600",
    iconText: "text-amber-600 group-hover:text-white",
    glow: "from-amber-100/50 to-orange-100/50",
    ring: "hover:border-amber-300",
    hoverShadow: "hover:shadow-amber-500/10",
    gradient: "from-amber-500 to-orange-600",
  },
  violet: {
    eyebrow: "text-violet-600",
    iconBg: "bg-violet-50 group-hover:bg-gradient-to-br group-hover:from-violet-500 group-hover:to-fuchsia-600",
    iconText: "text-violet-600 group-hover:text-white",
    glow: "from-violet-100/50 to-fuchsia-100/50",
    ring: "hover:border-violet-300",
    hoverShadow: "hover:shadow-violet-500/10",
    gradient: "from-violet-500 to-fuchsia-600",
  },
  slate: {
    eyebrow: "text-slate-600",
    iconBg: "bg-slate-100 group-hover:bg-gradient-to-br group-hover:from-slate-700 group-hover:to-slate-900",
    iconText: "text-slate-700 group-hover:text-white",
    glow: "from-slate-100/50 to-slate-200/50",
    ring: "hover:border-slate-300",
    hoverShadow: "hover:shadow-slate-500/10",
    gradient: "from-slate-700 to-slate-900",
  },
};

type ServiceGridProps = {
  eyebrow: string;
  title: React.ReactNode;
  description?: string;
  items: ServiceGridItem[];
  accent?: Accent;
  background?: "white" | "muted" | "dark";
  columns?: 2 | 3 | 4;
};

export const ServiceGrid = ({
  eyebrow,
  title,
  description,
  items,
  accent = "emerald",
  background = "white",
  columns = 3,
}: ServiceGridProps) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const a = accents[accent];

  const bg =
    background === "dark"
      ? "bg-slate-950 text-white"
      : background === "muted"
        ? "bg-gradient-to-b from-slate-50 via-white to-slate-50"
        : "bg-white";

  const titleColor = background === "dark" ? "text-white" : "text-slate-900";
  const descColor = background === "dark" ? "text-white/70" : "text-slate-600";
  const cardBg = background === "dark" ? "bg-white/[0.04] border-white/10" : "bg-white border-slate-200";
  const cardTitle = background === "dark" ? "text-white" : "text-slate-900";
  const cardDesc = background === "dark" ? "text-white/65" : "text-slate-600";

  const colClass =
    columns === 2 ? "sm:grid-cols-2" : columns === 4 ? "sm:grid-cols-2 lg:grid-cols-4" : "sm:grid-cols-2 lg:grid-cols-3";

  return (
    <section ref={ref} className={`py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden ${bg}`}>
      <div className={`absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br ${a.glow} rounded-full blur-[120px] pointer-events-none`} />
      <div className={`absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-br ${a.glow} rounded-full blur-[120px] pointer-events-none`} />

      <div className="max-w-7xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14 max-w-2xl mx-auto"
        >
          <span className={`inline-block text-xs uppercase tracking-[0.3em] font-bold ${a.eyebrow} mb-4`}>
            ✦ {eyebrow} ✦
          </span>
          <h2 className={`font-heading text-4xl sm:text-5xl font-extrabold ${titleColor} mb-5 leading-tight`}>
            {title}
          </h2>
          {description && <p className={`text-lg ${descColor}`}>{description}</p>}
        </motion.div>

        <div className={`grid grid-cols-1 ${colClass} gap-5`}>
          {items.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.05 * i }}
              whileHover={{ y: -6 }}
              className={`group relative border rounded-2xl p-6 transition-all duration-300 ${cardBg} ${a.ring} hover:shadow-xl ${a.hoverShadow}`}
            >
              <div className={`absolute left-0 top-6 bottom-6 w-1 bg-gradient-to-b ${a.gradient} rounded-r opacity-0 group-hover:opacity-100 transition-opacity`} />

              <div className="flex items-start gap-4">
                <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${a.iconBg}`}>
                  <item.icon className={`w-5 h-5 transition-colors duration-300 ${a.iconText}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className={`font-heading text-base sm:text-lg font-extrabold leading-snug mb-2 ${cardTitle}`}>
                    {item.title}
                  </h4>
                  <p className={`text-sm leading-relaxed ${cardDesc}`}>{item.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServiceGrid;
