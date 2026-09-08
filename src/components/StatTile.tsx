import { useEffect, useRef, useState } from "react";
import { animate, useInView } from "framer-motion";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

interface Props {
  value: string;
  label: string;
}

const NUMERIC_PREFIX = /^([\d.]+)(.*)$/;

export default function StatTile({ value, label }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const reducedMotion = usePrefersReducedMotion();
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    if (!inView) return;
    const match = value.match(NUMERIC_PREFIX);
    if (reducedMotion || !match) {
      setDisplay(value);
      return;
    }
    const [, numStr, suffix] = match;
    const target = parseFloat(numStr);
    const decimals = numStr.includes(".") ? numStr.split(".")[1].length : 0;

    const controls = animate(0, target, {
      duration: 1.1,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplay(`${v.toFixed(decimals)}${suffix}`),
    });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, reducedMotion, value]);

  return (
    <div ref={ref}>
      <p className="stat-tile-value">{display}</p>
      <p className="stat-tile-label">{label}</p>
    </div>
  );
}
