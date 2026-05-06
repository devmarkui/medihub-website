import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Calendar } from "lucide-react";

const specialists = [
  { name: "Dr. Sarah Chen", role: "Chief Cardiologist", exp: "20+ Years", initials: "SC" },
  { name: "Dr. James Mitchell", role: "Head of Neurology", exp: "18+ Years", initials: "JM" },
  { name: "Dr. Amara Osei", role: "Orthopedic Surgeon", exp: "15+ Years", initials: "AO" },
  { name: "Dr. Raj Patel", role: "Oncology Director", exp: "22+ Years", initials: "RP" },
];

const SpecialistsSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="specialists" className="section-padding bg-white" ref={ref}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <span className="section-label">Medical Team</span>
          <h2 className="section-title">Our <span className="text-primary">Doctors</span></h2>
          <p className="section-subtitle mx-auto">
            Experienced medical professionals committed to delivering exceptional patient outcomes.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {specialists.map((doc, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.08 * i }}
              className="premium-card-hover p-6 text-center group"
            >
              <div className="w-20 h-20 rounded-full bg-muted border-2 border-border group-hover:border-primary/30 flex items-center justify-center mx-auto mb-5 transition-colors duration-300">
                <span className="font-heading text-xl font-bold text-primary">{doc.initials}</span>
              </div>

              <h3 className="font-heading text-base font-bold mb-1">{doc.name}</h3>
              <span className="inline-block text-xs text-primary bg-primary/8 px-3 py-1 rounded-full font-medium mb-1.5">
                {doc.role}
              </span>
              <p className="text-muted-foreground text-sm mb-5">{doc.exp} Experience</p>

              <a href="#contact" className="btn-outline !px-4 !py-2 text-sm w-full justify-center">
                <Calendar className="w-4 h-4" />
                Book Appointment
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SpecialistsSection;
