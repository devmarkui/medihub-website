import { motion, useInView } from "framer-motion";
import { useMemo, useRef } from "react";
import { useOutletContext } from "react-router-dom";
import {
  Calendar,
  Languages,
  GraduationCap,
  Stethoscope,
  ArrowRight,
  Star,
} from "lucide-react";
import { useAdminData, type Doctor } from "@/contexts/AdminDataContext";
import ExpandOnHover, { type ExpandCardItem } from "@/components/ui/expand-cards";
import { cn } from "@/lib/utils";

type LayoutContext = { openBooking: (service?: string, mode?: "consultation" | "migration") => void };

export const DoctorsSection = () => {
  const { doctors } = useAdminData();
  const ctx = useOutletContext<LayoutContext>();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  // Featured doctor expands by default; otherwise the first.
  const defaultIdx = Math.max(
    0,
    doctors.findIndex((d) => d.featured)
  );

  const items = useMemo<ExpandCardItem[]>(
    () =>
      doctors.map((doctor) => ({
        id: doctor.id,
        image: doctor.photo,
        alt: doctor.name,
        expandedContent: (
          <ExpandedDoctor doctor={doctor} onBook={ctx.openBooking} />
        ),
        collapsedContent: <CollapsedDoctor doctor={doctor} />,
      })),
    [doctors, ctx.openBooking]
  );

  if (doctors.length === 0) return null;

  return (
    <section
      id="our-doctors"
      ref={ref}
      className="relative py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white via-slate-50 to-white overflow-hidden scroll-mt-20"
    >
      {/* Decorative blobs */}
      <div className="absolute -top-20 left-1/3 w-[600px] h-[600px] bg-emerald-100/40 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-cyan-100/40 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-14 max-w-3xl mx-auto"
        >
          <span className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 mb-5">
            <Stethoscope className="w-3.5 h-3.5 text-primary" />
            <span className="text-[11px] font-bold text-primary uppercase tracking-widest">
              Meet Our Doctors
            </span>
          </span>
          <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 mb-5 leading-[1.05] tracking-tight">
            Specialists who{" "}
            <span className="bg-gradient-to-r from-primary via-emerald-500 to-cyan-500 bg-clip-text text-transparent">
              put your health first
            </span>
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed">
            Hover any card to expand it — meet the consultants leading MEDIHUB's clinical team.
          </p>
        </motion.div>

        {/* Expand-on-hover row (lg+) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="hidden lg:block"
        >
          <ExpandOnHover items={items} defaultIndex={defaultIdx} />
        </motion.div>

        {/* Mobile / tablet fallback — horizontal scroll of standard cards */}
        <div className="lg:hidden -mx-4 px-4">
          <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scroll-smooth">
            {doctors.map((doctor) => (
              <MobileDoctorCard
                key={doctor.id}
                doctor={doctor}
                onBook={ctx.openBooking}
              />
            ))}
          </div>
          <p className="text-xs text-slate-400 text-center mt-2">
            ← swipe to see more doctors →
          </p>
        </div>
      </div>
    </section>
  );
};

// ── Expanded card overlay (active doctor) ─────────────────────────────────
const ExpandedDoctor = ({
  doctor,
  onBook,
}: {
  doctor: Doctor;
  onBook: () => void;
}) => (
  <>
    {/* Strong dark gradient so text stays readable on any photo */}
    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/55 to-slate-950/10" />

    {/* Featured badge */}
    {doctor.featured && (
      <span className="absolute top-5 left-5 inline-flex items-center gap-1.5 rounded-full bg-amber-400/95 backdrop-blur-md px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-amber-950 shadow-lg">
        <Star className="w-3 h-3 fill-amber-950" />
        Featured
      </span>
    )}

    {/* Specialty pill */}
    <span className="absolute top-5 right-5 inline-flex items-center rounded-full bg-white/15 backdrop-blur-md border border-white/30 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white">
      {doctor.specialty}
    </span>

    {/* Bottom info card */}
    <div className="absolute inset-x-0 bottom-0 p-6 sm:p-7 text-white">
      <h3 className="font-heading text-2xl sm:text-3xl font-extrabold mb-2 leading-tight drop-shadow-md">
        {doctor.name}
      </h3>

      {doctor.bio && (
        <p className="text-sm text-white/80 mb-4 leading-relaxed line-clamp-2">
          {doctor.bio}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-white/75 mb-5">
        <span className="inline-flex items-center gap-1.5">
          <GraduationCap className="w-3.5 h-3.5 text-emerald-300" />
          {doctor.qualifications.split(",")[0].trim()}
        </span>
        <span className="text-white/30">•</span>
        <span className="inline-flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-emerald-300" />
          {doctor.yearsExperience}+ yrs
        </span>
        <span className="text-white/30">•</span>
        <span className="inline-flex items-center gap-1.5">
          <Languages className="w-3.5 h-3.5 text-emerald-300" />
          {doctor.languages.join(", ")}
        </span>
      </div>

      <button
        onClick={onBook}
        className={cn(
          "group/btn inline-flex items-center gap-2 rounded-xl bg-primary text-primary-foreground font-semibold px-5 py-2.5 text-sm",
          "shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:bg-primary/90 transition-all duration-300"
        )}
      >
        Book with {doctor.name.split(" ").slice(-1)[0]}
        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
      </button>
    </div>
  </>
);

// ── Collapsed card overlay (narrow strip) ─────────────────────────────────
const CollapsedDoctor = ({ doctor }: { doctor: Doctor }) => (
  <>
    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent" />
    {doctor.featured && (
      <span className="absolute top-3 left-1/2 -translate-x-1/2">
        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 drop-shadow" />
      </span>
    )}
    {/* Vertical name label — adds visual interest to the strip */}
    <div
      className="absolute bottom-5 left-1/2 -translate-x-1/2 text-white/95 font-heading font-bold text-xs tracking-widest uppercase whitespace-nowrap"
      style={{ writingMode: "vertical-rl", transform: "rotate(180deg) translateX(50%)" }}
    >
      {doctor.name.split(" ").slice(-1)[0]}
    </div>
  </>
);

// ── Mobile card ───────────────────────────────────────────────────────────
const MobileDoctorCard = ({
  doctor,
  onBook,
}: {
  doctor: Doctor;
  onBook: () => void;
}) => (
  <article className="snap-center shrink-0 w-[78vw] max-w-sm rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-sm relative">
    <div className="relative aspect-[4/5] overflow-hidden bg-slate-100">
      <img
        src={doctor.photo}
        alt={doctor.name}
        className="absolute inset-0 h-full w-full object-cover"
        loading="lazy"
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).src = `https://api.dicebear.com/8.x/initials/svg?seed=${encodeURIComponent(doctor.name)}&backgroundColor=42BEAD`;
        }}
      />
      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />

      {doctor.featured && (
        <span className="absolute top-3 left-3 inline-flex items-center gap-1 rounded-full bg-amber-400/95 px-2.5 py-1 text-[10px] font-bold text-amber-950">
          <Star className="w-3 h-3 fill-amber-950" />
          Featured
        </span>
      )}

      <div className="absolute inset-x-4 bottom-4 text-white">
        <p className="text-[10px] font-bold uppercase tracking-widest opacity-80 mb-1">
          {doctor.specialty}
        </p>
        <h3 className="font-heading text-xl font-extrabold leading-tight drop-shadow-md">
          {doctor.name}
        </h3>
      </div>
    </div>
    <div className="p-4">
      <p className="text-sm text-slate-600 leading-relaxed line-clamp-3 mb-3">
        {doctor.bio}
      </p>
      <button
        onClick={onBook}
        className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-slate-900 hover:bg-primary text-white font-semibold py-2.5 text-sm transition-colors"
      >
        Book Appointment
        <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </div>
  </article>
);

export default DoctorsSection;
