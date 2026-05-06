import { useState, useEffect, useRef } from "react";
import { Menu, X, ChevronDown, PlaneTakeoff, PlaneLanding, Stethoscope, FlaskConical, HeartPulse, Activity, Syringe, ScanLine, ShieldCheck, Microscope } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";

const simpleLinks = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
];

const migrationItems = [
  { label: "Outbound", desc: "Going abroad — visa medicals & pre-departure care", to: "/services?tab=outbound", icon: PlaneTakeoff },
  { label: "Inbound", desc: "Arriving in Sri Lanka — check-ups & integration care", to: "/services?tab=inbound", icon: PlaneLanding },
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

const Navbar = ({ onBookClick }: { onBookClick: () => void }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const isOnServices = location.pathname.startsWith("/services");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setServicesOpen(false);
      }
    };
    if (servicesOpen) document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [servicesOpen]);

  // Close dropdown on route change
  useEffect(() => {
    setServicesOpen(false);
    setMobileOpen(false);
    setMobileServicesOpen(false);
  }, [location.pathname, location.search, location.hash]);

  const goTo = (to: string) => {
    setServicesOpen(false);
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
        <div className="flex items-center justify-between h-[100px]">
          <Link to="/" className="flex items-center gap-0 group pl-4">
            <img 
              src="/medihub_logo.png" 
              alt="MediHub Logo" 
              className="h-48 w-auto object-contain"
            />
          </Link>

          <div
            ref={dropdownRef}
            className={`hidden lg:flex items-center gap-1 backdrop-blur-md rounded-full border px-2 py-1.5 transition-colors duration-300 relative ${
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
            <button
              onClick={() => setServicesOpen((v) => !v)}
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

            {/* Mega menu */}
            <AnimatePresence>
              {servicesOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.98 }}
                  transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-[640px] bg-white rounded-3xl border border-border/60 shadow-2xl shadow-primary/10 overflow-hidden"
                >
                  <div className="grid grid-cols-2">
                    {/* Migration column */}
                    <div className="p-6 bg-gradient-to-br from-primary/5 to-brand-cyan/5 border-r border-border/60">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-brand-cyan flex items-center justify-center">
                          <PlaneTakeoff className="w-4 h-4 text-white" />
                        </div>
                        <h3 className="font-heading text-sm font-extrabold text-foreground uppercase tracking-wider">Migration</h3>
                      </div>
                      <ul className="space-y-1">
                        {migrationItems.map((item) => (
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
            className={`lg:hidden p-2 rounded-lg transition-colors ${
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
                        <div className="px-3 pt-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-primary/70">Migration</div>
                        {migrationItems.map((item) => (
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
