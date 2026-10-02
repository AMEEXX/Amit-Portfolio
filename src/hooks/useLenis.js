import { useEffect } from 'react';
import Lenis from '@studio-freight/lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Mobile browsers fire `resize` whenever the URL bar shows/hides. Without this,
// every scrubbed animation (keyboard, starfield) would recalculate mid-scroll and jump.
ScrollTrigger.config({ ignoreMobileResize: true });

export function useLenis() {
  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const lenis = new Lenis({
      duration: reducedMotion ? 0 : 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: !reducedMotion,
      wheelMultiplier: 1,
      // Touch keeps the device's native momentum scrolling (feels right on iOS /
      // Android and never fights the browser's URL-bar collapse). Lenis only
      // smooths mouse wheels / trackpads.
      syncTouch: false,
      touchMultiplier: 1.5,
    });

    // ── Connect Lenis to GSAP ScrollTrigger ──────────────────────────────
    lenis.on('scroll', ScrollTrigger.update);

    const raf = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // Recalculate trigger positions after fonts / images change layout and on
    // orientation change (rotation changes every section height).
    const refresh = () => ScrollTrigger.refresh();
    const onOrientation = () => setTimeout(refresh, 350);
    window.addEventListener('orientationchange', onOrientation);
    window.addEventListener('load', refresh);
    document.fonts?.ready?.then(refresh).catch(() => {});

    // Global scroll helper for anchor links
    window.scrollToId = (id) => {
      const el = document.getElementById(id);
      if (el) {
        lenis.scrollTo(el, { offset: 0, duration: reducedMotion ? 0 : 1.2 });
      }
    };
    window.__lenis = lenis;

    return () => {
      lenis.off('scroll', ScrollTrigger.update);
      gsap.ticker.remove(raf);
      window.removeEventListener('orientationchange', onOrientation);
      window.removeEventListener('load', refresh);
      lenis.destroy();
      delete window.scrollToId;
      delete window.__lenis;
    };
  }, []);
}
