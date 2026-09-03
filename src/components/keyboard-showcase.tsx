// src/components/keyboard-showcase.tsx
// Credit: the 3D scene (/assets/skills-keyboard.spline) is from
// github.com/Naresh-Khatri/3d-portfolio (README asks for a credit/link back).

import React, { Suspense, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SKILLS } from "@/data/skills";
import { HIDDEN_POSE, SETTLED_POSE, SETTLED_POSE_MOBILE } from "@/data/keyboard-motion";

const Spline = React.lazy(() => import("@splinetool/react-spline"));

gsap.registerPlugin(ScrollTrigger);

// ── Hooks ─────────────────────────────────────────────────────────────────────

function capSplinePixelRatio(app: any, maxDpr: number) {
  const apply = () => {
    try {
      const renderer = app?._renderer;
      if (renderer?.setPixelRatio) {
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, maxDpr));
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

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return isMobile;
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return reduced;
}

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

type SkillValue = NonNullable<(typeof SKILLS)[keyof typeof SKILLS]>;

// ── KeyboardScene ─────────────────────────────────────────────────────────────

function KeyboardScene({ isMobile }: { isMobile: boolean }) {
  const [splineApp, setSplineApp] = useState<any>(null);
  const [selectedSkill, setSelectedSkill] = useState<SkillValue | null>(null);
  const selectedSkillRef = useRef<SkillValue | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // ── Skill hover / keydown interactions ───────────────────────────────────
  useEffect(() => {
    if (!splineApp) return;

    const onHover = (e: any) => {
      if (selectedSkillRef.current?.name === e.target.name) return;
      if (e.target.name === "body" || e.target.name === "platform") {
        setSelectedSkill(null);
        selectedSkillRef.current = null;
        try { splineApp.setVariable("heading", ""); splineApp.setVariable("desc", ""); } catch {}
        return;
      }
      const skill = SKILLS[e.target.name as keyof typeof SKILLS];
      if (skill) { setSelectedSkill(skill); selectedSkillRef.current = skill; }
    };
    const onKeyDown = (e: any) => {
      const skill = SKILLS[e.target.name as keyof typeof SKILLS];
      if (skill) { setSelectedSkill(skill); selectedSkillRef.current = skill; }
    };

    splineApp.addEventListener("mouseHover", onHover);
    splineApp.addEventListener("keyDown", onKeyDown);
    return () => {
      splineApp.removeEventListener("mouseHover", onHover);
      splineApp.removeEventListener("keyDown", onKeyDown);
    };
  }, [splineApp]);

  useEffect(() => {
    if (!splineApp || !selectedSkill) return;
    try {
      splineApp.setVariable("heading", selectedSkill.label ?? "");
      splineApp.setVariable("desc", selectedSkill.shortDescription ?? "");
    } catch {}
  }, [selectedSkill, splineApp]);

  // ── Make keys visible immediately & Cap Pixel Ratio ─────────────────────
  // 1. Toggle keys visible immediately so they appear as part of the keyboard.
  // 2. Cap the Spline pixel ratio to 1.5 to prevent GPU throttling and jagged 
  //    edges/broken pixels on retina displays, ensuring hover effects stay smooth.
  useEffect(() => {
    if (!splineApp) return;
    
    // Cap pixel ratio to ensure smooth performance and prevent aliasing artifacts
    const cleanupDpr = capSplinePixelRatio(splineApp, 2);

    try {
      const all = splineApp.getAllObjects();
      all.forEach((o: any) => {
        if (o.name === "keycap") {
          o.visible = true;
        } else if (o.name === "keycap-desktop") {
          o.visible = !isMobile;
        } else if (o.name === "keycap-mobile") {
          o.visible = isMobile;
        }
      });
    } catch {}

    return cleanupDpr;
  }, [splineApp, isMobile]);

  // ── Three-phase scroll-scrubbed timeline + keycap reveal on settle ────────
  useEffect(() => {
    if (!splineApp || !wrapperRef.current) return;

    let tl: gsap.core.Timeline | null = null;

    const timer = setTimeout(() => {
      const kbd = splineApp.findObjectByName("keyboard");
      if (!kbd) return;

      const sectionEl = wrapperRef.current?.closest("section");
      if (!sectionEl) return;

      const settled = isMobile ? SETTLED_POSE_MOBILE : SETTLED_POSE;

      // Start keyboard at hidden pose
      gsap.set(kbd.scale, HIDDEN_POSE.scale);
      gsap.set(kbd.position, HIDDEN_POSE.position);
      gsap.set(kbd.rotation, HIDDEN_POSE.rotation);

      tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionEl,
          start: "top top",
          end: "bottom top",
          scrub: 0.6,
        },
      });

      // Phase 1 — RISE + SPIN (~55% of scroll, duration 1.6 of 2.9 total)
      tl.to(kbd.scale,    { ...settled.scale,    duration: 1.6, ease: "power1.out" }, 0)
        .to(kbd.position, { ...settled.position, duration: 1.6, ease: "power1.out" }, 0)
        .to(kbd.rotation, { y: settled.rotation.y - Math.PI, x: 0, duration: 1.6, ease: "none" }, 0)
        // Phase 2 — SETTLE (~15%)
        .to(kbd.rotation, { ...settled.rotation, duration: 0.5, ease: "power2.out" }, 1.6)
        // Phase 3 — HOLD (~30%: empty tween = scroll buffer for interactivity)
        .to({}, { duration: 0.8 }, 2.1);

      ScrollTrigger.refresh();
    }, 200);

    return () => {
      clearTimeout(timer);
      tl?.kill();
      ScrollTrigger.getAll().forEach((st) => {
        if (st.vars.trigger === wrapperRef.current?.closest("section")) st.kill();
      });
    };
  }, [splineApp, isMobile]);

  return (
    <Suspense fallback={null}>
      <div ref={wrapperRef} style={{ width: "100%", height: "100%", position: "relative" }}>
        <Spline
          style={{ width: "100%", height: "100%" }}
          onLoad={(app: any) => setSplineApp(app)}
          scene="/assets/skills-keyboard.spline"
        />

        {selectedSkill && (
          <div className="pointer-events-none absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center">
            <div className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-neutral-950/85 backdrop-blur-md border border-white/15 shadow-[0_8px_32px_rgba(0,0,0,0.6)] max-w-sm transition-all duration-300">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm"
                style={{ backgroundColor: selectedSkill.color || '#62a2d8' }}
              />
              <div className="flex flex-col text-left">
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
    </Suspense>
  );
}

// ── Public export ─────────────────────────────────────────────────────────────

export default function KeyboardShowcase() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const reducedMotion = usePrefersReducedMotion();
  const inView = useInViewport(sectionRef as React.RefObject<HTMLElement>);

  if (reducedMotion) return null;

  return (
    <section id="skills" ref={sectionRef as React.RefObject<HTMLElement>} style={{ position: "relative", height: "300vh" }}>
      {/* Section label */}
      <div style={{ position: "absolute", top: "4rem", left: 0, right: 0, textAlign: "center", zIndex: 10, pointerEvents: "none" }}>
        <p style={{ fontSize: "0.75rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", margin: "0 0 0.5rem" }}>
          Scroll to reveal · hover to explore
        </p>
        <h2 style={{
          fontFamily: "inherit",
          fontSize: "clamp(2.25rem, 5vw, 4rem)",
          fontWeight: 600,
          letterSpacing: "-0.02em",
          color: "#fff",
          margin: 0,
          lineHeight: 1.05,
          maxWidth: "56rem",
          marginLeft: "auto",
          marginRight: "auto",
          padding: "0 1rem",
        }}>
          <span className="line-reveal-line">
            <span className="line-reveal-inner revealed">Tools &amp; Skills</span>
          </span>
        </h2>
      </div>

      {/* Sticky canvas */}
      <div style={{ position: "sticky", top: 0, height: "100vh", width: "100%", overflow: "hidden" }}>
        {inView && <KeyboardScene isMobile={isMobile} />}
      </div>
    </section>
  );
}
