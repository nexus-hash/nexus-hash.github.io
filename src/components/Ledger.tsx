import { m } from "framer-motion";
import { ledger } from "../data/resume";
import CountUp from "./CountUp";

/** Headline outcomes set as ruled ledger lines: amount · entry · source. */
export default function Ledger() {
  return (
    <div className="ledger">
      <div className="ledger-head" aria-hidden="true">
        <span>Amount</span>
        <span>Entry</span>
        <span>Source</span>
      </div>
      <ul>
        {ledger.map((row, i) => (
          <m.li
            className="ledger-row"
            key={row.label}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-8% 0px" }}
            transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="ledger-value">
              <CountUp value={row.value} />
            </p>
            <div>
              <p className="ledger-label">{row.label}</p>
              <p className="ledger-detail">{row.detail}</p>
            </div>
            <p className="ledger-source">{row.source}</p>
          </m.li>
        ))}
      </ul>
    </div>
  );
}
