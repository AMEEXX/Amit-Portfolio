import React, { useEffect, useRef } from 'react';
import LiquidRevealCanvas from './effects/LiquidRevealCanvas';
import EncryptedText from './effects/EncryptedText';
import { GradientButton } from '@/components/ui/gradient-button';

// Cloudinary delivers a right-sized WebP/AVIF instead of the 8K PNG originals
// (2.7 MB + 7 MB). Both images MUST keep identical framing so the liquid reveal
// lines up 1:1 — they share the same transform and object-fit: cover math.
const CLD = 'https://res.cloudinary.com/dvfshzhp/image/upload';
const BASE_ID = 'v1788253096/main_selected_picture_8K_upscaled.png';
const AFTER_ID = 'v1788281218/final_base_2.png';
const cld = (id, w) => `${CLD}/f_auto,q_auto,w_${w}/${id}`;
const WIDTHS = [640, 960, 1280, 1920, 2560, 3840];

function pickRevealWidth() {
  if (typeof window === 'undefined') return 1920;
  const need = Math.max(window.innerWidth, window.innerHeight * (16 / 9)) * Math.min(window.devicePixelRatio || 1, 2);
  return WIDTHS.find((w) => w >= need) || WIDTHS[WIDTHS.length - 1];
}

export default function Hero({ isLoaderFinished, onOpenModal }) {
  const containerRef = useRef(null);
  const cursorDotRef = useRef(null);
  const statusRef = useRef(null);
  const revealWidthRef = useRef(pickRevealWidth());

  // Expose the real status-bar height so the floating brand / content padding
  // never overlap it at any font size or device.
  useEffect(() => {
    const el = statusRef.current;
    const host = containerRef.current;
    if (!el || !host) return;
    const apply = () => host.style.setProperty('--hero-status-h', `${el.offsetHeight}px`);
    apply();
    const ro = new ResizeObserver(apply);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const handleBrandClick = () => {
    if (window.scrollToId) {
      window.scrollToId('home');
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <section className="hero" id="home" ref={containerRef}>
      {/* Liquid Reveal Background */}
      <div className="hero-reveal-bg">
        <img
          src={cld(BASE_ID, 1920)}
          srcSet={WIDTHS.map((w) => `${cld(BASE_ID, w)} ${w}w`).join(', ')}
          sizes="(orientation: portrait) 190vh, 100vw"
          alt="Amit Hota portfolio hero base"
          id="heroBaseImg"
          fetchpriority="high"
          decoding="async"
        />
        <LiquidRevealCanvas
          afterImgUrl={cld(AFTER_ID, revealWidthRef.current)}
          containerRef={containerRef}
          cursorDotRef={cursorDotRef}
        />
      </div>

      <div className="hero-vignette" />
      <div className="hero-cursor" ref={cursorDotRef} id="heroCursorDot" />

      {/* Hero Watermark Text */}
      <div className={`hero-watermark ${isLoaderFinished ? 'revealed' : ''}`} id="heroWatermark">
        AMIT HOTA
      </div>

      {/* Hero Content */}
      <div className="shell hero-content">
        <div className="hero-left">
          <h1 className="hero-h1" id="heroH1">
            <span className="line-reveal-line">
              <EncryptedText text="Hello " trigger={isLoaderFinished} lineDelayMs={0} />
              <EncryptedText text="World," trigger={isLoaderFinished} lineDelayMs={80} />
            </span>
            <span className="line-reveal-line">
              <EncryptedText
                text="I develop"
                className="encrypted-text--block encrypted-text--accent"
                trigger={isLoaderFinished}
                lineDelayMs={220}
              />
            </span>
            <span className="line-reveal-line">
              <EncryptedText text="scalable " trigger={isLoaderFinished} lineDelayMs={440} />
              <EncryptedText text="systems." className="encrypted-text--italic" trigger={isLoaderFinished} lineDelayMs={520} />
            </span>
          </h1>

          <div className={`hero-ctas ${isLoaderFinished ? 'revealed' : ''}`} id="heroCtas">
            <GradientButton onClick={onOpenModal}>
              Get in touch
              <span className="ml-1.5 inline-block transition-transform duration-300 group-hover:rotate-45">
                <svg className="arrow-up-right w-4 h-4 inline" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M7 17L17 7" />
                  <path d="M8 7h9v9" />
                </svg>
              </span>
            </GradientButton>

            <GradientButton variant="variant" asChild>
              <a
                href="https://drive.google.com/file/d/1V4nJo9dbEVhRpYUrMPVHSxI_Z3ycBQAw/view?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
              >
                Resume
                <span className="ml-1.5 inline-block transition-transform duration-300 group-hover:rotate-45">
                  <svg className="arrow-up-right w-4 h-4 inline" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M7 17L17 7" />
                    <path d="M8 7h9v9" />
                  </svg>
                </span>
              </a>
            </GradientButton>
          </div>
        </div>
        <div className="hero-right" />
      </div>

      {/* Hero Status Bar */}
      <div className={`hero-status ${isLoaderFinished ? 'revealed' : ''}`} id="heroStatus" ref={statusRef}>
        <div className="shell hero-status-inner">
          <span>Available for Q2/Q3 roles</span>
          <span className="hero-status-center">Backend · Cloud · Systems · AI</span>
          <span className="hero-status-right">
            Scroll to explore <span>↓</span>
          </span>
        </div>
      </div>

      {/* Floating Brand Button */}
      <button className="hero-brand-floating" id="brandBtn" aria-label="Scroll to top" onClick={handleBrandClick}>
        <svg viewBox="0 0 48 48" fill="currentColor">
          <path d="M24 2c2.2 13.8 7.9 19.6 22 22-14.1 2.4-19.8 8.2-22 22-2.2-13.8-7.9-19.6-22-22 14.1-2.4 19.8-8.2 22-22Z" />
        </svg>
        Amit Hota
      </button>
    </section>
  );
}
