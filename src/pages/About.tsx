import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Link, useOutletContext } from "react-router-dom";
import {
  Eye,
  Target,
  Sparkles,
  Heart,
  Award,
  Globe2,
  Shield,
  Users,
  Calendar,
  ArrowRight,
  Stethoscope,
  FileCheck,
  PlaneTakeoff,
  MapPin,
  PlaneLanding,
  Compass,
} from "lucide-react";
import PageHero from "@/components/PageHero";

type LayoutContext = { openBooking: (service?: string, mode?: "consultation" | "migration") => void };

const values = [
  { name: "Compassion", icon: Heart },
  { name: "Excellence", icon: Award },
  { name: "Integrity", icon: Shield },
  { name: "Accessibility", icon: Globe2 },
  { name: "Person-centred Care", icon: Users },
  { name: "Cultural Sensitivity", icon: Compass },
  { name: "Continuity", icon: ArrowRight },
  { name: "Confidentiality", icon: Shield },
];

const Intro = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <section ref={ref} className="py-24 px-4 sm:px-6 lg:px-8 bg-white relative overflow-hidden">
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-emerald-100/50 rounded-full blur-[100px]" />
      <div className="max-w-7xl mx-auto relative">
        <div className="grid lg:grid-cols-12 gap-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5"
          >
            <span className="inline-block text-xs uppercase tracking-[0.3em] font-bold text-primary mb-4">
              ✦ Our Story ✦
            </span>
            <h2 className="font-heading text-4xl sm:text-5xl font-extrabold text-slate-900 leading-tight mb-6">
              Sri Lanka's dedicated{" "}
              <span className="bg-gradient-to-r from-primary to-emerald-600 bg-clip-text text-transparent">
                migration health centre.
              </span>
            </h2>
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50/50 border-l-4 border-primary rounded-r-2xl p-6">
              <p className="font-heading text-lg italic text-slate-700 leading-relaxed">
                "Migration is not just a logistical event — it is a life transition that demands careful health preparation, continuous support, and compassionate care."
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-7 space-y-5 text-slate-600 leading-relaxed text-base lg:text-lg"
          >
            <p>
              MEDIHUB is a purpose-built, specialized health centre dedicated exclusively to the health needs of <strong className="text-slate-900">migrants, foreign workers, and internationally mobile individuals</strong>. We bridge the gap between clinical excellence and the realities of cross-border movement — ensuring every person who crosses a border does so in the best possible health.
            </p>
            <p>
              We serve both <strong className="text-slate-900">outbound migrants</strong> — those preparing to work or study abroad — and <strong className="text-slate-900">inbound arrivals</strong>, offering a comprehensive continuum of care that addresses every stage of the migration journey.
            </p>
            <p>
              Our multidisciplinary team of physicians, travel medicine specialists, nurses, and health counselors work together to deliver personalized, evidence-based health services under one roof.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const VisionMission = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14 max-w-2xl mx-auto"
        >
          <span className="inline-block text-xs uppercase tracking-[0.3em] font-bold text-primary mb-4">
            ✦ Vision · Mission · Values ✦
          </span>
          <h2 className="font-heading text-4xl sm:text-5xl font-extrabold text-slate-900 leading-tight">
            What guides us{" "}
            <span className="bg-gradient-to-r from-primary to-emerald-600 bg-clip-text text-transparent">
              every day.
            </span>
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            whileHover={{ y: -8 }}
            className="relative bg-white border border-slate-200 rounded-3xl p-8 hover:shadow-2xl transition-all duration-500 overflow-hidden group"
          >
            <div className="absolute -top-20 -right-20 w-48 h-48 rounded-full bg-emerald-200/40 blur-3xl group-hover:bg-emerald-200/60 transition-all" />
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-emerald-600 flex items-center justify-center shadow-xl shadow-primary/30 mb-6">
                <Eye className="w-7 h-7 text-white" />
              </div>
              <span className="text-xs uppercase tracking-widest font-bold text-primary mb-2 block">Vision</span>
              <h3 className="font-heading text-2xl font-extrabold text-slate-900 mb-3">Our North Star</h3>
              <p className="text-slate-600 leading-relaxed">
                To be the leading dedicated migration health centre in <strong>South Asia</strong> — recognized for clinical excellence, compassionate care, and seamless health support for every migrant across every border.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            whileHover={{ y: -8 }}
            className="relative bg-gradient-to-br from-primary to-emerald-700 text-white rounded-3xl p-8 shadow-2xl shadow-primary/30 overflow-hidden group lg:scale-105"
          >
            <div className="absolute -top-20 -right-20 w-48 h-48 rounded-full bg-amber-300/30 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-48 h-48 rounded-full bg-teal-400/30 blur-3xl" />
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center mb-6">
                <Target className="w-7 h-7 text-white" />
              </div>
              <span className="text-xs uppercase tracking-widest font-bold text-amber-200 mb-2 block">Mission</span>
              <h3 className="font-heading text-2xl font-extrabold mb-3">Our Daily Promise</h3>
              <p className="text-white/85 leading-relaxed">
                To provide <strong>comprehensive, expert, and accessible</strong> health services tailored to the unique needs of migrants — empowering individuals with the health knowledge, documentation, and care they need to migrate safely, confidently, and successfully.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            whileHover={{ y: -8 }}
            className="relative bg-white border border-slate-200 rounded-3xl p-8 hover:shadow-2xl transition-all duration-500 overflow-hidden group"
          >
            <div className="absolute -top-20 -right-20 w-48 h-48 rounded-full bg-amber-200/40 blur-3xl group-hover:bg-amber-200/60 transition-all" />
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-xl shadow-amber-500/30 mb-6">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <span className="text-xs uppercase tracking-widest font-bold text-amber-600 mb-2 block">Values</span>
              <h3 className="font-heading text-2xl font-extrabold text-slate-900 mb-3">Our Principles</h3>
              <p className="text-sm text-slate-600 mb-4">The principles that guide every interaction at MEDIHUB:</p>
              <div className="grid grid-cols-2 gap-2">
                {values.map((v) => (
                  <div
                    key={v.name}
                    className="flex items-center gap-2 text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg"
                  >
                    <v.icon className="w-3 h-3 text-primary flex-shrink-0" />
                    {v.name}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const Journey = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const stages = [
    { icon: Stethoscope, title: "Pre-departure", desc: "Health prep, screenings, vaccines, travel fitness, and MEDIF — required when a passenger has a significant medical condition or needs special assistance." },
    { icon: FileCheck, title: "Visa Medicals", desc: "Official country-specific health assessments compliant with destination country requirements." },
    { icon: PlaneTakeoff, title: "In Transit", desc: "Telehealth support and trained medical escorts for vulnerable travellers throughout the journey." },
    { icon: MapPin, title: "At Destination", desc: "Health advisory, chronic care, telehealth, and long-term medication management abroad." },
    { icon: PlaneLanding, title: "Inbound Support", desc: "Emergency care, check-ups, vaccinations, and integration support for migrants arriving here." },
  ];

  return (
    <section ref={ref} className="py-24 px-4 sm:px-6 lg:px-8 bg-white relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-emerald-100/40 rounded-full blur-[120px]" />

      <div className="max-w-7xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 max-w-2xl mx-auto"
        >
          <span className="inline-block text-xs uppercase tracking-[0.3em] font-bold text-primary mb-4">
            ✦ How We Help ✦
          </span>
          <h2 className="font-heading text-4xl sm:text-5xl font-extrabold text-slate-900 mb-5 leading-tight">
            The MEDIHUB{" "}
            <span className="bg-gradient-to-r from-primary to-emerald-600 bg-clip-text text-transparent">
              Journey
            </span>
          </h2>
          <p className="text-lg text-slate-600">We support you at every stage — before, during, and after your move.</p>
        </motion.div>

        {/* Desktop horizontal timeline */}
        <div className="hidden lg:block relative">
          <div className="absolute top-12 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-primary/10 via-primary/40 to-primary/10" />
          <div className="grid grid-cols-5 gap-4">
            {stages.map((stage, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.12 * i }}
                className="flex flex-col items-center text-center"
              >
                <div className="relative w-24 h-24 rounded-full bg-white border-4 border-emerald-100 shadow-lg flex items-center justify-center mb-5 group hover:border-primary transition-all duration-300">
                  <stage.icon className="w-10 h-10 text-primary group-hover:scale-110 transition-transform duration-300" />
                  <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-br from-primary to-emerald-600 text-white text-xs font-extrabold flex items-center justify-center shadow-lg">
                    {i + 1}
                  </span>
                </div>
                <h3 className="font-heading text-base font-extrabold mb-2 text-slate-900">{stage.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed px-2">{stage.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Mobile vertical */}
        <div className="lg:hidden space-y-4">
          {stages.map((stage, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 * i }}
              className="flex gap-4 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm"
            >
              <div className="flex-shrink-0 w-14 h-14 rounded-full bg-emerald-50 border-2 border-emerald-200 flex items-center justify-center relative">
                <stage.icon className="w-6 h-6 text-primary" />
                <span className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center">
                  {i + 1}
                </span>
              </div>
              <div className="flex-1">
                <h3 className="font-heading text-base font-bold mb-1.5">{stage.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{stage.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Promise = () => (
  <section className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-900 text-white relative overflow-hidden">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(13,148,136,0.2),transparent_50%)]" />
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(245,158,11,0.1),transparent_50%)]" />

    <div className="max-w-4xl mx-auto relative text-center">
      <motion.span
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="inline-block text-xs uppercase tracking-[0.3em] font-bold text-emerald-400 mb-6"
      >
        ✦ Our Commitment ✦
      </motion.span>
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.1] mb-8"
      >
        Every form filed.{" "}
        <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
          Every patient cared for.
        </span>{" "}
        Every border crossed safely.
      </motion.h2>
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="text-white/70 text-lg leading-relaxed mb-10"
      >
        At MEDIHUB, we don't see migration as a logistical event. We see it as a life transition — one that deserves careful health preparation, continuous support, and compassionate care.
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="flex flex-wrap items-center justify-center gap-4"
      >
        <Link
          to="/services"
          className="inline-flex items-center gap-2 bg-white text-slate-900 font-bold px-7 py-3.5 rounded-full hover:-translate-y-1 transition-transform shadow-xl"
        >
          Explore Our Services
          <ArrowRight className="w-4 h-4" />
        </Link>
        <Link
          to="/contact"
          className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-white font-semibold px-7 py-3.5 rounded-full hover:bg-white/20 transition-colors"
        >
          Get in Touch
        </Link>
      </motion.div>
    </div>
  </section>
);

const About = () => {
  const ctx = useOutletContext<LayoutContext>();
  return (
    <>
      <PageHero
        eyebrow="About MEDIHUB"
        title={
          <>
            More than a clinic.{" "}
            <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
              A migration partner.
            </span>
          </>
        }
        description="Migration is more than movement — it is about health, safety, and continuity of care. MEDIHUB is Sri Lanka's first dedicated Migration Health Hub."
        breadcrumb="About"
        imageSrc="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&w=1400&q=80"
        imageAlt="MEDIHUB clinical care"
      />
      <Intro />
      <VisionMission />
      <Journey />
      <Promise />
    </>
  );
};

export default About;
