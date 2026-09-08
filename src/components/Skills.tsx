import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { skills } from "../data/resume";
import SectionHead from "./SectionHead";

function toKey(title: string): string {
  return title
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");
}

export default function Skills() {
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});

  return (
    <section className="section skills" id="skills">
      <SectionHead index="03" title="Skills" sub="The stack behind the systems above." />

      <motion.div
        className="skills-manifest"
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-10% 0px" }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        {skills.map((cluster, i) => {
          const isOpen = Boolean(expanded[i]);
          return (
            <div className="skill-row" key={cluster.title}>
              <p className="skill-key">{toKey(cluster.title)}</p>
              <div className="skill-values">
                {cluster.core.map((skill) => (
                  <span className="skill-value" key={skill}>
                    {skill}
                  </span>
                ))}
                <AnimatePresence>
                  {isOpen &&
                    cluster.extra?.map((skill) => (
                      <motion.span
                        className="skill-value"
                        key={skill}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        {skill}
                      </motion.span>
                    ))}
                </AnimatePresence>
                {cluster.extra && cluster.extra.length > 0 && (
                  <button
                    className="skill-toggle"
                    onClick={() => setExpanded((prev) => ({ ...prev, [i]: !prev[i] }))}
                    aria-expanded={isOpen}
                  >
                    {isOpen ? "// show less" : `// +${cluster.extra.length} more`}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </motion.div>
    </section>
  );
}
