import { useEffect } from 'react';
import Lenis from '@studio-freight/lenis';

export function useLenis() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    let rafId;
    function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    // Global scroll helper for anchor links
    window.scrollToId = (id) => {
      const el = document.getElementById(id);
      if (el) {
        lenis.scrollTo(el, { offset: 0, duration: 1.2 });
      }
    };

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      delete window.scrollToId;
    };
  }, []);
}
