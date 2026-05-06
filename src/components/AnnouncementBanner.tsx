import { motion, AnimatePresence } from "framer-motion";
import {
  Info,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import {
  useAdminData,
  type Announcement,
  type AnnouncementType,
} from "@/contexts/AdminDataContext";
import { cn } from "@/lib/utils";

type Style = {
  icon: typeof Info;
  gradient: string;
  shadow: string;
  chipText: string;
  ring: string;
  label: string;
};

const STYLES: Record<AnnouncementType, Style> = {
  info: {
    icon: Info,
    gradient: "from-cyan-500 via-sky-500 to-blue-600",
    shadow: "shadow-[0_10px_40px_-8px_rgba(14,165,233,0.7)]",
    chipText: "text-sky-700",
    ring: "ring-cyan-200/40",
    label: "Info",
  },
  success: {
    icon: CheckCircle2,
    gradient: "from-emerald-500 via-teal-500 to-emerald-600",
    shadow: "shadow-[0_10px_40px_-8px_rgba(16,185,129,0.7)]",
    chipText: "text-emerald-700",
    ring: "ring-emerald-200/40",
    label: "Update",
  },
  warning: {
    icon: AlertTriangle,
    gradient: "from-amber-500 via-orange-500 to-amber-600",
    shadow: "shadow-[0_10px_40px_-8px_rgba(245,158,11,0.7)]",
    chipText: "text-amber-700",
    ring: "ring-amber-200/40",
    label: "Notice",
  },
  alert: {
    icon: AlertCircle,
    gradient: "from-rose-500 via-pink-500 to-red-600",
    shadow: "shadow-[0_10px_40px_-8px_rgba(244,63,94,0.7)]",
    chipText: "text-rose-700",
    ring: "ring-rose-200/40",
    label: "Alert",
  },
};

/**
 * BannerCore — pure presentation, takes the announcement as a prop so the
 * admin preview can render it without going through the live data context.
 */
export const BannerCore = ({ announcement }: { announcement: Announcement }) => {
  const style = STYLES[announcement.type];
  const Icon = style.icon;

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl ring-1",
        "bg-gradient-to-r",
        style.gradient,
        style.shadow,
        style.ring
      )}
    >
      {/* Soft radial highlight */}
      <div
        className="absolute inset-0 opacity-40 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(120% 80% at 0% 0%, rgba(255,255,255,0.35) 0%, transparent 60%)",
        }}
        aria-hidden
      />

      {/* Periodic sheen sweep */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
        <div className="absolute top-0 -left-1/3 h-full w-1/3 bg-gradient-to-r from-transparent via-white/35 to-transparent announcement-sheen" />
      </div>

      {/* Content */}
      <div className="relative flex flex-wrap items-center gap-3 sm:gap-4 px-4 sm:px-5 py-3.5 sm:py-4">
        {/* Pulsing dot */}
        <span className="relative flex shrink-0 items-center justify-center">
          <span className="absolute h-4 w-4 rounded-full bg-white/60 animate-ping" />
          <span
            className="relative h-2.5 w-2.5 rounded-full bg-white"
            style={{ boxShadow: "0 0 18px 4px rgba(255,255,255,0.85)" }}
          />
        </span>

        {/* Type chip */}
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.18em] shadow-sm",
            style.chipText
          )}
        >
          <Icon className="w-3.5 h-3.5" />
          {style.label}
        </span>

        {/* Message */}
        <span className="flex-1 min-w-0 text-white font-bold text-base sm:text-[1.05rem] leading-snug drop-shadow-[0_1px_2px_rgba(0,0,0,0.25)]">
          {announcement.message}
        </span>

        {/* Optional CTA */}
        {announcement.link && announcement.linkLabel && (
          <a
            href={announcement.link}
            target={announcement.link.startsWith("http") ? "_blank" : undefined}
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full bg-white text-slate-900 px-4 py-2 text-sm font-bold whitespace-nowrap shadow-lg shadow-black/15 hover:scale-[1.03] transition-transform"
          >
            {announcement.linkLabel}
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        )}
      </div>
    </div>
  );
};

/**
 * AnnouncementBanner — wires BannerCore to the live admin context. Mounted
 * inside the hero. Animates in/out as the announcement is toggled.
 */
export const AnnouncementBanner = () => {
  const { announcement } = useAdminData();
  const visible = announcement.active && announcement.message.trim().length > 0;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="announcement"
          initial={{ opacity: 0, y: -12, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -12, scale: 0.97 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="mb-7"
        >
          <BannerCore announcement={announcement} />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AnnouncementBanner;
