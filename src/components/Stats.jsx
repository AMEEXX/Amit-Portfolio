import React, { useEffect, useState, useRef } from 'react';

const STATS_DATA = [
  { value: 1884, suffix: '', label: 'Codeforces max rating' },
  { value: 17, suffix: '%', label: 'Performance improved' },
  { value: 5000, suffix: '+', label: 'Flight hours supported' },
  { value: 6, suffix: '+', label: 'Hackathon wins' },
];

export default function Stats() {
  const [isPanelRevealed, setIsPanelRevealed] = useState(false);
  const [revealedItems, setRevealedItems] = useState({});
  const [counts, setCounts] = useState(STATS_DATA.map(() => 0));
  const [headingRevealed, setHeadingRevealed] = useState(false);
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const countsRef = useRef(counts);
  countsRef.current = counts;

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const panelObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsPanelRevealed(true);
            STATS_DATA.forEach((_, i) => {
              setTimeout(() => {
                setRevealedItems((prev) => ({ ...prev, [i]: true }));
              }, i * 90);
            });
            panelObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    panelObserver.observe(el);
    return () => panelObserver.disconnect();
  }, []);

  useEffect(() => {
    const el = headingRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setHeadingRevealed(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Scroll-based count-up (matches original behavior)
  useEffect(() => {
    let lastTick = 0;

    function updateStats() {
      const now = performance.now();
      if (now - lastTick < 30) return;
      lastTick = now;

      const vh = window.innerHeight;
      const newCounts = STATS_DATA.map((stat) => {
        const el = document.querySelector(`[data-stat-target="${stat.value}"]`);
        if (!el) return 0;
        const rect = el.getBoundingClientRect();
        const startPos = vh;
        const endPos = vh / 2;
        let progress = (startPos - rect.top) / (startPos - endPos + rect.height / 2);
        progress = Math.max(0, Math.min(1, progress));
        return Math.round(progress * stat.value);
      });

      setCounts(newCounts);
    }

    window.addEventListener('scroll', updateStats, { passive: true });
    updateStats();
    return () => window.removeEventListener('scroll', updateStats);
  }, []);

  return (
    <section className="stats" ref={sectionRef}>
      <div className="shell stats-outer">
        <div id="statsPanel" className={`stats-panel ${isPanelRevealed ? 'revealed' : ''}`}>
          <div className="eyebrow eyebrow--light">
            <span className="eyebrow-dot" />
            Career highlights
          </div>

          <h2 className="stats-h2" id="statsH2" ref={headingRef}>
            <span className="line-reveal-line">
              <span className={`line-reveal-inner ${headingRevealed ? 'revealed' : ''}`}>
                Numbers that speak.
              </span>
            </span>
          </h2>

          <ul className="stats-grid" id="statsGrid">
            {STATS_DATA.map((stat, i) => (
              <li
                key={i}
                className={`stat-item ${revealedItems[i] ? 'revealed' : ''}`}
                style={{ transitionDelay: `${i * 90}ms` }}
              >
                <div
                  className="stat-number"
                  data-stat-target={stat.value}
                  data-suffix={stat.suffix}
                >
                  {counts[i]}{stat.suffix}
                </div>
                <div className="stat-label">{stat.label}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
