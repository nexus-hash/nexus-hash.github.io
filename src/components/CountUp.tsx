import { useEffect, useRef, useState } from "react";
import { animate, useInView } from "framer-motion";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

const NUMERIC_PREFIX = /^([\d.]+)(.*)$/;

function parse(value: string) {
  const match = value.match(NUMERIC_PREFIX);
  if (!match) return null;
  const [, numStr, suffix] = match;
  return {
    target: parseFloat(numStr),
    decimals: numStr.includes(".") ? numStr.split(".")[1].length : 0,
    suffix,
  };
}

/** Counts a value like "100M+" up from 0 when it scrolls into view. */
export default function CountUp({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const reducedMotion = usePrefersReducedMotion();
  const parsed = parse(value);
  const [display, setDisplay] = useState(() =>
    parsed ? `${(0).toFixed(parsed.decimals)}${parsed.suffix}` : value
  );

  useEffect(() => {
    if (!inView || reducedMotion) return;
    const p = parse(value);
    if (!p) return;
    const controls = animate(0, p.target, {
      duration: 1.4,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplay(`${v.toFixed(p.decimals)}${p.suffix}`),
    });
    return () => controls.stop();
  }, [inView, reducedMotion, value]);

  return (
    <span ref={ref} aria-label={value}>
      {reducedMotion || !parsed ? value : display}
    </span>
  );
}
