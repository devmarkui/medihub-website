import { motion, AnimatePresence, useInView } from "framer-motion";
import { useRef, useState } from "react";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  MessageCircle,
  Plus,
  Globe2,
  PlaneTakeoff,
  PlaneLanding,
  Building2,
} from "lucide-react";
import { toast } from "sonner";
import PageHero from "@/components/PageHero";
import AuroraBackground from "@/components/AuroraBackground";

const contactCards = [
  {
    icon: Phone,
    title: "Call us",
    primary: "+94 11 226 7777",
    secondary: "24/7 Travel Assistance",
    href: "tel:+94112267777",
    accent: "from-emerald-500 to-teal-600",
  },
  {
    icon: Mail,
    title: "Email us",
    primary: "info@medihub.lk",
    secondary: "We reply within 24 hours",
    href: "mailto:info@medihub.lk",
    accent: "from-blue-500 to-cyan-600",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp",
    primary: "+94 74 393 6193",
    secondary: "Quick chat support",
    href: "https://wa.me/94743936193",
    accent: "from-amber-500 to-orange-600",
  },
  {
    icon: MapPin,
    title: "Visit us",
    primary: "Migration Health Centre",
    secondary: "548/1, Avissawella Road, Wellampitiya",
    href: "https://maps.app.goo.gl/c65HbJxsjxZFsu4L6",
    accent: "from-rose-500 to-pink-600",
  },
];

const services = [
  { id: "visa", label: "Visa Medical", icon: Globe2 },
  { id: "predeparture", label: "Pre-departure Care", icon: PlaneTakeoff },
  { id: "inbound", label: "Inbound Health", icon: PlaneLanding },
  { id: "corporate", label: "Corporate / Agency", icon: Building2 },
];

const faqs = [
  {
    q: "How long does a visa medical take?",
    a: "Most visa medicals are completed within a single visit lasting 2–3 hours. Documentation is typically issued within 3 to 5 working days, depending on the destination country's requirements.",
  },
  {
    q: "Do you do GAMCA / WAFID medicals?",
    a: "Yes — MEDIHUB is an authorized centre for GAMCA / WAFID compliant medicals for all GCC countries (Saudi Arabia, UAE, Qatar, Kuwait, Oman, Bahrain).",
  },
  {
    q: "What is a pre-medical and do I need one?",
    a: "A pre-medical is an informal but thorough health evaluation done before your official visa medical. It catches issues that could fail your medical so you can address them in advance. We strongly recommend it for first-time visa applicants and anyone with known health conditions.",
  },
  {
    q: "Can MEDIHUB arrange medical escorts for international travel?",
    a: "Yes. We provide trained doctors and nurses as medical escorts for medically vulnerable passengers, with full clinical monitoring, medication administration, and emergency response throughout the journey.",
  },
  {
    q: "Do you support corporate / recruitment agency partnerships?",
    a: "Yes. We offer preferred-partner arrangements with priority scheduling, dedicated account management, standardized pricing, and seamless coordination of medical clearance for large worker placements.",
  },
  {
    q: "Do you offer telehealth consultations?",
    a: "Yes — secure virtual consultations are available for follow-up appointments, medication reviews, mental health support, and general health advice from anywhere in the country.",
  },
];

const ContactForm = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    service: "visa",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Request received! Our team will be in touch within 24 hours.");
    setForm({ name: "", email: "", phone: "", service: "visa", message: "" });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2 block">Full Name</label>
          <input
            type="text"
            required
            placeholder="Your name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm"
          />
        </div>
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2 block">Phone</label>
          <input
            type="tel"
            required
            placeholder="+94 77 000 0000"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm"
          />
        </div>
      </div>

      <div>
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2 block">Email</label>
        <input
          type="email"
          required
          placeholder="you@example.com"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm"
        />
      </div>

      <div>
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2 block">Service Required</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {services.map((svc) => (
            <button
              key={svc.id}
              type="button"
              onClick={() => setForm({ ...form, service: svc.id })}
              className={`flex flex-col items-center gap-1.5 px-3 py-3 rounded-xl border-2 text-xs font-semibold transition-all ${
                form.service === svc.id
                  ? "bg-primary text-white border-primary shadow-lg shadow-primary/30"
                  : "bg-white text-slate-600 border-slate-200 hover:border-primary/50"
              }`}
            >
              <svc.icon className="w-4 h-4" />
              {svc.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2 block">Message</label>
        <textarea
          rows={4}
          placeholder="Tell us about your destination, visa type, or any special requirements..."
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none text-sm"
        />
      </div>

      <button
        type="submit"
        className="group w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-emerald-600 text-white font-bold px-7 py-4 rounded-xl shadow-xl shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-0.5 transition-all"
      >
        <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        Send Message
      </button>
    </form>
  );
};

const ContactSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="py-24 px-4 sm:px-6 lg:px-8 bg-white relative overflow-visible">
      <div className="max-w-7xl mx-auto">
        {/* Contact cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-20 -mt-32 relative z-10"
        >
          {contactCards.map((card, i) => (
            <motion.a
              key={i}
              href={card.href}
              target={card.href.startsWith("http") ? "_blank" : undefined}
              rel={card.href.startsWith("http") ? "noopener noreferrer" : undefined}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 * i }}
              whileHover={{ y: -8 }}
              className="group block bg-white border border-slate-200 rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 relative overflow-hidden"
            >
              <div className={`absolute -top-12 -right-12 w-32 h-32 rounded-full bg-gradient-to-br ${card.accent} opacity-10 group-hover:opacity-20 blur-2xl transition-opacity`} />
              <div className={`relative w-12 h-12 rounded-2xl bg-gradient-to-br ${card.accent} flex items-center justify-center shadow-lg mb-4`}>
                <card.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-heading font-extrabold text-slate-900 text-base mb-1">{card.title}</h3>
              <p className="text-sm font-semibold text-slate-700">{card.primary}</p>
              <p className="text-xs text-slate-500 mt-0.5">{card.secondary}</p>
            </motion.a>
          ))}
        </motion.div>

        {/* Form + Map */}
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="lg:col-span-3 bg-white border border-slate-200 rounded-3xl p-8 shadow-lg"
          >
            <span className="inline-block text-xs uppercase tracking-[0.3em] font-bold text-primary mb-3">
              ✦ Get in touch ✦
            </span>
            <h2 className="font-heading text-3xl font-extrabold text-slate-900 mb-2">
              Tell us about your journey
            </h2>
            <p className="text-sm text-slate-500 mb-8">
              Fill out the form and our migration health team will be in touch within 24 hours.
            </p>
            <ContactForm />
          </motion.div>

          {/* Map / hours */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2 space-y-4"
          >
            {/* Map placeholder */}
            <div className="bg-gradient-to-br from-slate-100 to-slate-200 rounded-3xl overflow-hidden h-64 relative group cursor-pointer">
              <div className="absolute inset-0 grid-pattern opacity-30" />
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-emerald-600 flex items-center justify-center shadow-2xl shadow-primary/40 mb-4 group-hover:scale-110 transition-transform">
                  <MapPin className="w-7 h-7 text-white" />
                </div>
                <p className="font-heading font-bold text-slate-700">Migration Health Centre</p>
                <p className="text-xs text-slate-500 mt-1">548/1, Avissawella Road, Wellampitiya</p>
              </div>
              {/* Animated pulse */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-12">
                <span className="absolute inset-0 w-16 h-16 rounded-full bg-primary/30 animate-ping" />
              </div>
            </div>

            {/* Hours card */}
            <div className="bg-gradient-to-br from-primary to-emerald-700 text-white rounded-3xl p-7 relative overflow-hidden">
              <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-amber-300/20 blur-3xl" />
              <div className="relative">
                <Clock className="w-7 h-7 text-amber-200 mb-4" />
                <h3 className="font-heading text-xl font-extrabold mb-4">Operating Hours</h3>
                <ul className="space-y-2.5 text-sm">
                  {[
                    { day: "Monday – Friday", time: "8:00 AM – 7:00 PM" },
                    { day: "Saturday", time: "9:00 AM – 4:00 PM" },
                    { day: "Sunday", time: "By appointment" },
                    { day: "Travel Assistance", time: "24 / 7", highlight: true },
                  ].map((row, i) => (
                    <li
                      key={i}
                      className={`flex justify-between items-center pb-2 border-b border-white/15 ${
                        row.highlight ? "border-amber-300/40" : ""
                      }`}
                    >
                      <span className="text-white/85">{row.day}</span>
                      <span className={`font-bold ${row.highlight ? "text-amber-200" : "text-white"}`}>
                        {row.time}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const FAQ = () => {
  const [open, setOpen] = useState<number | null>(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <AuroraBackground className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-50 to-white relative">
      <div ref={ref} className="max-w-4xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-block text-xs uppercase tracking-[0.3em] font-bold text-primary mb-4">
            ✦ Frequently Asked ✦
          </span>
          <h2 className="font-heading text-4xl sm:text-5xl font-extrabold text-slate-900 leading-tight">
            Questions?{" "}
            <span className="bg-gradient-to-r from-primary to-emerald-600 bg-clip-text text-transparent">
              We've got answers.
            </span>
          </h2>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.05 * i }}
              className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:border-primary/30 transition-colors"
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between gap-4 p-5 text-left"
              >
                <span className="font-heading font-bold text-slate-900 text-base sm:text-lg">{faq.q}</span>
                <motion.div
                  animate={{ rotate: open === i ? 45 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex-shrink-0 w-9 h-9 rounded-full bg-emerald-50 flex items-center justify-center"
                >
                  <Plus className="w-4 h-4 text-primary" />
                </motion.div>
              </button>
              <AnimatePresence>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 text-sm text-slate-600 leading-relaxed">{faq.a}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </AuroraBackground>
  );
};

const Contact = () => {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title={
          <>
            Talk to our{" "}
            <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
              migration health team.
            </span>
          </>
        }
        description="Whether it's a visa medical, pre-departure consultation, or institutional partnership — reach out and we'll be in touch within 24 hours."
        breadcrumb="Contact"
        imageSrc="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1400&q=80"
        imageAlt="MEDIHUB migration health team"
      />
      <ContactSection />
      <FAQ />
    </>
  );
};

export default Contact;
