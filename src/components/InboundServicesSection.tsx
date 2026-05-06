import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  ClipboardList,
  Lightbulb,
  Syringe,
  HeartPulse,
  Plane,
  Video,
} from "lucide-react";

const inboundServices = [
  {
    icon: ClipboardList,
    title: "Health Check-ups for Inbound Migrants",
    desc: "Comprehensive arrival health assessments for incoming migrants — including general physical examination, baseline laboratory investigations, and identification of any pre-existing or travel-acquired conditions requiring attention or follow-up.",
  },
  {
    icon: Lightbulb,
    title: "Health Advisory",
    desc: "Personalized health orientation for newly arrived migrants covering local health risks, safe food and water practices, climate adaptation, available healthcare facilities, and guidance on accessing the local health system effectively.",
  },
  {
    icon: Syringe,
    title: "Vaccination Services",
    desc: "Review of vaccine history and administration of required or recommended immunizations — ensuring incoming migrants are protected against endemic diseases and meet any vaccination compliance requirements for residency or employment.",
  },
  {
    icon: HeartPulse,
    title: "Chronic Medical Condition Management",
    desc: "Ongoing clinical management for inbound migrants with pre-existing chronic conditions — including consultation, medication management, specialist referrals, and coordination with home-country physicians to maintain continuity of care.",
  },
  {
    icon: Plane,
    title: "Travel Assistance",
    desc: "Health-related travel support for inbound migrants who require assistance with onward travel within the region — including fitness assessments, documentation, and liaison with transport providers for passengers with medical needs.",
  },
  {
    icon: Video,
    title: "Telehealth Services",
    desc: "Secure, convenient virtual consultations for inbound migrants who cannot attend in person — including follow-up appointments, medication reviews, mental health support, and health advice accessible from anywhere in the country.",
  },
];

const InboundServicesSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id="inbound"
      className="section-padding relative overflow-hidden bg-gradient-to-b from-blue-50/40 via-white to-blue-50/30"
      ref={ref}
    >
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-sky-500/10 rounded-full blur-[120px] -z-10" />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-blue-600 text-sm font-semibold tracking-widest uppercase mb-3 block">
            Inbound Health Services
          </span>
          <h2 className="section-title">
            For Those <span className="text-blue-600">Arriving Here</span>
          </h2>
          <p className="section-subtitle mx-auto">
            Supporting the health of migrants arriving in Sri Lanka — from initial health check-ups to long-term care and workplace wellness. Designed to facilitate healthy integration, identify health needs early, and provide ongoing care throughout their stay.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {inboundServices.map((svc, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.08 * i }}
              whileHover={{ y: -6 }}
              className="bg-white border border-blue-100 rounded-2xl p-6 hover:shadow-xl hover:border-blue-300 hover:shadow-blue-500/10 transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:scale-110 transition-all duration-300">
                <svc.icon className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="font-heading text-base font-bold mb-2 group-hover:text-blue-700 transition-colors">
                {svc.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{svc.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default InboundServicesSection;
