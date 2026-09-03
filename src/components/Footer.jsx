import React, { useEffect, useState, useRef } from 'react';

export default function Footer({ onOpenModal }) {
  const [headingRevealed, setHeadingRevealed] = useState(false);
  const headingRef = useRef(null);

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

  const handleNavClick = (e, id) => {
    e.preventDefault();
    if (id === 'contact') {
      if (onOpenModal) onOpenModal();
      return;
    }
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="site-footer" id="contact">
      <div className="shell footer-inner">
        {/* Footer CTA */}
        <div className="footer-cta">
          <h2 className="footer-cta-h2" id="footerH2" ref={headingRef}>
            <span className="line-reveal-line">
              <span className={`line-reveal-inner ${headingRevealed ? 'revealed' : ''}`} style={{ transitionDelay: '0ms' }}>
                Got a role in
              </span>
            </span>
            <span className="line-reveal-line">
              <span className={`line-reveal-inner ${headingRevealed ? 'revealed' : ''}`} style={{ transitionDelay: '100ms' }}>
                mind? Let's
              </span>
            </span>
            <span className="line-reveal-line">
              <span className={`line-reveal-inner ${headingRevealed ? 'revealed' : ''}`} style={{ transitionDelay: '200ms' }}>
                connect.
              </span>
            </span>
          </h2>
          <button className="pill-btn" type="button" id="footerCtaBtn" onClick={onOpenModal}>
            <span className="pill-inner pill-inner--light pill-inner--arrow">
              Get in touch
              <span className="pill-arrow-badge">
                <svg className="arrow-up-right" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M7 17L17 7" />
                  <path d="M8 7h9v9" />
                </svg>
              </span>
            </span>
          </button>
        </div>

        {/* Footer Columns — matches original 4-column layout */}
        <div className="footer-columns">
          <div>
            <div className="footer-brand-name">
              <svg viewBox="0 0 48 48" fill="currentColor">
                <path d="M24 2c2.2 13.8 7.9 19.6 22 22-14.1 2.4-19.8 8.2-22 22-2.2-13.8-7.9-19.6-22-22 14.1-2.4 19.8-8.2 22-22Z" />
              </svg>
              Amit Hota
            </div>
            <p className="footer-brand-desc">
              A software engineer crafting scalable systems, cloud-native apps, and AI-driven solutions.
            </p>
          </div>

          <div className="footer-col">
            <div className="footer-col-title">Explore</div>
            <ul>
              <li><a href="#about" onClick={(e) => handleNavClick(e, 'about')}><span className="animated-link">About</span></a></li>
              <li><a href="#experience" onClick={(e) => handleNavClick(e, 'experience')}><span className="animated-link">Experience</span></a></li>
              <li><a href="#works" onClick={(e) => handleNavClick(e, 'works')}><span className="animated-link">Projects</span></a></li>
              <li><a href="#contact" className="footer-contact-link" onClick={(e) => handleNavClick(e, 'contact')}><span className="animated-link">Contact</span></a></li>
            </ul>
          </div>

          <div className="footer-col">
            <div className="footer-col-title">Skills</div>
            <ul>
              <li><a href="#services" onClick={(e) => handleNavClick(e, 'services')}><span className="animated-link">Backend Engineering</span></a></li>
              <li><a href="#services" onClick={(e) => handleNavClick(e, 'services')}><span className="animated-link">Cloud &amp; DevOps</span></a></li>
              <li><a href="#services" onClick={(e) => handleNavClick(e, 'services')}><span className="animated-link">AI &amp; Automation</span></a></li>
              <li><a href="#services" onClick={(e) => handleNavClick(e, 'services')}><span className="animated-link">Competitive Programming</span></a></li>
            </ul>
          </div>

          <div className="footer-col">
            <div className="footer-col-title">Social</div>
            <ul>
              <li><a href="https://github.com/AMEEXX" target="_blank" rel="noopener noreferrer"><span className="animated-link">GitHub</span></a></li>
              <li><a href="https://www.linkedin.com/in/amit-kumar-hota/" target="_blank" rel="noopener noreferrer"><span className="animated-link">LinkedIn</span></a></li>
              <li><a href="https://www.instagram.com/the.amit.hota" target="_blank" rel="noopener noreferrer"><span className="animated-link">Instagram</span></a></li>
              <li><a href="https://mail.google.com/mail/?view=cm&fs=1&to=amitkumarhotaofficial@gmail.com" target="_blank" rel="noopener noreferrer"><span className="animated-link">Email</span></a></li>
            </ul>
          </div>
        </div>

        {/* Footer Legal */}
        <div className="footer-legal">
          <span>© 2025 Amit Kumar Hota. All rights reserved.</span>
        </div>
      </div>

      <div className="footer-watermark">AMIT HOTA</div>
    </footer>
  );
}
