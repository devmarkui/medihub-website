import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Briefcase, Users2, Handshake, Building2, ArrowRight } from "lucide-react";

const corporateServices = [
  {
    icon: Briefcase,
    title: "Pre-employment Medical Programmes",
    desc: "Structured, standardized pre-employment health assessments for organizations recruiting migrant workers — including physical examination, fitness-for-duty certification, and all required visa medical documentation, managed under a dedicated corporate agreement.",
  },
  {
    icon: Users2,
    title: "Group Health Screening",
    desc: "Efficient, high-volume health screening for groups of workers or staff — coordinated with minimal disruption to operations, with rapid turnaround of results and centralized report management for HR and compliance teams.",
  },
  {
    icon: Handshake,
    title: "Recruitment Agency Partnerships",
    desc: "Preferred partner arrangements for licensed recruitment agencies — offering priority scheduling, dedicated account management, standardized pricing, and seamless coordination of medical clearance for large migrant worker placements.",
  },
  {
    icon: Building2,
    title: "Occupational Health Consulting",
    desc: "Expert advisory services for companies managing the health compliance of outbound or inbound migrant workforces — including policy development, health risk assessments, destination health briefings, and regulatory compliance guidance.",
  },
];

const CorporateSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="corporate" className="section-padding bg-slate-dark text-white relative overflow-hidden" ref={ref}>
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/15 rounded-full blur-[140px] -z-0" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/10 rounded-full blur-[140px] -z-0" />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-primary text-sm font-semibold tracking-widest uppercase mb-3 block">
            Corporate & Institutional
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Corporate <span className="text-primary">Medicals</span>
          </h2>
          <p className="text-white/70 text-lg max-w-2xl mx-auto leading-relaxed">
            Comprehensive occupational and pre-employment health solutions for employers, recruitment agencies, and institutions managing migrant workforces.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {corporateServices.map((svc, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 * i }}
              whileHover={{ y: -6 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-7 hover:border-primary/40 hover:bg-white/10 transition-all duration-300 group"
            >
              <div className="flex items-start gap-5">
                <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                  <svc.icon className="w-7 h-7 text-primary group-hover:text-white transition-colors" />
                </div>
                <div className="flex-1">
                  <h3 className="font-heading text-lg font-bold mb-2 text-white">{svc.title}</h3>
                  <p className="text-sm text-white/70 leading-relaxed">{svc.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-12 text-center"
        >
          <a
            href="#contact"
            className="inline-flex items-center gap-2 bg-primary text-white font-semibold px-7 py-3.5 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
          >
            Partner With Us
            <ArrowRight className="w-5 h-5" />
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default CorporateSection;
