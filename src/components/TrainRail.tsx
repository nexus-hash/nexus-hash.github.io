import { useEffect, useRef, useState } from "react";
import { trainStops } from "../data/resume";

/*
 * The train rail: a fixed maglev guideway down the right edge with a white
 * bullet train seen from above, nose pointing up. The track never moves.
 * Scrolling down drives the train up the track, one car per section; the car
 * level with the projection line lights a side window and projects onto its
 * section: a soft cone of light from the window to the section's top-right
 * and bottom-right corners. The cone stays pinned to those corners, so part
 * of it is off screen when a corner is. It is painted behind the page
 * content, so a section's rounded corners sit on top of the light.
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

/** The first page's projection, in viewport px: window, section edge, and how far left the light carries. */
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
const LENGTH = EN + (N - 1) * PITCH;
const VIEW = { x: -PADX, y: -AHEAD, w: W + PADX * 2, h: AHEAD + LENGTH + 30 };

/** Top edge (front) of car i. The engine is car 0 with its nose at y = 0. */
const carTop = (i: number) => (i === 0 ? 0 : EN + G + (i - 1) * PITCH);
/** Centre of the projecting window of car i. */
const windowY = (i: number) => EN - WIN + i * PITCH;

function RoofUnit({ y }: { y: number }) {
  return (
    <>
      <rect x="21" y={y} width="22" height="40" rx="4" fill="#DCD8CD" stroke="#000" strokeOpacity="0.13" />
      <path d={`M25 ${y + 10} H39 M25 ${y + 20} H39 M25 ${y + 30} H39`} stroke="#000" strokeOpacity="0.13" />
    </>
  );
}

function Pantograph({ y }: { y: number }) {
  return (
    <g stroke="#3A3A36" strokeWidth="1.6" fill="none">
      <path d={`M18 ${y + 12} L32 ${y} L46 ${y + 12} M18 ${y + 38} L32 ${y + 50} L46 ${y + 38} M32 ${y} V${y + 50}`} />
      <path d={`M8 ${y + 25} H56`} strokeWidth="3" />
    </g>
  );
}

function SideGlass({ from, to }: { from: number; to: number }) {
  return (
    <>
      <path className="rail-glass" d={`M4.6 ${from} V${to}`} />
      <path className="rail-glass" d={`M${W - 4.6} ${from} V${to}`} />
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

    // Dust drifts on every page. On the first page it shows only inside the beam,
    // which carries on across the page; elsewhere it floats freely, with no light.
    let proj: Projection | null = null;
    let edgeX = 0; // right-hand limit for free-floating dust
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
      const left = p ? p.left : 0;
      const right = p ? p.faceX : edgeX;
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
        let alpha: number;
        if (p) {
          // inside the beam? the two rays leave the window and pass through the section's corners
          const t = (p.faceX - x) / (p.faceX - p.sx);
          const upper = p.wy - p.half + (p.top - (p.wy - p.half)) * t;
          const lower = p.wy + p.half + (p.bottom - (p.wy + p.half)) * t;
          if (y < upper || y > lower) continue;
          alpha = p.strength * (0.12 + near * 0.6) * twinkle;
        } else {
          alpha = (0.1 + near * 0.3) * twinkle;
        }
        ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
        ctx.beginPath();
        ctx.arc(x, y, d.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      dustRaf = requestAnimationFrame(drawDust);
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

      // First page: carry the two rays on across the page and let the light fade out.
      let next: Projection | null = null;
      if (visible && active === 0 && target) {
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
      edgeX = trackLeft;
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
            <stop offset="0" stopColor="#B9B5AA" />
            <stop offset="0.16" stopColor="#EDEAE2" />
            <stop offset="0.42" stopColor="#FFFFFF" />
            <stop offset="0.7" stopColor="#F2EFE7" />
            <stop offset="1" stopColor="#ABA79C" />
          </linearGradient>
          <linearGradient id="rail-screen" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0" stopColor="#34342F" />
            <stop offset="1" stopColor="#0C0C0B" />
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
        <path d={`M${W / 2} 4 L-30 ${-AHEAD + 10} L${W + 30} ${-AHEAD + 10} Z`} fill="url(#rail-head)" />

        {/* coaches, last first so each overlaps the gangway behind it */}
        {trainStops
          .map((s, i) => ({ s, i }))
          .slice(1)
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
                <rect x="11" y={-G} width={W - 22} height={G} fill="#1B1B19" />
                <rect x="0" y="0" width={W} height={L} rx="9" fill="url(#rail-roof)" />
                <SideGlass from={16} to={L - 16} />
                <path className="rail-stripe" d={`M12 0 V${L} M${W - 12} 0 V${L}`} />
                {i === 1 ? <Pantograph y={28} /> : <RoofUnit y={34} />}
                <RoofUnit y={L - 72} />
                <text className="rail-tag" textAnchor="middle" transform={`translate(${W / 2 + 4} ${WIN}) rotate(-90)`}>
                  {s.name}
                </text>
                <rect className="rail-window" x="1.4" y={WIN - WINH / 2} width="6.6" height={WINH} rx="2" />
              </g>
            );
          })}

        {/* the engine: medium-sharp nose, wraparound windscreen, twin headlights */}
        <g className={`rail-car${near === 0 ? " is-on" : ""}`} onClick={() => go(0)}>
          <path
            d={`M26 6 Q32 -2 38 6 C52 28 64 70 64 118 V${EN - 9} Q64 ${EN} 55 ${EN} H9 Q0 ${EN} 0 ${EN - 9} V118 C0 70 12 28 26 6 Z`}
            fill="url(#rail-roof)"
          />
          <SideGlass from={126} to={EN - 16} />
          <path className="rail-stripe" d={`M12 ${EN} V118 C12 70 22 34 31 12 M52 ${EN} V118 C52 70 42 34 33 12`} />
          <path d="M10 96 C12 64 21 40 32 31 C43 40 52 64 54 96 C50 106 14 106 10 96 Z" fill="url(#rail-screen)" />
          <path d="M17 92 C24 97 40 97 47 92" stroke="#fff" strokeOpacity="0.25" strokeWidth="1.6" fill="none" />
          <circle cx="26.5" cy="12" r="2.6" fill="#fff" />
          <circle cx="37.5" cy="12" r="2.6" fill="#fff" />
          <RoofUnit y={EN - 72} />
          <text className="rail-livery" textAnchor="middle" transform={`translate(${W / 2 + 5} ${EN - WIN}) rotate(-90)`}>
            SRT
          </text>
          <rect className="rail-window" x="1.4" y={EN - WIN - WINH / 2} width="6.6" height={WINH} rx="2" />
        </g>
      </svg>

    </aside>
    </>
  );
}
