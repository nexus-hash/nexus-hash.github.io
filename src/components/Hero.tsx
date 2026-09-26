import { ArrowDown, Github, Linkedin, Mail } from "lucide-react";
import { contact, heroRoles, heroStats } from "../data/resume";
import StatTile from "./StatTile";
import Typewriter from "./Typewriter";

export default function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero-inner">
        <p className="hero-eyebrow">
          <span className="status-dot" aria-hidden="true" />
          status: open to conversations
        </p>
        <h1 className="hero-name">
          Soumya Ranjan
          <br />
          Tripathy<span className="hero-cursor" aria-hidden="true" />
        </h1>
        <p className="hero-type">
          <span className="hero-type-prompt" aria-hidden="true">
            $ building
          </span>{" "}
          <Typewriter phrases={heroRoles} />
        </p>
        <p className="hero-line">
          I build the infrastructure that moves money and the agents that watch it. Currently
          scaling payment systems and agentic AI pipelines at <span className="hero-accent">Visa</span>.
        </p>
        <div className="hero-actions">
          <a href="#experience" className="btn btn-primary">
            view_experience <ArrowDown size={14} aria-hidden="true" />
          </a>
          <a href={`mailto:${contact.email}`} className="btn btn-ghost">
            get_in_touch
          </a>
        </div>
        <div className="hero-links">
          <a href={contact.github} target="_blank" rel="noopener noreferrer">
            <Github size={15} /> GitHub
          </a>
          <a href={contact.linkedin} target="_blank" rel="noopener noreferrer">
            <Linkedin size={15} /> LinkedIn
          </a>
          <a href={`mailto:${contact.email}`}>
            <Mail size={15} /> Email
          </a>
        </div>

        <div className="stat-strip">
          {heroStats.map((stat) => (
            <StatTile key={stat.label} value={stat.value} label={stat.label} />
          ))}
        </div>
      </div>
    </section>
  );
}
