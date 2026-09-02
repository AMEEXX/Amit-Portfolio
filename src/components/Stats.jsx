import React, { useEffect, useState, useRef } from 'react';

const STATS_DATA = [
  { value: 800, suffix: '+', label: 'Problems solved' },
  { value: 1900, suffix: '', label: 'LeetCode rating' },
  { value: 1800, suffix: '', label: 'Codeforces rating' },
  { value: 6, suffix: '+', label: 'Hackathon finalist' },
];

export default function Stats() {
  const [isPanelRevealed, setIsPanelRevealed] = useState(false);
  const [revealedItems, setRevealedItems] = useState({});
  const [counts, setCounts] = useState(STATS_DATA.map(() => 0));
  const [headingRevealed, setHeadingRevealed] = useState(false);
  const sectionRef = useRef(null);
  const headingRef = useRef(null);

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
      { threshold: 0.15 }
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

  // Smooth count-up animation once section enters viewport
  useEffect(() => {
    if (!isPanelRevealed) return;

    let startTime = null;
    const duration = 1600; // 1.6s duration

    function animate(timestamp) {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      // Smooth cubic ease-out
      const easeProgress = 1 - Math.pow(1 - progress, 3);

      setCounts(STATS_DATA.map((stat) => Math.round(easeProgress * stat.value)));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    }

    const timer = setTimeout(() => {
      requestAnimationFrame(animate);
    }, 150);

    return () => clearTimeout(timer);
  }, [isPanelRevealed]);

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
