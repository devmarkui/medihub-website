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
} from "lucide-react";
import PageHero from "@/components/PageHero";
import { ServiceGrid, type ServiceGridItem } from "@/components/ServiceGrid";

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

/* ------------------ tabs ------------------ */

const tabs = [
  { id: "local", label: "Local Travelers", icon: MapPin, accent: "from-teal-500 to-emerald-600" },
  { id: "international", label: "International", icon: Globe2, accent: "from-blue-500 to-cyan-600" },
  { id: "general", label: "General", icon: Compass, accent: "from-violet-500 to-fuchsia-600" },
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
  };

  const heroDescription: Record<TabId, string> = {
    local: "Travel health consultations, vaccinations, and fitness assessments for domestic journeys within Sri Lanka.",
    international: "Pre-travel medicals, destination-specific vaccinations, infectious disease testing, and post-travel care.",
    general: "Appointments, registration, records, downloads, and a dedicated travel health information centre.",
  };

  const heroImage: Record<TabId, string> = {
    local: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1400&q=80",
    international: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1400&q=80",
    general: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1400&q=80",
  };

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
    </>
  );
};

export default Travels;
