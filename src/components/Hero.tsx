import type { ReactNode } from "react";
import { m } from "framer-motion";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { contact, headline } from "../data/resume";

// The statement is broken into lines by hand so each can rise in on its own
// and so the two italic words land where they should. Keep it in sync with
// `headline.statement` (used as the accessible label).
const LINES: ReactNode[] = [
  <>
    I take systems <em>apart</em>
  </>,
  <>to see how they work,</>,
  <>
    then build <em>better</em> ones.
  </>,
];

export default function Hero() {
  return (
    <section className="hero" id="top">
      <div className="wrap">
        <m.p
          className="hero-kicker"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <span>{headline.role}</span>
          <span className="pill">
            <i aria-hidden="true" />
            {headline.availability}
          </span>
        </m.p>

        <h1 aria-label={headline.statement}>
          {LINES.map((line, i) => (
            <span className="line" key={i} aria-hidden="true">
              <m.span
                initial={{ y: "110%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.9, delay: 0.08 + i * 0.09, ease: [0.22, 1, 0.36, 1] }}
              >
                {line}
              </m.span>
            </span>
          ))}
        </h1>

        <m.div
          className="hero-foot"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="hero-lede">{headline.lede}</p>
          <div className="hero-links">
            <a className="link is-down" href="#experience">
              Read the trace <ArrowDown size={14} aria-hidden="true" />
            </a>
            <a className="link" href={`mailto:${contact.email}`}>
              Email <ArrowUpRight size={14} aria-hidden="true" />
            </a>
            <a className="link" href={contact.github} target="_blank" rel="noopener noreferrer">
              GitHub <ArrowUpRight size={14} aria-hidden="true" />
            </a>
            <a className="link" href={contact.linkedin} target="_blank" rel="noopener noreferrer">
              LinkedIn <ArrowUpRight size={14} aria-hidden="true" />
            </a>
          </div>
        </m.div>
      </div>
    </section>
  );
}
