import { useEffect } from "react";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

export default function GridBackground() {
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;

    let raf = 0;
    function handlePointer(e: PointerEvent) {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        document.documentElement.style.setProperty("--spot-x", `${e.clientX}px`);
        document.documentElement.style.setProperty("--spot-y", `${e.clientY}px`);
      });
    }
    window.addEventListener("pointermove", handlePointer, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", handlePointer);
    };
  }, [reducedMotion]);

  return (
    <>
      <div className="grid-bg" aria-hidden="true" />
      <div className="grid-spotlight" aria-hidden="true" style={reducedMotion ? { opacity: 0 } : undefined} />
      {!reducedMotion && <div className="grid-scanline" aria-hidden="true" />}
      <div className="grain-overlay" aria-hidden="true" />
    </>
  );
}
