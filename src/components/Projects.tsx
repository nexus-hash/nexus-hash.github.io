import { motion } from "framer-motion";
import { project } from "../data/resume";
import SectionHead from "./SectionHead";

export default function Projects() {
  return (
    <section className="section projects" id="projects">
      <SectionHead index="02" title="Projects" />

      <motion.div
        className="project-panel"
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-10% 0px" }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="project-panel-bar">
          <span />
          <span />
          <span />
          <span className="project-panel-bar-label">project.log</span>
        </div>
        <div className="project-panel-body">
          <p className="project-cmd">
            $ cat <span>{project.name.toLowerCase()}/README.md</span>
          </p>
          <h2>{project.name}</h2>
          <p className="project-desc">{project.description}</p>
          <div className="project-stack">
            stack: <span>{project.tagline}</span>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
