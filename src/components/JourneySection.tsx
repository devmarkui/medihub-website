import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Stethoscope, FileCheck, PlaneTakeoff, MapPin, PlaneLanding, ArrowRight } from "lucide-react";

const stages = [
  {
    icon: Stethoscope,
    title: "Pre-departure",
    desc: "Health prep, screenings, vaccines, travel fitness, and MEDIF — required when a passenger has a significant medical condition or needs special assistance.",
  },
  {
    icon: FileCheck,
    title: "Visa Medicals",
    desc: "Official country-specific health assessments compliant with destination country requirements.",
  },
  {
    icon: PlaneTakeoff,
    title: "In Transit",
    desc: "Telehealth support and trained medical escorts for vulnerable travellers throughout the journey.",
  },
  {
    icon: MapPin,
    title: "At Destination",
    desc: "Health advisory, chronic care, telehealth, and long-term medication management abroad.",
  },
  {
    icon: PlaneLanding,
    title: "Inbound Support",
    desc: "Emergency care, check-ups, vaccinations, and integration support for migrants arriving here.",
  },
];

const JourneySection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="journey" className="section-padding relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-[120px] -z-10" />

      <div className="max-w-7xl mx-auto" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="section-label">How We Help</span>
          <h2 className="section-title mb-4">
            The MEDIHUB <span className="text-primary">Journey</span>
          </h2>
          <p className="section-subtitle mx-auto">
            We support you at every stage — before, during, and after your move.
          </p>
        </motion.div>

        {/* Desktop horizontal timeline */}
        <div className="hidden lg:block relative">
          <div className="absolute top-12 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20" />
          <div className="grid grid-cols-5 gap-3 relative">
            {stages.map((stage, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.1 * i }}
                className="relative flex flex-col items-center text-center"
              >
                <div className="w-24 h-24 rounded-full bg-white border-4 border-primary/20 shadow-lg flex items-center justify-center mb-5 relative z-10 group hover:border-primary transition-all duration-300">
                  <stage.icon className="w-10 h-10 text-primary group-hover:scale-110 transition-transform duration-300" />
                  <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                </div>
                <h3 className="font-heading text-base font-bold mb-2 text-foreground">
                  {stage.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed px-2">
                  {stage.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Mobile vertical timeline */}
        <div className="lg:hidden space-y-5">
          {stages.map((stage, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 * i }}
              className="flex gap-4 bg-white border border-border rounded-2xl p-5 shadow-sm"
            >
              <div className="flex-shrink-0 w-14 h-14 rounded-full bg-primary/10 border-2 border-primary/30 flex items-center justify-center relative">
                <stage.icon className="w-6 h-6 text-primary" />
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center">
                  {i + 1}
                </span>
              </div>
              <div className="flex-1">
                <h3 className="font-heading text-base font-bold mb-1.5">
                  {stage.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {stage.desc}
                </p>
              </div>
              {i < stages.length - 1 && (
                <ArrowRight className="hidden absolute text-primary/30 w-5 h-5" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default JourneySection;
