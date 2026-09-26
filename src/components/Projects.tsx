import { m } from "framer-motion";
import { ArrowUpRight, Github } from "lucide-react";
import { projects } from "../data/resume";
import { useCardGlow } from "../hooks/useCardGlow";
import SectionHead from "./SectionHead";

const statusLabel = { live: "LIVE", wip: "IN PROGRESS", archived: "ARCHIVED" } as const;

export default function Projects() {
  const glow = useCardGlow();

  return (
    <section className="section projects" id="projects">
      <SectionHead index="02" title="Projects" sub="Things I build when nobody is paging me." />

      <div className="project-list">
        {projects.map((project, i) => {
          const host = project.live?.replace(/^https?:\/\//, "").replace(/\/$/, "");
          return (
            <m.article
              key={project.id}
              className="project-panel glow"
              onPointerMove={glow}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="project-panel-bar">
                <span />
                <span />
                <span />
                <span className="project-panel-bar-label">{host ?? `${project.id}.log`}</span>
                <span className={`project-status is-${project.status}`}>
                  {project.status === "live" && <span className="status-dot" aria-hidden="true" />}
                  {statusLabel[project.status]}
                </span>
              </div>

              <div className="project-panel-body">
                <div className="project-copy">
                  <p className="project-cmd">
                    $ cat <span>{project.id}/README.md</span>
                  </p>
                  <h3>{project.name}</h3>
                  <p className="project-tagline">{project.tagline}</p>
                  <p className="project-desc">{project.description}</p>
                  <ul className="project-stack" aria-label="Stack">
                    {project.stack.map((s) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ul>
                  <div className="project-links">
                    {project.live && (
                      <a className="btn btn-primary" href={project.live} target="_blank" rel="noopener noreferrer">
                        open_live <ArrowUpRight size={14} aria-hidden="true" />
                      </a>
                    )}
                    {project.repo && (
                      <a className="btn btn-ghost" href={project.repo} target="_blank" rel="noopener noreferrer">
                        <Github size={14} aria-hidden="true" /> source
                      </a>
                    )}
                  </div>
                </div>

                {project.image && (
                  <a
                    className="project-shot"
                    href={project.live ?? project.repo}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Open ${project.name}`}
                  >
                    <span className="project-shot-chrome" aria-hidden="true">
                      <span className="project-shot-url">{host}</span>
                    </span>
                    <img
                      src={`${import.meta.env.BASE_URL}${project.image}`}
                      alt={`Screenshot of ${project.name}`}
                      loading="lazy"
                      decoding="async"
                      width={1280}
                      height={800}
                    />
                    <span className="project-shot-overlay" aria-hidden="true">
                      <ArrowUpRight size={18} /> open
                    </span>
                  </a>
                )}
              </div>
            </m.article>
          );
        })}
      </div>
    </section>
  );
}
