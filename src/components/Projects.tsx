import { m } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { projects } from "../data/resume";
import SectionHead from "./SectionHead";

export default function Projects() {
  return (
    <section className="section" id="projects">
      <div className="wrap">
        <SectionHead
          index="02"
          label="Projects"
          title={
            <>
              Built on my <em>own</em> time.
            </>
          }
        />

        {projects.map((project) => {
          const host = project.live?.replace(/^https?:\/\//, "").replace(/\/$/, "");
          return (
            <m.article
              className="feature"
              key={project.id}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-8% 0px" }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              {project.image && (
                <a
                  className="feature-shot"
                  href={project.live ?? project.repo}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Open ${project.name}`}
                >
                  <div className="feature-shot-frame">
                    <img
                      className={project.imageLight ? "shot-dark" : undefined}
                      src={`${import.meta.env.BASE_URL}${project.image}`}
                      alt={`Screenshot of ${project.name}`}
                      loading="lazy"
                      decoding="async"
                      width={3200}
                      height={1800}
                    />
                    {project.imageLight && (
                      <img
                        className="shot-light"
                        src={`${import.meta.env.BASE_URL}${project.imageLight}`}
                        alt={`Screenshot of ${project.name}`}
                        loading="lazy"
                        decoding="async"
                        width={3200}
                        height={1800}
                      />
                    )}
                  </div>
                  <span className="feature-shot-tag" aria-hidden="true">
                    {host} <ArrowUpRight size={14} />
                  </span>
                </a>
              )}

              <div className="feature-body">
                <div className="feature-title">
                  <h3>{project.name}</h3>
                  <p className="feature-tagline">{project.tagline}</p>
                </div>
                <div>
                  <p className="feature-desc">{project.description}</p>
                  <ul className="feature-meta" aria-label="Stack">
                    {project.stack.map((s) => (
                      <li className="chip" key={s}>
                        {s}
                      </li>
                    ))}
                  </ul>
                  <div className="feature-links">
                    {project.live && (
                      <a className="link" href={project.live} target="_blank" rel="noopener noreferrer">
                        Open the live site <ArrowUpRight size={14} aria-hidden="true" />
                      </a>
                    )}
                    {project.repo && (
                      <a className="link" href={project.repo} target="_blank" rel="noopener noreferrer">
                        Source on GitHub <ArrowUpRight size={14} aria-hidden="true" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </m.article>
          );
        })}
      </div>
    </section>
  );
}
