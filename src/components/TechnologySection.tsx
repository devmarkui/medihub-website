import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { HeartPulse, Stethoscope, FlaskConical, Pill, Ambulance } from "lucide-react";

const facilities = [
  { icon: HeartPulse, title: "ICU & Critical Care", desc: "State-of-the-art intensive care with 24/7 monitoring and advanced life support." },
  { icon: Stethoscope, title: "Advanced Operation Theatres", desc: "Fully equipped modular OTs with precision surgical instruments and laminar airflow." },
  { icon: FlaskConical, title: "Modern Diagnostic Labs", desc: "NABL-accredited laboratories with rapid turnaround for accurate test results." },
  { icon: Pill, title: "In-House Pharmacy", desc: "24/7 pharmacy stocked with a wide range of medicines and medical supplies." },
  { icon: Ambulance, title: "Ambulance Services", desc: "GPS-tracked ambulance fleet with trained paramedics for rapid emergency response." },
];

const TechnologySection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="technology" className="section-padding" ref={ref}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <span className="section-label">Infrastructure</span>
          <h2 className="section-title">Facilities & <span className="text-primary">Technology</span></h2>
          <p className="section-subtitle mx-auto">
            Equipped with the latest medical infrastructure to provide safe, efficient, and advanced healthcare.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {facilities.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.08 * i }}
              className={`premium-card-hover p-7 group ${i === 4 ? "sm:col-span-2 lg:col-span-1" : ""}`}
            >
              <div className="w-12 h-12 rounded-xl bg-primary/8 border border-primary/15 flex items-center justify-center mb-5 group-hover:bg-primary group-hover:border-primary transition-all duration-300">
                <item.icon className="w-6 h-6 text-primary group-hover:text-primary-foreground transition-colors duration-300" />
              </div>
              <h3 className="font-heading text-base font-bold mb-2">{item.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechnologySection;
