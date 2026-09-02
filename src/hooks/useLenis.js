import { useEffect } from 'react';
import Lenis from '@studio-freight/lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function useLenis() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    // ── Connect Lenis to GSAP ScrollTrigger ──────────────────────────────
    // Without this, ScrollTrigger reads native scrollY while Lenis intercepts
    // scroll events — causing scroll-driven animations (scrub) to break.
    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    // Global scroll helper for anchor links
    window.scrollToId = (id) => {
      const el = document.getElementById(id);
      if (el) {
        lenis.scrollTo(el, { offset: 0, duration: 1.2 });
      }
    };

    return () => {
      lenis.off('scroll', ScrollTrigger.update);
      gsap.ticker.remove(lenis.raf);
      lenis.destroy();
      delete window.scrollToId;
    };
  }, []);
}
