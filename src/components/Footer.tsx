import { Link } from "react-router-dom";
import { Plane, Mail, Phone, MapPin, ArrowRight, Facebook, Instagram, Linkedin } from "lucide-react";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Services", to: "/services" },
  { label: "Contact", to: "/contact" },
];

const serviceLinks = [
  { label: "Visa Medicals", to: "/services" },
  { label: "Pre-Medicals", to: "/services" },
  { label: "Travel Fitness & MEDIF", to: "/services" },
  { label: "Vaccinations", to: "/services" },
  { label: "Medical Escorts", to: "/services" },
  { label: "Telehealth", to: "/services" },
  { label: "Corporate Programmes", to: "/services" },
];

const Footer = () => (
  <footer className="bg-slate-950 text-white relative overflow-hidden">
    {/* Decorative gradient */}
    <div className="absolute -top-32 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px]" />
    <div className="absolute -bottom-32 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-[120px]" />

    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-10">
      {/* Top CTA strip */}
      <div className="grid lg:grid-cols-2 gap-6 items-center pb-14 border-b border-white/10">
        <div>
          <h3 className="font-heading text-3xl sm:text-4xl font-extrabold leading-tight">
            Ready to take{" "}
            <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
              the next step?
            </span>
          </h3>
        </div>
        <div className="flex flex-wrap gap-3 lg:justify-end">
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-emerald-600 text-white font-bold px-7 py-3.5 rounded-full shadow-xl shadow-primary/30 hover:-translate-y-1 transition-transform"
          >
            Get in Touch
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/services"
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-white font-semibold px-7 py-3.5 rounded-full hover:bg-white/20 transition-colors"
          >
            Explore Services
          </Link>
        </div>
      </div>

      {/* Main grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 py-14">
        {/* Brand */}
        <div className="lg:col-span-1">
          <Link to="/" className="flex items-center gap-2.5 mb-5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-emerald-600 flex items-center justify-center shadow-lg shadow-primary/30">
              <Plane className="w-5 h-5 text-white -rotate-12" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-heading font-extrabold text-xl">
                MEDI<span className="text-emerald-400">HUB</span>
              </span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-semibold mt-0.5">
                Migration Health
              </span>
            </div>
          </Link>
          <p className="text-white/60 text-sm leading-relaxed mb-5">
            Sri Lanka's first dedicated Migration Health Hub — comprehensive services for both outbound and inbound migrants.
          </p>
          <div className="flex gap-2">
            {[Facebook, Instagram, Linkedin].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary hover:border-primary transition-colors"
              >
                <Icon className="w-4 h-4 text-white/70" />
              </a>
            ))}
          </div>
        </div>

        {/* Quick links */}
        <div>
          <h4 className="font-heading font-bold text-sm uppercase tracking-wider mb-5">Quick Links</h4>
          <ul className="space-y-3">
            {navLinks.map((link) => (
              <li key={link.label}>
                <Link to={link.to} className="text-sm text-white/60 hover:text-emerald-400 transition-colors">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Services */}
        <div>
          <h4 className="font-heading font-bold text-sm uppercase tracking-wider mb-5">Services</h4>
          <ul className="space-y-3">
            {serviceLinks.map((link) => (
              <li key={link.label}>
                <Link to={link.to} className="text-sm text-white/60 hover:text-emerald-400 transition-colors">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-heading font-bold text-sm uppercase tracking-wider mb-5">Get in Touch</h4>
          <ul className="space-y-4 text-sm">
            <li className="flex items-start gap-3">
              <Phone className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
              <div>
                <div className="text-white/90">+94 (0) 11 MEDI-HUB</div>
                <div className="text-xs text-white/50">24/7 Travel Assistance</div>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <Mail className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
              <div className="text-white/90">care@medihub.lk</div>
            </li>
            <li className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
              <div className="text-white/90 text-sm leading-relaxed">
                Migration Health Centre,
                <br />
                Colombo, Sri Lanka
              </div>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-white/10 pt-7 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-xs text-white/40">© 2026 MEDIHUB Migration Health Hub. All rights reserved.</p>
        <p className="text-xs text-white/40 italic">Migration is more than movement — it's continuity of care.</p>
      </div>
    </div>
  </footer>
);

export default Footer;
