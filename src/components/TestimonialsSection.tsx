import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Elena Rodriguez",
    text: "Medi Hub's cardiac team was extraordinary. From the first consultation to post-surgery follow-up, every detail was handled with professionalism and genuine care.",
    role: "Heart Surgery Patient",
  },
  {
    name: "Michael Okonkwo",
    text: "The diagnostic accuracy was remarkable. My neurologist took the time to explain everything clearly, and the treatment plan gave me real confidence in my recovery.",
    role: "Neurology Patient",
  },
  {
    name: "Priya Sharma",
    text: "My daughter received exceptional pediatric care. The staff treated us like family, and the facilities are truly world-class. I couldn't have asked for more.",
    role: "Parent",
  },
  {
    name: "David Kim",
    text: "My knee replacement surgery was seamless. Minimal pain, quick recovery, and the physiotherapy team was outstanding. Highly recommended.",
    role: "Orthopedic Patient",
  },
];

const TestimonialsSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrent((prev) => (prev + 1) % testimonials.length), 6000);
    return () => clearInterval(timer);
  }, []);

  const prev = () => setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length);
  const next = () => setCurrent((c) => (c + 1) % testimonials.length);

  return (
    <section id="testimonials" className="section-padding bg-white" ref={ref}>
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <span className="section-label">Testimonials</span>
          <h2 className="section-title">What Our <span className="text-primary">Patients</span> Say</h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="premium-card p-8 sm:p-10 relative"
        >
          <Quote className="w-10 h-10 text-primary/15 absolute top-6 left-6" />

          <div className="flex gap-1 justify-center mb-6">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 text-gold fill-gold" />
            ))}
          </div>

          <div className="min-h-[130px] flex items-center justify-center">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="text-center"
            >
              <p className="text-foreground/85 text-lg leading-relaxed mb-6">
                "{testimonials[current].text}"
              </p>
              <p className="font-heading font-bold text-foreground">{testimonials[current].name}</p>
              <p className="text-sm text-primary">{testimonials[current].role}</p>
            </motion.div>
          </div>

          <div className="flex items-center justify-center gap-4 mt-8">
            <button onClick={prev} className="w-9 h-9 rounded-full border border-border hover:border-primary/40 flex items-center justify-center transition-colors">
              <ChevronLeft className="w-4 h-4 text-muted-foreground" />
            </button>
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === current ? "bg-primary w-6" : "bg-border w-2"
                  }`}
                />
              ))}
            </div>
            <button onClick={next} className="w-9 h-9 rounded-full border border-border hover:border-primary/40 flex items-center justify-center transition-colors">
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
