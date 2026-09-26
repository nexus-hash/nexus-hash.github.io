import { useCallback } from "react";
import type { PointerEvent } from "react";

/**
 * Cursor-tracked border glow. Writes the pointer position (relative to the
 * element) into --mx/--my; `.glow` in index.css paints a radial highlight
 * along the border from those coords. Pure CSS otherwise, no re-renders.
 */
export function useCardGlow() {
  return useCallback((e: PointerEvent<HTMLElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    el.style.setProperty("--my", `${e.clientY - rect.top}px`);
  }, []);
}
