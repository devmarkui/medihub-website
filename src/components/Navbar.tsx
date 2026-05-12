import { useState, useEffect, useRef } from "react";
import {
  Menu,
  X,
  ChevronDown,
  PlaneTakeoff,
  PlaneLanding,
  Stethoscope,
  FlaskConical,
  HeartPulse,
  Activity,
  Syringe,
  ScanLine,
  ShieldCheck,
  Microscope,
  Compass,
  MapPin,
  Globe2,
  Briefcase,
  Plane,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";

const simpleLinks = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
];

const migrantItems = [
  { label: "Outbound Services", desc: "Visa medicals & pre-departure care for going abroad", to: "/services?tab=outbound", icon: PlaneTakeoff },
  { label: "Inbound Services", desc: "Arrival check-ups & integration care in Sri Lanka", to: "/services?tab=inbound", icon: PlaneLanding },
  { label: "General Services", desc: "Bookings, records, payments & support", to: "/services?tab=general", icon: Briefcase },
];

const laboratoryItems = [
  { label: "General Consultations", to: "/services?tab=clinic#general-consultations", icon: Stethoscope },
  { label: "Laboratory Services", to: "/services?tab=clinic#laboratory-services", icon: FlaskConical },
  { label: "Health Check-up Packages", to: "/services?tab=clinic#health-checkup-packages", icon: HeartPulse },
  { label: "Chronic Disease Management", to: "/services?tab=clinic#chronic-disease-management", icon: Activity },
  { label: "Routine Vaccinations", to: "/services?tab=clinic#routine-vaccinations", icon: Syringe },
  { label: "Diagnostic Imaging", to: "/services?tab=clinic#diagnostic-imaging", icon: ScanLine },
  { label: "Pre-employment & Insurance", to: "/services?tab=clinic#pre-employment-insurance-medicals", icon: ShieldCheck },
  { label: "Specialized Testing", to: "/services?tab=clinic#specialized-testing", icon: Microscope },
];

const travelsItems = [
  { label: "Local Travelers", desc: "Travel health for domestic journeys", to: "/travels?tab=local", icon: MapPin },
  { label: "International Travelers", desc: "Pre-travel consultations & vaccines for overseas trips", to: "/travels?tab=international", icon: Globe2 },
  { label: "General Traveler Services", desc: "Appointments, records & travel health info", to: "/travels?tab=general", icon: Compass },
];

const Navbar = ({ onBookClick }: { onBookClick: () => void }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [travelsOpen, setTravelsOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [mobileTravelsOpen, setMobileTravelsOpen] = useState(false);
  const servicesRef = useRef<HTMLDivElement>(null);
  const travelsRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const isOnServices = location.pathname.startsWith("/services");
  const isOnTravels = location.pathname.startsWith("/travels");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (servicesRef.current && !servicesRef.current.contains(e.target as Node)) {
        setServicesOpen(false);
      }
      if (travelsRef.current && !travelsRef.current.contains(e.target as Node)) {
        setTravelsOpen(false);
      }
    };
    if (servicesOpen || travelsOpen) document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [servicesOpen, travelsOpen]);

  useEffect(() => {
    setServicesOpen(false);
    setTravelsOpen(false);
    setMobileOpen(false);
    setMobileServicesOpen(false);
    setMobileTravelsOpen(false);
  }, [location.pathname, location.search, location.hash]);

  const goTo = (to: string) => {
    setServicesOpen(false);
    setTravelsOpen(false);
    setMobileOpen(false);
    navigate(to);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/90 backdrop-blur-xl border-b border-border/60 shadow-[0_4px_30px_-10px_rgba(13,148,136,0.15)]"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-0">
        <div className="flex items-center justify-between h-[72px] sm:h-[88px] lg:h-[100px]">
          <Link to="/" className="flex items-center gap-0 group pl-0 sm:pl-2 lg:pl-4 -my-6">
            <img
              src="/medihub_logo.png"
              alt="MediHub Logo"
              className="h-40 sm:h-44 lg:h-48 w-auto object-contain"
            />
          </Link>

          <div
            className={`hidden lg:flex items-center gap-1 backdrop-blur-md rounded-full border px-2 py-1.5 transition-colors duration-300 ${
              scrolled ? "bg-white/40 border-border/40" : "bg-white/10 border-white/20"
            }`}
          >
            {simpleLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/"}
                className={({ isActive }) =>
                  `relative px-4 py-1.5 text-sm font-medium rounded-full transition-all duration-300 ${
                    isActive
                      ? "text-white bg-primary shadow-md shadow-primary/30"
                      : scrolled
                        ? "text-muted-foreground hover:text-primary"
                        : "text-white/85 hover:text-white"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}

            {/* Services dropdown trigger */}
            <div ref={servicesRef} className="relative">
              <button
                onClick={() => {
                  setServicesOpen((v) => !v);
                  setTravelsOpen(false);
                }}
                aria-haspopup="true"
                aria-expanded={servicesOpen}
                className={`relative inline-flex items-center gap-1 px-4 py-1.5 text-sm font-medium rounded-full transition-all duration-300 ${
                  isOnServices
                    ? "text-white bg-primary shadow-md shadow-primary/30"
                    : scrolled
                      ? "text-muted-foreground hover:text-primary"
                      : "text-white/85 hover:text-white"
                }`}
              >
                Services
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-300 ${servicesOpen ? "rotate-180" : ""}`}
                />
              </button>

              <AnimatePresence>
                {servicesOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.98 }}
                    transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-[680px] bg-white rounded-3xl border border-border/60 shadow-2xl shadow-primary/10 overflow-hidden"
                  >
                    <div className="grid grid-cols-2">
                      {/* Migrant column */}
                      <div className="p-6 bg-gradient-to-br from-primary/5 to-brand-cyan/5 border-r border-border/60">
                        <div className="flex items-center gap-2 mb-4">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-brand-cyan flex items-center justify-center">
                            <PlaneTakeoff className="w-4 h-4 text-white" />
                          </div>
                          <h3 className="font-heading text-sm font-extrabold text-foreground uppercase tracking-wider">Migrant</h3>
                        </div>
                        <ul className="space-y-1">
                          {migrantItems.map((item) => (
                            <li key={item.to}>
                              <button
                                onClick={() => goTo(item.to)}
                                className="w-full text-left flex items-start gap-3 p-3 rounded-xl hover:bg-white hover:shadow-sm transition-all group"
                              >
                                <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-white border border-border/50 flex items-center justify-center group-hover:border-primary/40 group-hover:bg-primary/5 transition-colors">
                                  <item.icon className="w-4 h-4 text-primary" />
                                </div>
                                <div className="min-w-0">
                                  <div className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">{item.label}</div>
                                  <div className="text-xs text-muted-foreground leading-snug mt-0.5">{item.desc}</div>
                                </div>
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Laboratory column */}
                      <div className="p-6">
                        <div className="flex items-center gap-2 mb-4">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-cyan to-primary flex items-center justify-center">
                            <FlaskConical className="w-4 h-4 text-white" />
                          </div>
                          <h3 className="font-heading text-sm font-extrabold text-foreground uppercase tracking-wider">Laboratory</h3>
                        </div>
                        <ul className="space-y-0.5">
                          {laboratoryItems.map((item) => (
                            <li key={item.to}>
                              <button
                                onClick={() => goTo(item.to)}
                                className="w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-primary/5 transition-colors group"
                              >
                                <item.icon className="w-3.5 h-3.5 text-primary/70 flex-shrink-0 group-hover:text-primary transition-colors" />
                                <span className="text-sm text-foreground/80 group-hover:text-primary transition-colors">{item.label}</span>
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="px-6 py-3 bg-muted/40 border-t border-border/60 flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Looking for everything?</span>
                      <Link
                        to="/services"
                        onClick={() => setServicesOpen(false)}
                        className="text-xs font-semibold text-primary hover:underline"
                      >
                        View all services →
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Travels dropdown trigger */}
            <div ref={travelsRef} className="relative">
              <button
                onClick={() => {
                  setTravelsOpen((v) => !v);
                  setServicesOpen(false);
                }}
                aria-haspopup="true"
                aria-expanded={travelsOpen}
                className={`relative inline-flex items-center gap-1 px-4 py-1.5 text-sm font-medium rounded-full transition-all duration-300 ${
                  isOnTravels
                    ? "text-white bg-primary shadow-md shadow-primary/30"
                    : scrolled
                      ? "text-muted-foreground hover:text-primary"
                      : "text-white/85 hover:text-white"
                }`}
              >
                Travels
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-300 ${travelsOpen ? "rotate-180" : ""}`}
                />
              </button>

              <AnimatePresence>
                {travelsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.98 }}
                    transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-[420px] bg-white rounded-3xl border border-border/60 shadow-2xl shadow-primary/10 overflow-hidden"
                  >
                    <div className="p-6 bg-gradient-to-br from-primary/5 to-brand-cyan/5">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-brand-cyan flex items-center justify-center">
                          <Plane className="w-4 h-4 text-white" />
                        </div>
                        <h3 className="font-heading text-sm font-extrabold text-foreground uppercase tracking-wider">Travels</h3>
                      </div>
                      <ul className="space-y-1">
                        {travelsItems.map((item) => (
                          <li key={item.to}>
                            <button
                              onClick={() => goTo(item.to)}
                              className="w-full text-left flex items-start gap-3 p-3 rounded-xl hover:bg-white hover:shadow-sm transition-all group"
                            >
                              <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-white border border-border/50 flex items-center justify-center group-hover:border-primary/40 group-hover:bg-primary/5 transition-colors">
                                <item.icon className="w-4 h-4 text-primary" />
                              </div>
                              <div className="min-w-0">
                                <div className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">{item.label}</div>
                                <div className="text-xs text-muted-foreground leading-snug mt-0.5">{item.desc}</div>
                              </div>
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="px-6 py-3 bg-muted/40 border-t border-border/60 flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">All travel services</span>
                      <Link
                        to="/travels"
                        onClick={() => setTravelsOpen(false)}
                        className="text-xs font-semibold text-primary hover:underline"
                      >
                        View all →
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <NavLink
              to="/contact"
              className={({ isActive }) =>
                `relative px-4 py-1.5 text-sm font-medium rounded-full transition-all duration-300 ${
                  isActive
                    ? "text-white bg-primary shadow-md shadow-primary/30"
                    : scrolled
                      ? "text-muted-foreground hover:text-primary"
                      : "text-white/85 hover:text-white"
                }`
              }
            >
              Contact
            </NavLink>
          </div>

          <div className="hidden lg:flex items-center gap-3">
            <button
              onClick={onBookClick}
              className="relative inline-flex items-center gap-2 bg-gradient-to-r from-primary to-brand-cyan text-white text-sm font-semibold px-5 py-2.5 rounded-full shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-0.5 transition-all duration-300 group overflow-hidden"
            >
              <span className="relative z-10">Book Appointment</span>
              <span className="relative z-10 w-1.5 h-1.5 rounded-full bg-amber-300 group-hover:scale-150 transition-transform" />
              <div className="absolute inset-0 bg-gradient-to-r from-brand-cyan to-primary opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          </div>

          <button
            className={`lg:hidden p-2 mr-3 sm:mr-4 rounded-lg transition-colors ${
              scrolled ? "text-foreground hover:bg-muted" : "text-white hover:bg-white/10"
            }`}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-t border-border overflow-hidden"
          >
            <div className="px-4 py-5 space-y-1">
              {simpleLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === "/"}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `block px-4 py-3 rounded-xl font-medium transition-colors ${
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted"
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}

              {/* Mobile services accordion */}
              <button
                onClick={() => setMobileServicesOpen((v) => !v)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-medium transition-colors ${
                  isOnServices ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"
                }`}
              >
                <span>Services</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${mobileServicesOpen ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence>
                {mobileServicesOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="pl-4 mt-1 space-y-2">
                      <div>
                        <div className="px-3 pt-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-primary/70">Migrant</div>
                        {migrantItems.map((item) => (
                          <button
                            key={item.to}
                            onClick={() => goTo(item.to)}
                            className="w-full text-left flex items-center gap-2 px-3 py-2.5 rounded-lg hover:bg-muted transition-colors"
                          >
                            <item.icon className="w-4 h-4 text-primary" />
                            <span className="text-sm text-foreground">{item.label}</span>
                          </button>
                        ))}
                      </div>
                      <div>
                        <div className="px-3 pt-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-primary/70">Laboratory</div>
                        {laboratoryItems.map((item) => (
                          <button
                            key={item.to}
                            onClick={() => goTo(item.to)}
                            className="w-full text-left flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted transition-colors"
                          >
                            <item.icon className="w-3.5 h-3.5 text-primary/70" />
                            <span className="text-sm text-foreground/80">{item.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Mobile travels accordion */}
              <button
                onClick={() => setMobileTravelsOpen((v) => !v)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-medium transition-colors ${
                  isOnTravels ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"
                }`}
              >
                <span>Travels</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${mobileTravelsOpen ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence>
                {mobileTravelsOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="pl-4 mt-1 space-y-2">
                      {travelsItems.map((item) => (
                        <button
                          key={item.to}
                          onClick={() => goTo(item.to)}
                          className="w-full text-left flex items-center gap-2 px-3 py-2.5 rounded-lg hover:bg-muted transition-colors"
                        >
                          <item.icon className="w-4 h-4 text-primary" />
                          <span className="text-sm text-foreground">{item.label}</span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <NavLink
                to="/contact"
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `block px-4 py-3 rounded-xl font-medium transition-colors ${
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted"
                  }`
                }
              >
                Contact
              </NavLink>

              <button
                onClick={() => {
                  setMobileOpen(false);
                  onBookClick();
                }}
                className="w-full mt-3 bg-gradient-to-r from-primary to-brand-cyan text-white font-semibold py-3 rounded-xl shadow-lg shadow-primary/30"
              >
                Book Appointment
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
