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
  const keysRevealedRef = useRef(false);

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

  // ── Keycap reveal helper (from source repo's updateKeyboardTransform) ─────
  // The Spline scene stores all keycap objects as invisible by default.
  // Must call getAllObjects() and toggle visible=true in staggered sequence.
  const revealKeycaps = async (app: any) => {
    if (keysRevealedRef.current) return;
    keysRevealedRef.current = true;

    const allObjects = app.getAllObjects();

    // Reveal the container groups first
    if (isMobile) {
      allObjects
        .filter((o: any) => o.name === "keycap-mobile")
        .forEach((kc: any) => { kc.visible = true; });
    } else {
      const desktopGroups = allObjects.filter((o: any) => o.name === "keycap-desktop");
      for (let i = 0; i < desktopGroups.length; i++) {
        await sleep(i * 70);
        desktopGroups[i].visible = true;
      }
    }

    // Then bounce-animate each individual skill keycap
    const keycaps = allObjects.filter((o: any) => o.name === "keycap");
    keycaps.forEach(async (keycap: any, idx: number) => {
      keycap.visible = false;
      await sleep(idx * 70);
      keycap.visible = true;
      gsap.fromTo(
        keycap.position,
        { y: 200 },
        { y: 50, duration: 0.5, delay: 0.1, ease: "bounce.out" }
      );
    });
  };

  const hideKeycaps = (app: any) => {
    if (!keysRevealedRef.current) return;
    keysRevealedRef.current = false;
    try {
      const all = app.getAllObjects();
      all.filter((o: any) => o.name === "keycap" || o.name === "keycap-desktop" || o.name === "keycap-mobile")
        .forEach((o: any) => { o.visible = false; });
    } catch {}
  };

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

      // Phase boundary: settle phase starts at progress ~0.55 (1.6/2.9)
      const SETTLE_PROGRESS = 0.57;
      let keysTriggered = false;

      tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionEl,
          start: "top top",
          end: "bottom top",
          scrub: 0.6,
          onUpdate: (self) => {
            // Trigger keycap reveal once keyboard has settled (phase 2 complete)
            if (self.progress >= SETTLE_PROGRESS && !keysTriggered) {
              keysTriggered = true;
              revealKeycaps(splineApp);
            }
            // Hide keys again if user scrolls back above the settle point
            if (self.progress < SETTLE_PROGRESS - 0.05 && keysTriggered) {
              keysTriggered = false;
              hideKeycaps(splineApp);
            }
          },
          onLeave: () => {
            // Section fully scrolled past — reset for re-entry
          },
          onLeaveBack: () => {
            keysTriggered = false;
            hideKeycaps(splineApp);
          },
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
          <div style={{
            pointerEvents: "none",
            position: "absolute",
            bottom: "2.5rem",
            left: "50%",
            transform: "translateX(-50%)",
            textAlign: "center",
            zIndex: 10,
          }}>
            <p style={{ fontSize: "1.125rem", fontWeight: 600, color: selectedSkill.color, margin: 0, textShadow: `0 0 20px ${selectedSkill.color}60` }}>
              {selectedSkill.label}
            </p>
            <p style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.55)", maxWidth: "20rem", margin: "0.25rem auto 0" }}>
              {selectedSkill.shortDescription}
            </p>
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
    <section ref={sectionRef as React.RefObject<HTMLElement>} style={{ position: "relative", height: "300vh" }}>
      {/* Section label */}
      <div style={{ position: "absolute", top: "4rem", left: 0, right: 0, textAlign: "center", zIndex: 10, pointerEvents: "none" }}>
        <p style={{ fontSize: "0.75rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", margin: "0 0 0.5rem" }}>
          Scroll to reveal · hover to explore
        </p>
        <h2 style={{ fontSize: "clamp(1.5rem, 4vw, 2.5rem)", fontWeight: 700, color: "#fff", margin: 0, lineHeight: 1.1 }}>
          Skills &amp; Tools
        </h2>
      </div>

      {/* Sticky canvas */}
      <div style={{ position: "sticky", top: 0, height: "100vh", width: "100%", overflow: "hidden" }}>
        {inView && <KeyboardScene isMobile={isMobile} />}
      </div>
    </section>
  );
}
