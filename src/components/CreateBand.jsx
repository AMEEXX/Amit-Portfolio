import React, { useEffect, useState, useRef } from 'react';
import ChromeButton from '@/components/ui/chrome-button';
import { ArrowRight } from 'lucide-react';

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
          <ChromeButton className="create-band-tile w-full p-0 flex items-center justify-center">
            <ArrowRight className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
          </ChromeButton>
        </li>
        <li className={`create-band-item ${isRevealed ? 'revealed' : ''}`} style={{ transitionDelay: '360ms' }}>
          <div className="create-band-tile create-band-tile--ghost">Deploy</div>
        </li>
      </ul>
    </section>
  );
}
