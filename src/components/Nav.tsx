import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { contact } from "../data/resume";
import { useActiveSection } from "../hooks/useActiveSection";
import LiveClock from "./LiveClock";

const links = [
  { id: "experience", label: "experience" },
  { id: "projects", label: "projects" },
  { id: "skills", label: "skills" },
  { id: "contact", label: "contact" },
];

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const active = useActiveSection(links.map((l) => l.id));

  return (
    <header className="nav">
      <nav className="nav-inner">
        <a className="nav-brand" href="#top" aria-label="Back to top">
          <span className="nav-mark" aria-hidden="true">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <rect width="22" height="22" rx="6" fill="var(--panel)" stroke="var(--line)" />
              <path
                d="M7 7L11 11L7 15"
                stroke="var(--amber)"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <rect x="13" y="14.3" width="5" height="1.8" rx="0.5" fill="var(--amber)" className="nav-mark-cursor" />
            </svg>
            <span className="nav-brand-dot" />
          </span>
          <span className="nav-brand-label">
            <strong>soumya</strong>.dev
          </span>
        </a>

        <ul className="nav-links">
          {links.map((link) => (
            <li key={link.id}>
              <a href={`#${link.id}`} className={active === link.id ? "active" : ""}>
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <LiveClock />

        <a className="nav-cta" href={`mailto:${contact.email}`}>
          say_hello
        </a>

        <button
          className={`nav-toggle${menuOpen ? " is-open" : ""}`}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>

        <AnimatePresence>
          {menuOpen && (
            <motion.ul
              className="nav-mobile-menu"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              {links.map((link) => (
                <li key={link.id}>
                  <a
                    href={`#${link.id}`}
                    className={active === link.id ? "active" : ""}
                    onClick={() => setMenuOpen(false)}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
