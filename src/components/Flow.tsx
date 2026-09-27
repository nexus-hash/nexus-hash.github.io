import { m } from "framer-motion";
import { flowStages } from "../data/resume";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

const DOT_DELAYS = [0, 1.2, 2.3, 3.5, 4.7, 5.8];
const TAP_ID = "agents";
const TAP_ON = "stream";

/**
 * The hero's signature graphic: payment events travelling merchant → gateway
 * → Kafka → settlement, with the AI triage pipeline tapping the stream.
 * Horizontal on desktop, vertical on phones; static under reduced motion.
 */
export default function Flow() {
  const reducedMotion = usePrefersReducedMotion();
  const stages = flowStages.filter((s) => s.id !== TAP_ID);
  const tap = flowStages.find((s) => s.id === TAP_ID);

  return (
    <m.div
      className="flow"
      role="img"
      aria-label={`Payment flow: ${stages.map((s) => `${s.label} (${s.note})`).join(" to ")}${
        tap ? `, observed by ${tap.label} (${tap.note})` : ""
      }`}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.9, delay: 0.5 }}
    >
      <p className="flow-caption" aria-hidden="true">
        <span>
          <b>fig. 1</b> — what I work on, end to end
        </span>
        <span>live</span>
      </p>

      <div className="flow-body" aria-hidden="true">
        <div className="flow-track">
          {!reducedMotion &&
            DOT_DELAYS.map((d) => <span key={d} className="flow-rail" style={{ ["--d" as string]: `${d}s` }} />)}
        </div>

        <ol className="flow-stages">
          {stages.map((stage) => (
            <li className="flow-stage" key={stage.id}>
              <span className="flow-node" />
              <span className="flow-label">{stage.label}</span>
              <span className="flow-note">{stage.note}</span>
              {tap && stage.id === TAP_ON && (
                <div className="flow-tap">
                  <span className="flow-label">{tap.label}</span>
                  <span className="flow-note">{tap.note}</span>
                </div>
              )}
            </li>
          ))}
        </ol>
      </div>
    </m.div>
  );
}
