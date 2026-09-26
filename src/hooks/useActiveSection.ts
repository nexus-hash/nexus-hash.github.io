import { useEffect, useState } from "react";

/**
 * Returns the id of the section currently "in focus": the last section whose
 * top has scrolled past 40% of the viewport. Returns "" while above the first
 * section (the hero) so nothing is highlighted there, and snaps to the last
 * id when the page is scrolled to the bottom so short trailing sections
 * (Contact) still light up.
 */
export function useActiveSection(ids: string[]): string {
  const [active, setActive] = useState("");

  useEffect(() => {
    let raf = 0;

    function measure() {
      raf = 0;
      const threshold = window.innerHeight * 0.4;
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
      let current = "";
      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= threshold) current = id;
      }
      if (atBottom && ids.length) current = ids[ids.length - 1];
      setActive((prev) => (prev === current ? prev : current));
    }

    function schedule() {
      if (!raf) raf = requestAnimationFrame(measure);
    }

    measure();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [ids]);

  return active;
}
