import React, { useEffect, useState, useRef } from 'react';
import { CardSpotlight } from '@/components/ui/card-spotlight';

const EXPERIENCE = [
  {
    idx: '2026',
    title: 'Software Engineer Intern — Dell Technologies',
    desc: 'Migrated PowerStore VSA to Red Hat OpenShift; reduced VM latency 14.6%, improved throughput 17%.',
  },
  {
    idx: '2025',
    title: 'Software Engineer Intern — ideaForge Technology',
    desc: 'Built FlyghtCloud backend processing 100k+ geospatial data points per day with real-time Kafka streaming.',
  },
  {
    idx: '2024',
    title: 'Harvard PAIR Delegate & SIH Grand Finalist',
    desc: 'Selected delegate at Harvard PAIR symposium; Grand Finalist at Smart India Hackathon 2024.',
  },
  {
    idx: '2021–2025',
    title: 'B.Tech CSE — IIIT Bhubaneswar',
    desc: 'CGPA 8.23 · Core tech stack: Java, Python, C++, Spring Boot, React, Docker, Kubernetes.',
  },
];

export default function Experience() {
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
            EXPERIENCE.forEach((_, i) => {
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
    <section className="services" id="experience" ref={sectionRef}>
      <div className="shell services-inner">
        <div className={`eyebrow eyebrow--dark reveal-item ${eyebrowRevealed ? 'revealed' : ''}`}>
          <span className="eyebrow-dot" />
          Experience
        </div>

        <h2 className="services-h2" id="experienceH2" ref={headingRef}>
          <span className="line-reveal-line">
            <span className={`line-reveal-inner ${headingRevealed ? 'revealed' : ''}`}>
              Where I've worked
            </span>
          </span>
        </h2>

        <ul id="experienceList">
          {EXPERIENCE.map((item, i) => (
            <li key={i} className={`service-row-wrap ${revealedItems[i] ? 'revealed' : ''}`} style={{ transitionDelay: `${i * 80}ms` }}>
              <CardSpotlight className="p-0 border-none bg-transparent !rounded-2xl" color="#3d7ab0">
                <a href="#" className="service-row relative z-20" onClick={(e) => e.preventDefault()}>
                  <span className="service-index">{item.idx}</span>
                  <h3 className="service-title">{item.title}</h3>
                  <p className="service-desc">{item.desc}</p>
                  <span className="service-badge">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M7 17L17 7" />
                      <path d="M8 7h9v9" />
                    </svg>
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
