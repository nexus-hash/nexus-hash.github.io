import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { AnimatePresence, m } from "framer-motion";
import { education, experience } from "../data/resume";
import type { ExperienceEntry, ExperienceRole } from "../data/resume";
import SectionHead from "./SectionHead";

interface Span {
  key: string;
  entry: ExperienceEntry;
  role: ExperienceRole;
  start: number;
  end: number;
  live: boolean;
}

/** "YYYY-MM" or "YYYY-MM-DD" → month index, fractional when a day is given. */
function toIdx(date: string): number {
  const [y, mo, d] = date.split("-").map(Number);
  return y * 12 + (mo - 1) + (d ? (d - 1) / 30 : 0);
}

/** Exclusive end: a bare month runs through its last day, a full date ends on that day. */
function toEnd(date: string): number {
  return date.length > 7 ? toIdx(date) : toIdx(date) + 1;
}

function duration(span: number): string {
  const months = Math.max(1, Math.round(span));
  const y = Math.floor(months / 12);
  const mo = months % 12;
  if (y && mo) return `${y}y ${mo}m`;
  if (y) return `${y}y`;
  return `${mo}m`;
}

/** Bold the numbers in a bullet so outcomes are scannable. */
function emphasise(text: string): ReactNode[] {
  return text
    .split(/(\d[\d,.]*(?:[KM]\+?|x|%|\+)?)/g)
    .map((part, i) => (i % 2 === 1 ? <strong key={i}>{part}</strong> : part));
}

/**
 * Career as a distributed-trace waterfall: one lane per company, one span per
 * role, positioned on a real time axis. Select a span (or use the index list,
 * which is also the touch/keyboard path) to read its detail.
 */
export default function Trace() {
  const { spans, rangeStart, total, ticks, nowIdx } = useMemo(() => {
    const now = new Date();
    const nowIdx = now.getFullYear() * 12 + now.getMonth();
    const spans: Span[] = experience.flatMap((entry) =>
      entry.roles.map((role, i) => ({
        key: `${entry.id}-${i}`,
        entry,
        role,
        start: toIdx(role.start),
        end: role.end ? toEnd(role.end) : nowIdx + 1,
        live: !role.end,
      }))
    );
    const rangeStart = Math.floor(Math.min(...spans.map((s) => s.start)));
    const total = nowIdx + 1 - rangeStart;
    const ticks: { label: string; left: number }[] = [];
    for (let idx = Math.ceil(rangeStart / 12) * 12; idx <= nowIdx; idx += 12) {
      ticks.push({ label: String(idx / 12), left: ((idx - rangeStart) / total) * 100 });
    }
    return { spans, rangeStart, total, ticks, nowIdx };
  }, []);

  const [selectedKey, setSelectedKey] = useState(spans[0]?.key ?? "");
  const selected = spans.find((s) => s.key === selectedKey) ?? spans[0];

  const place = (start: number, end: number) => ({
    left: `${((Math.max(start, rangeStart) - rangeStart) / total) * 100}%`,
    width: `${((end - Math.max(start, rangeStart)) / total) * 100}%`,
  });

  const laneStyle = {
    ["--year-w" as string]: `${(12 / total) * 100}%`,
    ["--year-x" as string]: `${ticks[0]?.left ?? 0}%`,
  };

  const eduStart = toIdx(education.start);
  const eduEnd = toEnd(education.end);
  const totalMonths = nowIdx + 1 - rangeStart;

  return (
    <section className="section" id="experience">
      <div className="wrap">
        <SectionHead
          index="01"
          label="Experience"
          title={
            <>
              A career, read as a <em>trace</em>.
            </>
          }
          sub="One lane per company, one span per role, on a real time axis. Pick a span to see what happened inside it."
        />

        <m.div
          className="trace"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-8% 0px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="trace-top">
            <span>
              trace <b>career</b> · {spans.length} spans<span className="trace-hide-sm"> · {experience.length} services</span>
            </span>
            <span>
              total <b>{duration(totalMonths)}</b>
            </span>
          </div>

          <div className="trace-chart">
            <div className="trace-grid">
              <div className="trace-axis trace-axis-spacer" aria-hidden="true" />
              <div className="trace-axis" aria-hidden="true">
                {ticks.map((t) => (
                  <span className="trace-tick" key={t.label} style={{ left: `${t.left}%` }}>
                    {t.label}
                  </span>
                ))}
                <span className="trace-tick is-now">now</span>
              </div>

              {experience.map((entry, row) => (
                <TraceRow key={entry.id} label={entry.company} meta={entry.dates} style={laneStyle}>
                  {spans
                    .filter((s) => s.entry.id === entry.id)
                    .map((s, i) => {
                      const pos = place(s.start, s.end);
                      const tiny = s.end - s.start < 12; // under a year: too narrow for a label
                      return (
                        <m.button
                          key={s.key}
                          type="button"
                          className={`trace-span${s.key === selected.key ? " is-selected" : ""}${
                            s.live ? " is-live" : ""
                          }${tiny ? " is-tiny" : ""}`}
                          style={pos}
                          aria-pressed={s.key === selected.key}
                          aria-label={`${s.role.title} at ${entry.company}, ${s.role.dates ?? entry.dates}`}
                          title={`${s.role.title} · ${s.role.dates ?? entry.dates}`}
                          onClick={() => setSelectedKey(s.key)}
                          initial={{ scaleX: 0, opacity: 0 }}
                          whileInView={{ scaleX: 1, opacity: 1 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.7, delay: 0.15 + row * 0.1 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                        >
                          {!tiny && s.role.title}
                        </m.button>
                      );
                    })}
                </TraceRow>
              ))}

              <TraceRow label="VIT Vellore" meta="2019 — 2023" style={laneStyle}>
                <div className="trace-span is-edu" style={place(eduStart, eduEnd)} title={`${education.degree} · ${education.dates}`}>
                  ← B.Tech, CSE
                </div>
              </TraceRow>
            </div>
          </div>

          <div className="trace-detail">
            <div className="trace-index" role="group" aria-label="Roles">
              {spans.map((s) => (
                <button
                  key={s.key}
                  type="button"
                  aria-pressed={s.key === selected.key}
                  onClick={() => setSelectedKey(s.key)}
                >
                  <span className="trace-index-title">{s.role.title}</span>
                  <span className="trace-index-co">{s.entry.company}</span>
                  <span className="trace-index-dur">{duration(s.end - s.start)}</span>
                </button>
              ))}
            </div>

            <div className="trace-panel" aria-live="polite">
              <AnimatePresence mode="wait" initial={false}>
                <m.div
                  key={selected.key}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                >
                  <p className="trace-panel-meta">
                    <span>
                      span <b>{selected.key}</b>
                    </span>
                    <span>{selected.role.dates ?? selected.entry.dates}</span>
                    <span>{duration(selected.end - selected.start)}</span>
                    {selected.live && <b>running</b>}
                  </p>
                  <h3>
                    {selected.role.title} <span>· {selected.entry.company}</span>
                  </h3>
                  <ul className="trace-stack" aria-label="Stack">
                    {selected.role.stack.split("·").map((t) => (
                      <li className="chip" key={t}>
                        {t.trim()}
                      </li>
                    ))}
                  </ul>
                  <ol className="trace-bullets">
                    {selected.role.bullets.map((b, i) => (
                      <li key={i}>{emphasise(b)}</li>
                    ))}
                  </ol>
                </m.div>
              </AnimatePresence>
            </div>
          </div>
        </m.div>
      </div>
    </section>
  );
}

function TraceRow({
  label,
  meta,
  style,
  children,
}: {
  label: string;
  meta: string;
  style: React.CSSProperties;
  children: ReactNode;
}) {
  return (
    <>
      <div className="trace-row-label">
        <strong>{label}</strong>
        <span>{meta}</span>
      </div>
      <div className="trace-lane" style={style}>
        {children}
        <div className="trace-now" aria-hidden="true" />
      </div>
    </>
  );
}
