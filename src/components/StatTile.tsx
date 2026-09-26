import { useEffect, useRef, useState } from "react";
import { animate, useInView } from "framer-motion";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

interface Props {
  value: string;
  label: string;
}

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

export default function StatTile({ value, label }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const reducedMotion = usePrefersReducedMotion();
  // Start at the zero-formatted value so the tile doesn't flash the final
  // number before the count-up begins.
  const [display, setDisplay] = useState(() => {
    const parsed = parse(value);
    if (reducedMotion || !parsed) return value;
    return `${(0).toFixed(parsed.decimals)}${parsed.suffix}`;
  });

  useEffect(() => {
    if (!inView) return;
    const parsed = parse(value);
    if (reducedMotion || !parsed) return;
    const controls = animate(0, parsed.target, {
      duration: 1.1,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplay(`${v.toFixed(parsed.decimals)}${parsed.suffix}`),
    });
    return () => controls.stop();
  }, [inView, reducedMotion, value]);

  return (
    <div ref={ref} className="stat-tile">
      <p className="stat-tile-value">{reducedMotion || !parse(value) ? value : display}</p>
      <p className="stat-tile-label">{label}</p>
    </div>
  );
}
