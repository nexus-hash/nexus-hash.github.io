import { useEffect, useState } from "react";
import { m } from "framer-motion";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { contact, headline } from "../data/resume";

// The statement is broken into lines by hand so the two italic words land
// where they should. Keep it in sync with `headline.statement` (used as the
// accessible label). It is typed out one character at a time; the full stop
// at the end blinks once the typing is done.
type Segment = { text: string; em?: boolean };
const LINES: Segment[][] = [
  [{ text: "I take systems " }, { text: "apart", em: true }],
  [{ text: "to see how they work," }],
  [{ text: "then build " }, { text: "better", em: true }, { text: " ones." }],
];
const TOTAL = LINES.flat().reduce((n, s) => n + s.text.length, 0);
const START = 350; // ms before the first key
const KEY = 46; // ms per character

/** How many characters of the statement have been typed so far. */
function useTyped() {
  const [typed, setTyped] = useState(() =>
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches ? TOTAL : 0
  );
  useEffect(() => {
    let timer = 0;
    const begin = window.setTimeout(() => {
      timer = window.setInterval(() => {
        setTyped((n) => {
          if (n + 1 >= TOTAL) window.clearInterval(timer);
          return Math.min(TOTAL, n + 1);
        });
      }, KEY);
    }, START);
    return () => {
      window.clearTimeout(begin);
      window.clearInterval(timer);
    };
  }, []);
  return typed;
}

/** One run of text: the typed part, the caret if it is here, and the part still to come. */
function Run({ seg, from, typed }: { seg: Segment; from: number; typed: number }) {
  const n = Math.max(0, Math.min(seg.text.length, typed - from));
  const done = typed >= TOTAL;
  const last = from + seg.text.length === TOTAL;
  // the caret sits in the run that holds the last typed character
  const caret = !done && typed > from && typed <= from + seg.text.length;
  const body =
    done && last ? (
      <>
        {seg.text.slice(0, -1)}
        <span className="hero-stop">{seg.text.slice(-1)}</span>
      </>
    ) : (
      <>
        {seg.text.slice(0, n)}
        {(caret || (typed === 0 && from === 0)) && <span className="hero-caret" />}
        {n < seg.text.length && <span className="hero-untyped">{seg.text.slice(n)}</span>}
      </>
    );
  return seg.em ? <em>{body}</em> : <>{body}</>;
}

export default function Hero() {
  const typed = useTyped();
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
        </m.p>

        <h1 aria-label={headline.statement}>
          {LINES.map((line, i) => {
            let from = LINES.slice(0, i).flat().reduce((n, x) => n + x.text.length, 0);
            return (
              <span className="line" key={i} aria-hidden="true">
                {line.map((seg, j) => {
                  const at = from;
                  from += seg.text.length;
                  return <Run key={j} seg={seg} from={at} typed={typed} />;
                })}
              </span>
            );
          })}
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
