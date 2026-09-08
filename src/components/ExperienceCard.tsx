import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import type { ExperienceEntry } from "../data/resume";

interface Props {
  entry: ExperienceEntry;
  isOpen: boolean;
  onToggle: () => void;
}

export default function ExperienceCard({ entry, isOpen, onToggle }: Props) {
  return (
    <motion.article
      layout
      transition={{ layout: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }}
      className={`exp-card ${entry.anchor ? "is-anchor" : ""} ${isOpen ? "is-open" : ""}`}
      onClick={() => !isOpen && onToggle()}
      onKeyDown={(e) => {
        if ((e.key === "Enter" || e.key === " ") && !isOpen) {
          e.preventDefault();
          onToggle();
        }
        if (e.key === "Escape" && isOpen) onToggle();
      }}
      tabIndex={0}
      role="button"
      aria-expanded={isOpen}
      aria-controls={`exp-detail-${entry.id}`}
    >
      <motion.div layout="position" className="exp-card-face">
        <div className="exp-face-top">
          <div className="exp-face-top-left">
            <div>
              <h3>{entry.company}</h3>
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
        {!isOpen && <p className="exp-hint">{entry.hint} · click to expand</p>}
      </motion.div>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="detail"
            id={`exp-detail-${entry.id}`}
            className="exp-detail"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <button
              className="exp-close"
              aria-label="Close"
              onClick={(e) => {
                e.stopPropagation();
                onToggle();
              }}
            >
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
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
}
