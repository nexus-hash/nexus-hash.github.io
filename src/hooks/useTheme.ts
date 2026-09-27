import { useCallback, useState } from "react";

export type Theme = "light" | "dark";
const KEY = "theme";

function current(): Theme {
  if (typeof document === "undefined") return "light";
  const set = document.documentElement.dataset.theme;
  if (set === "light" || set === "dark") return set;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

/**
 * Light/dark theme. Defaults to the system preference; a manual choice is
 * stored and applied as data-theme on <html> (index.html applies the stored
 * value before first paint so there is no flash).
 */
export function useTheme(): [Theme, () => void] {
  const [theme, setTheme] = useState<Theme>(current);

  const toggle = useCallback(() => {
    const next: Theme = current() === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", next === "dark" ? "#0f0f0d" : "#f5f2ea");
    try {
      localStorage.setItem(KEY, next);
    } catch {
      // storage unavailable — the choice just won't persist
    }
    setTheme(next);
  }, []);

  return [theme, toggle];
}
