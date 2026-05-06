import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Heart, Brain, Bone, Baby, Scissors, Siren, ArrowRight } from "lucide-react";

const departments = [
  { icon: Heart, name: "Cardiology", desc: "Advanced cardiac diagnostics, interventional procedures, and comprehensive heart failure management." },
  { icon: Brain, name: "Neurology", desc: "State-of-the-art brain mapping, neurological assessments, and expert treatment protocols." },
  { icon: Bone, name: "Orthopedics", desc: "Joint replacement, sports medicine, spine surgery, and rehabilitation with precision care." },
  { icon: Baby, name: "Pediatrics", desc: "Specialized child healthcare with dedicated neonatal and pediatric intensive care units." },
  { icon: Scissors, name: "General Surgery", desc: "Minimally invasive surgical procedures with rapid recovery and world-class surgical teams." },
  { icon: Siren, name: "Emergency Care", desc: "24/7 trauma center with rapid response teams and critical care expertise." },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 15,
      mass: 1
    }
  },
};

const DepartmentsSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="departments" className="section-padding relative overflow-hidden" ref={ref}>
      {/* Decorative blurred background drops */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-[100px] -z-10" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-teal-500/5 rounded-full blur-[100px] -z-10" />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="section-label"
          >
            Specializations
          </motion.span>
          <h2 className="section-title">Our <span className="text-primary relative inline-block">
            Departments
            <motion.span
              initial={{ scaleX: 0 }}
              animate={inView ? { scaleX: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
              className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500/50 to-teal-500/50 rounded-full origin-left"
            />
          </span></h2>
          <p className="section-subtitle mx-auto">
            Comprehensive medical departments led by globally recognized specialists with advanced technology.
          </p>
        </motion.div>

        <motion.div
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {departments.map((dept, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              whileHover={{
                y: -12,
                transition: { type: "spring", stiffness: 300, damping: 20 }
              }}
              className="relative p-8 rounded-[2rem] bg-white border border-slate-100 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] hover:shadow-[0_25px_50px_-12px_rgba(16,185,129,0.15)] hover:border-emerald-100 transition-all duration-300 group cursor-pointer overflow-hidden"
            >
              {/* Subtle hover gradient background */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />

              <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-100/50 flex items-center justify-center mb-6 group-hover:bg-gradient-to-br group-hover:from-emerald-500 group-hover:to-teal-500 group-hover:shadow-lg group-hover:shadow-emerald-500/25 transition-all duration-500 relative overflow-hidden">
                {/* Icon pulse effect */}
                <span className="absolute inset-0 rounded-2xl bg-white opacity-0 group-hover:animate-ping" style={{ animationDuration: '3s' }} />
                <dept.icon className="w-7 h-7 text-emerald-600 group-hover:text-white relative z-10 transition-colors duration-300" />
              </div>

              <h3 className="font-heading text-xl font-bold mb-3 text-slate-800 group-hover:text-emerald-700 transition-colors duration-300">
                {dept.name}
              </h3>

              <p className="text-slate-500 text-sm leading-relaxed mb-6 group-hover:text-slate-600 transition-colors duration-300">
                {dept.desc}
              </p>

              <div className="flex items-center text-sm font-bold text-emerald-600 opacity-0 transform translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                Learn more
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default DepartmentsSection;
