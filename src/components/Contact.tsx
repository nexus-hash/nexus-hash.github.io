import { useState } from "react";
import { m } from "framer-motion";
import { Check, Copy, Github, Linkedin } from "lucide-react";
import { contact } from "../data/resume";
import SectionHead from "./SectionHead";

export default function Contact() {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(contact.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // clipboard unavailable — the mailto link below still works
    }
  }

  return (
    <section className="section contact" id="contact">
      <SectionHead
        index="05"
        title="Let's talk"
        sub="Open to conversations about distributed systems, payments infrastructure, and agentic AI."
      />

      <m.div
        className="contact-inner"
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-10% 0px" }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="contact-prompt">
          $ contact <span>--email</span>
        </p>
        <div className="contact-email-row">
          <a className="contact-email" href={`mailto:${contact.email}`}>
            {contact.email}
          </a>
          <button
            className={`contact-copy${copied ? " is-copied" : ""}`}
            onClick={handleCopy}
            aria-label="Copy email address"
          >
            {copied ? <Check size={13} /> : <Copy size={13} />}
            {copied ? "copied" : "copy"}
          </button>
        </div>
        <div className="hero-links">
          <a href={contact.github} target="_blank" rel="noopener noreferrer">
            <Github size={15} /> GitHub
          </a>
          <a href={contact.linkedin} target="_blank" rel="noopener noreferrer">
            <Linkedin size={15} /> LinkedIn
          </a>
        </div>
      </m.div>
    </section>
  );
}
