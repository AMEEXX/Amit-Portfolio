// src/components/keyboard-showcase.tsx
// Credit: the 3D scene (/assets/skills-keyboard.spline) is from
// github.com/Naresh-Khatri/3d-portfolio (README asks for a credit/link back).
//
// Responsive notes
// ─────────────────
// • Spline's camera keeps a fixed vertical field of view, so an object's on-screen
//   size scales with the canvas HEIGHT. A fixed scale therefore renders ~3x too
//   wide on a tall phone. `fitScale()` derives the scale from the stage aspect
//   ratio so the keyboard always fits horizontally and stays centred.
// • The stage is `position: sticky` and `100svh` tall (small viewport height), so
//   the whole keyboard is visible even while the mobile URL bar is showing, and
//   its size never changes while the bar animates (no resize jank).
// • Vertical swipes over the canvas always scroll the page (touch-action: pan-y +
//   touchmove intercepted before Spline can preventDefault it). Taps still select keys.
// • No WebGL / scene error → a static skills grid instead of crashing the app.

import React, { Suspense, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SKILLS } from "@/data/skills";
import { HIDDEN_POSE, SETTLED_POSE, SETTLED_POSE_MOBILE } from "@/data/keyboard-motion";

const Spline = React.lazy(() => import("@splinetool/react-spline"));

gsap.registerPlugin(ScrollTrigger);

type SkillValue = NonNullable<(typeof SKILLS)[keyof typeof SKILLS]>;
type StageSize = { w: number; h: number };

// ── Helpers ───────────────────────────────────────────────────────────────────

// Spline renders with a perspective camera whose framing follows the canvas
// height, so a fixed scale overflows narrow/tall screens. Calibrated from real
// renders of the settled pose: on-screen width ≈ K × canvasHeight × scale.
//   K ≈ 2.45 for the 30° mobile pose, ≈ 2.1 for the 15° desktop pose (portrait).
// Landscape/desktop keeps the original artistic scale (it already fits).
function fitScale(stage: StageSize, isMobile: boolean) {
  const base = isMobile ? SETTLED_POSE_MOBILE.scale.x : SETTLED_POSE.scale.x;
  if (!stage.w || !stage.h) return base;
  const K = isMobile ? 2.45 : 2.1;
  // fraction of stage width to fill (narrow screens exaggerate perspective width)
  const targetWidthRatio = stage.w < 360 ? 0.7 : stage.w < 640 ? 0.86 : 0.74;
  const fit = (targetWidthRatio * stage.w) / (K * stage.h);
  return Math.max(0.06, Math.min(base, fit));
}

function hasWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

function capSplinePixelRatio(app: any, maxDpr: number) {
  const apply = () => {
    try {
      const renderer = app?._renderer;
      if (renderer?.setPixelRatio) {
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, maxDpr));
      }
    } catch {}
  };
  apply();
  window.addEventListener("resize", apply, { passive: true });
  return () => window.removeEventListener("resize", apply);
}

function useInViewport(ref: React.RefObject<HTMLElement>, rootMargin = "600px") {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    if (!ref.current || inView) return;
    const io = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setInView(true),
      { rootMargin }
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, [ref, inView, rootMargin]);
  return inView;
}

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const mq = matchMedia(query);
    const update = () => setMatches(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [query]);
  return matches;
}

// Stage size, ignoring sub-24px height changes (mobile URL-bar show/hide).
function useStageSize(ref: React.RefObject<HTMLElement>) {
  const [size, setSize] = useState<StageSize>({ w: 0, h: 0 });
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const measure = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const w = el.clientWidth, h = el.clientHeight;
        setSize((prev) =>
          Math.abs(prev.w - w) > 2 || Math.abs(prev.h - h) > 24 ? { w, h } : prev
        );
      });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, [ref]);
  return size;
}

// ── Fallback (no WebGL / scene failed) ───────────────────────────────────────

function SkillsGridFallback() {
  const skills = Object.values(SKILLS).filter(Boolean) as SkillValue[];
  return (
    <div className="kbd-fallback">
      <ul className="kbd-fallback-grid">
        {skills.map((s) => (
          <li key={s.name} className="kbd-fallback-key" title={s.shortDescription}>
            <img src={s.icon} alt="" loading="lazy" width={28} height={28} />
            <span>{s.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

class SceneBoundary extends React.Component<{ children: React.ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(err: unknown) { console.warn("Skills keyboard disabled:", err); }
  render() { return this.state.failed ? <SkillsGridFallback /> : this.props.children; }
}

// ── KeyboardScene ─────────────────────────────────────────────────────────────

function KeyboardScene({
  isMobile,
  isTouch,
  reducedMotion,
  stage,
}: {
  isMobile: boolean;
  isTouch: boolean;
  reducedMotion: boolean;
  stage: StageSize;
}) {
  const [splineApp, setSplineApp] = useState<any>(null);
  const [selectedSkill, setSelectedSkill] = useState<SkillValue | null>(null);
  const selectedSkillRef = useRef<SkillValue | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // ── Let the page scroll through the canvas on touch devices ──────────────
  useEffect(() => {
    const wrap = wrapperRef.current;
    if (!wrap) return;
    // Capture phase on the wrapper runs before Spline's (non-passive) canvas
    // listener, so Spline can never preventDefault a scroll gesture.
    const stopTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1) e.stopPropagation();
    };
    wrap.addEventListener("touchmove", stopTouchMove, { capture: true, passive: true });
    return () => wrap.removeEventListener("touchmove", stopTouchMove, { capture: true } as any);
  }, []);

  useEffect(() => {
    if (!splineApp || !wrapperRef.current) return;
    const canvas = wrapperRef.current.querySelector("canvas");
    if (canvas) {
      canvas.style.touchAction = "pan-y";
      canvas.style.display = "block";
    }
  }, [splineApp]);

  // ── Skill hover / tap interactions ───────────────────────────────────────
  useEffect(() => {
    if (!splineApp) return;

    const clear = () => {
      setSelectedSkill(null);
      selectedSkillRef.current = null;
      try { splineApp.setVariable("heading", ""); splineApp.setVariable("desc", ""); } catch {}
    };
    const select = (name: string) => {
      const skill = SKILLS[name as keyof typeof SKILLS];
      if (skill) { setSelectedSkill(skill); selectedSkillRef.current = skill; }
    };
    const onHover = (e: any) => {
      if (selectedSkillRef.current?.name === e.target.name) return;
      if (e.target.name === "body" || e.target.name === "platform") return clear();
      select(e.target.name);
    };
    const onKeyDown = (e: any) => select(e.target.name);
    // Touch has no hover: a tap on a keycap selects it
    const onMouseDown = (e: any) => {
      if (e.target.name === "body" || e.target.name === "platform") return clear();
      select(e.target.name);
    };

    splineApp.addEventListener("mouseHover", onHover);
    splineApp.addEventListener("keyDown", onKeyDown);
    splineApp.addEventListener("mouseDown", onMouseDown);
    return () => {
      splineApp.removeEventListener("mouseHover", onHover);
      splineApp.removeEventListener("keyDown", onKeyDown);
      splineApp.removeEventListener("mouseDown", onMouseDown);
    };
  }, [splineApp]);

  useEffect(() => {
    if (!splineApp || !selectedSkill) return;
    try {
      splineApp.setVariable("heading", selectedSkill.label ?? "");
      splineApp.setVariable("desc", selectedSkill.shortDescription ?? "");
    } catch {}
  }, [selectedSkill, splineApp]);

  // ── Keycap variants & pixel-ratio cap ────────────────────────────────────
  useEffect(() => {
    if (!splineApp) return;
    const cleanupDpr = capSplinePixelRatio(splineApp, isTouch ? 1.5 : 2);
    try {
      splineApp.getAllObjects().forEach((o: any) => {
        if (o.name === "keycap") o.visible = true;
        else if (o.name === "keycap-desktop") o.visible = !isMobile;
        else if (o.name === "keycap-mobile") o.visible = isMobile;
      });
    } catch {}
    return cleanupDpr;
  }, [splineApp, isMobile, isTouch]);

  // ── Scroll-scrubbed timeline (rebuilt when the stage size changes) ────────
  useEffect(() => {
    if (!splineApp || !wrapperRef.current || !stage.w || !stage.h) return;

    let tl: gsap.core.Timeline | null = null;

    const timer = setTimeout(() => {
      const kbd = splineApp.findObjectByName("keyboard");
      if (!kbd) return;

      const sectionEl = wrapperRef.current?.closest("section");
      if (!sectionEl) return;

      const pose = isMobile ? SETTLED_POSE_MOBILE : SETTLED_POSE;
      const s = fitScale(stage, isMobile);
      const settled = { ...pose, scale: { x: s, y: s, z: s } };

      if (reducedMotion) {
        // Static, fully visible keyboard — no scrubbing, no spin
        gsap.set(kbd.scale, settled.scale);
        gsap.set(kbd.position, settled.position);
        gsap.set(kbd.rotation, settled.rotation);
        return;
      }

      gsap.set(kbd.scale, HIDDEN_POSE.scale);
      gsap.set(kbd.position, HIDDEN_POSE.position);
      gsap.set(kbd.rotation, HIDDEN_POSE.rotation);

      tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionEl,
          start: "top top",
          end: "bottom top",
          scrub: isTouch ? 0.35 : 0.6,
          invalidateOnRefresh: true,
        },
      });

      // Phase 1 — RISE + SPIN
      tl.to(kbd.scale,    { ...settled.scale,    duration: 1.6, ease: "power1.out" }, 0)
        .to(kbd.position, { ...settled.position, duration: 1.6, ease: "power1.out" }, 0)
        .to(kbd.rotation, { y: settled.rotation.y - Math.PI, x: 0, duration: 1.6, ease: "none" }, 0)
        // Phase 2 — SETTLE
        .to(kbd.rotation, { ...settled.rotation, duration: 0.5, ease: "power2.out" }, 1.6)
        // Phase 3 — HOLD (scroll buffer for interactivity)
        .to({}, { duration: 0.8 }, 2.1);

      ScrollTrigger.refresh();
    }, 200);

    return () => {
      clearTimeout(timer);
      if (tl) {
        tl.scrollTrigger?.kill();
        tl.kill();
      }
    };
  }, [splineApp, isMobile, isTouch, reducedMotion, stage.w, stage.h]);

  return (
    <div ref={wrapperRef} className="kbd-scene">
      <Spline
        style={{ width: "100%", height: "100%" }}
        onLoad={(app: any) => setSplineApp(app)}
        scene="/assets/skills-keyboard.spline"
      />

      {selectedSkill && (
        <div className="pointer-events-none absolute inset-x-0 bottom-[max(2rem,env(safe-area-inset-bottom))] z-20 flex justify-center px-4">
          <div className="flex items-center gap-3 px-5 py-3 sm:px-6 rounded-2xl bg-neutral-950/85 backdrop-blur-md border border-white/15 shadow-[0_8px_32px_rgba(0,0,0,0.6)] w-max max-w-full sm:max-w-sm transition-all duration-300">
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm"
              style={{ backgroundColor: selectedSkill.color || "#62a2d8" }}
            />
            <div className="flex flex-col text-left min-w-0">
              <span className="text-white font-semibold text-sm tracking-tight leading-tight">
                {selectedSkill.label}
              </span>
              <span className="text-neutral-300/80 text-xs mt-0.5 leading-snug font-normal">
                {selectedSkill.shortDescription}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Public export ─────────────────────────────────────────────────────────────

export default function KeyboardShowcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const isMobile = useMediaQuery("(max-width: 767px)");
  const isTouch = useMediaQuery("(hover: none), (pointer: coarse)");
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const inView = useInViewport(sectionRef);
  const stage = useStageSize(stageRef);
  const [webgl, setWebgl] = useState(true);

  useEffect(() => { setWebgl(hasWebGL()); }, []);

  return (
    <section
      id="skills"
      ref={sectionRef}
      className={`kbd-section ${reducedMotion || !webgl ? "kbd-section--static" : ""}`}
    >
      {/* Section label */}
      <div className="kbd-label">
        <p className="kbd-eyebrow">
          {isTouch ? "Scroll to reveal · tap a key to explore" : "Scroll to reveal · hover to explore"}
        </p>
        <h2 className="kbd-title">
          <span className="line-reveal-line">
            <span className="line-reveal-inner revealed">Tools &amp; Skills</span>
          </span>
        </h2>
      </div>

      {/* Sticky, viewport-sized stage — keyboard is always centred in it */}
      <div ref={stageRef} className="kbd-stage">
        {!webgl ? (
          <SkillsGridFallback />
        ) : (
          inView && (
            <SceneBoundary>
              <Suspense fallback={null}>
                <KeyboardScene
                  isMobile={isMobile}
                  isTouch={isTouch}
                  reducedMotion={reducedMotion}
                  stage={stage}
                />
              </Suspense>
            </SceneBoundary>
          )
        )}
      </div>
    </section>
  );
}
