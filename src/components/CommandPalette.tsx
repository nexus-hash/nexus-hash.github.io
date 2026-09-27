import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import {
  ArrowUp,
  Briefcase,
  Check,
  Copy,
  ExternalLink,
  FolderGit2,
  GitPullRequest,
  Github,
  GraduationCap,
  Linkedin,
  Mail,
  Search,
  Wrench,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { contact, projects } from "../data/resume";

interface Command {
  id: string;
  label: string;
  hint: string;
  group: "navigate" | "links" | "actions";
  icon: LucideIcon;
  run: () => void;
  keywords?: string;
}

interface Props {
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
}

function jump(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
  history.replaceState(null, "", `#${id}`);
}

function openExternal(url: string) {
  window.open(url, "_blank", "noopener,noreferrer");
}

/**
 * ⌘K / Ctrl+K command palette: jump to sections, open links, copy email.
 * Keyboard: ↑↓ move, Enter run, Esc close. Focus returns to whatever opened it.
 */
export default function CommandPalette({ open, onOpen, onClose }: Props) {
  // Global shortcut.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (open) onClose();
        else onOpen();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onOpen, onClose]);

  return <AnimatePresence>{open && <PaletteDialog onClose={onClose} />}</AnimatePresence>;
}

/** Mounted fresh on every open, so query/cursor state always starts clean. */
function PaletteDialog({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);

  const commands = useMemo<Command[]>(() => {
    const projectLinks: Command[] = projects
      .filter((p) => p.live)
      .map((p) => ({
        id: `open-${p.id}`,
        label: `Open ${p.name}`,
        hint: p.live!.replace(/^https?:\/\//, ""),
        group: "links",
        icon: ExternalLink,
        run: () => openExternal(p.live!),
        keywords: "project live demo",
      }));
    return [
      { id: "top", label: "Back to top", hint: "#top", group: "navigate", icon: ArrowUp, run: () => jump("top") },
      { id: "experience", label: "Experience", hint: "// 01", group: "navigate", icon: Briefcase, run: () => jump("experience"), keywords: "work visa jobs" },
      { id: "projects", label: "Projects", hint: "// 02", group: "navigate", icon: FolderGit2, run: () => jump("projects") },
      { id: "open-source", label: "Open source", hint: "// 03", group: "navigate", icon: GitPullRequest, run: () => jump("open-source"), keywords: "oss contributions pull requests jupyterlab p5" },
      { id: "skills", label: "Skills", hint: "// 04", group: "navigate", icon: Wrench, run: () => jump("skills"), keywords: "stack tools" },
      { id: "education", label: "Education", hint: "// 05", group: "navigate", icon: GraduationCap, run: () => jump("education"), keywords: "college university vit" },
      { id: "contact", label: "Contact", hint: "// 06", group: "navigate", icon: Mail, run: () => jump("contact"), keywords: "email talk" },
      { id: "github", label: "GitHub", hint: contact.github.replace(/^https?:\/\//, ""), group: "links", icon: Github, run: () => openExternal(contact.github) },
      { id: "linkedin", label: "LinkedIn", hint: contact.linkedin.replace(/^https?:\/\//, ""), group: "links", icon: Linkedin, run: () => openExternal(contact.linkedin) },
      ...projectLinks,
      { id: "email", label: "Send email", hint: contact.email, group: "actions", icon: Mail, run: () => { window.location.href = `mailto:${contact.email}`; } },
      {
        id: "copy-email",
        label: "Copy email address",
        hint: copied ? "copied ✓" : contact.email,
        group: "actions",
        icon: copied ? Check : Copy,
        run: () => {
          navigator.clipboard?.writeText(contact.email).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          });
        },
        keywords: "clipboard",
      },
    ];
  }, [copied]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter((c) => `${c.label} ${c.hint} ${c.keywords ?? ""}`.toLowerCase().includes(q));
  }, [commands, query]);

  // Mount: remember focus, lock scroll, focus input. Unmount: restore.
  useEffect(() => {
    restoreFocusRef.current = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const id = requestAnimationFrame(() => inputRef.current?.focus());
    return () => {
      cancelAnimationFrame(id);
      document.body.style.overflow = prevOverflow;
      restoreFocusRef.current?.focus?.();
    };
  }, []);

  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>(`[data-index="${cursor}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [cursor]);

  function runAt(i: number) {
    const cmd = filtered[i];
    if (!cmd) return;
    cmd.run();
    if (cmd.id !== "copy-email") onClose();
  }

  function onInputKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setCursor((c) => (filtered.length ? (c + 1) % filtered.length : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setCursor((c) => (filtered.length ? (c - 1 + filtered.length) % filtered.length : 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      runAt(cursor);
    } else if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    }
  }

  const groups: { key: Command["group"]; label: string }[] = [
    { key: "navigate", label: "navigate" },
    { key: "links", label: "links" },
    { key: "actions", label: "actions" },
  ];

  let runningIndex = -1;

  return (
        <m.div
          className="palette-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onPointerDown={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <m.div
            className="palette"
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="palette-input-row">
              <Search size={15} aria-hidden="true" />
              <input
                ref={inputRef}
                className="palette-input"
                placeholder="type a command or search…"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setCursor(0);
                }}
                onKeyDown={onInputKey}
                role="combobox"
                aria-expanded="true"
                aria-controls="palette-list"
                aria-activedescendant={filtered[cursor] ? `palette-opt-${filtered[cursor].id}` : undefined}
                autoComplete="off"
                spellCheck={false}
              />
              <kbd className="palette-esc">esc</kbd>
            </div>

            <ul className="palette-list" id="palette-list" role="listbox" ref={listRef}>
              {filtered.length === 0 && <li className="palette-empty">no matches for “{query}”</li>}
              {groups.map((g) => {
                const items = filtered.filter((c) => c.group === g.key);
                if (items.length === 0) return null;
                return (
                  <li key={g.key} className="palette-group">
                    <p className="palette-group-label">{`// ${g.label}`}</p>
                    <ul role="group" aria-label={g.label}>
                      {items.map((cmd) => {
                        runningIndex += 1;
                        const i = runningIndex;
                        const Icon = cmd.icon;
                        return (
                          <li
                            key={cmd.id}
                            id={`palette-opt-${cmd.id}`}
                            role="option"
                            aria-selected={i === cursor}
                            data-index={i}
                            className={`palette-item${i === cursor ? " is-active" : ""}`}
                            onPointerMove={() => setCursor(i)}
                            onClick={() => runAt(i)}
                          >
                            <Icon size={15} aria-hidden="true" />
                            <span className="palette-item-label">{cmd.label}</span>
                            <span className="palette-item-hint">{cmd.hint}</span>
                          </li>
                        );
                      })}
                    </ul>
                  </li>
                );
              })}
            </ul>

            <div className="palette-foot">
              <span>
                <kbd>↑</kbd>
                <kbd>↓</kbd> move
              </span>
              <span>
                <kbd>↵</kbd> run
              </span>
              <span>
                <kbd>esc</kbd> close
              </span>
            </div>
          </m.div>
        </m.div>
  );
}
