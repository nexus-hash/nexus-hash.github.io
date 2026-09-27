# Soumya Ranjan Tripathy — Portfolio

Vite + React + TypeScript + Tailwind CSS v4 + Framer Motion. Static output, zero server runtime — built for GitHub Pages.

**Design:** editorial "ledger" system — paper and ink with one accent, serif statements (Fraunces), sans body (Inter), mono for numbers only (JetBrains Mono). Light by default, follows the system theme, manual toggle persists. The previous dark "systems console" design is preserved on the `design/console` branch.

## Stack

- **Vite** — build tool, dev server
- **React 18 + TypeScript** — components in `src/components`, all content in `src/data/resume.ts`
- **Tailwind CSS v4** (via `@tailwindcss/vite`) — used for its reset; the design system itself (tokens, light/dark themes, every component) is hand-authored CSS in `src/index.css`
- **Framer Motion** — loaded via `LazyMotion` + `domAnimation` (no layout animations, so the small feature set is enough); `whileInView` reveals, the hero line-rise, the trace span draw-in
- **lucide-react** — icons

## Getting started

```bash
npm install
npm run dev       # http://localhost:5173
```

```bash
npm run lint       # eslint (typescript-eslint + react-hooks)
npm run build      # typechecks (tsc --noEmit) then bundles to dist/
npm run preview    # serve the production build locally to sanity-check it
```

## Deploying to GitHub Pages

`vite.config.ts` sets `base: "./"`, so the build emits relative asset paths — it works unmodified whether the repo is served at `username.github.io` (a user/org page) or `username.github.io/repo-name/` (a project page). You don't need to edit the base path either way.

**Option A — GitHub Actions (included, recommended):**
`.github/workflows/deploy.yml` installs dependencies, runs `npm run build`, and deploys `dist/` automatically on every push to `main`.
1. Push this repo to GitHub.
2. Go to **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. Push to `main` (or run the workflow manually) — it builds and deploys for you.

**Option B — manual:**
```bash
npm run build
```
Then push the contents of `dist/` to a `gh-pages` branch (or the branch/folder you've configured under Settings → Pages → Deploy from a branch).

## Editing content

Everything — company names, dates, bullets, metrics, skills, projects, education, contact links — lives in `src/data/resume.ts` as typed data. Edit that file; the components render from it, so you shouldn't need to touch JSX for routine content changes.

- **Projects** are an array (`projects`). Each entry can carry a `live` URL, a `repo` URL and an `image` (a file in `public/`, shown as a framed screenshot).
- **Open source** rows are `openSource` — static data, no GitHub API calls at runtime. Update `status`/`diff` when a PR lands.
- **Hero**: `headline` holds the role, lede and availability. The big statement's line breaks and italic words are set by hand in `Hero.tsx` (`LINES`) — keep `headline.statement` in sync, it is the accessible label.
- **Ledger** rows are `ledger`; **flow diagram** stages are `flowStages`.
- **Trace**: every role needs `start` (and `end` unless current) as `"YYYY-MM"` — that positions its span on the time axis.
- **Local time** in the contact section uses `contact.timezone` (IANA name + short label) — change it if you move.
- **Social previews**: `public/og.png` (1200×630) is what LinkedIn/Slack/X show when the link is shared. Regenerate it if the headline changes. The Open Graph / Twitter / JSON-LD tags live in `index.html`.

## Structure

```
index.html                 Vite HTML entry: meta/OG/JSON-LD + pre-paint theme script
src/main.tsx                React root (LazyMotion)
src/App.tsx                 Section composition, palette + theme state
src/index.css                Design tokens (light/dark) + all component styles
src/data/resume.ts           All content (edit this for updates)
src/hooks/                   useActiveSection, usePrefersReducedMotion, useIsMac, useTheme
src/components/
  TopBar.tsx                 Name, section links with scroll-spy, ⌘K button, theme toggle, mobile menu
  Hero.tsx                   Statement headline (line-by-line rise), lede, links; hosts Flow + Ledger
  Flow.tsx                   "fig. 1": payment events travelling merchants → gateway → Kafka → settlement,
                             with the AI-triage tap. Horizontal on desktop, vertical on phones
  Ledger.tsx                 Headline outcomes as ruled ledger lines (amount · entry · source)
  CountUp.tsx                Counts a value like "100M+" up from 0 when scrolled into view
  Trace.tsx                  Career as a distributed-trace waterfall: lane per company, span per role,
                             real time axis; role index + detail panel
  Projects.tsx                Full-width project feature with screenshot + live/source links
  OpenSource.tsx              Ledger table of upstream contributions (status, diffstat, linked issue)
  Skills.tsx                  Manifest: daily-driver stack in display type, the rest as chips
  Contact.tsx                 Closing statement, email + copy, education, links, local time
  CommandPalette.tsx         ⌘K / Ctrl+K: jump to sections, open links, copy email, toggle theme
  SectionHead.tsx            Shared "0N / Label + serif title" heading
  Footer.tsx
```

## Notes

- Animation targets `transform`/`opacity` only.
- Fonts are self-hosted via `@fontsource-variable` (imported in `src/index.css`) — no third-party font request.
- Use `m.div`, not `motion.div`, in new components — `LazyMotion` is in strict mode and will throw otherwise.
- Theme: CSS follows `prefers-color-scheme` unless `<html data-theme>` is set; the toggle writes that attribute and `localStorage.theme`.
- Respects `prefers-reduced-motion`: the flow dots are not rendered, count-ups show their final value, and CSS transitions collapse to near-zero.
