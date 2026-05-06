import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  Globe2,
  FileSearch,
  HeartHandshake,
  Activity,
  PlaneTakeoff,
  ClipboardCheck,
  Headphones,
  UserCheck,
  Syringe,
  Pill,
  Baby,
} from "lucide-react";

const visaCountries = [
  {
    title: "GCC Countries",
    countries: "Saudi Arabia, UAE, Qatar, Kuwait, Oman, Bahrain",
    desc: "Health screenings for GAMCA/WAFID compliant medicals, blood tests, chest X-ray, infectious disease panels, and fitness certification for visa applicants.",
  },
  {
    title: "Japan",
    countries: "Japan SSW & TITP Programs",
    desc: "Structured health examinations aligned with Japan's Specified Skilled Worker (SSW) and Technical Intern Training Program (TITP) requirements, including tuberculosis screening, infectious disease testing, and physical fitness evaluation for work visa applicants.",
  },
  {
    title: "EU & European Countries",
    countries: "All EU member states",
    desc: "Comprehensive health assessments for EU member state visa and residency applications — covering general medical examination, specialist referrals, vaccination compliance, and documentation required by embassies and consulates.",
  },
  {
    title: "General Health Screening",
    countries: "Worldwide destinations",
    desc: "For countries not listed, we offer a flexible, destination-specific health screening service. Our team reviews the destination country's requirements and prepares a tailored health assessment package — from basic checks to full specialist-supported evaluations.",
  },
];

const preMedicalBlocks = [
  {
    title: "What is a Pre-Medical?",
    desc: "A pre-medical is an informal but thorough health evaluation carried out before your official visa medical. It identifies potential health concerns — such as elevated blood pressure, anaemia, or subclinical infections — that could result in a failed medical, giving you the opportunity to address them in advance.",
  },
  {
    title: "Who Should Have One?",
    desc: "Anyone planning to undergo a visa medical is advised to complete a pre-medical at MEDIHUB. It is especially recommended for individuals with known or suspected health conditions, those with a history of previous medical failures, and first-time visa applicants.",
  },
  {
    title: "What's Included",
    desc: "Full clinical examination, laboratory panel, chest X-ray review, blood pressure monitoring, and a physician consultation. If any issues are found, our team initiates an appropriate treatment or management plan to ensure medical readiness before your official assessment.",
  },
  {
    title: "Outcome",
    desc: "A detailed Pre-Medical Report with clinical findings, health status summary, and recommendations — giving you clear guidance on next steps and readiness for official visa medical submission.",
  },
];

const migrantServices = [
  {
    icon: HeartHandshake,
    title: "Pre-departure Health Counselling",
    desc: "One-on-one sessions with our migration health counselors to prepare you for the health environment at your destination — covering climate adaptation, food safety, mental health, workplace health risks, and how to access care abroad.",
  },
  {
    icon: Activity,
    title: "Travel Fitness Assessment",
    desc: "A clinical assessment to confirm that you are medically fit to undertake the planned journey. Considers duration of travel, transit conditions, existing health conditions, and destination health risks to issue a Travel Fitness Certificate.",
  },
  {
    icon: PlaneTakeoff,
    title: "Fitness to Fly",
    desc: "A specialized assessment for passengers who may have medical conditions affected by air travel — including post-surgical patients, those with cardiac or respiratory conditions, and individuals recently hospitalized. We issue Fit-to-Fly documentation accepted by major airlines.",
  },
  {
    icon: ClipboardCheck,
    title: "MEDIF (Medical Information Form)",
    desc: "Completion and facilitation of IATA's Medical Information Form (MEDIF), required by airlines when passengers with medical conditions or special needs require in-flight medical support, supplemental oxygen, stretcher service, or wheelchair assistance.",
  },
  {
    icon: Activity,
    title: "Continued Health Management",
    desc: "For migrants with chronic conditions such as diabetes, hypertension, or asthma — we establish a structured ongoing care plan, ensure adequate medication supply, and coordinate with healthcare providers at the destination for continuity of treatment.",
  },
  {
    icon: Headphones,
    title: "Travel Assistance",
    desc: "24/7 travel health assistance for migrants in transit or at destination — including coordination with international medical assistance networks, emergency health guidance, and liaison with embassies and employers for urgent medical situations.",
  },
  {
    icon: UserCheck,
    title: "Medical Escorts",
    desc: "Trained medical professionals — doctors or nurses — who accompany medically vulnerable passengers during travel. Our escorts provide clinical monitoring, medication administration, and emergency response throughout the journey.",
  },
  {
    icon: Syringe,
    title: "Pre-departure Vaccination",
    desc: "Destination-specific vaccination programmes administered by our travel medicine team. We advise on mandatory and recommended vaccines — including Yellow Fever, Hepatitis A/B, Typhoid, Meningitis — and issue certified vaccination documentation.",
  },
  {
    icon: Pill,
    title: "Pre-departure Medication",
    desc: "Prescription and dispensing of travel-specific medications — including antimalarials, altitude sickness prophylaxis, traveller's diarrhoea medication, and adequate supply of regular chronic disease medications to cover the full period abroad.",
  },
  {
    icon: Baby,
    title: "Pregnancy, Infants & Elderly Travellers",
    desc: "Specialized travel health assessments and guidance for vulnerable groups: pregnant women (with gestational age-specific air travel advice), infants (with age-appropriate immunization), and elderly travellers (with mobility, chronic condition, and insurance guidance).",
  },
];

const OutboundServicesSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="outbound" className="section-padding bg-white relative overflow-hidden" ref={ref}>
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-[100px] -z-10" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-teal-500/5 rounded-full blur-[100px] -z-10" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="section-label">Outbound Health Services</span>
          <h2 className="section-title">
            For Those <span className="text-primary">Going Abroad</span>
          </h2>
          <p className="section-subtitle mx-auto">
            From visa medicals to complete pre-departure health preparation, we ensure every outbound migrant leaves with full health clearance and confidence.
          </p>
        </motion.div>

        {/* Block 1: Migration Health Services & Visa Medicals */}
        <div className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Globe2 className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-heading text-2xl font-bold">Migration Health Services & Visa Medicals</h3>
                <p className="text-sm text-muted-foreground mt-1">Mandatory health screening for work and residency visas worldwide</p>
              </div>
            </div>

            <div className="bg-primary/5 border-l-4 border-primary rounded-r-2xl p-5 mb-8">
              <h4 className="font-heading font-bold text-primary mb-2">What are Visa Medicals?</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Visa medicals are mandatory, government-regulated health assessments required by destination countries as part of visa or work permit applications. MEDIHUB is an authorized centre for conducting these assessments in strict compliance with each country's requirements, ensuring your documentation is accurate, complete, and accepted.
              </p>
            </div>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-5">
            {visaCountries.map((country, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.08 * i }}
                whileHover={{ y: -4 }}
                className="bg-white border border-border rounded-2xl p-6 hover:shadow-lg hover:border-primary/30 transition-all duration-300"
              >
                <h4 className="font-heading text-lg font-bold mb-2 text-foreground">{country.title}</h4>
                <span className="inline-block text-xs font-medium text-primary bg-primary/10 px-3 py-1 rounded-full mb-3">
                  {country.countries}
                </span>
                <p className="text-sm text-muted-foreground leading-relaxed">{country.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Block 2: Pre-Medicals */}
        <div className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <FileSearch className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-heading text-2xl font-bold">Pre-Medicals</h3>
                <p className="text-sm text-muted-foreground mt-1">Health optimization before your formal medical assessment</p>
              </div>
            </div>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-5">
            {preMedicalBlocks.map((block, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.08 * i }}
                className="bg-gradient-to-br from-emerald-50 to-teal-50/30 border border-emerald-100 rounded-2xl p-6"
              >
                <h4 className="font-heading text-base font-bold mb-3 text-emerald-900">{block.title}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{block.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Block 3: Migrant Health Services — Pre-departure Care */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <HeartHandshake className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-heading text-2xl font-bold">Migrant Health Services — Pre-departure Care</h3>
                <p className="text-sm text-muted-foreground mt-1">Complete health preparation for a safe journey and successful integration abroad</p>
              </div>
            </div>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {migrantServices.map((svc, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.05 * i }}
                whileHover={{ y: -6 }}
                className="bg-white border border-border rounded-2xl p-6 hover:shadow-xl hover:border-primary/30 transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                  <svc.icon className="w-6 h-6 text-primary group-hover:text-white transition-colors" />
                </div>
                <h4 className="font-heading text-base font-bold mb-2">{svc.title}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{svc.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default OutboundServicesSection;
