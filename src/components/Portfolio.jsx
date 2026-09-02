import React, { useEffect, useState, useRef } from 'react';

const PROJECTS = [
  {
    name: 'FlyghtCloud Platform',
    cat: 'Backend',
    year: '2025',
    desc: 'Cloud-based drone platform backend processing 100k+ geospatial data points daily with real-time streaming.',
    tags: ['Java', 'Spring Boot', 'Kafka', 'FastAPI'],
    link: '#',
  },
  {
    name: 'Future Vault',
    cat: 'Full Stack',
    year: '2026',
    desc: 'A time-capsule app for scheduled notes with event-driven processing and cloud-native deployment.',
    tags: ['Spring Boot', 'Rust', 'Docker', 'Kubernetes'],
    link: '#',
  },
  {
    name: 'AI Agent Marketplace',
    cat: 'AI Platform',
    year: '2025',
    desc: 'A generative AI platform to discover, deploy, and interact with 100+ autonomous AI agents.',
    tags: ['LangChain', 'React', 'Spring Boot', 'Kafka'],
    link: '#',
  },
  {
    name: 'PowerStore VSA',
    cat: 'Cloud & DevOps',
    year: '2026',
    desc: 'Migrated VMware ESXi workloads to Red Hat OpenShift, reducing VM latency by 14.6%.',
    tags: ['Kubernetes', 'OpenShift', 'Jenkins', 'Python'],
    link: '#',
  },
];

export default function Portfolio() {
  const [revealedItems, setRevealedItems] = useState({});
  const [headingRevealed, setHeadingRevealed] = useState(false);
  const sectionRef = useRef(null);
  const headingRef = useRef(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            PROJECTS.forEach((_, i) => {
              setTimeout(() => {
                setRevealedItems((prev) => ({ ...prev, [i]: true }));
              }, i * 90);
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
    <section className="portfolio" id="works" ref={sectionRef}>
      <div className="shell portfolio-inner">
        <div className="portfolio-header">
          <h2 className="portfolio-h2" id="portfolioH2" ref={headingRef}>
            <span className="line-reveal-line">
              <span className={`line-reveal-inner ${headingRevealed ? 'revealed' : ''}`}>Things I've Built</span>
            </span>
          </h2>
        </div>

        <ul className="portfolio-grid">
          {PROJECTS.map((item, i) => (
            <li
              key={i}
              className={`portfolio-card-wrap ${revealedItems[i] ? 'revealed' : ''}`}
            >
              <a href={item.link}>
                <article className="portfolio-card">
                  <div className="portfolio-card-meta">
                    <span>
                      {item.cat} — {item.year}
                    </span>
                    <span className="portfolio-card-badge">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M7 17L17 7" />
                        <path d="M8 7h9v9" />
                      </svg>
                    </span>
                  </div>

                  <div className="portfolio-card-center">
                    <div className="portfolio-card-logo">
                      <svg viewBox="0 0 48 48" fill="currentColor">
                        <path d="M24 2c2.2 13.8 7.9 19.6 22 22-14.1 2.4-19.8 8.2-22 22-2.2-13.8-7.9-19.6-22-22 14.1-2.4 19.8-8.2 22-22Z" />
                      </svg>
                      <span className="reg">®</span>
                    </div>
                  </div>

                  <div className="portfolio-card-bottom">
                    <h3>{item.name}</h3>
                    <p>{item.desc}</p>
                    <div className="portfolio-tags">
                      {item.tags.map((t, idx) => (
                        <span key={idx} className="tag-chip">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </article>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
