import React, { useEffect, useState, useRef } from 'react';
import { CardSpotlight } from '@/components/ui/card-spotlight';

const EDUCATION = [
  {
    idx: '2021–2025',
    title: 'B.Tech CSE — IIIT Bhubaneswar',
    desc: 'CGPA 8.23 · Core tech stack: Java, Python, C++, Spring Boot, React, Docker, Kubernetes.',
  },
];

export default function Education() {
  const [revealedItems, setRevealedItems] = useState({});
  const [headingRevealed, setHeadingRevealed] = useState(false);
  const [eyebrowRevealed, setEyebrowRevealed] = useState(false);
  const sectionRef = useRef(null);
  const headingRef = useRef(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setEyebrowRevealed(true);
            EDUCATION.forEach((_, i) => {
              setTimeout(() => {
                setRevealedItems((prev) => ({ ...prev, [i]: true }));
              }, i * 80);
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
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

  return (
    <section className="services" id="education" ref={sectionRef}>
      <div className="shell services-inner">
        <div className={`eyebrow eyebrow--dark reveal-item ${eyebrowRevealed ? 'revealed' : ''}`}>
          <span className="eyebrow-dot" />
          Education
        </div>

        <h2 className="services-h2" id="educationH2" ref={headingRef}>
          <span className="line-reveal-line">
            <span className={`line-reveal-inner ${headingRevealed ? 'revealed' : ''}`}>
              Where I studied
            </span>
          </span>
        </h2>

        <ul id="educationList">
          {EDUCATION.map((item, i) => (
            <li key={i} className={`service-row-wrap ${revealedItems[i] ? 'revealed' : ''}`} style={{ transitionDelay: `${i * 80}ms` }}>
              <CardSpotlight className="p-0 border-none bg-transparent !rounded-2xl" color="#3d7ab0">
                <a href="https://www.iiit-bh.ac.in/" target="_blank" rel="noopener noreferrer" className="service-row relative z-20">
                  <span className="service-index">{item.idx}</span>
                  <h3 className="service-title">{item.title}</h3>
                  <p className="service-desc">{item.desc}</p>
<span className="service-badge">
                    <span className="service-arrow-wrap">
                      <svg className="arrow-up-right" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M7 17L17 7" />
                        <path d="M8 7h9v9" />
                      </svg>
                    </span>
                  </span>
                </a>
              </CardSpotlight>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
