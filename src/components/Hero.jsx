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
  const revealWidthRef = useRef(pickRevealWidth());

  const handleScrollToWork = (e) => {
    e.preventDefault();
    if (typeof window !== 'undefined' && window.scrollToId) {
      window.scrollToId('works');
    } else {
      const el = document.getElementById('works');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
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
      <div className={`hero-status ${isLoaderFinished ? 'revealed' : ''}`} id="heroStatus">
        <div className="shell hero-status-inner">
          <span className="inline-flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-yellow-400 inline-block animate-pulse" />
            Open to work
          </span>
          <a
            href="#works"
            onClick={handleScrollToWork}
            className="hero-status-right hover:text-white transition-colors cursor-pointer"
          >
            Scroll to explore <span>↓</span>
          </a>
        </div>
      </div>
    </section>
  );
}
