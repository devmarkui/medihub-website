import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Phone, Mail, MapPin, Send, Clock } from "lucide-react";
import { toast } from "sonner";

const ContactSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Appointment request submitted! We'll contact you shortly.");
    setForm({ name: "", email: "", phone: "", message: "" });
  };

  return (
    <section id="contact" className="section-padding" ref={ref}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <span className="section-label">Get In Touch</span>
          <h2 className="section-title">Begin Your <span className="text-primary">Migration Journey</span></h2>
          <p className="section-subtitle mx-auto">
            Book a visa medical, pre-departure consultation, or speak with our migration health team — we're here at every stage.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-3 premium-card p-7"
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              {[
                { key: "name", label: "Full Name", type: "text", placeholder: "Your name" },
                { key: "email", label: "Email", type: "email", placeholder: "you@example.com" },
                { key: "phone", label: "Phone", type: "tel", placeholder: "+1 (555) 000-0000" },
              ].map((field) => (
                <div key={field.key}>
                  <label className="text-sm text-foreground mb-1.5 block font-medium">{field.label}</label>
                  <input
                    type={field.type}
                    required
                    placeholder={field.placeholder}
                    value={form[field.key as keyof typeof form]}
                    onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                    className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all text-sm"
                  />
                </div>
              ))}
              <div>
                <label className="text-sm text-foreground mb-1.5 block font-medium">Message</label>
                <textarea
                  rows={4}
                  placeholder="Tell us about your destination country, visa type, or service needed..."
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all resize-none text-sm"
                />
              </div>
              <button type="submit" className="btn-primary w-full justify-center">
                <Send className="w-4 h-4" />
                Submit Appointment Request
              </button>
            </form>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-2 space-y-4"
          >
            {[
              { icon: Phone, title: "Travel Assistance Hotline", text: "+94 (0) 11 MEDI-HUB", highlight: true },
              { icon: Clock, title: "Working Hours", text: "24/7 Travel Assistance" },
              { icon: Mail, title: "Email Us", text: "care@medihub.lk" },
              { icon: MapPin, title: "Location", text: "Migration Health Centre, Colombo, Sri Lanka" },
            ].map((item, i) => (
              <div
                key={i}
                className={`premium-card p-5 flex items-start gap-4 ${item.highlight ? "border-primary/30 bg-primary/5" : ""}`}
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-sm mb-0.5">{item.title}</h4>
                  <p className="text-muted-foreground text-sm">{item.text}</p>
                </div>
              </div>
            ))}

            <div className="premium-card p-1 rounded-2xl overflow-hidden h-40">
              <div className="w-full h-full rounded-xl bg-muted flex items-center justify-center">
                <MapPin className="w-6 h-6 text-muted-foreground/40" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
