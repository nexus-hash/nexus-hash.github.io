import { useEffect, useRef, useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import { Menu, Moon, Search, Sun, X } from "lucide-react";
import { useActiveSection } from "../hooks/useActiveSection";
import { useIsMac } from "../hooks/useIsMac";
import type { Theme } from "../hooks/useTheme";

const links = [
  { id: "experience", label: "Experience", no: "01" },
  { id: "projects", label: "Projects", no: "02" },
  { id: "open-source", label: "Open source", no: "03" },
  { id: "skills", label: "Skills", no: "04" },
  { id: "contact", label: "Contact", no: "05" },
];
const linkIds = links.map((l) => l.id);

interface Props {
  theme: Theme;
  onToggleTheme: () => void;
  onOpenPalette: () => void;
}

export default function TopBar({ theme, onToggleTheme, onOpenPalette }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const active = useActiveSection(linkIds);
  const isMac = useIsMac();
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setMenuOpen(false);
    }
    function onPointer(e: PointerEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setMenuOpen(false);
    }
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [menuOpen]);

  return (
    <header className="bar" ref={ref}>
      <nav className="wrap bar-inner" aria-label="Primary">
        <a className="bar-name" href="#top" aria-label="Soumya Ranjan Tripathy — back to top">
          Soumya R Tripathy<span>.</span>
        </a>

        <ul className="bar-links">
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

        <div className="bar-tools">
          <button className="icon-btn" onClick={onOpenPalette} aria-label="Open command palette">
            <Search size={14} aria-hidden="true" />
            <kbd className="bar-kbd">{isMac ? "⌘K" : "Ctrl K"}</kbd>
          </button>
          <button
            className="icon-btn"
            onClick={onToggleTheme}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
          >
            {theme === "dark" ? <Sun size={15} aria-hidden="true" /> : <Moon size={15} aria-hidden="true" />}
          </button>
          <button
            className="icon-btn bar-menu-btn"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            aria-controls="bar-menu"
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? <X size={16} aria-hidden="true" /> : <Menu size={16} aria-hidden="true" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <m.ul
            id="bar-menu"
            className="bar-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            {links.map((link) => (
              <li key={link.id}>
                <a
                  href={`#${link.id}`}
                  className={active === link.id ? "active" : ""}
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                  <span>{link.no}</span>
                </a>
              </li>
            ))}
          </m.ul>
        )}
      </AnimatePresence>
    </header>
  );
}
