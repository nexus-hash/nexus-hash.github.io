import { useEffect, useRef } from "react";
import { AnimatePresence, m } from "framer-motion";
import { ChevronDown, X } from "lucide-react";
import type { ExperienceEntry } from "../data/resume";
import { useCardGlow } from "../hooks/useCardGlow";

interface Props {
  entry: ExperienceEntry;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
}

/**
 * Only the card header is the toggle button (a real <button>), so the
 * expanded detail is never read out as part of a button label and the close
 * button isn't nested inside another control. Focus moves into the detail on
 * open and back to the header on close.
 */
export default function ExperienceCard({ entry, index, isOpen, onToggle }: Props) {
  const glow = useCardGlow();
  const headRef = useRef<HTMLButtonElement>(null);
  const detailRef = useRef<HTMLDivElement>(null);
  const wasOpen = useRef(false);

  useEffect(() => {
    if (isOpen) {
      // Let the layout animation start first, then move focus in.
      const id = requestAnimationFrame(() => detailRef.current?.focus({ preventScroll: true }));
      wasOpen.current = true;
      return () => cancelAnimationFrame(id);
    }
    if (wasOpen.current) {
      wasOpen.current = false;
      headRef.current?.focus({ preventScroll: true });
    }
  }, [isOpen]);

  const detailId = `exp-detail-${entry.id}`;

  return (
    <m.article
      layout
      transition={{
        layout: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
        default: { duration: 0.55, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] },
      }}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8% 0px" }}
      className={`exp-card glow${entry.anchor ? " is-anchor" : ""}${isOpen ? " is-open" : ""}`}
      onPointerMove={glow}
      aria-labelledby={`exp-title-${entry.id}`}
    >
      <m.div layout="position" className="exp-card-face">
        <button
          ref={headRef}
          type="button"
          className="exp-face-btn"
          onClick={onToggle}
          aria-expanded={isOpen}
          aria-controls={detailId}
        >
          <div className="exp-face-top">
            <div className="exp-face-top-left">
              <div>
                <h3 id={`exp-title-${entry.id}`}>{entry.company}</h3>
                <p className="exp-role">{entry.headlineRole}</p>
              </div>
              <span className={`exp-status${entry.anchor ? " is-active" : ""}`}>
                {entry.anchor ? "ACTIVE" : "COMPLETE"}
              </span>
            </div>
            <p className="exp-dates">{entry.dates}</p>
          </div>
          <p className="exp-metric">
            {entry.metricValue && <span className="exp-metric-inline">{entry.metricValue} </span>}
            {entry.metricLabel}
          </p>
          <p className="exp-hint">
            <span>{entry.hint}</span>
            <span className="exp-hint-action">
              {isOpen ? "collapse" : "expand"}
              <ChevronDown size={13} aria-hidden="true" className={isOpen ? "is-flipped" : ""} />
            </span>
          </p>
        </button>
      </m.div>

      <AnimatePresence initial={false}>
        {isOpen && (
          <m.div
            key="detail"
            id={detailId}
            ref={detailRef}
            tabIndex={-1}
            role="region"
            aria-label={`${entry.company} details`}
            className="exp-detail"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <button type="button" className="exp-close" aria-label="Close details" onClick={onToggle}>
              <X size={18} />
            </button>

            {entry.roles.map((role) => (
              <div className="exp-role-block" key={`${role.title}-${role.dates ?? ""}`}>
                <div className="exp-role-head">
                  <h4>{role.title}</h4>
                  <span className="exp-stack">{role.stack}</span>
                  {role.dates && <span className="exp-role-dates">{role.dates}</span>}
                </div>
                <ul>
                  {role.bullets.map((bullet, i) => (
                    <li key={i}>{bullet}</li>
                  ))}
                </ul>
              </div>
            ))}
          </m.div>
        )}
      </AnimatePresence>
    </m.article>
  );
}
