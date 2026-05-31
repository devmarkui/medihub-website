import { Link } from "react-router-dom";
import { Plane, Mail, Phone, MapPin, ArrowRight, Facebook, Instagram, Linkedin, Smartphone, Apple } from "lucide-react";

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

      {/* App promotion strip */}
      <div className="relative grid lg:grid-cols-[1.4fr_1fr] gap-8 items-center py-12 border-b border-white/10">
        <div className="relative">
          <span className="inline-flex items-center gap-2 bg-emerald-500/15 border border-emerald-400/30 rounded-full px-3 py-1 mb-4">
            <Smartphone className="w-3.5 h-3.5 text-emerald-300" />
            <span className="text-[11px] font-bold text-emerald-200 uppercase tracking-widest">
              MEDIHUB Mobile App
            </span>
          </span>
          <h3 className="font-heading text-2xl sm:text-3xl font-extrabold leading-tight mb-3">
            Care in your pocket —{" "}
            <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
              download the MEDIHUB app.
            </span>
          </h3>
          <p className="text-white/65 text-sm sm:text-base leading-relaxed max-w-xl">
            Book appointments, access your medical records, download reports, and chat with our health team — all from one secure app.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 lg:justify-end">
          {/* Google Play */}
          <a
            href="#"
            aria-label="Get it on Google Play"
            className="group inline-flex items-center gap-3 bg-black hover:bg-slate-900 border border-white/15 rounded-2xl px-5 py-3 transition-all hover:-translate-y-0.5 shadow-lg shadow-black/30"
          >
            <svg viewBox="0 0 48 48" className="w-8 h-8 flex-shrink-0" aria-hidden="true">
              <linearGradient id="play1" x1="6" y1="6" x2="42" y2="42" gradientUnits="userSpaceOnUse">
                <stop offset="0" stopColor="#00C2FF"/>
                <stop offset="1" stopColor="#0072FF"/>
              </linearGradient>
              <linearGradient id="play2" x1="22" y1="24" x2="42" y2="24" gradientUnits="userSpaceOnUse">
                <stop offset="0" stopColor="#FFCE00"/>
                <stop offset="1" stopColor="#FFB400"/>
              </linearGradient>
              <linearGradient id="play3" x1="22" y1="24" x2="38" y2="38" gradientUnits="userSpaceOnUse">
                <stop offset="0" stopColor="#FF3A44"/>
                <stop offset="1" stopColor="#C31162"/>
              </linearGradient>
              <linearGradient id="play4" x1="22" y1="24" x2="38" y2="10" gradientUnits="userSpaceOnUse">
                <stop offset="0" stopColor="#00F076"/>
                <stop offset="1" stopColor="#00B14F"/>
              </linearGradient>
              <path d="M7.2 5.6c-.5.4-.8 1-.8 1.8v33.2c0 .8.3 1.4.8 1.8L25 24 7.2 5.6z" fill="url(#play1)"/>
              <path d="M30.4 18.6L25 24l5.4 5.4 9-5.1c1.4-.8 1.4-2.8 0-3.6l-9-2.1z" fill="url(#play2)"/>
              <path d="M30.4 29.4L25 24 7.2 42.4c.7.5 1.6.5 2.5 0l20.7-12z" fill="url(#play3)"/>
              <path d="M9.7 5.6c-.9-.5-1.9-.5-2.5 0L25 24l5.4-5.4-20.7-13z" fill="url(#play4)"/>
            </svg>
            <div className="text-left leading-tight">
              <div className="text-[10px] font-semibold text-white/70 uppercase tracking-wider">Get it on</div>
              <div className="font-heading text-base font-extrabold text-white">Google Play</div>
            </div>
          </a>

          {/* App Store */}
          <a
            href="#"
            aria-label="Download on the App Store"
            className="group inline-flex items-center gap-3 bg-black hover:bg-slate-900 border border-white/15 rounded-2xl px-5 py-3 transition-all hover:-translate-y-0.5 shadow-lg shadow-black/30"
          >
            <Apple className="w-8 h-8 text-white flex-shrink-0" />
            <div className="text-left leading-tight">
              <div className="text-[10px] font-semibold text-white/70 uppercase tracking-wider">Download on the</div>
              <div className="font-heading text-base font-extrabold text-white">App Store</div>
            </div>
          </a>
        </div>
      </div>

      {/* Main grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 py-14">
        {/* Brand */}
        <div className="lg:col-span-1">
          <Link to="/" className="flex items-center gap-2.5 mb-5 group">
              <div className="w-40 h-20 flex items-center justify-center overflow-hidden">
              <img src="/medihub_logo.png" alt="MEDIHUB logo" className="w-40 h-auto object-contain" />
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
        {/* Contact */}
<div>
  <h4 className="font-heading font-bold text-sm uppercase tracking-wider mb-5">
    Get in Touch
  </h4>

  <ul className="space-y-4 text-sm">
    
    {/* Phone */}
    <li className="flex items-start gap-3">
      <Phone className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
      <div>
        <a 
          href="tel:+94112267777" 
          className="text-white/90 hover:text-emerald-400 transition"
        >
          011 226 7777
        </a>
        <div className="text-xs text-white/50">
          24/7 Travel Assistance
        </div>
      </div>
    </li>

    {/* Emails */}
<li className="flex items-start gap-3">
  <Mail className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
  <a 
    href="mailto:info@medihub.lk" 
    className="text-white/90 hover:text-emerald-400 transition"
  >
    info@medihub.lk
  </a>
</li>

<li className="flex items-start gap-3">
  <Mail className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
  <a 
    href="mailto:hr@medihub.lk" 
    className="text-white/90 hover:text-emerald-400 transition"
  >
    hr@medihub.lk
  </a>
</li>

    {/* Address */}
    <li className="flex items-start gap-3">
      <MapPin className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
      <a
  href="https://maps.app.goo.gl/c65HbJxsjxZFsu4L6"
  target="_blank"
  rel="noopener noreferrer"
  className="text-white/90 text-sm leading-relaxed hover:text-emerald-400 transition"
>
  548/1, Awissawella Road,
  <br />
  Wellampitiya, Sri Lanka
</a>
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
