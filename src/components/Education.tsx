import { motion } from "framer-motion";
import { education } from "../data/resume";
import SectionHead from "./SectionHead";

export default function Education() {
  return (
    <section className="section education" id="education">
      <SectionHead index="04" title="Education" />

      <motion.div
        className="edu-row"
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-10% 0px" }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="edu-check">[✓] complete</div>
        <div className="edu-detail">
          <h3>{education.school}</h3>
          <p className="exp-role">{education.degree}</p>
          <p className="exp-dates">{education.dates}</p>
        </div>
      </motion.div>
    </section>
  );
}
