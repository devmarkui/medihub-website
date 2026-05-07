import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Calendar,
  User,
  Mail,
  Phone,
  Clock,
  ChevronDown,
  Check,
  Shield,
  Stethoscope,
  Plane,
  Globe2,
  HeartPulse,
  Sparkles,
  MapPin,
  type LucideIcon,
} from "lucide-react";

export type BookingMode = "consultation" | "migration";

export interface BookingPrefill {
  /** Pre-fills the Service / Department field (free text — gets shown even
   *  if it isn't one of the predefined dropdown options). */
  service?: string;
  /** Forces the consultation/migration mode toggle. */
  mode?: BookingMode;
}

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  prefill?: BookingPrefill;
}

const consultationServices = [
  "General Consultation",
  "Health Check-up Package",
  "Cardiology",
  "Pediatrics",
  "Chronic Disease Management",
  "Laboratory Services",
  "Diagnostic Imaging",
  "Vaccination",
];

const migrationServices = [
  "Visa Medical Examination",
  "Pre-departure Consultation",
  "Inbound Health Check-up",
  "Travel Vaccination",
  "Travel Fitness / Fit-to-Fly",
  "Corporate / Recruitment Booking",
];

const destinationSuggestions = [
  "Saudi Arabia",
  "UAE",
  "Qatar",
  "Kuwait",
  "Oman",
  "Bahrain",
  "Japan",
  "South Korea",
  "European Union",
  "United Kingdom",
  "Australia",
  "Canada",
  "Other",
];

interface CustomDropdownProps {
  label: string;
  options: string[];
  selected: string;
  onSelect: (val: string) => void;
  accentClass?: string;
  placeholder?: string;
}

const CustomDropdown = ({
  label,
  options,
  selected,
  onSelect,
  accentClass = "emerald",
  placeholder,
}: CustomDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const ringClass =
    accentClass === "blue"
      ? "border-blue-500 ring-2 ring-blue-500/15"
      : "border-emerald-500 ring-2 ring-emerald-500/15";
  const hoverClass =
    accentClass === "blue" ? "hover:border-blue-200" : "hover:border-emerald-200";
  const chevColor = accentClass === "blue" ? "text-blue-600" : "text-emerald-600";
  const itemHover =
    accentClass === "blue"
      ? "hover:bg-blue-50 hover:text-blue-700"
      : "hover:bg-emerald-50 hover:text-emerald-700";
  const checkColor = accentClass === "blue" ? "text-blue-600" : "text-emerald-600";

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 block ml-1">
        {label}
      </label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full bg-white border ${
          isOpen ? ringClass : "border-slate-200"
        } rounded-lg py-2.5 px-3.5 text-left flex items-center justify-between transition-all duration-200 ${hoverClass}`}
      >
        <span className={`text-sm ${selected ? "text-slate-900" : "text-slate-400"}`}>
          {selected || placeholder || `Select ${label}`}
        </span>
        <ChevronDown
          size={14}
          className={`${chevColor} transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 5, scale: 0.98 }}
            animate={{ opacity: 1, y: 2, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.98 }}
            className="absolute z-[110] w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-xl overflow-hidden"
          >
            <div className="max-h-56 overflow-y-auto">
              {options.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => {
                    onSelect(opt);
                    setIsOpen(false);
                  }}
                  className={`w-full px-3.5 py-2.5 text-left text-sm text-slate-600 ${itemHover} flex items-center justify-between group transition-colors`}
                >
                  <span>{opt}</span>
                  {selected === opt && <Check size={14} className={checkColor} />}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

interface FloatingInputProps {
  label: string;
  type?: string;
  placeholder?: string;
  icon: LucideIcon;
  value: string;
  onChange: (val: string) => void;
  accentClass?: string;
}

const FloatingInput = ({
  label,
  type = "text",
  placeholder,
  icon: Icon,
  value,
  onChange,
  accentClass = "emerald",
}: FloatingInputProps) => {
  const [isFocused, setIsFocused] = useState(false);

  const focusRing =
    accentClass === "blue"
      ? "border-blue-500 ring-2 ring-blue-500/15"
      : "border-emerald-500 ring-2 ring-emerald-500/15";
  const iconColor =
    accentClass === "blue" ? "text-blue-600" : "text-emerald-600";

  return (
    <div className="relative group">
      <label
        className={`text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 block ml-1 transition-opacity duration-200 ${
          isFocused || value ? "opacity-100" : "opacity-0"
        }`}
      >
        {label}
      </label>
      <div className="relative">
        <Icon
          className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors duration-200 ${
            isFocused ? iconColor : "text-slate-400"
          }`}
          size={16}
        />
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={!isFocused ? label : placeholder}
          className={`w-full bg-white border ${
            isFocused ? focusRing : "border-slate-200"
          } rounded-lg py-2.5 pl-10 pr-3.5 text-sm text-slate-900 focus:outline-none transition-all duration-200 placeholder:text-slate-400`}
        />
      </div>
    </div>
  );
};

const modeOptions: {
  id: BookingMode;
  label: string;
  icon: LucideIcon;
  gradient: string;
  description: string;
}[] = [
  {
    id: "consultation",
    label: "Consultation",
    icon: Stethoscope,
    gradient: "from-emerald-500 to-teal-500",
    description: "General check-ups, specialist visits, lab tests, and clinic services.",
  },
  {
    id: "migration",
    label: "Migration Health",
    icon: Plane,
    gradient: "from-blue-500 to-cyan-500",
    description: "Visa medicals, pre-departure care, inbound check-ups, and travel fitness.",
  },
];

const BookingModal = ({ isOpen, onClose, prefill }: BookingModalProps) => {
  const [mode, setMode] = useState<BookingMode>("consultation");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    service: "",
    destination: "",
    date: "",
    time: "",
    message: "",
  });

  // Apply prefill (service + mode) whenever the modal opens.
  useEffect(() => {
    if (!isOpen) return;
    if (prefill?.mode) setMode(prefill.mode);
    if (prefill?.service) {
      setFormData((prev) => ({ ...prev, service: prefill.service! }));
    }
  }, [isOpen, prefill]);

  // Reset form state whenever the modal closes
  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => {
        setIsSubmitted(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const accent = mode === "migration" ? "blue" : "emerald";
  const activeOption = modeOptions.find((m) => m.id === mode)!;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const phoneNumber = "94752977591";
    const heading =
      mode === "migration"
        ? "Migration Health Booking"
        : "Consultation Booking";

    const lines = [
      `Hello Medi Hub,`,
      ``,
      `I'd like to request a *${heading}*.`,
      ``,
      `• Name: ${formData.name}`,
      `• Phone: ${formData.phone}`,
      `• Email: ${formData.email}`,
      `• Service: ${formData.service || "Not specified"}`,
    ];

    if (mode === "migration" && formData.destination) {
      lines.push(`• Destination / Origin: ${formData.destination}`);
    }
    if (formData.date) lines.push(`• Preferred date: ${formData.date}`);
    if (mode === "consultation" && formData.time)
      lines.push(`• Preferred time: ${formData.time}`);
    if (formData.message) lines.push(`• Notes: ${formData.message}`);

    lines.push(``, `Please confirm my booking. Thank you.`);

    const encoded = encodeURIComponent(lines.join("\n"));
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encoded}`;
    window.open(whatsappUrl, "_blank");

    setIsSubmitted(true);
    setTimeout(() => {
      onClose();
    }, 1800);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-[1000px] max-h-[92vh] bg-white rounded-3xl shadow-2xl overflow-hidden grid lg:grid-cols-[5fr_7fr] border border-white/40"
          >
            {/* ───── Left: brand panel ───── */}
            <aside className="hidden lg:flex relative bg-gradient-to-br from-brand-dark via-[#003a3d] to-brand-dark p-10 text-white flex-col justify-between overflow-hidden">
              {/* decorative blobs */}
              <div className="absolute -top-24 -left-16 w-72 h-72 bg-brand-teal/30 rounded-full blur-[100px]" />
              <div className="absolute -bottom-24 -right-16 w-80 h-80 bg-brand-cyan/20 rounded-full blur-[100px]" />
              <div
                className="absolute inset-0 opacity-[0.06]"
                style={{
                  backgroundImage:
                    "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
                  backgroundSize: "44px 44px",
                }}
              />

              <div className="relative">
                <div className="flex items-center gap-3 mb-10">
                  <div className="flex items-center justify-center overflow-hidden">
                    <img src="/medihub_logo.png" alt="MEDIHUB logo" className="w-44 h-auto object-contain" />
                  </div>
                </div>

                <span className="inline-block text-[10px] uppercase tracking-[0.3em] font-bold text-brand-teal mb-4">
                  ✦ Concierge Booking ✦
                </span>
                <h2 className="font-heading text-3xl font-extrabold leading-[1.1] mb-4">
                  Premium care,
                  <br />
                  <span className="bg-gradient-to-r from-emerald-300 to-cyan-300 bg-clip-text text-transparent">
                    tailored to you.
                  </span>
                </h2>
                <p className="text-sm text-white/65 leading-relaxed mb-8">
                  Tell us what you need. Our team confirms every booking
                  personally — usually within 24 hours via WhatsApp.
                </p>

                {/* Mode preview card */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={mode}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.25 }}
                    className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4"
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br ${activeOption.gradient} flex items-center justify-center text-white shadow-lg`}
                      >
                        <activeOption.icon className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/60 mb-1">
                          You're booking
                        </div>
                        <div className="font-heading text-sm font-extrabold text-white">
                          {activeOption.label}
                        </div>
                        <p className="text-xs text-white/60 mt-1 leading-relaxed">
                          {activeOption.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* trust list */}
              <ul className="relative space-y-2.5 text-sm text-white/80 mt-8">
                {[
                  { icon: Shield, text: "Confidential & secure" },
                  { icon: Clock, text: "Reply within 24h" },
                  { icon: HeartPulse, text: "Concierge follow-up" },
                  { icon: Globe2, text: "Multilingual team" },
                ].map((item) => (
                  <li key={item.text} className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-md bg-white/10 flex items-center justify-center text-brand-cyan">
                      <item.icon className="w-3.5 h-3.5" />
                    </div>
                    <span>{item.text}</span>
                  </li>
                ))}
              </ul>
            </aside>

            {/* ───── Right: form pane ───── */}
            <div className="relative bg-slate-50/60 max-h-[92vh] overflow-y-auto">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-200/70 transition-colors text-slate-400 hover:text-slate-700 z-20"
                aria-label="Close booking"
              >
                <X size={18} />
              </button>

              <div className="p-6 sm:p-8 lg:p-10">
                <AnimatePresence mode="wait">
                  {!isSubmitted ? (
                    <motion.div
                      key="form"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      {/* Mobile-only header */}
                      <div className="lg:hidden mb-6">
                        <span className="inline-block text-[10px] uppercase tracking-[0.3em] font-bold text-emerald-600 mb-2">
                          ✦ Concierge Booking ✦
                        </span>
                        <h2 className="font-heading text-2xl font-extrabold text-slate-900 leading-tight">
                          Premium care,{" "}
                          <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
                            tailored to you.
                          </span>
                        </h2>
                      </div>

                      {/* Mode selector */}
                      <div className="mb-6">
                        <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-500 mb-2 block ml-1">
                          What would you like to book?
                        </label>
                        <div className="relative grid grid-cols-2 gap-1 p-1 bg-slate-100 rounded-2xl border border-slate-200/60">
                          {modeOptions.map((opt) => (
                            <button
                              key={opt.id}
                              type="button"
                              onClick={() => {
                                setMode(opt.id);
                                setFormData((prev) => ({ ...prev, service: "" }));
                              }}
                              className={`relative z-10 flex items-center justify-center gap-2 py-2.5 sm:py-3 text-xs sm:text-sm font-bold rounded-xl transition-colors ${
                                mode === opt.id
                                  ? "text-white"
                                  : "text-slate-600 hover:text-slate-900"
                              }`}
                            >
                              {mode === opt.id && (
                                <motion.div
                                  layoutId="booking-mode-pill"
                                  className={`absolute inset-0 bg-gradient-to-r ${opt.gradient} rounded-xl shadow-lg`}
                                  transition={{
                                    type: "spring",
                                    stiffness: 400,
                                    damping: 32,
                                  }}
                                />
                              )}
                              <span className="relative z-10 flex items-center gap-2">
                                <opt.icon className="w-4 h-4" />
                                {opt.label}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>

                      <form className="space-y-4" onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <FloatingInput
                            label="Full Name"
                            icon={User}
                            placeholder="John Doe"
                            value={formData.name}
                            onChange={(val) => setFormData({ ...formData, name: val })}
                            accentClass={accent}
                          />
                          <FloatingInput
                            label="Phone Number"
                            type="tel"
                            icon={Phone}
                            placeholder="+94 77 000 0000"
                            value={formData.phone}
                            onChange={(val) => setFormData({ ...formData, phone: val })}
                            accentClass={accent}
                          />
                        </div>

                        <FloatingInput
                          label="Email Address"
                          type="email"
                          icon={Mail}
                          placeholder="john@example.com"
                          value={formData.email}
                          onChange={(val) => setFormData({ ...formData, email: val })}
                          accentClass={accent}
                        />

                        <AnimatePresence mode="wait">
                          <motion.div
                            key={mode + "-fields"}
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -6 }}
                            transition={{ duration: 0.2 }}
                            className="space-y-4"
                          >
                            <CustomDropdown
                              label={mode === "migration" ? "Service Type" : "Service / Department"}
                              options={
                                mode === "migration"
                                  ? migrationServices
                                  : consultationServices
                              }
                              selected={formData.service}
                              onSelect={(val) => setFormData({ ...formData, service: val })}
                              accentClass={accent}
                              placeholder={
                                mode === "migration"
                                  ? "Choose a migration service"
                                  : "Choose a service or department"
                              }
                            />

                            {mode === "migration" && (
                              <div className="relative">
                                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 block ml-1">
                                  Destination / Origin Country (optional)
                                </label>
                                <div className="relative">
                                  <MapPin
                                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                                    size={16}
                                  />
                                  <input
                                    type="text"
                                    list="destination-suggestions"
                                    value={formData.destination}
                                    onChange={(e) =>
                                      setFormData({
                                        ...formData,
                                        destination: e.target.value,
                                      })
                                    }
                                    placeholder="e.g. Saudi Arabia, Japan, UK"
                                    className="w-full bg-white border border-slate-200 rounded-lg py-2.5 pl-10 pr-3.5 text-sm text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 transition-all duration-200 placeholder:text-slate-400"
                                  />
                                  <datalist id="destination-suggestions">
                                    {destinationSuggestions.map((d) => (
                                      <option key={d} value={d} />
                                    ))}
                                  </datalist>
                                </div>
                              </div>
                            )}

                            <div className="grid grid-cols-2 gap-3">
                              <FloatingInput
                                label="Preferred Date"
                                type="date"
                                icon={Calendar}
                                value={formData.date}
                                onChange={(val) => setFormData({ ...formData, date: val })}
                                accentClass={accent}
                              />
                              {mode === "consultation" ? (
                                <FloatingInput
                                  label="Time"
                                  type="time"
                                  icon={Clock}
                                  value={formData.time}
                                  onChange={(val) => setFormData({ ...formData, time: val })}
                                  accentClass={accent}
                                />
                              ) : (
                                <div className="flex items-end">
                                  <div className="w-full bg-white border border-slate-200 rounded-lg py-2.5 px-3.5 text-xs text-slate-500 flex items-center gap-2 h-[42px]">
                                    <Sparkles className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                                    <span className="truncate">
                                      We'll confirm a slot via WhatsApp
                                    </span>
                                  </div>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        </AnimatePresence>

                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 ml-1">
                            Additional Notes (Optional)
                          </label>
                          <textarea
                            className={`w-full bg-white border border-slate-200 rounded-lg py-2.5 px-3.5 text-sm text-slate-900 focus:outline-none transition-all duration-200 min-h-[72px] placeholder:text-slate-400 ${
                              accent === "blue"
                                ? "focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15"
                                : "focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15"
                            }`}
                            placeholder={
                              mode === "migration"
                                ? "Visa deadline, country requirements, family details..."
                                : "Specific concerns, preferred specialist, accessibility..."
                            }
                            value={formData.message}
                            onChange={(e) =>
                              setFormData({ ...formData, message: e.target.value })
                            }
                          />
                        </div>

                        <div className="pt-2">
                          <button
                            type="submit"
                            className={`w-full bg-gradient-to-r ${activeOption.gradient} text-white font-bold text-sm py-3.5 rounded-xl shadow-lg ${
                              accent === "blue"
                                ? "shadow-blue-500/25 hover:shadow-blue-500/40"
                                : "shadow-emerald-500/25 hover:shadow-emerald-500/40"
                            } hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2`}
                          >
                            Send Booking Request
                            <Check size={18} />
                          </button>
                          <p className="text-[10px] text-slate-400 text-center mt-2 leading-relaxed">
                            By submitting, you agree to be contacted via WhatsApp / phone to
                            confirm your booking.
                          </p>
                        </div>
                      </form>

                      <footer className="mt-6 pt-5 border-t border-slate-200 flex items-center justify-between text-slate-400">
                        <div className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-widest">
                          <Shield
                            size={12}
                            className={accent === "blue" ? "text-blue-600" : "text-emerald-600"}
                          />
                          Secure & Confidential
                        </div>
                        <span className="text-[10px]">Colombo Private Medical Standard</span>
                      </footer>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="py-16 flex flex-col items-center text-center"
                    >
                      <div
                        className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 shadow-lg ${
                          accent === "blue"
                            ? "bg-blue-50 text-blue-600 border border-blue-100"
                            : "bg-emerald-50 text-emerald-600 border border-emerald-100"
                        }`}
                      >
                        <Check size={32} />
                      </div>
                      <h2 className="text-xl font-extrabold text-slate-900 mb-2">
                        Request Sent
                      </h2>
                      <p className="text-slate-500 text-sm max-w-[320px]">
                        We've opened WhatsApp with your booking summary. Our team will confirm
                        the details shortly.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default BookingModal;
