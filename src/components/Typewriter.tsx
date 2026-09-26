import { useEffect, useState } from "react";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

interface Props {
  phrases: string[];
  typeMs?: number;
  deleteMs?: number;
  holdMs?: number;
}

/**
 * Cycles through `phrases` character by character. With reduced motion the
 * first phrase is shown statically. Screen readers get the full list once via
 * the visually hidden span; the animated text is aria-hidden so it doesn't
 * re-announce on every keystroke.
 */
export default function Typewriter({ phrases, typeMs = 46, deleteMs = 24, holdMs = 1700 }: Props) {
  const reducedMotion = usePrefersReducedMotion();
  const [index, setIndex] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (reducedMotion || phrases.length === 0) return;
    const target = phrases[index % phrases.length];

    let delay = deleting ? deleteMs : typeMs;
    if (!deleting && text === target) delay = holdMs;
    if (deleting && text === "") delay = 260;

    const id = setTimeout(() => {
      if (!deleting) {
        if (text === target) setDeleting(true);
        else setText(target.slice(0, text.length + 1));
      } else if (text === "") {
        setDeleting(false);
        setIndex((i) => (i + 1) % phrases.length);
      } else {
        setText(target.slice(0, text.length - 1));
      }
    }, delay);
    return () => clearTimeout(id);
  }, [text, deleting, index, phrases, reducedMotion, typeMs, deleteMs, holdMs]);

  const shown = reducedMotion ? phrases[0] ?? "" : text;
  // Keep the caret glued to the last word so it never wraps onto its own line.
  const cut = shown.lastIndexOf(" ");
  const head = cut === -1 ? "" : shown.slice(0, cut + 1);
  const tail = cut === -1 ? shown : shown.slice(cut + 1);

  return (
    <span className="typewriter">
      <span className="sr-only">{phrases.join(", ")}</span>
      <span aria-hidden="true">
        {head}
        <span className="typewriter-tail">
          {tail}
          <span className="typewriter-caret" />
        </span>
      </span>
    </span>
  );
}
