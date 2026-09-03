import React, { useEffect, useState, useRef } from 'react';
import { StaticLiquidTag } from '@/components/ui/static-liquid-tag';

const EDUCATION = [
  {
    idx: '2023–2027',
    title: 'B.Tech Computer Science and Engineering',
    institution: 'IIIT Bhubaneswar',
    cgpa: '8.23',
    subjects: ['Computer Networks', 'DBMS', 'Object-Oriented Programming', 'SQL', 'Operating Systems', 'Distributed Systems'],
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

  const SimpleSpotlight = ({ children }) => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    
    const handleMouseMove = (e) => {
      const rect = e.currentTarget.getBoundingClientRect();
      setMousePosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };

    return (
      <div 
        className="group/spotlight relative p-0 border-none bg-transparent rounded-none overflow-hidden"
        onMouseMove={handleMouseMove}
      >
        <div
          className="pointer-events-none absolute -inset-px z-0 opacity-0 transition duration-300 group-hover/spotlight:opacity-100"
          style={{
            backgroundColor: '#3d7ab0',
            maskImage: `radial-gradient(400px circle at ${mousePosition.x}px ${mousePosition.y}px, white, transparent)`,
            WebkitMaskImage: `radial-gradient(400px circle at ${mousePosition.x}px ${mousePosition.y}px, white, transparent)`,
          }}
        />
        {children}
      </div>
    );
  };

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
              <SimpleSpotlight>
                <a href="https://www.iiit-bh.ac.in/" target="_blank" rel="noopener noreferrer" className="service-row relative z-20 flex flex-col md:flex-row md:items-center justify-between !py-10">
                  <div className="flex-1 pr-6">
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 relative z-20">{item.title}</h3>
                    
                    <div className="flex flex-col lg:flex-row lg:items-center gap-4 mt-2 ml-1">
                      <div className="text-gray-400 text-lg">{item.institution}</div>
                      
                      <div className="flex items-center gap-3">
                        {/* Year Pill */}
                        <StaticLiquidTag>
                          <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent font-mono text-sm">{item.idx}</span>
                        </StaticLiquidTag>
                        
                        {/* CGPA Pill */}
                        <StaticLiquidTag>
                          <span className="text-cyan-400 text-sm">CGPA <span className="text-white ml-1">{item.cgpa}</span></span>
                        </StaticLiquidTag>
                      </div>
                    </div>
                  </div>

                  <span className="service-badge mt-6 md:mt-0 self-start md:self-center">
                    <span className="service-arrow-wrap">
                      <svg className="arrow-up-right" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M7 17L17 7" />
                        <path d="M8 7h9v9" />
                      </svg>
                    </span>
                  </span>
                </a>
              </SimpleSpotlight>

              {/* Subjects moved OUTSIDE of the spotlight box */}
              <div className="flex flex-wrap gap-2.5 mt-4 ml-2">
                {item.subjects.map(sub => (
                  <StaticLiquidTag key={sub} className="px-5 py-2" textClass="text-sm">
                    {sub}
                  </StaticLiquidTag>
                ))}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
