import React, { useState, useEffect } from 'react';

export default function Navbar({ onOpenModal }) {
  const [isCondensed, setIsCondensed] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY || document.documentElement.scrollTop || 0;
      setIsCondensed(y > 120);

      const sections = ['home', 'about', 'work-experience', 'works', 'skills', 'education', 'contact'];
      let current = 'home';
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom > 100) {
            current = id;
            break;
          }
        }
      }
      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e, id) => {
    e.preventDefault();
    setIsOpen(false);
    if (window.scrollToId) {
      window.scrollToId(id);
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className={`navbar-shell ${isCondensed ? 'is-condensed' : ''} ${isOpen ? 'is-open' : ''}`} id="navbarShell">
      <div className="navbar-pill" id="navbarPill">
        {/* Brand */}
        <a className="navbar-brand" href="#home" onClick={(e) => handleNavClick(e, 'home')} aria-label="Scroll to top">
          <svg viewBox="0 0 48 48" fill="currentColor" width="22" height="22">
            <path d="M24 2c2.2 13.8 7.9 19.6 22 22-14.1 2.4-19.8 8.2-22 22-2.2-13.8-7.9-19.6-22-22 14.1-2.4 19.8-8.2 22-22Z" />
          </svg>
          <span className="navbar-brand-name">Amit&nbsp;Hota</span>
        </a>

        {/* Desktop Nav Items */}
        <nav className="navbar-items" aria-label="Primary">
          {[
            { id: 'home', label: 'Home' },
            { id: 'about', label: 'About' },
            { id: 'work-experience', label: 'Experience' },
            { id: 'works', label: 'Work' },
            { id: 'skills', label: 'Skills' },
            { id: 'education', label: 'Education' },
            { id: 'contact', label: 'Contact' },
          ].map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={`navbar-item ${activeSection === item.id ? 'is-active' : ''}`}
              onClick={(e) => handleNavClick(e, item.id)}
            >
              <span>{item.label}</span>
            </a>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="navbar-actions">
          <a
            className="navbar-btn navbar-btn--secondary"
            href="https://drive.google.com/file/d/1V4nJo9dbEVhRpYUrMPVHSxI_Z3ycBQAw/view?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
          >
            Resume
          </a>
          <button className="navbar-btn navbar-btn--primary" type="button" onClick={onOpenModal}>
            Hire me
          </button>
        </div>

        {/* Mobile Toggle */}
        <button
          className="navbar-toggle"
          type="button"
          aria-label="Toggle menu"
          aria-expanded={isOpen}
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg className="navbar-toggle-icon navbar-toggle-icon--open" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="4" y1="6" x2="20" y2="6" />
            <line x1="4" y1="12" x2="20" y2="12" />
            <line x1="4" y1="18" x2="20" y2="18" />
          </svg>
          <svg className="navbar-toggle-icon navbar-toggle-icon--close" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="6" y1="6" x2="18" y2="18" />
            <line x1="18" y1="6" x2="6" y2="18" />
          </svg>
        </button>

        {/* Mobile Sheet */}
        <div className="navbar-mobile-sheet">
          {[
            { id: 'home', label: 'Home' },
            { id: 'about', label: 'About' },
            { id: 'work-experience', label: 'Experience' },
            { id: 'works', label: 'Work' },
            { id: 'skills', label: 'Skills' },
            { id: 'education', label: 'Education' },
            { id: 'contact', label: 'Contact' },
          ].map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={`navbar-mobile-link ${activeSection === item.id ? 'is-active' : ''}`}
              onClick={(e) => handleNavClick(e, item.id)}
            >
              {item.label}
            </a>
          ))}
          <div className="navbar-mobile-ctas">
            <a
              className="navbar-btn navbar-btn--secondary"
              href="https://drive.google.com/file/d/1V4nJo9dbEVhRpYUrMPVHSxI_Z3ycBQAw/view?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
            >
              Resume
            </a>
            <button className="navbar-btn navbar-btn--primary" type="button" onClick={() => { setIsOpen(false); onOpenModal(); }}>
              Hire me
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
