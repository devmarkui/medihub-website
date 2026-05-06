import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Eye, Target, Sparkles } from "lucide-react";

const values = [
  "Compassion",
  "Excellence",
  "Integrity",
  "Accessibility",
  "Person-centred Care",
  "Cultural Sensitivity",
  "Continuity",
  "Confidentiality",
];

const AboutSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="about" className="section-padding bg-white" ref={ref}>
      <div className="max-w-7xl mx-auto">
        {/* Intro */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center mb-16"
        >
          <span className="section-label">About MEDIHUB</span>
          <h2 className="section-title mb-6">
            Sri Lanka's Dedicated{" "}
            <span className="text-primary">Migration Health Centre</span>
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed mb-5">
            MEDIHUB is a purpose-built, specialized health centre dedicated exclusively to the health needs of migrants, foreign workers, and internationally mobile individuals. We bridge the gap between clinical excellence and the realities of cross-border movement — ensuring every person who crosses a border does so in the best possible health.
          </p>
          <p className="text-muted-foreground text-base leading-relaxed mb-5">
            We serve both outbound migrants — those preparing to work or study abroad — and inbound arrivals, offering a comprehensive continuum of care that addresses every stage of the migration journey. Our multidisciplinary team of physicians, travel medicine specialists, nurses, and health counselors work together to deliver personalized, evidence-based health services under one roof.
          </p>
          <p className="text-muted-foreground text-base leading-relaxed italic">
            At MEDIHUB, migration is not just a logistical event — it is a life transition that demands careful health preparation, continuous support, and compassionate care.
          </p>
        </motion.div>

        {/* Vision / Mission / Values */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Vision */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/15 rounded-2xl p-8"
          >
            <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center mb-5">
              <Eye className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-heading text-xl font-bold mb-3">Our Vision</h3>
            <p className="text-muted-foreground leading-relaxed">
              To be the leading dedicated migration health centre in South Asia — recognized for clinical excellence, compassionate care, and seamless health support for every migrant across every border.
            </p>
          </motion.div>

          {/* Mission */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/15 rounded-2xl p-8"
          >
            <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center mb-5">
              <Target className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-heading text-xl font-bold mb-3">Our Mission</h3>
            <p className="text-muted-foreground leading-relaxed">
              To provide comprehensive, expert, and accessible health services tailored to the unique needs of migrants — empowering individuals with the health knowledge, documentation, and care they need to migrate safely, confidently, and successfully.
            </p>
          </motion.div>

          {/* Values */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/15 rounded-2xl p-8"
          >
            <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center mb-5">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-heading text-xl font-bold mb-3">Our Values</h3>
            <p className="text-muted-foreground text-sm leading-relaxed mb-4">
              The principles that guide every interaction at MEDIHUB:
            </p>
            <div className="flex flex-wrap gap-2">
              {values.map((value) => (
                <span
                  key={value}
                  className="text-xs font-medium text-primary bg-white border border-primary/20 px-3 py-1.5 rounded-full"
                >
                  {value}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
