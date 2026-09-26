import { useEffect, useRef, useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import { Terminal } from "lucide-react";
import { contact } from "../data/resume";
import { useActiveSection } from "../hooks/useActiveSection";
import { useIsMac } from "../hooks/useIsMac";
import LiveClock from "./LiveClock";

const links = [
  { id: "experience", label: "experience" },
  { id: "projects", label: "projects" },
  { id: "skills", label: "skills" },
  { id: "contact", label: "contact" },
];
const linkIds = links.map((l) => l.id);

interface Props {
  onOpenPalette: () => void;
}

export default function Nav({ onOpenPalette }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const active = useActiveSection(linkIds);
  const isMac = useIsMac();
  const navRef = useRef<HTMLElement>(null);

  // Close the mobile menu on Escape or on a tap/click outside the nav.
  useEffect(() => {
    if (!menuOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setMenuOpen(false);
    }
    function onPointer(e: PointerEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setMenuOpen(false);
    }
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [menuOpen]);

  return (
    <header className="nav" ref={navRef}>
      <nav className="nav-inner" aria-label="Primary">
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
              <a
                href={`#${link.id}`}
                className={active === link.id ? "active" : ""}
                aria-current={active === link.id ? "location" : undefined}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <LiveClock />

        <button className="nav-kbd" onClick={onOpenPalette} aria-label="Open command palette">
          <Terminal size={13} aria-hidden="true" />
          <kbd>{isMac ? "⌘" : "Ctrl"}</kbd>
          <kbd>K</kbd>
        </button>

        <a className="nav-cta" href={`mailto:${contact.email}`}>
          say_hello
        </a>

        <button className="nav-palette-mobile" onClick={onOpenPalette} aria-label="Open command palette">
          <Terminal size={16} aria-hidden="true" />
        </button>

        <button
          className={`nav-toggle${menuOpen ? " is-open" : ""}`}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          aria-controls="nav-mobile-menu"
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>

        <AnimatePresence>
          {menuOpen && (
            <m.ul
              id="nav-mobile-menu"
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
            </m.ul>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
