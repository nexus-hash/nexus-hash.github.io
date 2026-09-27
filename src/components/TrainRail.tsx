import { useEffect, useRef, useState } from "react";
import { trainStops } from "../data/resume";

/*
 * The train rail: a fixed maglev guideway down the right edge with a white
 * bullet train seen from above, nose pointing up, with a second engine closing
 * the far end, its headlights off. The track never moves.
 * Scrolling down drives the train up the track, one car per section; the car
 * level with the projection line lights a side window and projects onto its
 * section. Two rays leave the window, pass through the section's top-right
 * and bottom-right corners, and carry on across the page, fading to the left.
 * The light stays pinned to those corners, so part of it is off screen when a
 * corner is. It is painted behind the page content: titles sit in the light,
 * while tables and panels are solid and cover it. Dust drifts inside the beam.
 *
 * Every section after the first is dark until its light is on. When the light
 * strikes, the section flickers into view; when it cuts out, the section
 * flickers away. That is decided by which window is lit, not by how much of
 * the section the beam happens to cover.
 *
 * All geometry below is in "train units"; one car is 64 units wide.
 */
const W = 64; // car width
const L = 260; // coach length
const G = 8; // gangway between cars
const PITCH = L + G;
const EN = 332; // engine length, nose tip to rear
const WIN = 130; // window centre, measured from the rear end of a car
const WINH = 26; // height of the projecting window
const PADX = 40; // room either side for glow and shadow
const AHEAD = 250; // room ahead of the nose for the headlight beam
const BREATHE = 36; // px of clear space between plain content and the light
const MOTES = 70; // dust particles in the first page's beam

/** The current projection, in viewport px: window, section edge, and how far left the light carries. */
interface Projection {
  faceX: number;
  wy: number;
  half: number;
  sx: number;
  top: number;
  bottom: number;
  left: number;
  strength: number;
}

const N = trainStops.length;
// an engine at each end: the last car is a second engine, facing the other way
const LENGTH = EN + (N - 1) * PITCH + (EN - L);
const VIEW = { x: -PADX, y: -AHEAD, w: W + PADX * 2, h: AHEAD + LENGTH + 30 };

/** Top edge (front) of car i. The engine is car 0 with its nose at y = 0. */
const carTop = (i: number) => (i === 0 ? 0 : EN + G + (i - 1) * PITCH);
/** Centre of the projecting window of car i. */
const windowY = (i: number) => EN - WIN + i * PITCH;

const NOSE = `M26 6 Q32 -2 38 6 C52 28 64 70 64 118 V${EN - 5} Q64 ${EN} 59 ${EN} H5 Q0 ${EN} 0 ${EN - 5} V118 C0 70 12 28 26 6 Z`;

/** Rooftop air conditioning: a housing with two fan grilles. */
function RoofUnit({ y }: { y: number }) {
  return (
    <g>
      <rect x="18" y={y} width="28" height="48" rx="3" fill="#D3D0C6" stroke="#000" strokeOpacity="0.22" strokeWidth="0.6" />
      <rect x="20.5" y={y + 2.5} width="23" height="43" rx="2" fill="#BFBCB2" />
      {[13, 35].map((dy) => (
        <g key={dy} transform={`translate(32 ${y + dy})`}>
          <circle r="8" fill="#8E8B83" />
          <circle r="6.6" fill="#4B4A45" />
          <path d="M-6.6 0 H6.6 M0 -6.6 V6.6 M-4.7 -4.7 L4.7 4.7 M-4.7 4.7 L4.7 -4.7" stroke="#8E8B83" strokeWidth="0.7" />
          <circle r="1.7" fill="#A9A69D" />
        </g>
      ))}
      <path d={`M20.5 ${y + 24} H43.5`} stroke="#000" strokeOpacity="0.2" strokeWidth="0.6" />
    </g>
  );
}

/** The current collector: base frame on insulators, folding arm, and a twin-strip head. */
function Pantograph({ y }: { y: number }) {
  return (
    <g>
      <rect x="21" y={y} width="22" height="58" rx="2" fill="#000" fillOpacity="0.08" stroke="#4A4944" strokeWidth="1.1" />
      {[
        [21, y],
        [43, y],
        [21, y + 58],
        [43, y + 58],
      ].map(([cx, cy]) => (
        <g key={`${cx}-${cy}`}>
          <circle cx={cx} cy={cy} r="2.8" fill="#77756E" />
          <circle cx={cx} cy={cy} r="1.3" fill="#B5B2A9" />
        </g>
      ))}
      <path d={`M32 ${y + 54} V${y + 16}`} stroke="#2E2E2B" strokeWidth="2.6" strokeLinecap="round" />
      <path d={`M32 ${y + 16} L27 ${y + 36} M32 ${y + 16} L37 ${y + 36}`} stroke="#3B3B37" strokeWidth="1.4" />
      <circle cx="32" cy={y + 16} r="2.2" fill="#5A5953" />
      {/* collector head, with down-turned horns at each end */}
      <path d={`M5 ${y + 35} Q7 ${y + 33} 10 ${y + 33} H54 Q57 ${y + 33} 59 ${y + 35}`} stroke="#1D1D1B" strokeWidth="1.7" fill="none" />
      <path d={`M5 ${y + 41} Q7 ${y + 39} 10 ${y + 39} H54 Q57 ${y + 39} 59 ${y + 41}`} stroke="#1D1D1B" strokeWidth="1.7" fill="none" />
      <path d={`M27 ${y + 33} V${y + 39} M37 ${y + 33} V${y + 39}`} stroke="#3B3B37" strokeWidth="1.2" />
    </g>
  );
}

/** Tinted window bands along both flanks, seen from a steep angle, with pillars. */
function SideGlass({ from, to }: { from: number; to: number }) {
  const pillars: number[] = [];
  for (let y = from + 22; y < to - 8; y += 22) pillars.push(y);
  return (
    <>
      {[1, W - 4.8].map((x) => (
        <g key={x}>
          <rect x={x} y={from} width="3.8" height={to - from} rx="1.2" fill="url(#rail-glassfill)" />
          {pillars.map((y) => (
            <rect key={y} x={x} y={y} width="3.8" height="1.6" fill="#C9C6BC" />
          ))}
        </g>
      ))}
    </>
  );
}

/** Roof details every car shares: seams between panels, the rain gutters, and the roof line cable. */
function RoofLines({ from, to }: { from: number; to: number }) {
  const seams: number[] = [];
  for (let y = from + 40; y < to - 10; y += 44) seams.push(y);
  return (
    <g fill="none">
      {seams.map((y) => (
        <path key={y} d={`M6 ${y} H${W - 6}`} stroke="#000" strokeOpacity="0.09" strokeWidth="0.7" />
      ))}
      <path d={`M7.2 ${from} V${to} M${W - 7.2} ${from} V${to}`} stroke="#000" strokeOpacity="0.16" strokeWidth="0.7" />
      <path d={`M15 ${from} V${to}`} stroke="#6A6861" strokeWidth="1.1" />
      {seams.map((y) => (
        <circle key={y} cx="15" cy={y - 22} r="1.6" fill="#8E8B83" stroke="#000" strokeOpacity="0.3" strokeWidth="0.4" />
      ))}
    </g>
  );
}

/** Doors at both ends of a car: a dark leaf in the flank and a threshold seam across the roof edge. */
function Doors({ at }: { at: number[] }) {
  return (
    <>
      {at.map((y) => (
        <g key={y}>
          <rect x="0.6" y={y} width="4.4" height="17" rx="1" fill="#2B2B28" />
          <rect x={W - 5} y={y} width="4.4" height="17" rx="1" fill="#2B2B28" />
          <path d={`M0.6 ${y + 8.5} H5 M${W - 5} ${y + 8.5} H${W - 0.6}`} stroke="#8E8B83" strokeWidth="0.5" />
        </g>
      ))}
    </>
  );
}

/** The ribbed bellows between two cars. */
function Gangway() {
  return (
    <g>
      <rect x="13" y={-G - 1} width={W - 26} height={G + 2} fill="#1B1B19" />
      <path d={`M13 ${-G + 1.5} H${W - 13} M13 ${-G / 2} H${W - 13} M13 ${-1.5} H${W - 13}`} stroke="#3A3A36" strokeWidth="0.8" />
    </g>
  );
}

/** A driving car, nose at y = 0. Drawn once and flipped for the rear of the train. */
function Cab({ lamps }: { lamps: boolean }) {
  return (
    <>
      <path d={NOSE} fill="url(#rail-roof)" />
      {/* the nose falls away from the roof line towards the tip and the flanks */}
      <path d={NOSE} fill="url(#rail-nose)" />
      <RoofLines from={150} to={EN - 4} />
      <SideGlass from={150} to={EN - 34} />
      <Doors at={[128, EN - 28]} />
      <path className="rail-stripe" d={`M8.6 ${EN} V118 C9 72 20 36 31 12 M${W - 8.6} ${EN} V118 C${W - 9} 72 44 36 33 12`} />
      {/* windscreen: one curved pane, with the sky reflected across it */}
      <path d="M9 98 C11 64 21 40 32 30 C43 40 53 64 55 98 C50 108 14 108 9 98 Z" fill="#CFCCC2" />
      <path d="M11 96 C13 65 22 43 32 33 C42 43 51 65 53 96 C49 105 15 105 11 96 Z" fill="url(#rail-screen)" />
      <path d="M17 88 C19 66 25 50 31 42 C27 56 25 72 25 92 Z" fill="#fff" fillOpacity="0.1" />
      <path d="M16 96 C24 101 40 101 48 96" stroke="#fff" strokeOpacity="0.22" strokeWidth="1.2" fill="none" />
      <path d="M32 33 V26" stroke="#000" strokeOpacity="0.18" strokeWidth="0.7" />
      {/* coupler hatch in the nose tip */}
      <path d="M27.5 9 Q32 3 36.5 9 Q32 12 27.5 9 Z" fill="none" stroke="#000" strokeOpacity="0.28" strokeWidth="0.6" />
      {/* headlamp clusters */}
      {[
        [23.2, 21, 24],
        [40.8, 21, -24],
      ].map(([cx, cy, r]) => (
        <g key={cx} transform={`translate(${cx} ${cy}) rotate(${r})`}>
          <ellipse rx="2.5" ry="5.2" fill="#1F1F1D" />
          <ellipse className={lamps ? "rail-lamp-on" : "rail-lamp-off"} rx="1.5" ry="3.9" />
        </g>
      ))}
      {/* cab roof: antenna fairing and the driver's hatch */}
      <rect x="28" y="112" width="8" height="14" rx="3" fill="#D3D0C6" stroke="#000" strokeOpacity="0.22" strokeWidth="0.6" />
      <path d="M6 118 H58" stroke="#000" strokeOpacity="0.1" strokeWidth="0.7" />
      <RoofUnit y={EN - 84} />
    </>
  );
}

export default function TrainRail() {
  const dockRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const trainRef = useRef<SVGSVGElement>(null);
  const showRef = useRef<SVGSVGElement>(null);
  const coneRef = useRef<SVGPolygonElement>(null);
  const fadeRef = useRef<SVGLinearGradientElement>(null);
  const tipRef = useRef<SVGPolygonElement>(null);
  const tipFadeRef = useRef<SVGLinearGradientElement>(null);
  const washRef = useRef<SVGPolygonElement>(null);
  const washFadeRef = useRef<SVGLinearGradientElement>(null);
  const washMidRef = useRef<SVGStopElement>(null);
  const motesRef = useRef<HTMLCanvasElement>(null);
  const grainRef = useRef<HTMLDivElement>(null);
  const patternRef = useRef<SVGPatternElement>(null);
  const [near, setNear] = useState(0);
  const nearRef = useRef(0);

  useEffect(() => {
    const dock = dockRef.current;
    const track = trackRef.current;
    const train = trainRef.current;
    const show = showRef.current;
    const cone = coneRef.current;
    const fade = fadeRef.current;
    const tip = tipRef.current;
    const tipFade = tipFadeRef.current;
    const wash = washRef.current;
    const washFade = washFadeRef.current;
    const washMid = washMidRef.current;
    const canvas = motesRef.current;
    if (!dock || !track || !train || !show || !cone || !fade || !tip || !tipFade || !wash || !washFade || !washMid || !canvas)
      return;
    const ctx = canvas.getContext("2d");
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Dust drifts only inside the beam, on every page.
    let proj: Projection | null = null;
    let dustRaf = 0;
    const dust = Array.from({ length: MOTES }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: 0.5 + Math.random() * 1.4,
      vx: -0.00012 - Math.random() * 0.00022,
      vy: (Math.random() - 0.5) * 0.00016,
      tw: Math.random() * Math.PI * 2,
    }));

    function drawDust() {
      dustRaf = 0;
      if (!ctx) return;
      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);
      if (w < 720) return; // the train and its dust are hidden on small screens
      const p = proj;
      if (!p) return;
      const left = p.left;
      const right = p.faceX;
      const span = Math.max(1, right - left);
      for (const d of dust) {
        d.x += d.vx;
        d.y += d.vy;
        d.tw += 0.02;
        if (d.x < 0) d.x += 1;
        if (d.y < 0) d.y += 1;
        if (d.y > 1) d.y -= 1;
        const x = left + d.x * span;
        const y = d.y * h;
        const near = 1 - (right - x) / span; // brighter towards the train
        const twinkle = 0.55 + 0.45 * Math.sin(d.tw);
        // inside the beam? the two rays leave the window and pass through the section's corners
        const t = (p.faceX - x) / (p.faceX - p.sx);
        const upper = p.wy - p.half + (p.top - (p.wy - p.half)) * t;
        const lower = p.wy + p.half + (p.bottom - (p.wy + p.half)) * t;
        if (y < upper || y > lower) continue;
        const alpha = p.strength * (0.12 + near * 0.6) * twinkle;
        ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
        ctx.beginPath();
        ctx.arc(x, y, d.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      dustRaf = requestAnimationFrame(drawDust);
    }

    // Sections after the first start dark and wait for their light.
    const rooms = trainStops.map((s, i) => (i === 0 ? null : document.getElementById(s.id)));
    for (const room of rooms) room?.setAttribute("data-lamp", "dark");
    let lit = 0;
    const strikeEnd = (e: Event) => (e.currentTarget as Element).classList.remove("is-striking");
    show.addEventListener("animationend", strikeEnd);
    tip.addEventListener("animationend", strikeEnd);

    /** Move the light from one section to another, flickering both. */
    function relight(to: number) {
      rooms[lit]?.setAttribute("data-lamp", "off");
      rooms[to]?.setAttribute("data-lamp", "on");
      lit = to;
      if (calm) return;
      for (const el of [show!, tip!]) {
        el.classList.remove("is-striking");
        void el.getBoundingClientRect(); // restart the animation
        el.classList.add("is-striking");
      }
    }

    let k = 1; // px per train unit
    let line = 0; // projection line, px from the top of the dock
    let dockTop = 0; // top of the dock in the viewport
    let trackLeft = 0; // left of the guideway in the viewport
    let faceX = 0; // x of the train's left face in the viewport
    let screens: { el: Element; inset: number }[] = [];
    let raf = 0;

    /** Fractional car index level with the projection line, from the scroll position. */
    function position(): number {
      const at = window.scrollY + window.innerHeight * 0.5;
      const tops = trainStops.map((s) => {
        const el = document.getElementById(s.id);
        return el ? el.getBoundingClientRect().top + window.scrollY : 0;
      });
      const end = document.documentElement.scrollHeight;
      let i = 0;
      for (let j = 0; j < tops.length; j++) if (at >= tops[j]) i = j;
      const height = (i + 1 < tops.length ? tops[i + 1] : end) - tops[i];
      // car i is level with the line when the reader is halfway through section i
      const pos = i + (at - tops[i]) / Math.max(1, height) - 0.5;
      return Math.min(N - 1, Math.max(0, pos));
    }

    function frame() {
      raf = 0;
      const pos = position();
      const active = Math.round(pos);
      // scrolling down raises pos, which pulls the train up the track
      train!.style.transform = `translate3d(0, ${line - (windowY(0) + pos * PITCH - VIEW.y) * k}px, 0)`;

      // The show: from the lit window to the two right-hand corners of its section.
      // Always pinned to the real corners, on screen or not.
      const wy = dockTop + line + (active - pos) * PITCH * k; // where the active window is right now
      const half = (WINH * k) / 2;
      const target = screens[active];
      let visible = false;
      if (target) {
        const r = target.el.getBoundingClientRect();
        const sx = r.right - target.inset; // tucked just under the section's edge
        if (r.height > 0 && faceX - sx > 8) {
          visible = true;
          const pts = (dx: number, dy: number) =>
            `${sx - dx},${r.top - dy} ${faceX - dx},${wy - half - dy} ${faceX - dx},${wy + half - dy} ${sx - dx},${r.bottom - dy}`;
          cone!.setAttribute("points", pts(0, 0));
          fade!.setAttribute("x1", String(sx));
          fade!.setAttribute("x2", String(faceX));
          // the last stretch, over the guideway, is drawn above the track only
          tip!.setAttribute("points", pts(trackLeft, dockTop));
          tipFade!.setAttribute("x1", String(sx - trackLeft));
          tipFade!.setAttribute("x2", String(faceX - trackLeft));
        }
      }
      const focus = Math.max(0.25, 1 - Math.abs(pos - active) * 1.5);

      // Carry the two rays on across the page and let the light fade out.
      let next: Projection | null = null;
      if (visible && target) {
        const r = target.el.getBoundingClientRect();
        const sx = r.right - target.inset;
        const left = 0; // the light runs to the edge of the screen, so it has no left-hand edge
        const t = (faceX - left) / (faceX - sx);
        const upper = wy - half + (r.top - (wy - half)) * t;
        const lower = wy + half + (r.bottom - (wy + half)) * t;
        // one shape from the window to the far left, so there is no seam at the content edge
        wash!.setAttribute("points", `${faceX},${wy - half} ${left},${upper} ${left},${lower} ${faceX},${wy + half}`);
        washFade!.setAttribute("x1", String(left));
        washFade!.setAttribute("x2", String(faceX));
        washMid!.setAttribute("offset", String((sx - left) / (faceX - left)));
        next = { faceX, wy, half, sx, top: r.top, bottom: r.bottom, left, strength: focus };
      }
      wash!.style.opacity = next ? "1" : "0";
      cone!.style.opacity = next ? "0" : "1";
      show!.classList.toggle("is-projecting", Boolean(next));
      grainRef.current?.classList.toggle("is-on", Boolean(next));
      proj = next;
      if (!calm && !dustRaf) dustRaf = requestAnimationFrame(drawDust);
      show!.style.opacity = visible ? String(focus) : "0";
      tip!.style.opacity = visible ? String(focus) : "0";

      if (active !== lit) relight(active);
      if (active !== nearRef.current) {
        nearRef.current = active;
        setNear(active);
      }
    }

    function measure() {
      const trackW = track!.getBoundingClientRect().width;
      const carW = trackW / 1.5;
      k = carW / W;
      const d = dock!.getBoundingClientRect();
      line = d.height * 0.5;
      dockTop = d.top;
      trackLeft = d.right - trackW;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas!.width = window.innerWidth * dpr;
      canvas!.height = window.innerHeight * dpr;
      if (ctx) {
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.fillStyle = "#dfe4ff";
      }
      faceX = d.right - (trackW / 2 + (W / 2) * k) + 1.5 * k;
      screens = trainStops.map((s) => {
        const el = document.querySelector(s.screen) ?? document.getElementById(s.id) ?? document.body;
        const cs = getComputedStyle(el);
        const box = s.tuck ? document.querySelector(s.tuck) : null;
        const radius = box ? parseFloat(getComputedStyle(box).borderTopRightRadius) || 0 : 0;
        // Rounded boxes: slide under the corner. Plain content: start the light a
        // little to the right of it, so text never touches the edge of the light.
        return { el, inset: (parseFloat(cs.paddingRight) || 0) + (radius ? radius + 4 : -BREATHE) };
      });
      train!.style.width = `${VIEW.w * k}px`;
      train!.style.height = `${VIEW.h * k}px`;
      train!.style.right = `${trackW / 2 - (PADX + W / 2) * k}px`;
      patternRef.current?.setAttribute("patternTransform", `scale(${k})`);
      frame();
    }

    function ask() {
      if (!raf) raf = requestAnimationFrame(frame);
    }

    measure();
    window.addEventListener("scroll", ask, { passive: true });
    window.addEventListener("resize", measure);
    // section heights settle after fonts and images load
    const settle = window.setTimeout(measure, 600);
    window.addEventListener("load", measure);
    return () => {
      cancelAnimationFrame(raf);
      cancelAnimationFrame(dustRaf);
      for (const room of rooms) room?.removeAttribute("data-lamp");
      show.removeEventListener("animationend", strikeEnd);
      tip.removeEventListener("animationend", strikeEnd);
      window.clearTimeout(settle);
      window.removeEventListener("scroll", ask);
      window.removeEventListener("resize", measure);
      window.removeEventListener("load", measure);
    };
  }, []);

  function go(i: number) {
    const el = document.getElementById(trainStops[i].id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <>
    <svg className="rail-show" ref={showRef} aria-hidden="true">
      <defs>
        <linearGradient id="rail-fade" ref={fadeRef} gradientUnits="userSpaceOnUse" y1="0" y2="0">
          <stop offset="0" className="rail-fade-0" />
          <stop offset="1" className="rail-fade-1" />
        </linearGradient>
      </defs>
      <defs>
        <linearGradient id="rail-wash-fade" ref={washFadeRef} gradientUnits="userSpaceOnUse" y1="0" y2="0">
          <stop offset="0" className="rail-wash-0" />
          <stop offset="0.8" ref={washMidRef} className="rail-fade-0" />
          <stop offset="1" className="rail-fade-1" />
        </linearGradient>
      </defs>
      <polygon ref={washRef} className="rail-wash" fill="url(#rail-wash-fade)" />
      <polygon ref={coneRef} className="rail-cone" fill="url(#rail-fade)" />
    </svg>
    <div className="rail-grain" ref={grainRef} aria-hidden="true" />
    <canvas className="rail-motes" ref={motesRef} aria-hidden="true" />
    <aside className="rail" ref={dockRef} aria-hidden="true">
      {/* The guideway. Static: it never moves with the page. */}
      <div className="rail-track" ref={trackRef}>
        <svg width="100%" height="100%" preserveAspectRatio="none">
          <defs>
            <pattern id="guideway" ref={patternRef} width="96" height="120" patternUnits="userSpaceOnUse">
              <rect width="96" height="120" className="gw-slab" />
              <rect x="0" y="0" width="9" height="120" className="gw-channel" />
              <rect x="87" y="0" width="9" height="120" className="gw-channel" />
              <rect x="40" y="0" width="16" height="120" className="gw-motor" />
              <path d="M14 0 V120 M82 0 V120" className="gw-inner" />
              <path d="M9 0 H87" className="gw-tie" />
              <path d="M9 60 H40 M56 60 H87" className="gw-tie gw-tie-half" />
              <path d="M43 102 L48 95 L53 102" className="gw-chev gw-chev-1" />
              <path d="M43 62 L48 55 L53 62" className="gw-chev gw-chev-2" />
              <path d="M43 22 L48 15 L53 22" className="gw-chev gw-chev-3" />
              <rect x="2.5" y="-2" width="4" height="4" className="gw-node" />
              <rect x="89.5" y="-2" width="4" height="4" className="gw-node" />
              <rect x="2.5" y="118" width="4" height="4" className="gw-node" />
              <rect x="89.5" y="118" width="4" height="4" className="gw-node" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#guideway)" />
        </svg>
        <div className="rail-guide rail-guide-l" />
        <div className="rail-guide rail-guide-r" />
      </div>

      <svg className="rail-tip" aria-hidden="true">
        <defs>
          <linearGradient id="rail-tip-fade" ref={tipFadeRef} gradientUnits="userSpaceOnUse" y1="0" y2="0">
            <stop offset="0" className="rail-fade-0" />
            <stop offset="1" className="rail-fade-1" />
          </linearGradient>
        </defs>
        <polygon ref={tipRef} className="rail-cone" fill="url(#rail-tip-fade)" />
      </svg>

      <svg
        className="rail-train"
        ref={trainRef}
        viewBox={`${VIEW.x} ${VIEW.y} ${VIEW.w} ${VIEW.h}`}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="rail-roof" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#8F8C84" />
            <stop offset="0.09" stopColor="#CFCBC1" />
            <stop offset="0.3" stopColor="#F6F4EE" />
            <stop offset="0.46" stopColor="#FFFFFF" />
            <stop offset="0.72" stopColor="#EFECE4" />
            <stop offset="0.92" stopColor="#C2BEB4" />
            <stop offset="1" stopColor="#85827A" />
          </linearGradient>
          <linearGradient id="rail-screen" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0" stopColor="#34342F" />
            <stop offset="1" stopColor="#0C0C0B" />
          </linearGradient>
          <linearGradient id="rail-glassfill" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#0B0C10" />
            <stop offset="1" stopColor="#262A38" />
          </linearGradient>
          <linearGradient id="rail-nose" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="150">
            <stop offset="0" stopColor="#000" stopOpacity="0.34" />
            <stop offset="0.45" stopColor="#000" stopOpacity="0.1" />
            <stop offset="1" stopColor="#000" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="rail-head" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.45" />
            <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>
          <radialGradient id="rail-charge" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" className="rail-charge-0" />
            <stop offset="1" className="rail-charge-1" />
          </radialGradient>
        </defs>

        {/* the guideway energises around the nose */}
        <ellipse cx={W / 2} cy="40" rx="74" ry="210" fill="url(#rail-charge)" />
        <path className="rail-beam" d={`M24 18 L-24 ${-AHEAD + 10} L${W + 24} ${-AHEAD + 10} L40 18 Z`} fill="url(#rail-head)" />

        {/* coaches, last first so each overlaps the gangway behind it */}
        {trainStops
          .map((s, i) => ({ s, i }))
          .slice(1, -1)
          .reverse()
          .map(({ s, i }) => {
            const y = carTop(i);
            return (
              <g
                key={s.id}
                className={`rail-car${i === near ? " is-on" : ""}`}
                transform={`translate(0 ${y})`}
                onClick={() => go(i)}
              >
                <Gangway />
                <rect x="0" y="0" width={W} height={L} rx="5" fill="url(#rail-roof)" />
                <RoofLines from={4} to={L - 4} />
                <SideGlass from={32} to={L - 32} />
                <Doors at={[9, L - 26]} />
                <path className="rail-stripe" d={`M8.6 0 V${L} M${W - 8.6} 0 V${L}`} />
                {i === 1 ? <Pantograph y={22} /> : <RoofUnit y={26} />}
                <RoofUnit y={L - 78} />
                <text className="rail-tag" textAnchor="middle" transform={`translate(${W / 2 + 4} ${WIN}) rotate(-90)`}>
                  {s.name}
                </text>
                <rect className="rail-window" x="0.6" y={WIN - WINH / 2} width="6.6" height={WINH} rx="2" />
              </g>
            );
          })}

        {/* the rear driving car closes the train: same cab, facing back, headlamps off */}
        <g
          className={`rail-car${near === N - 1 ? " is-on" : ""}`}
          transform={`translate(0 ${carTop(N - 1)})`}
          onClick={() => go(N - 1)}
        >
          <Gangway />
          <g transform={`translate(0 ${EN}) scale(1 -1)`}>
            <Cab lamps={false} />
          </g>
          <text className="rail-tag" textAnchor="middle" transform={`translate(${W / 2 + 4} ${WIN}) rotate(-90)`}>
            {trainStops[N - 1].name}
          </text>
          <rect className="rail-window" x="0.6" y={WIN - WINH / 2} width="6.6" height={WINH} rx="2" />
        </g>

        {/* the leading driving car: medium-sharp nose, headlamps on */}
        <g className={`rail-car${near === 0 ? " is-on" : ""}`} onClick={() => go(0)}>
          <Cab lamps />
          <text className="rail-livery" textAnchor="middle" transform={`translate(${W / 2 + 5} ${EN - WIN}) rotate(-90)`}>
            SRT
          </text>
          <rect className="rail-window" x="0.6" y={EN - WIN - WINH / 2} width="6.6" height={WINH} rx="2" />
        </g>
      </svg>

    </aside>
    </>
  );
}
