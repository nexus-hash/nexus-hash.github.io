# Soumya Ranjan Tripathy — Portfolio

Vite + React + TypeScript + Tailwind CSS v4 + Framer Motion. Static output, zero server runtime — built for GitHub Pages.

## Stack

- **Vite** — build tool, dev server
- **React 18 + TypeScript** — components in `src/components`, all content in `src/data/resume.ts`
- **Tailwind CSS v4** (via `@tailwindcss/vite`) — imported in `src/index.css`; most of the actual visual system ("systems console" theme: grid background, cursor-tracked spotlight, terminal/manifest-styled panels) is hand-authored CSS in that same file, since Tailwind's utility classes aren't a great fit for that kind of effect
- **Framer Motion** — the Experience-card expand/collapse uses its `layout` prop (FLIP-based, transform/opacity only — not a raw `height` tween), plus `whileInView` for scroll reveals
- **lucide-react** — icons (GitHub/LinkedIn/Mail/close)

## Getting started

```bash
npm install
npm run dev       # http://localhost:5173
```

```bash
npm run build      # outputs to dist/
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

Everything — company names, dates, bullets, metrics, skills, project description, education, contact links — lives in `src/data/resume.ts` as typed data. Edit that file; the components render from it, so you shouldn't need to touch JSX for routine content changes.

## Structure

```
index.html                 Vite HTML entry
src/main.tsx                React root
src/App.tsx                 Section composition
src/index.css                Tailwind import + design tokens + liquid/glass CSS
src/data/resume.ts           All content (edit this for updates)
src/hooks/                   useActiveSection (nav scroll-spy), usePrefersReducedMotion
src/components/
  GridBackground.tsx         Fixed grid + cursor-tracked spotlight + scanline + grain overlay
  Nav.tsx                    Full-width console header bar, scroll-spy, live clock, mobile menu
  LiveClock.tsx              Ticking HH:MM:SS clock used in the nav
  SectionHead.tsx            Shared "// 0N  Title" section heading used by every section below Hero
  Hero.tsx                   Boot-status eyebrow, blinking terminal cursor, count-up stat strip
  StatTile.tsx                Animates a stat's numeric prefix from 0 to its target when scrolled into view
  Experience.tsx             Manages which card is open (single-open-at-a-time), renders the pipeline rail
  ExperienceCard.tsx         Collapsed headline ⇄ expanded role detail (Framer layout animation)
  Projects.tsx                Terminal-panel project showcase
  Skills.tsx                  Config-manifest style skill list, "+N more" reveal
  Education.tsx
  Contact.tsx                 Terminal-prompt contact block with copy-to-clipboard
  Footer.tsx
```

## Notes

- All animation targets `transform`/`opacity` (or Framer's `layout`, which resolves to transform under the hood) to stay off the main-thread layout/paint path — nothing animates raw `width`/`height`/`top`/`left`.
- `backdrop-filter` glass panels have a solid-color fallback via `@supports not (...)` for browsers that don't support it.
- Respects `prefers-reduced-motion`: the mercury canvas paints a single static frame instead of animating, and all CSS transitions collapse to near-zero duration.
- On viewports ≤640px, an expanded Experience card promotes to a full-screen sheet instead of growing in place (there isn't width for the staggered layout at that size).
