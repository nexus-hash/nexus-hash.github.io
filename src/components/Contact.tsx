import { useEffect, useState } from "react";
import { m } from "framer-motion";
import { ArrowUpRight, Check, Copy } from "lucide-react";
import { contact, education } from "../data/resume";

const clock = new Intl.DateTimeFormat("en-GB", {
  timeZone: contact.timezone.iana,
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

function LocalTime() {
  const [time, setTime] = useState(() => clock.format(new Date()));
  useEffect(() => {
    const id = setInterval(() => setTime(clock.format(new Date())), 15_000);
    return () => clearInterval(id);
  }, []);
  return (
    <span className="mono">
      {time} {contact.timezone.label}
    </span>
  );
}

export default function Contact() {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(contact.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // clipboard unavailable — the mailto link still works
    }
  }

  return (
    <section className="section contact" id="contact">
      <m.div
        className="wrap"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-10% 0px" }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="contact-kicker">
          <b>05</b> / Contact
        </p>
        <h2>
          Let’s talk about hard <em>systems</em> problems.
        </h2>

        <div className="contact-email-row">
          <a className="contact-email" href={`mailto:${contact.email}`}>
            {contact.email}
          </a>
          <button
            className={`icon-btn contact-copy${copied ? " is-copied" : ""}`}
            onClick={handleCopy}
            aria-label="Copy email address"
          >
            {copied ? <Check size={14} aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>

        <div className="contact-grid">
          <div id="education">
            <h3>Education</h3>
            <p>
              <strong>{education.school}</strong>
              {education.degree}
              <br />
              <span className="mono">{education.dates}</span>
            </p>
          </div>
          <div>
            <h3>Elsewhere</h3>
            <ul>
              <li>
                <a className="link" href={contact.github} target="_blank" rel="noopener noreferrer">
                  GitHub <ArrowUpRight size={13} aria-hidden="true" />
                </a>
              </li>
              <li>
                <a className="link" href={contact.linkedin} target="_blank" rel="noopener noreferrer">
                  LinkedIn <ArrowUpRight size={13} aria-hidden="true" />
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3>Local time</h3>
            <p>
              <strong>
                <LocalTime />
              </strong>
              Usually replies within a day.
            </p>
          </div>
        </div>
      </m.div>
    </section>
  );
}
