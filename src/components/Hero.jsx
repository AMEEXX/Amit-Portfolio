import React, { useRef } from 'react';
import LiquidRevealCanvas from './effects/LiquidRevealCanvas';
import EncryptedText from './effects/EncryptedText';
import { GradientButton } from '@/components/ui/gradient-button';

export default function Hero({ isLoaderFinished, onOpenModal }) {
  const containerRef = useRef(null);
  const cursorDotRef = useRef(null);

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
          src="https://res.cloudinary.com/dvfshzhp/image/upload/v1788253096/main_selected_picture_8K_upscaled.png"
          alt="Amit Hota portfolio hero base"
          id="heroBaseImg"
        />
        <LiquidRevealCanvas
          afterImgUrl="https://res.cloudinary.com/dvfshzhp/image/upload/v1788281218/final_base_2.png"
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
                href="https://drive.google.com/file/d/122eIzLXN4gWJ41f37FVfD3_m3afleYT-/view?usp=drive_link"
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
