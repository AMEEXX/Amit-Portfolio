import React, { useEffect, useState, useRef } from 'react';

export default function CreateBand() {
  const [isRevealed, setIsRevealed] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsRevealed(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="create-band" ref={sectionRef}>
      <ul className="shell create-band-list">
        <li className={`create-band-item ${isRevealed ? 'revealed' : ''}`} style={{ transitionDelay: '0ms' }}>
          <div className="create-band-tile create-band-tile--light">Design</div>
        </li>
        <li className={`create-band-item ${isRevealed ? 'revealed' : ''}`} style={{ transitionDelay: '120ms' }}>
          <div className="create-band-tile create-band-tile--accent">Develop</div>
        </li>
        <li className={`create-band-item ${isRevealed ? 'revealed' : ''}`} style={{ transitionDelay: '240ms' }}>
          <div className="create-band-tile create-band-tile--dark">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14" />
              <path d="M13 6l6 6-6 6" />
            </svg>
          </div>
        </li>
        <li className={`create-band-item ${isRevealed ? 'revealed' : ''}`} style={{ transitionDelay: '360ms' }}>
          <div className="create-band-tile create-band-tile--ghost">Deploy</div>
        </li>
      </ul>
    </section>
  );
}
