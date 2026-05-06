import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { useOutletContext, useSearchParams, useLocation } from "react-router-dom";
import {
  PlaneTakeoff,
  PlaneLanding,
  Building2,
  Microscope,
  Globe2,
  FileSearch,
  HeartHandshake,
  Activity,
  ClipboardCheck,
  Headphones,
  UserCheck,
  Syringe,
  Pill,
  Baby,
  ClipboardList,
  Lightbulb,
  HeartPulse,
  Plane,
  Video,
  Briefcase,
  Users2,
  Calendar,
  Stethoscope,
  FlaskConical,
  ScanLine,
  ShieldCheck,
  ChevronDown,
  Languages,
} from "lucide-react";
import PageHero from "@/components/PageHero";
import { CardStack } from "@/components/CardStack";

type LayoutContext = { openBooking: (service?: string, mode?: "consultation" | "migration") => void };

/* ------------------ data ------------------ */

const visaCountries = [
  {
    title: "GCC Countries",
    countries: "Saudi Arabia · UAE · Qatar · Kuwait · Oman · Bahrain",
    desc: "Health screenings for GAMCA / WAFID compliant medicals — blood tests, chest X-ray, infectious disease panels, and fitness certification for visa applicants.",
    badge: "GAMCA / WAFID",
    image: "https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=1000&q=80",
  },
  {
    title: "Japan",
    countries: "SSW · TITP Programs",
    desc: "Structured health examinations aligned with Japan's Specified Skilled Worker (SSW) and Technical Intern Training Program (TITP) requirements — including TB screening, infectious disease testing, and physical fitness evaluation.",
    badge: "SSW / TITP",
    image: "https://images.unsplash.com/photo-1480796927426-f609979314bd?auto=format&fit=crop&w=1000&q=80",
  },
  {
    title: "EU & European Countries",
    countries: "All EU member states",
    desc: "Comprehensive health assessments for EU member state visa and residency applications — covering general medical examination, specialist referrals, vaccination compliance, and embassy-required documentation.",
    badge: "Embassy-Ready",
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1000&q=80",
  },
  {
    title: "General Health Screening",
    countries: "Worldwide destinations",
    desc: "For countries not listed above, we offer flexible, destination-specific health screening. Our team reviews the requirements and prepares a tailored health assessment package — from basic checks to full specialist-supported evaluations.",
    badge: "Custom",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1000&q=80",
  },
];

const preMedicalBlocks = [
  { title: "What is a Pre-Medical?", short: "A thorough pre-screening to catch issues before your official visa medical.", desc: "An informal but thorough health evaluation carried out before your official visa medical. It identifies potential health concerns — such as elevated blood pressure, anaemia, or subclinical infections — that could result in a failed medical, giving you the opportunity to address them in advance." },
  { title: "Who Should Have One?", short: "Recommended for every visa applicant — essential for first-timers and at-risk cases.", desc: "Anyone planning to undergo a visa medical is advised to complete a pre-medical at MEDIHUB. It is especially recommended for individuals with known or suspected health conditions, those with a history of previous medical failures, and first-time visa applicants." },
  { title: "What's Included", short: "Full clinical exam, lab panel, chest X-ray, BP monitoring, and physician consultation.", desc: "Full clinical examination, laboratory panel, chest X-ray review, blood pressure monitoring, and a physician consultation. If any issues are found, our team initiates an appropriate treatment or management plan to ensure medical readiness before your official assessment." },
  { title: "Outcome", short: "A detailed Pre-Medical Report with findings and clear next steps.", desc: "A detailed Pre-Medical Report with clinical findings, health status summary, and recommendations — giving you clear guidance on next steps and readiness for official visa medical submission." },
];

const migrantServices = [
  { icon: HeartHandshake, image: "https://images.unsplash.com/photo-1581595220892-b0739db3ba8c?auto=format&fit=crop&w=1200&q=80", title: "Pre-departure Health Counselling", short: "One-on-one sessions on adapting to life and healthcare abroad.", desc: "One-on-one sessions with our migration health counselors covering climate adaptation, food safety, mental health, workplace health risks, and how to access care abroad." },
  { icon: Activity, image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80", title: "Travel Fitness Assessment", short: "Confirms you're medically fit for the journey — issued with a certificate.", desc: "Clinical assessment to confirm you are medically fit for the journey. Considers travel duration, transit conditions, existing conditions, and destination health risks — issued as a Travel Fitness Certificate." },
  { icon: PlaneTakeoff, image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1200&q=80", title: "Fitness to Fly", short: "Airline-accepted Fit-to-Fly clearance for medically sensitive flyers.", desc: "Specialized assessment for passengers with conditions affected by air travel — post-surgical, cardiac, respiratory patients, or those recently hospitalized. We issue Fit-to-Fly documentation accepted by major airlines." },
  { icon: ClipboardCheck, image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1200&q=80", title: "MEDIF (Medical Information Form)", short: "IATA MEDIF completion for in-flight medical, oxygen, or wheelchair support.", desc: "Completion and facilitation of IATA's Medical Information Form — required by airlines for passengers needing in-flight medical support, oxygen, stretcher service, or wheelchair assistance." },
  { icon: Activity, image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&w=1200&q=80", title: "Continued Health Management", short: "Ongoing care and medication continuity for chronic conditions abroad.", desc: "For migrants with chronic conditions like diabetes, hypertension, or asthma — structured ongoing care, adequate medication supply, and coordination with healthcare providers at the destination." },
  { icon: Headphones, image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1200&q=80", title: "Travel Assistance", short: "24/7 health assistance and embassy liaison while you're in transit or abroad.", desc: "24/7 travel health assistance for migrants in transit or at destination — coordination with international assistance networks, emergency guidance, and liaison with embassies and employers." },
  { icon: UserCheck, image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=1200&q=80", title: "Medical Escorts", short: "Trained doctors or nurses who travel with you for clinical monitoring.", desc: "Trained doctors or nurses who accompany medically vulnerable passengers — providing clinical monitoring, medication administration, and emergency response throughout the journey." },
  { icon: Syringe, image: "https://images.unsplash.com/photo-1632053001113-df97cf03307c?auto=format&fit=crop&w=1200&q=80", title: "Pre-departure Vaccination", short: "Destination-specific vaccines with IHR-compliant certification.", desc: "Destination-specific vaccination programmes by our travel medicine team — Yellow Fever, Hepatitis A/B, Typhoid, Meningitis, and certified IHR-compliant vaccination documentation." },
  { icon: Pill, image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=1200&q=80", title: "Pre-departure Medication", short: "Travel meds and chronic disease prescriptions sized for your trip.", desc: "Prescription and dispensing of travel medications — antimalarials, altitude sickness prophylaxis, traveller's diarrhoea, and adequate supply of regular chronic disease medications." },
  { icon: Baby, image: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=1200&q=80", title: "Pregnancy, Infants & Elderly", short: "Specialized travel health for pregnancy, infants, and elderly travellers.", desc: "Specialized travel health for vulnerable groups: pregnancy (gestational age-specific advice), infants (age-appropriate immunization), elderly (mobility, chronic, and insurance guidance)." },
];

const inboundServices = [
  { icon: ClipboardList, image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1000&q=80", en: { title: "Health Check-ups for Inbound Migrants", desc: "Comprehensive arrival health assessments — general physical examination, baseline laboratory investigations, and identification of pre-existing or travel-acquired conditions requiring follow-up." }, zh: { title: "入境移民健康检查", desc: "全面的入境健康评估 — 一般体格检查、基础实验室检验，以及识别需要随访的既往或旅行相关疾病。" } },
  { icon: Lightbulb, image: "https://images.unsplash.com/photo-1581595220892-b0739db3ba8c?auto=format&fit=crop&w=1000&q=80", en: { title: "Health Advisory", desc: "Personalized health orientation for newly arrived migrants — local health risks, safe food and water practices, climate adaptation, healthcare facility guidance, and access to local health systems." }, zh: { title: "健康咨询", desc: "为新抵达的移民提供个性化健康指导 — 当地健康风险、安全饮食饮水、气候适应、医疗设施使用以及医疗系统获取指南。" } },
  { icon: Syringe, image: "https://images.unsplash.com/photo-1632053001113-df97cf03307c?auto=format&fit=crop&w=1000&q=80", en: { title: "Vaccination Services", desc: "Review of vaccine history and administration of required or recommended immunizations — protection against endemic diseases and meeting vaccination compliance for residency or employment." }, zh: { title: "疫苗接种服务", desc: "审查疫苗接种史并提供所需或建议的免疫接种 — 预防地方流行病并满足居留或就业的疫苗合规要求。" } },
  { icon: HeartPulse, image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&w=1000&q=80", en: { title: "Chronic Medical Condition Management", desc: "Ongoing clinical management for migrants with pre-existing chronic conditions — consultation, medication management, specialist referrals, and coordination with home-country physicians." }, zh: { title: "慢性疾病管理", desc: "为患有既往慢性疾病的移民提供持续的临床管理 — 咨询、用药管理、专科转诊以及与原籍国医生的协调。" } },
  { icon: Plane, image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1000&q=80", en: { title: "Travel Assistance", desc: "Health-related travel support for inbound migrants who need onward travel within the region — fitness assessments, documentation, and liaison with transport providers for medical needs." }, zh: { title: "旅行协助", desc: "为需要在区域内继续旅行的入境移民提供健康相关支持 — 健康评估、文件办理及与运输方就医疗需求的协调。" } },
  { icon: Video, image: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=1000&q=80", en: { title: "Telehealth Services", desc: "Secure virtual consultations for migrants who cannot attend in person — follow-up appointments, medication reviews, mental health support, and health advice from anywhere in the country." }, zh: { title: "远程医疗服务", desc: "为无法亲临的移民提供安全的线上咨询 — 随访预约、用药复查、心理健康支持，全国任何地方均可获得健康建议。" } },
];

const inboundI18n = {
  en: {
    eyebrow: "Inbound Health Services",
    titleA: "For those",
    titleB: "arriving here.",
    description: "Supporting the health of migrants arriving in Sri Lanka — from initial check-ups to long-term care, designed to facilitate healthy integration and ongoing care throughout their stay.",
    langLabel: "Language",
  },
  zh: {
    eyebrow: "入境健康服务",
    titleA: "为初到此地",
    titleB: "的朋友。",
    description: "为抵达斯里兰卡的移民提供健康支持 — 从初步检查到长期护理，助您健康融入并获得持续关怀。",
    langLabel: "语言",
  },
} as const;

const corporateServices = [
  {
    icon: Briefcase,
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1200&q=80",
    title: "Pre-employment Medical Programmes",
    short: "Standardized health checks for migrant recruitment — fully documented for visas.",
    desc: "Structured, standardized pre-employment health assessments for organizations recruiting migrant workers — physical examination, fitness-for-duty certification, and full visa medical documentation under a corporate agreement.",
  },
  {
    icon: Users2,
    image: "https://images.unsplash.com/photo-1581595220892-b0739db3ba8c?auto=format&fit=crop&w=1200&q=80",
    title: "Group Health Screening",
    short: "High-volume worker screenings with rapid turnaround and centralized HR reporting.",
    desc: "Efficient, high-volume health screening for groups of workers or staff — coordinated with minimal disruption to operations, rapid turnaround, and centralized reporting for HR and compliance teams.",
  },
  {
    icon: Building2,
    image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80",
    title: "Occupational Health Consulting",
    short: "Health policy, risk assessment and compliance advisory for cross-border workforces.",
    desc: "Expert advisory for companies managing health compliance of outbound or inbound migrant workforces — policy development, health risk assessments, destination health briefings, and regulatory compliance guidance.",
  },
];

const clinicServices = [
  {
    slug: "general-consultations",
    icon: Stethoscope,
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=1200&q=80",
    title: "General Consultations",
    short: "Walk-in or scheduled GP visits, family medicine for all ages.",
    desc: "Walk-in and scheduled GP consultations — common illnesses, minor injuries, prescriptions, referrals, and family medicine for all age groups.",
  },
  {
    slug: "laboratory-services",
    icon: FlaskConical,
    image: "https://images.unsplash.com/photo-1582719471384-894fbb16e074?auto=format&fit=crop&w=1200&q=80",
    title: "Laboratory Services",
    short: "Full-service medical lab — fast, accurate results, every day.",
    desc: "Full-service medical laboratory — haematology, clinical chemistry, microbiology, hormone assays, and infectious disease testing with rapid turnaround.",
  },
  {
    slug: "health-checkup-packages",
    icon: HeartPulse,
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&w=1200&q=80",
    title: "Health Check-up Packages",
    short: "Basic, executive and full-body wellness screenings.",
    desc: "Comprehensive wellness screenings — basic, executive, and full-body packages including cardiac, metabolic, liver, and kidney assessments.",
  },
  {
    slug: "chronic-disease-management",
    icon: Activity,
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=1200&q=80",
    title: "Chronic Disease Management",
    short: "Long-term care plans for diabetes, hypertension, asthma and more.",
    desc: "Ongoing care plans for diabetes, hypertension, asthma, thyroid disorders, and other long-term conditions — including monitoring, medication, and lifestyle counselling.",
  },
  {
    slug: "routine-vaccinations",
    icon: Syringe,
    image: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=1200&q=80",
    title: "Routine Vaccinations",
    short: "Adult and child immunization with up-to-date records.",
    desc: "Adult and child immunization — flu, hepatitis, MMR, tetanus, HPV, and travel-unrelated routine vaccines, with up-to-date records and reminders.",
  },
  {
    slug: "diagnostic-imaging",
    icon: ScanLine,
    image: "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?auto=format&fit=crop&w=1200&q=80",
    title: "Diagnostic Imaging",
    short: "On-site X-ray and ECG, with partner-network ultrasound, CT and MRI.",
    desc: "On-site chest X-ray, ECG, and partner-network access to ultrasound, CT, and MRI imaging when clinically required.",
  },
  {
    slug: "pre-employment-insurance-medicals",
    icon: ShieldCheck,
    image: "https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&w=1200&q=80",
    title: "Pre-employment & Insurance Medicals",
    short: "Standardized medicals for jobs, schools and insurance applications.",
    desc: "Standardized health assessments for local employment, school admissions, and insurance applications — fast, accurate, and properly documented.",
  },
  {
    slug: "specialized-testing",
    icon: Microscope,
    image: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=1200&q=80",
    title: "Specialized Testing",
    short: "Allergy, autoimmune and tumour-marker panels — physician-guided.",
    desc: "Specialty panels including allergy testing, vitamin and mineral assays, autoimmune markers, and tumour markers — guided by physician consultation.",
  },
];

/* ------------------ tabs ------------------ */

const tabs = [
  { id: "outbound", label: "Outbound", icon: PlaneTakeoff, accent: "from-emerald-500 to-teal-600", group: "Migration" },
  { id: "inbound", label: "Inbound", icon: PlaneLanding, accent: "from-blue-500 to-cyan-600", group: "Migration" },
  { id: "corporate", label: "Corporate", icon: Building2, accent: "from-emerald-500 to-teal-600", group: "Migration" },
  { id: "clinic", label: "Clinic", icon: Microscope, accent: "from-blue-500 to-cyan-600", group: "Clinic" },
];

const TabNav = ({ active, setActive }: { active: string; setActive: (v: string) => void }) => (
  <div className="sticky top-[76px] z-40 bg-white/85 backdrop-blur-xl border-b border-slate-200/80 -mt-16 mb-12">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-center">
        <div className="flex gap-1 p-1.5 bg-slate-100 rounded-full my-3 overflow-x-auto max-w-full">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActive(tab.id)}
              className={`relative inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 text-sm font-semibold rounded-full transition-colors whitespace-nowrap ${
                active === tab.id ? "text-white" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {active === tab.id && (
                <motion.div
                  layoutId="tab-pill"
                  className={`absolute inset-0 bg-gradient-to-r ${tab.accent} rounded-full shadow-lg`}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  </div>
);

/* ------------------ collapsible card ------------------ */

type CollapsibleCardProps = {
  title: string;
  short: string;
  desc: string;
  icon?: React.ComponentType<{ className?: string }>;
  index: number;
  inView: boolean;
  variant?: "numbered" | "iconed";
};

const CollapsibleCard = ({ title, short, desc, icon: Icon, index, inView, variant = "iconed" }: CollapsibleCardProps) => {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: 0.05 * index }}
      layout
      className="group relative bg-white border border-slate-200 rounded-3xl overflow-hidden hover:shadow-xl hover:border-primary/40 transition-all duration-300"
    >
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="w-full text-left p-6 flex items-start gap-4 cursor-pointer"
      >
        {variant === "numbered" ? (
          <div className="flex-shrink-0 font-heading text-2xl font-black text-primary/80 bg-primary/10 w-11 h-11 rounded-xl flex items-center justify-center">
            {String(index + 1).padStart(2, "0")}
          </div>
        ) : (
          Icon && (
            <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-primary/10 group-hover:bg-gradient-to-br group-hover:from-primary group-hover:to-brand-cyan flex items-center justify-center transition-all duration-300">
              <Icon className="w-5 h-5 text-primary group-hover:text-white transition-colors" />
            </div>
          )
        )}

        <div className="flex-1 min-w-0">
          <h4 className="font-heading text-base sm:text-lg font-extrabold text-slate-900 leading-snug pr-8">{title}</h4>
          <motion.p
            animate={{ opacity: open ? 0 : 1, height: open ? 0 : "auto" }}
            transition={{ duration: 0.2 }}
            className="text-sm text-slate-600 leading-relaxed mt-1.5 overflow-hidden"
          >
            {short}
          </motion.p>
        </div>

        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="flex-shrink-0 mt-1 w-8 h-8 rounded-full bg-primary/5 group-hover:bg-primary/10 flex items-center justify-center transition-colors"
          aria-hidden="true"
        >
          <ChevronDown className="w-4 h-4 text-primary" />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              height: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
              opacity: { duration: 0.2, delay: 0.05 },
            }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 pl-[3.75rem] sm:pl-[4.25rem]">
              <div className="border-l-2 border-primary/30 pl-4">
                <p className="text-sm text-slate-700 leading-relaxed">{desc}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary to-brand-cyan transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`} />
    </motion.div>
  );
};

/* ------------------ outbound ------------------ */

const OutboundBlock = ({ onBook }: { onBook: LayoutContext["openBooking"] }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white relative overflow-hidden" ref={ref}>
      <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-100/40 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-100/40 rounded-full blur-[120px]" />

      <div className="max-w-7xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 max-w-2xl mx-auto"
        >
          <span className="inline-block text-xs uppercase tracking-[0.3em] font-bold text-emerald-600 mb-4">
            ✦ Outbound Health Services ✦
          </span>
          <h2 className="font-heading text-4xl sm:text-5xl font-extrabold text-slate-900 mb-5 leading-tight">
            For those{" "}
            <span className="bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent">
              going abroad.
            </span>
          </h2>
          <p className="text-lg text-slate-600">
            From visa medicals to complete pre-departure health preparation, we ensure every outbound migrant leaves with full health clearance and confidence.
          </p>
        </motion.div>

        <div className="mb-24">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }} className="mb-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                <Globe2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-heading text-3xl font-extrabold text-slate-900">Migration Health & Visa Medicals</h3>
                <p className="text-slate-500 text-sm">Mandatory health screening for work and residency visas worldwide.</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-emerald-50 to-teal-50/50 border border-emerald-200 rounded-3xl p-6 lg:p-8 mt-6">
              <div className="flex items-start gap-4">
                <div className="hidden sm:flex w-10 h-10 rounded-full bg-primary text-white items-center justify-center flex-shrink-0">
                  <FileSearch className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-heading font-extrabold text-emerald-900 mb-2">What are Visa Medicals?</h4>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    Visa medicals are mandatory, government-regulated health assessments required by destination countries as part of visa or work permit applications. <strong>MEDIHUB is an authorized centre</strong> for conducting these assessments in strict compliance with each country's requirements, ensuring your documentation is accurate, complete, and accepted.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-5">
            {visaCountries.map((country, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.08 * i }}
                whileHover={{ y: -6 }}
                className="group bg-white border border-slate-200 rounded-3xl hover:shadow-2xl hover:border-primary/40 transition-all duration-500 relative overflow-hidden flex flex-col"
              >
                {/* Image header */}
                <div className="relative h-40 sm:h-44 overflow-hidden">
                  <img
                    src={country.image}
                    alt={country.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-slate-900/10 to-transparent" />
                  <span className="absolute top-3 left-3 inline-block text-[10px] font-bold text-white bg-primary/90 backdrop-blur-sm px-2.5 py-1 rounded-full uppercase tracking-wider shadow-lg">
                    {country.badge}
                  </span>
                  <h4 className="absolute bottom-3 left-4 right-4 font-heading text-xl font-extrabold text-white drop-shadow-md">
                    {country.title}
                  </h4>
                </div>
                {/* Body */}
                <div className="p-6 flex-1 flex flex-col">
                  <p className="text-xs font-semibold text-primary mb-3">{country.countries}</p>
                  <p className="text-sm text-slate-600 leading-relaxed">{country.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="mb-24">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }} className="mb-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                <FileSearch className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-heading text-3xl font-extrabold text-slate-900">Pre-Medicals</h3>
                <p className="text-slate-500 text-sm">Health optimization before your formal medical assessment.</p>
              </div>
            </div>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-4">
            {preMedicalBlocks.map((block, i) => (
              <CollapsibleCard
                key={i}
                index={i}
                inView={inView}
                title={block.title}
                short={block.short}
                desc={block.desc}
                variant="numbered"
              />
            ))}
          </div>
        </div>

        <div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }} className="mb-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                <HeartHandshake className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-heading text-3xl font-extrabold text-slate-900">Migrant Health Services — Pre-departure Care</h3>
                <p className="text-slate-500 text-sm">Complete health preparation for a safe journey and successful integration abroad.</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <CardStack
              items={migrantServices.map((svc, i) => ({
                id: i,
                title: svc.title,
                description: svc.short,
                imageSrc: svc.image,
                icon: svc.icon,
              }))}
              cardWidth={460}
              cardHeight={300}
              overlap={0.52}
              spreadDeg={38}
              maxVisible={5}
              autoAdvance
              intervalMs={2000}
              pauseOnHover
              springStiffness={150}
              springDamping={26}
              activeScale={1.05}
              inactiveScale={0.92}
              activeLiftPx={28}
              tiltXDeg={10}
              depthPx={130}
              renderCard={(item, { active }) => (
                <FanCard
                  item={item}
                  active={active}
                  label="Pre-departure"
                  accentDot="bg-emerald-500/90"
                  onBook={(service) => onBook(service, "migration")}
                />
              )}
            />
            <p className="mt-3 text-center text-xs text-slate-400 uppercase tracking-[0.25em] font-bold">
              Drag · click · or use ← → keys
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

type FanCardItem = {
  id: string | number;
  title: string;
  description: string;
  imageSrc: string;
  icon: React.ComponentType<{ className?: string }>;
};

type FanCardProps = {
  item: FanCardItem;
  active: boolean;
  /** Pill label shown top-left, e.g. "Pre-departure", "Corporate", "Clinic". */
  label: string;
  /** Tailwind class for the active-state pill background, e.g. "bg-emerald-500/90". */
  accentDot: string;
  /** When provided, the active card is clickable to open the booking modal
   *  pre-filled with that service title. */
  onBook?: (service: string) => void;
};

const FanCard = ({ item, active, label, accentDot, onBook }: FanCardProps) => {
  const Icon = item.icon;
  const [imgError, setImgError] = useState(false);
  const isClickable = active && !!onBook;

  return (
    <div
      className={`relative h-full w-full bg-slate-900 ${
        isClickable ? "cursor-pointer" : ""
      }`}
      onClick={(e) => {
        if (isClickable && onBook) {
          e.stopPropagation();
          onBook(item.title);
        }
      }}
    >
      {!imgError ? (
        <img
          src={item.imageSrc}
          alt={item.title}
          className="absolute inset-0 h-full w-full object-cover"
          draggable={false}
          loading="eager"
          onError={() => setImgError(true)}
        />
      ) : (
        // Graceful image fallback — gradient + giant icon. Fires when the
        // remote photo can't load (CDN hiccup, blocked URL, etc.).
        <div className="absolute inset-0 bg-gradient-to-br from-slate-700 via-slate-800 to-slate-950 flex items-center justify-center">
          <Icon className="w-28 h-28 text-white/15" />
        </div>
      )}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />
      <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/10" />

      {/* Top-left: icon glass pill */}
      <div className="absolute top-4 left-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20">
        <Icon className="w-3.5 h-3.5 text-white" />
        <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/90">
          {label}
        </span>
      </div>

      {/* Active state highlight */}
      {active && (
        <div className={`absolute top-4 right-4 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full ${accentDot} backdrop-blur-sm`}>
          <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-white">
            Active
          </span>
        </div>
      )}

      {/* Bottom: title + description */}
      <div className="relative z-10 flex h-full flex-col justify-end p-5">
        <h4 className="font-heading text-xl sm:text-2xl font-extrabold text-white leading-tight">
          {item.title}
        </h4>
        <p className="mt-2 text-sm text-white/80 leading-snug line-clamp-2">
          {item.description}
        </p>

        {isClickable && (
          <div
            className="mt-4 inline-flex w-fit items-center gap-1.5 rounded-full bg-white text-slate-900 px-3.5 py-1.5 text-xs font-bold shadow-lg pointer-events-none"
          >
            Book this service
            <svg viewBox="0 0 16 16" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 8h10M9 4l4 4-4 4" />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
};

/* ------------------ inbound ------------------ */

const LanguageSwitcher = ({ lang, onChange }: { lang: "en" | "zh"; onChange: (l: "en" | "zh") => void }) => (
  <div
    className="inline-flex items-center gap-1 rounded-full p-1 backdrop-blur-md border bg-white border-blue-200 shadow-sm"
    role="group"
    aria-label="Language"
  >
    <Languages className="w-4 h-4 ml-2 text-blue-600" />
    <button
      onClick={() => onChange("en")}
      className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-all ${
        lang === "en" ? "bg-blue-600 text-white shadow" : "text-slate-600 hover:text-blue-700"
      }`}
      aria-pressed={lang === "en"}
    >
      EN
    </button>
    <button
      onClick={() => onChange("zh")}
      className={`px-3 py-1.5 text-xs font-bold rounded-full transition-all ${
        lang === "zh" ? "bg-blue-600 text-white shadow" : "text-slate-600 hover:text-blue-700"
      }`}
      aria-pressed={lang === "zh"}
    >
      中文
    </button>
  </div>
);


const InboundBlock = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [lang, setLang] = useState<"en" | "zh">("en");
  const t = inboundI18n[lang];

  return (
    <section
      className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-blue-50/30 via-white to-blue-50/30 relative overflow-hidden"
      ref={ref}
    >
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-blue-200/30 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-cyan-200/30 rounded-full blur-[120px]" />

      <div className="max-w-7xl mx-auto relative">
        <div className="flex flex-col items-center gap-6 mb-14">
          <div className="flex items-center gap-3">
            <span className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
              {t.langLabel}
            </span>
            <LanguageSwitcher lang={lang} onChange={setLang} />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center max-w-2xl"
          >
            <span className="inline-block text-xs uppercase tracking-[0.3em] font-bold text-blue-600 mb-4">
              ✦ {t.eyebrow} ✦
            </span>
            <AnimatePresence mode="wait">
              <motion.h2
                key={lang + "-title"}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className={`font-heading font-extrabold text-slate-900 leading-tight mb-5 ${
                  lang === "zh" ? "text-3xl sm:text-4xl" : "text-4xl sm:text-5xl"
                }`}
              >
                {t.titleA}{" "}
                <span className="bg-gradient-to-r from-blue-500 to-cyan-600 bg-clip-text text-transparent">
                  {t.titleB}
                </span>
              </motion.h2>
            </AnimatePresence>
            <AnimatePresence mode="wait">
              <motion.p
                key={lang + "-desc"}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
                className="text-lg text-slate-600 leading-relaxed"
              >
                {t.description}
              </motion.p>
            </AnimatePresence>
          </motion.div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {inboundServices.map((svc, i) => {
            const c = svc[lang];
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.08 * i }}
                whileHover={{ y: -6 }}
                className="group bg-white border border-blue-100 rounded-3xl hover:shadow-2xl hover:shadow-blue-500/10 hover:border-blue-300 transition-all duration-500 relative overflow-hidden flex flex-col"
              >
                {/* Image header */}
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={svc.image}
                    alt={c.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-slate-900/0 to-transparent" />
                  <div className="absolute top-3 left-3 w-11 h-11 rounded-2xl bg-white/95 backdrop-blur-sm shadow-lg flex items-center justify-center">
                    <svc.icon className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
                {/* Body */}
                <div className="p-6 flex-1 flex flex-col">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={lang + "-c-" + i}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.25 }}
                    >
                      <h3
                        className={`font-heading font-extrabold text-slate-900 mb-2 group-hover:text-blue-700 transition-colors ${
                          lang === "zh" ? "text-base sm:text-lg" : "text-base"
                        }`}
                      >
                        {c.title}
                      </h3>
                      <p className="text-sm text-slate-600 leading-relaxed">{c.desc}</p>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

/* ------------------ corporate ------------------ */

const CorporateBlock = ({ onBook }: { onBook: LayoutContext["openBooking"] }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900 text-white relative overflow-hidden" ref={ref}>
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-[140px]" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-500/10 rounded-full blur-[140px]" />

      <div className="max-w-7xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 max-w-2xl mx-auto"
        >
          <span className="inline-block text-xs uppercase tracking-[0.3em] font-bold text-emerald-400 mb-4">
            ✦ Corporate & Institutional ✦
          </span>
          <h2 className="font-heading text-4xl sm:text-5xl font-extrabold mb-5 leading-tight">
            For employers &{" "}
            <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
              recruitment partners.
            </span>
          </h2>
          <p className="text-lg text-white/70">
            Comprehensive occupational and pre-employment health solutions for employers, recruitment agencies, and institutions managing migrant workforces.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <CardStack
            items={corporateServices.map((svc, i) => ({
              id: i,
              title: svc.title,
              description: svc.short,
              imageSrc: svc.image,
              icon: svc.icon,
            }))}
            cardWidth={460}
            cardHeight={300}
            overlap={0.52}
            spreadDeg={38}
            maxVisible={5}
            autoAdvance
            intervalMs={2400}
            pauseOnHover
            springStiffness={150}
            springDamping={26}
            activeScale={1.05}
            inactiveScale={0.92}
            activeLiftPx={28}
            tiltXDeg={10}
            depthPx={130}
            renderCard={(item, { active }) => (
              <FanCard
                item={item}
                active={active}
                label="Corporate"
                accentDot="bg-emerald-500/90"
                onBook={(service) => onBook(service, "migration")}
              />
            )}
          />
          <p className="mt-3 text-center text-xs text-white/40 uppercase tracking-[0.25em] font-bold">
            Drag · click · or use ← → keys
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-14 max-w-3xl mx-auto bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-400/30 rounded-3xl p-8 text-center"
        >
          <h3 className="font-heading text-2xl font-extrabold mb-3">Ready to partner with MEDIHUB?</h3>
          <p className="text-white/70 text-sm mb-6">Priority scheduling, dedicated account management, and seamless coordination for high-volume placements.</p>
          <button
            onClick={() => onBook()}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold px-6 py-3 rounded-full shadow-lg hover:-translate-y-0.5 transition-transform"
          >
            <Calendar className="w-4 h-4" />
            Schedule a meeting
          </button>
        </motion.div>
      </div>
    </section>
  );
};

/* ------------------ clinic ------------------ */

const ClinicBlock = ({ onBook }: { onBook: LayoutContext["openBooking"] }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const location = useLocation();

  // If the URL has a hash matching a clinic slug, open the stack on that card.
  const hashSlug = location.hash.slice(1);
  const initialIndex = Math.max(
    0,
    clinicServices.findIndex((s) => s.slug === hashSlug)
  );

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-blue-50/30 via-white to-cyan-50/30 relative overflow-hidden" ref={ref}>
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-blue-200/30 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-cyan-200/30 rounded-full blur-[120px]" />

      {/* Invisible anchors so the navbar's deep links (e.g. #routine-vaccinations)
          still resolve to a scroll target — the CardStack auto-shows the matching
          card via initialIndex below. */}
      <div className="relative h-0" aria-hidden>
        {clinicServices.map((s) => (
          <span key={s.slug} id={s.slug} className="absolute -top-32 invisible" />
        ))}
      </div>

      <div className="max-w-7xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 max-w-2xl mx-auto"
        >
          <span className="inline-block text-xs uppercase tracking-[0.3em] font-bold text-blue-600 mb-4">
            ✦ Clinic & Laboratory ✦
          </span>
          <h2 className="font-heading text-4xl sm:text-5xl font-extrabold text-slate-900 mb-5 leading-tight">
            Care that stays{" "}
            <span className="bg-gradient-to-r from-blue-500 to-cyan-600 bg-clip-text text-transparent">
              close to home.
            </span>
          </h2>
          <p className="text-lg text-slate-600">
            Beyond migration, MEDIHUB is a fully equipped clinic and laboratory — offering everyday primary care, comprehensive diagnostics, and family health services for individuals and families.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <CardStack
            // Re-mount when the slug hash changes so initialIndex is reapplied.
            key={hashSlug || "default"}
            items={clinicServices.map((svc) => ({
              id: svc.slug,
              title: svc.title,
              description: svc.short,
              imageSrc: svc.image,
              icon: svc.icon,
            }))}
            initialIndex={initialIndex}
            cardWidth={460}
            cardHeight={300}
            overlap={0.52}
            spreadDeg={38}
            maxVisible={5}
            autoAdvance
            intervalMs={2400}
            pauseOnHover
            springStiffness={150}
            springDamping={26}
            activeScale={1.05}
            inactiveScale={0.92}
            activeLiftPx={28}
            tiltXDeg={10}
            depthPx={130}
            renderCard={(item, { active }) => (
              <FanCard
                item={item}
                active={active}
                label="Clinic"
                accentDot="bg-blue-500/90"
                onBook={(service) => onBook(service, "consultation")}
              />
            )}
          />
          <p className="mt-3 text-center text-xs text-slate-400 uppercase tracking-[0.25em] font-bold">
            Drag · click · or use ← → keys
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-14 max-w-3xl mx-auto bg-gradient-to-r from-blue-500 to-cyan-600 rounded-3xl p-8 text-center text-white relative overflow-hidden"
        >
          <div className="absolute -top-12 -right-12 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
          <div className="relative">
            <h3 className="font-heading text-2xl font-extrabold mb-3">Visit our clinic</h3>
            <p className="text-white/85 text-sm mb-6 max-w-xl mx-auto">Walk-ins are welcome for urgent consultations, or book ahead to skip the wait. Our laboratory operates daily for routine tests and same-day reports.</p>
            <button
              onClick={() => onBook()}
              className="inline-flex items-center gap-2 bg-white text-blue-600 font-bold px-6 py-3 rounded-full shadow-lg hover:-translate-y-0.5 transition-transform"
            >
              <Calendar className="w-4 h-4" />
              Book a visit
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

/* ------------------ page ------------------ */

const Services = () => {
  const ctx = useOutletContext<LayoutContext>();
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const initial = searchParams.get("tab") ?? "outbound";
  const [active, setActive] = useState(
    tabs.find((t) => t.id === initial) ? initial : "outbound"
  );

  // Sync URL with active tab
  const handleSetActive = (id: string) => {
    setActive(id);
    setSearchParams({ tab: id });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // React to URL changes (e.g., when user clicks Outbound/Inbound from Home)
  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab && tabs.find((t) => t.id === tab) && tab !== active) {
      setActive(tab);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // Smooth-scroll to hash anchor (e.g. clinic service navbar deep links).
  // Wait a frame so the section has actually mounted after the tab switch.
  useEffect(() => {
    if (!location.hash) return;
    const id = location.hash.slice(1);
    const tryScroll = (attempt = 0) => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      } else if (attempt < 10) {
        setTimeout(() => tryScroll(attempt + 1), 80);
      }
    };
    tryScroll();
  }, [location.hash, active]);

  const tabMeta = tabs.find((t) => t.id === active)!;

  const heroTitle: Record<string, React.ReactNode> = {
    outbound: (
      <>
        Going abroad?{" "}
        <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
          We've got you covered.
        </span>
      </>
    ),
    inbound: (
      <>
        Just arrived?{" "}
        <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
          Welcome to expert care.
        </span>
      </>
    ),
    corporate: (
      <>
        Moving people at scale?{" "}
        <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
          Partner with us.
        </span>
      </>
    ),
    clinic: (
      <>
        Everyday care.{" "}
        <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
          Close to home.
        </span>
      </>
    ),
  };

  const heroDescription: Record<string, string> = {
    outbound: "From visa medicals to complete pre-departure preparation — every form, every screening, every certificate handled by specialists.",
    inbound: "Arrival check-ups, vaccinations, chronic care, and telehealth — supporting your healthy integration into Sri Lanka.",
    corporate: "Pre-employment programmes, group screenings, and recruitment-agency partnerships — built for organizations moving people across borders.",
    clinic: "General consultations, laboratory diagnostics, and family health check-ups — a fully equipped clinic and lab beyond migration medicine.",
  };

  const heroImage: Record<string, string> = {
    outbound: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1400&q=80",
    inbound: "https://images.unsplash.com/photo-1632053001113-df97cf03307c?auto=format&fit=crop&w=1400&q=80",
    corporate: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1400&q=80",
    clinic: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1400&q=80",
  };

  return (
    <>
      <PageHero
        eyebrow="Our Services"
        title={heroTitle[active]}
        description={heroDescription[active]}
        breadcrumb={`Services · ${tabMeta.label}`}
        imageSrc={heroImage[active]}
        imageAlt={`${tabMeta.label} services at MEDIHUB`}
      />
      <TabNav active={active} setActive={handleSetActive} />
      {active === "outbound" && <OutboundBlock onBook={ctx.openBooking} />}
      {active === "inbound" && <InboundBlock />}
      {active === "corporate" && <CorporateBlock onBook={ctx.openBooking} />}
      {active === "clinic" && <ClinicBlock onBook={ctx.openBooking} />}
    </>
  );
};

export default Services;
