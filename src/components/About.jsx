import React, { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { FloatingDock } from '@/components/ui/floating-dock';

const MAIN_TEXT = "I build scalable backend systems and cloud-native applications";
const MUTED_TEXT = "with Java, Python, Spring Boot, Kubernetes, and a competitive edge forged in global contests.";

const EASE = [0.22, 1, 0.36, 1];

export default function About() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '0px 0px -15% 0px' });

  const mainWords = MAIN_TEXT.split(' ');
  const mutedWords = MUTED_TEXT.split(' ');
  const allWords = [
    ...mainWords.map((w) => ({ text: w, muted: false })),
    ...mutedWords.map((w) => ({ text: w, muted: true })),
  ];

  return (
    <section className="about" id="about" ref={sectionRef}>
      <div className="shell about-inner">

        {/* Left column */}
        <motion.div
          className="about-globe"
          initial={{ opacity: 0, y: 48 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 48 }}
          transition={{ duration: 0.8, ease: EASE }}
        >
          <div className="eyebrow eyebrow--dark" style={{ position: 'relative' }}>
            <span className="eyebrow-dot" />
            About Me
          </div>
        </motion.div>

        {/* Right column */}
        <div className="about-right">
          <h2 className="about-h2 word-reveal" id="aboutH2">
            {allWords.map((word, i) => (
              <React.Fragment key={i}>
                <span className="word-wrap">
                  <motion.span
                    className={`word-inner${word.muted ? ' muted' : ''}`}
                    initial={{ y: 28, opacity: 0 }}
                    animate={isInView ? { y: 0, opacity: 1 } : { y: 28, opacity: 0 }}
                    transition={{
                      duration: 0.5,
                      ease: EASE,
                      delay: 0.15 + i * 0.03,
                    }}
                    style={{ transition: 'none' }} /* Prevent CSS transition collision */
                  >
                    {word.text}
                  </motion.span>
                </span>
                {' '}
              </React.Fragment>
            ))}
          </h2>

          <motion.div
            className="about-footer"
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.55 }}
            style={{ transition: 'none' }} /* Prevent CSS transition collision */
          >
            <div>
              <div className="about-footer-label">Find me online</div>
              <FloatingDock
                items={[
                  {
                    title: 'GitHub',
                    href: 'https://github.com/AMEEXX',
                    icon: (
                      <svg viewBox="0 0 24 24" fill="currentColor" className="h-full w-full text-neutral-800 dark:text-neutral-300">
                        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                      </svg>
                    ),
                  },
                  {
                    title: 'LinkedIn',
                    href: 'https://www.linkedin.com/in/amit-kumar-hota/',
                    icon: (
                      <svg viewBox="0 0 24 24" fill="currentColor" className="h-full w-full text-neutral-800 dark:text-neutral-300">
                        <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                      </svg>
                    ),
                  },
                  {
                    title: 'Instagram',
                    href: 'https://www.instagram.com/the.amit.hota',
                    icon: (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-full w-full text-neutral-800 dark:text-neutral-300">
                        <rect x="2" y="3" width="20" height="18" rx="5" />
                        <circle cx="12" cy="12" r="4" />
                        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                      </svg>
                    ),
                  },
                  {
                    title: 'Email',
                    href: 'https://mail.google.com/mail/?view=cm&fs=1&to=amitkumarhotaofficial@gmail.com',
                    icon: (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-full w-full text-neutral-800 dark:text-neutral-300">
                        <rect x="2" y="4" width="20" height="16" rx="2" />
                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                      </svg>
                    ),
                  },
                ]}
                desktopClassName="!bg-transparent !px-0"
                mobileClassName="!bg-transparent"
              />
            </div>
            <a
              className="pill-btn"
              href="https://drive.google.com/file/d/122eIzLXN4gWJ41f37FVfD3_m3afleYT-/view?usp=drive_link"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="pill-inner pill-inner--outline pill-inner--arrow">
                Resume
                <span className="pill-arrow-badge">
                  <svg className="arrow-right" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14" />
                    <path d="M13 6l6 6-6 6" />
                  </svg>
                </span>
              </span>
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
