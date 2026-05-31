import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useOutletContext, useSearchParams } from "react-router-dom";
import {
  MapPin,
  Globe2,
  Compass,
  Plane,
  Stethoscope,
  Syringe,
  Activity,
  ClipboardCheck,
  Headphones,
  HeartPulse,
  Siren,
  UserCheck,
  UserCog,
  Calendar,
  ShieldCheck,
  TestTube2,
  FileSearch,
  FilePlus2,
  Download,
  LifeBuoy,
  Lightbulb,
  FileCheck,
  Sparkles,
  Moon,
  Landmark,
  HeartHandshake,
  Users,
  Pill,
  BookOpen,
  Ship,
  Anchor,
  Eye,
  Ear,
  FlaskConical,
  HeartHandshake as HeartIcon,
} from "lucide-react";
import PageHero from "@/components/PageHero";
import { ServiceGrid, type ServiceGridItem } from "@/components/ServiceGrid";
import { ParallaxSeafarer, ParallaxBand } from "@/components/ParallaxSeafarer";

type LayoutContext = {
  openBooking: (service?: string, mode?: "consultation" | "migration") => void;
};

/* ------------------ data ------------------ */

const localTravelerServices: ServiceGridItem[] = [
  { icon: Stethoscope, title: "Travel Health Consultation", desc: "Medical advice and health assessment for domestic travel within the country." },
  { icon: Syringe, title: "Vaccination Services", desc: "Recommended vaccinations for local travel and outbreak prevention." },
  { icon: Activity, title: "Fitness for Travel Assessment", desc: "Evaluation of fitness and safety for travel, especially for elderly or high-risk travelers." },
  { icon: ClipboardCheck, title: "Medical Screening", desc: "Basic health screening prior to travel, events, or occupational purposes." },
  { icon: Siren, title: "Emergency Medical Assistance", desc: "Support and coordination during travel-related medical emergencies." },
  { icon: Headphones, title: "Health Counselling", desc: "Guidance on food safety, infection prevention, and healthy travel practices." },
  { icon: UserCog, title: "Referral Services", desc: "Referral to hospitals, specialists, or diagnostic services when required." },
  { icon: UserCheck, title: "Escort Services", desc: "Medical and non-medical escort assistance for travelers requiring additional support." },
];

const internationalTravelerServices: ServiceGridItem[] = [
  { icon: Stethoscope, title: "Pre-Travel Health Consultation", desc: "Comprehensive medical advice based on destination-specific health risks." },
  { icon: Syringe, title: "Travel Vaccination Services", desc: "Administration of required and recommended vaccines for international travel." },
  { icon: FileCheck, title: "Visa Medical Examination", desc: "Medical examinations required for international visas and overseas travel." },
  { icon: Activity, title: "TB Screening", desc: "Tuberculosis screening for countries requiring migration or travel clearance." },
  { icon: TestTube2, title: "COVID-19 / Infectious Disease Testing", desc: "Testing services based on international travel and airline requirements." },
  { icon: Plane, title: "Fitness for Air Travel", desc: "Assessment for passengers with medical conditions requiring travel clearance." },
  { icon: Globe2, title: "Travel Health Advice", desc: "Guidance on malaria prevention, food safety, climate risks, and travel precautions." },
  { icon: ShieldCheck, title: "Insurance Assistance", desc: "Support with travel insurance medical documentation and claims guidance." },
  { icon: HeartPulse, title: "Post-Travel Consultation", desc: "Medical evaluation and care for illnesses or symptoms after international travel." },
  { icon: Siren, title: "Emergency Referral Services", desc: "Coordination of urgent medical care and specialist referrals during travel." },
  { icon: UserCheck, title: "Escort Services", desc: "Professional escort assistance for elderly, pediatric, disabled, or medically dependent travelers." },
];

const generalTravelerServices: ServiceGridItem[] = [
  { icon: Calendar, title: "Appointment Booking", desc: "Online scheduling for consultations, vaccinations, and medical examinations." },
  { icon: FilePlus2, title: "Online Registration", desc: "Digital registration for faster access to travel health services." },
  { icon: FileSearch, title: "Medical Records Access", desc: "Secure access to vaccination certificates and medical reports." },
  { icon: Download, title: "Report Download", desc: "Download travel-related medical and laboratory reports online." },
  { icon: LifeBuoy, title: "Help Desk", desc: "Assistance with appointments, documentation, and travel health inquiries." },
  { icon: Lightbulb, title: "Travel Health Information Centre", desc: "Country-specific health alerts, vaccination guidance, and travel advisories." },
];

const hajUmrahServices: ServiceGridItem[] = [
  { icon: ClipboardCheck, title: "Pilgrim Health Assessment", desc: "Comprehensive pre-pilgrimage health check-up to confirm fitness for Haj or Umrah travel." },
  { icon: Syringe, title: "Meningococcal Vaccination", desc: "Mandatory Meningococcal ACWY vaccination required by Saudi authorities, with certified documentation." },
  { icon: Pill, title: "Pilgrim Medication Pack", desc: "Personalised travel medication kit — chronic disease meds, pain relief, hydration support, and first aid." },
  { icon: HeartPulse, title: "Chronic Disease Clearance", desc: "Specialist review for pilgrims with diabetes, hypertension, asthma or cardiac conditions before travel." },
  { icon: BookOpen, title: "Pilgrim Health Briefing", desc: "Pre-departure orientation — heatstroke prevention, crowd safety, hygiene practices, and emergency contacts." },
  { icon: Headphones, title: "24/7 Telehealth in KSA", desc: "Round-the-clock telehealth assistance for pilgrims while they are in Makkah and Madinah." },
  { icon: ShieldCheck, title: "Travel Insurance Liaison", desc: "Guidance and documentation support for Haj/Umrah-specific travel health insurance." },
  { icon: Users, title: "Group Pilgrim Programmes", desc: "Coordinated medical screening and briefings for travel agents and pilgrim groups." },
];

const seafarerServices: ServiceGridItem[] = [
  { icon: Stethoscope, title: "Comprehensive Physical Examination", desc: "Full clinical examination covering cardiovascular, respiratory, abdominal, musculoskeletal and neurological systems — to certify fitness for sea service." },
  { icon: Eye, title: "Vision Assessment", desc: "Visual acuity, colour vision (Ishihara), and field-of-vision testing as required by the STCW Convention for deck and engine ratings." },
  { icon: Ear, title: "Hearing Assessment", desc: "Pure-tone audiometry and whispered voice testing — confirming hearing standards required by international maritime regulations." },
  { icon: FlaskConical, title: "Laboratory Investigations", desc: "Full blood count, biochemistry, urinalysis, drug & alcohol screening, HIV, Hepatitis B/C, syphilis and other tests required by the seafarer's flag state." },
  { icon: HeartPulse, title: "Cardiovascular Screening", desc: "Resting ECG, blood pressure assessment and cardiac risk evaluation — essential for high-stress, isolated working conditions at sea." },
  { icon: Activity, title: "Chest X-Ray", desc: "Digital chest radiograph reviewed by a radiologist — screening for tuberculosis, respiratory disease and cardiac silhouette abnormalities." },
  { icon: Syringe, title: "Vaccinations for Seafarers", desc: "Yellow Fever, Hepatitis A & B, Typhoid, Tetanus, Cholera and other immunisations recommended by the WHO and the seafarer's destination ports." },
  { icon: ShieldCheck, title: "Drug & Alcohol Testing", desc: "Pre-employment and periodic substance-abuse screening as mandated by maritime employers, P&I clubs and many flag-state authorities." },
  { icon: FileCheck, title: "MLC 2006 Certification", desc: "Maritime Labour Convention–compliant Medical Fitness Certificate issued for periods of up to 2 years (1 year for those under 18)." },
  { icon: Anchor, title: "Flag-State Specific Medicals", desc: "Examinations tailored to the requirements of the seafarer's flag state — UK MCA / ENG 1, Liberia, Panama, Marshall Islands, Singapore and more." },
  { icon: HeartIcon, title: "Mental Health & Wellness Check", desc: "Confidential screening for stress, anxiety and depression — supporting wellbeing for long, isolated rotations at sea." },
  { icon: ClipboardCheck, title: "Pre-Joining Medical Report", desc: "Detailed clinical report and Medical Fitness Certificate, formatted for shipping company, manning agency and port-state inspections." },
];

const dambadeniyaServices: ServiceGridItem[] = [
  { icon: Stethoscope, title: "Tourist Walk-in Clinic", desc: "On-site medical consultations for tourists visiting Dambadeniya and nearby heritage sites." },
  { icon: Pill, title: "Tourist Pharmacy Support", desc: "Quick access to commonly required medication and prescription refills for visitors." },
  { icon: Activity, title: "Heritage Trail Fitness Advice", desc: "Health and fitness guidance for tourists exploring climbing trails and outdoor heritage sites." },
  { icon: Siren, title: "Emergency Response", desc: "Rapid coordination with nearby hospitals for tourist medical emergencies in the region." },
  { icon: Syringe, title: "On-site Vaccination", desc: "Travel and routine vaccinations available for tourists and pilgrims passing through Dambadeniya." },
  { icon: HeartHandshake, title: "Cultural-Sensitive Care", desc: "Multilingual, culturally aware medical care for both local and international tourists." },
];

/* ------------------ tabs ------------------ */

const tabs = [
  { id: "local", label: "Local Travelers", icon: MapPin, accent: "from-teal-500 to-emerald-600" },
  { id: "international", label: "International", icon: Globe2, accent: "from-blue-500 to-cyan-600" },
  { id: "general", label: "General", icon: Compass, accent: "from-violet-500 to-fuchsia-600" },
  { id: "seafarer", label: "Seafarer", icon: Ship, accent: "from-cyan-500 to-blue-600" },
  { id: "haj-umrah", label: "Haj & Umrah", icon: Moon, accent: "from-amber-500 to-orange-600" },
  { id: "dambadeniya", label: "Dambadeniya", icon: Landmark, accent: "from-rose-500 to-pink-600" },
] as const;

type TabId = (typeof tabs)[number]["id"];

const TabNav = ({ active, setActive }: { active: TabId; setActive: (v: TabId) => void }) => (
  <div className="sticky top-[72px] sm:top-[88px] lg:top-[100px] z-40 bg-white/85 backdrop-blur-xl border-b border-slate-200/80 -mt-16 mb-12">
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
                  layoutId="travels-tab-pill"
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

/* ------------------ blocks ------------------ */

const LocalBlock = ({ onBook }: { onBook: LayoutContext["openBooking"] }) => (
  <>
    <ServiceGrid
      eyebrow="Local Travelers"
      title={
        <>
          Health support for{" "}
          <span className="bg-gradient-to-r from-teal-500 to-emerald-600 bg-clip-text text-transparent">
            domestic journeys.
          </span>
        </>
      }
      description="From event medicals to senior travel fitness — comprehensive care for travelers exploring within Sri Lanka."
      items={localTravelerServices}
      accent="teal"
      background="white"
      columns={3}
    />
    <section className="pb-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-3xl mx-auto bg-gradient-to-r from-teal-500/10 to-emerald-500/10 border border-teal-200 rounded-3xl p-8 text-center">
        <h3 className="font-heading text-2xl font-extrabold text-slate-900 mb-3">Planning a local trip?</h3>
        <p className="text-slate-600 text-sm mb-6">Book a quick travel health consultation before you set off.</p>
        <button
          onClick={() => onBook("Travel Health Consultation", "consultation")}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-bold px-6 py-3 rounded-full shadow-lg hover:-translate-y-0.5 transition-transform"
        >
          <Calendar className="w-4 h-4" />
          Book consultation
        </button>
      </div>
    </section>
  </>
);

const InternationalBlock = ({ onBook }: { onBook: LayoutContext["openBooking"] }) => (
  <>
    <ServiceGrid
      eyebrow="International Travelers"
      title={
        <>
          Ready for the world —{" "}
          <span className="bg-gradient-to-r from-blue-500 to-cyan-600 bg-clip-text text-transparent">
            medically prepared.
          </span>
        </>
      }
      description="Pre-travel consultations, vaccinations, visa medicals, and post-travel care for international journeys."
      items={internationalTravelerServices}
      accent="blue"
      background="muted"
      columns={3}
    />
    <section className="pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-3xl mx-auto bg-gradient-to-r from-blue-600 to-cyan-600 rounded-3xl p-8 text-center text-white relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
        <div className="relative">
          <h3 className="font-heading text-2xl font-extrabold mb-3">Traveling abroad soon?</h3>
          <p className="text-white/85 text-sm mb-6 max-w-xl mx-auto">
            Get destination-specific advice, vaccinations, and documentation — all in one visit.
          </p>
          <button
            onClick={() => onBook("Pre-Travel Health Consultation", "consultation")}
            className="inline-flex items-center gap-2 bg-white text-blue-600 font-bold px-6 py-3 rounded-full shadow-lg hover:-translate-y-0.5 transition-transform"
          >
            <Calendar className="w-4 h-4" />
            Book pre-travel consult
          </button>
        </div>
      </div>
    </section>
  </>
);

const HajUmrahBlock = ({ onBook }: { onBook: LayoutContext["openBooking"] }) => (
  <>
    <ServiceGrid
      eyebrow="Haj & Umrah Tourist Medical"
      title={
        <>
          A sacred journey,{" "}
          <span className="bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">
            taken in good health.
          </span>
        </>
      }
      description="Specialised pilgrim health services — mandatory vaccinations, fitness assessments, chronic disease clearance, and 24/7 telehealth while in Saudi Arabia."
      items={hajUmrahServices}
      accent="amber"
      background="white"
      columns={3}
    />
    <section className="pb-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-3xl mx-auto bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-200 rounded-3xl p-8 text-center">
        <div className="inline-flex items-center gap-2 text-amber-700 mb-3">
          <Moon className="w-4 h-4" />
          <span className="text-xs uppercase tracking-[0.3em] font-bold">Pilgrim Care</span>
        </div>
        <h3 className="font-heading text-2xl font-extrabold text-slate-900 mb-3">Preparing for Haj or Umrah?</h3>
        <p className="text-slate-600 text-sm mb-6">Book a dedicated pilgrim health consultation — fitness assessment, vaccinations, and pre-departure briefing.</p>
        <button
          onClick={() => onBook("Pilgrim Health Assessment", "consultation")}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-bold px-6 py-3 rounded-full shadow-lg hover:-translate-y-0.5 transition-transform"
        >
          <Calendar className="w-4 h-4" />
          Book pilgrim consultation
        </button>
      </div>
    </section>
  </>
);

const SeafarerBlock = ({ onBook }: { onBook: LayoutContext["openBooking"] }) => (
  <>
    {/* ── Intro / standards summary ── */}
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white relative overflow-hidden">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-100/50 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-100/50 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-5xl mx-auto relative text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
        >
          <span className="inline-block text-xs uppercase tracking-[0.3em] font-bold text-cyan-600 mb-4">
            ✦ Built for Maritime Workers ✦
          </span>
          <h2 className="font-heading text-4xl sm:text-5xl font-extrabold text-slate-900 mb-6 leading-tight">
            Comprehensive health evaluations,{" "}
            <span className="bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">
              ready for sea service.
            </span>
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed">
            MEDIHUB Seafarer Medicals provide complete health evaluations for individuals
            working at sea — covering every examination, screening and certification needed
            to meet international maritime health standards and sign on with confidence.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid sm:grid-cols-3 gap-4 mt-12"
        >
          {[
            { label: "MLC 2006 Compliant", desc: "Maritime Labour Convention certification" },
            { label: "ILO / WHO Standards", desc: "Aligned with international guidelines" },
            { label: "Flag-State Ready", desc: "UK MCA, Liberia, Panama, Singapore & more" },
          ].map((item) => (
            <div
              key={item.label}
              className="bg-gradient-to-br from-cyan-50 to-blue-50 border border-cyan-100 rounded-2xl p-6 text-left"
            >
              <div className="flex items-center gap-2 mb-2">
                <Anchor className="w-4 h-4 text-cyan-600" />
                <h4 className="font-heading text-sm font-extrabold text-slate-900">
                  {item.label}
                </h4>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>

    {/* ── Services grid ── */}
    <div id="seafarer-services">
      <ServiceGrid
        eyebrow="Examinations & Tests"
        title={
          <>
            Every check, every certificate —{" "}
            <span className="bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">
              under one roof.
            </span>
          </>
        }
        description="From physical examination and audiometry to MLC 2006 certification and flag-state specific medicals, our seafarer programme covers the full pre-joining workflow."
        items={seafarerServices}
        accent="blue"
        background="muted"
        columns={3}
      />
    </div>

    {/* ── Mid parallax band ── */}
    <ParallaxBand
      title="Certified to the standards your vessel demands."
      subtitle="MLC 2006 Medical Fitness Certificates · STCW vision & hearing standards · Flag-state and P&I-aligned reporting — issued the same day where possible."
    />

    {/* ── Process / what to bring ── */}
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-10 items-start">
          {/* What to bring */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
            className="bg-gradient-to-br from-slate-50 to-cyan-50/50 border border-slate-200 rounded-3xl p-8 lg:p-10"
          >
            <div className="inline-flex items-center gap-2 text-cyan-700 mb-4">
              <ClipboardCheck className="w-4 h-4" />
              <span className="text-xs uppercase tracking-[0.3em] font-bold">
                What to Bring
              </span>
            </div>
            <h3 className="font-heading text-3xl font-extrabold text-slate-900 mb-6">
              Come prepared — clear in one visit.
            </h3>
            <ul className="space-y-3">
              {[
                "Valid passport or NIC (with photocopy)",
                "Seaman's Discharge Book (CDC) if previously issued",
                "Recent passport-size photographs (2 copies)",
                "Previous medical certificates and reports, if any",
                "Vaccination card / Yellow Fever certificate (if any)",
                "Current prescriptions and chronic medication list",
                "Spectacles or contact lenses if you wear them",
                "Manning agent referral letter (if provided)",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="flex-shrink-0 mt-1 w-5 h-5 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                    <span className="w-2 h-2 rounded-full bg-white" />
                  </span>
                  <span className="text-sm text-slate-700 leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* How it works */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
            className="space-y-5"
          >
            <div className="inline-flex items-center gap-2 text-cyan-700 mb-1">
              <Ship className="w-4 h-4" />
              <span className="text-xs uppercase tracking-[0.3em] font-bold">
                Step-by-step
              </span>
            </div>
            <h3 className="font-heading text-3xl font-extrabold text-slate-900 mb-2">
              How your seafarer medical works.
            </h3>
            <p className="text-slate-600 mb-4">
              A streamlined, single-day pathway from registration to certificate.
            </p>

            {[
              {
                num: "01",
                title: "Registration & Briefing",
                desc: "Submit ID, photos and any previous reports. Our team confirms the flag-state and shipping company requirements applicable to your medical.",
              },
              {
                num: "02",
                title: "Examinations & Tests",
                desc: "Physical examination, vision and hearing, ECG, chest X-ray, urinalysis, drug screening and the full laboratory panel.",
              },
              {
                num: "03",
                title: "Physician Review",
                desc: "Our maritime medical examiner reviews every result, identifies any borderline findings and discusses next steps with you.",
              },
              {
                num: "04",
                title: "Certificate Issued",
                desc: "MLC 2006 Medical Fitness Certificate and detailed report — ready the same day where clinically appropriate.",
              },
            ].map((step) => (
              <div
                key={step.num}
                className="group flex items-start gap-4 p-5 rounded-2xl border border-slate-200 bg-white hover:border-cyan-300 hover:shadow-lg hover:shadow-cyan-500/10 transition-all"
              >
                <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white font-heading font-extrabold flex items-center justify-center shadow-md shadow-cyan-500/30">
                  {step.num}
                </div>
                <div className="min-w-0">
                  <h4 className="font-heading text-base font-extrabold text-slate-900 mb-1 group-hover:text-cyan-700 transition-colors">
                    {step.title}
                  </h4>
                  <p className="text-sm text-slate-600 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>

    {/* ── CTA ── */}
    <section id="seafarer-cta" className="pb-24 px-4 sm:px-6 lg:px-8 bg-white">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7 }}
        className="max-w-4xl mx-auto bg-gradient-to-br from-cyan-600 via-blue-700 to-slate-900 rounded-3xl p-10 lg:p-14 text-center text-white relative overflow-hidden"
      >
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-cyan-400/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-blue-400/15 rounded-full blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        <div className="relative">
          <div className="inline-flex items-center gap-2 bg-white/15 border border-white/25 rounded-full px-3 py-1 mb-5 backdrop-blur-md">
            <Ship className="w-3.5 h-3.5 text-cyan-200" />
            <span className="text-[11px] uppercase tracking-widest font-bold text-cyan-100">
              Ready to sign on?
            </span>
          </div>
          <h3 className="font-heading text-3xl sm:text-4xl font-extrabold mb-4 leading-tight">
            Book your seafarer medical — sail with confidence.
          </h3>
          <p className="text-white/80 text-base sm:text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
            Fast turnaround, MLC 2006–compliant certification, and flag-state specific
            reports prepared by maritime medical examiners.
          </p>
          <button
            onClick={() => onBook("Seafarer Medical Examination", "consultation")}
            className="inline-flex items-center gap-2 bg-white text-blue-700 font-bold px-7 py-3.5 rounded-full shadow-xl hover:-translate-y-0.5 transition-transform"
          >
            <Calendar className="w-5 h-5" />
            Book Seafarer Medical
          </button>
        </div>
      </motion.div>
    </section>
  </>
);

const DambadeniyaBlock = ({ onBook }: { onBook: LayoutContext["openBooking"] }) => (
  <>
    <ServiceGrid
      eyebrow="Dambadeniya Tourist Medical"
      title={
        <>
          Heritage travel,{" "}
          <span className="bg-gradient-to-r from-rose-500 to-pink-600 bg-clip-text text-transparent">
            with care close by.
          </span>
        </>
      }
      description="On-site medical support for tourists visiting Dambadeniya — walk-in consultations, vaccinations, pharmacy assistance, and rapid emergency coordination."
      items={dambadeniyaServices}
      accent="violet"
      background="muted"
      columns={3}
    />
    <section className="pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-3xl mx-auto bg-gradient-to-r from-rose-600 to-pink-600 rounded-3xl p-8 text-center text-white relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
        <div className="relative">
          <h3 className="font-heading text-2xl font-extrabold mb-3">Visiting Dambadeniya?</h3>
          <p className="text-white/85 text-sm mb-6 max-w-xl mx-auto">
            Reach our tourist medical desk for walk-in care, pharmacy needs, or emergency coordination during your visit.
          </p>
          <button
            onClick={() => onBook("Tourist Walk-in Clinic", "consultation")}
            className="inline-flex items-center gap-2 bg-white text-rose-600 font-bold px-6 py-3 rounded-full shadow-lg hover:-translate-y-0.5 transition-transform"
          >
            <Calendar className="w-4 h-4" />
            Book a tourist consultation
          </button>
        </div>
      </div>
    </section>
  </>
);

const GeneralBlock = ({ onBook }: { onBook: LayoutContext["openBooking"] }) => (
  <>
    <ServiceGrid
      eyebrow="General Traveler Services"
      title={
        <>
          Every traveler tool —{" "}
          <span className="bg-gradient-to-r from-violet-500 to-fuchsia-600 bg-clip-text text-transparent">
            at your fingertips.
          </span>
        </>
      }
      description="Bookings, records, downloads, and a travel health information centre to keep you informed every step of the way."
      items={generalTravelerServices}
      accent="violet"
      background="white"
      columns={3}
    />
    <section className="pb-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-3xl mx-auto bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 border border-violet-200 rounded-3xl p-8 text-center">
        <div className="inline-flex items-center gap-2 text-violet-700 mb-3">
          <Sparkles className="w-4 h-4" />
          <span className="text-xs uppercase tracking-[0.3em] font-bold">Need help?</span>
        </div>
        <h3 className="font-heading text-2xl font-extrabold text-slate-900 mb-3">Talk to the travel health desk</h3>
        <p className="text-slate-600 text-sm mb-6">Our team can walk you through documentation, vaccines, and country-specific health requirements.</p>
        <button
          onClick={() => onBook()}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-bold px-6 py-3 rounded-full shadow-lg hover:-translate-y-0.5 transition-transform"
        >
          <Calendar className="w-4 h-4" />
          Book an appointment
        </button>
      </div>
    </section>
  </>
);

/* ------------------ page ------------------ */

const Travels = () => {
  const ctx = useOutletContext<LayoutContext>();
  const [searchParams, setSearchParams] = useSearchParams();
  const initial = (searchParams.get("tab") as TabId) ?? "local";
  const [active, setActive] = useState<TabId>(
    tabs.find((t) => t.id === initial) ? initial : "local"
  );

  const handleSetActive = (id: TabId) => {
    setActive(id);
    setSearchParams({ tab: id });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const tab = searchParams.get("tab") as TabId | null;
    if (tab && tabs.find((t) => t.id === tab) && tab !== active) {
      setActive(tab);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const tabMeta = tabs.find((t) => t.id === active)!;

  const heroTitle: Record<TabId, React.ReactNode> = {
    local: (
      <>
        Travel locally,{" "}
        <span className="bg-gradient-to-r from-teal-300 to-emerald-300 bg-clip-text text-transparent">
          travel safely.
        </span>
      </>
    ),
    international: (
      <>
        Go global,{" "}
        <span className="bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent">
          fully prepared.
        </span>
      </>
    ),
    general: (
      <>
        Traveler services,{" "}
        <span className="bg-gradient-to-r from-violet-300 to-fuchsia-300 bg-clip-text text-transparent">
          all in one place.
        </span>
      </>
    ),
    seafarer: (
      <>
        Seafarer medical,{" "}
        <span className="bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">
          certified for sea.
        </span>
      </>
    ),
    "haj-umrah": (
      <>
        Pilgrim health,{" "}
        <span className="bg-gradient-to-r from-amber-300 to-orange-300 bg-clip-text text-transparent">
          for a safe journey.
        </span>
      </>
    ),
    dambadeniya: (
      <>
        Tourist medical{" "}
        <span className="bg-gradient-to-r from-rose-300 to-pink-300 bg-clip-text text-transparent">
          in Dambadeniya.
        </span>
      </>
    ),
  };

  const heroDescription: Record<TabId, string> = {
    local: "Travel health consultations, vaccinations, and fitness assessments for domestic journeys within Sri Lanka.",
    international: "Pre-travel medicals, destination-specific vaccinations, infectious disease testing, and post-travel care.",
    general: "Appointments, registration, records, downloads, and a dedicated travel health information centre.",
    seafarer: "MLC 2006 and ILO-aligned medical fitness examinations for seafarers — physical, laboratory, vision, hearing and flag-state certification.",
    "haj-umrah": "Specialised medical preparation for pilgrims — mandatory vaccinations, chronic disease clearance, and 24/7 telehealth support in Saudi Arabia.",
    dambadeniya: "Walk-in clinic, pharmacy support, on-site vaccination, and emergency coordination for visitors to Dambadeniya and surrounding heritage sites.",
  };

  const heroImage: Record<TabId, string> = {
    local: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1400&q=80",
    international: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1400&q=80",
    general: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1400&q=80",
    seafarer: "https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?auto=format&fit=crop&w=1400&q=80",
    "haj-umrah": "https://images.unsplash.com/photo-1591456983933-0d2d493e3a52?auto=format&fit=crop&w=1400&q=80",
    dambadeniya: "https://images.unsplash.com/photo-1566552881560-0be862a7c445?auto=format&fit=crop&w=1400&q=80",
  };

  // Seafarer tab uses its own parallax hero — rendered before the TabNav.
  if (active === "seafarer") {
    return (
      <>
        <ParallaxSeafarer />
        <TabNav active={active} setActive={handleSetActive} />
        <SeafarerBlock onBook={ctx.openBooking} />
      </>
    );
  }

  return (
    <>
      <PageHero
        eyebrow="Travel Health"
        title={heroTitle[active]}
        description={heroDescription[active]}
        breadcrumb={`Travels · ${tabMeta.label}`}
        imageSrc={heroImage[active]}
        imageAlt={`${tabMeta.label} services at MEDIHUB`}
      />
      <TabNav active={active} setActive={handleSetActive} />
      {active === "local" && <LocalBlock onBook={ctx.openBooking} />}
      {active === "international" && <InternationalBlock onBook={ctx.openBooking} />}
      {active === "general" && <GeneralBlock onBook={ctx.openBooking} />}
      {active === "haj-umrah" && <HajUmrahBlock onBook={ctx.openBooking} />}
      {active === "dambadeniya" && <DambadeniyaBlock onBook={ctx.openBooking} />}
    </>
  );
};

export default Travels;
