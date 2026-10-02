import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useInView } from 'motion/react';
import { CanvasRevealEffect } from '@/components/ui/canvas-reveal-effect';

// ── Corner + icon (exact Aceternity demo) ──
const Icon = ({ className, ...rest }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    stroke="currentColor"
    className={className}
    {...rest}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
  </svg>
);

// ── Card (exact Aceternity canvas-reveal-effect-demo structure) ──
function useCanHover() {
  const [canHover, setCanHover] = useState(true);
  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)');
    const update = () => setCanHover(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);
  return canHover;
}

const Card = ({ title, subtitle, description, logoSrc, logoAlt, logoStyle, tags, children }) => {
  const [hovered, setHovered] = useState(false);
  const canHover = useCanHover();
  // Touch devices have no hover: tap toggles the card open/closed.
  const active = hovered;
  const toggle = () => { if (!canHover) setHovered((v) => !v); };

  return (
    <div
      onMouseEnter={() => canHover && setHovered(true)}
      onMouseLeave={() => canHover && setHovered(false)}
      onClick={toggle}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setHovered((v) => !v); } }}
      role="button"
      tabIndex={0}
      aria-expanded={active}
      aria-label={`${title} — ${subtitle}`}
      data-active={active ? 'true' : 'false'}
      className="work-card border border-white/[0.2] group/canvas-card flex items-center justify-center max-w-md w-full mx-auto p-5 sm:p-6 relative min-h-[34rem] sm:min-h-[38rem] lg:min-h-[42rem] cursor-pointer select-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/60"
    >
      {/* Exact corner icons from demo */}
      <Icon className="absolute h-6 w-6 -top-3 -left-3 text-white" />
      <Icon className="absolute h-6 w-6 -bottom-3 -left-3 text-white" />
      <Icon className="absolute h-6 w-6 -top-3 -right-3 text-white" />
      <Icon className="absolute h-6 w-6 -bottom-3 -right-3 text-white" />

      {/* Canvas reveal — exact from demo */}
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="h-full w-full absolute inset-0"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content — exact from demo */}
      <div className="relative z-20 w-full text-center h-full flex flex-col justify-center items-center">

        {/* Logo: centered vertically on initial state, slides up + fades out on hover */}
        <div className="work-card-logo absolute inset-0 flex items-center justify-center pointer-events-none transition duration-300 z-30 px-6">
          <img
            src={logoSrc}
            alt={logoAlt}
            style={logoStyle}
            draggable={false}
          />
        </div>
        {!canHover && (
          <span className="work-card-hint absolute bottom-5 inset-x-0 text-center text-[11px] uppercase tracking-[0.15em] text-white/40 pointer-events-none transition duration-300 z-30">
            Tap to view details
          </span>
        )}

        {/* Company name — fades in + slides up on hover */}
        <h2 className="work-reveal text-white text-xl sm:text-2xl relative z-10 font-bold transition duration-200 mt-4">
          {title}
        </h2>

        {/* Role subtitle */}
        <p
          className="work-reveal text-[15px] sm:text-[17px] font-bold text-white/95 transition duration-300 mt-1"
          style={{ transitionDelay: '50ms' }}
        >
          {subtitle}
        </p>

        {/* Highlights — appear after title */}
        <ul
          className="work-reveal transition duration-300 mt-4 space-y-2 text-left px-0 sm:px-2"
          style={{ transitionDelay: '80ms' }}
        >
          {description.map((line, i) => (
            <li key={i} className="flex gap-2.5 items-start text-sm sm:text-base font-semibold text-white drop-shadow-md leading-relaxed">
              <span className="mt-[8px] w-1.5 h-1.5 rounded-full bg-white/90 shrink-0" />
              {line}
            </li>
          ))}
        </ul>

        {/* Tags */}
        {tags && (
          <div 
            className="work-reveal flex flex-wrap items-center justify-start gap-2 sm:gap-3 mt-6 px-0 sm:px-2 transition duration-300"
            style={{ transitionDelay: '100ms' }}
          >
            {tags.map((tag, i) => (
              <span 
                key={i} 
                className="px-2.5 py-0.5 border border-white/30 uppercase bg-transparent text-white transition duration-200 text-[10px] font-bold shadow-[1px_1px_rgba(255,255,255,0.3),2px_2px_rgba(255,255,255,0.3),3px_3px_rgba(255,255,255,0.3)]"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ── Section ──
export default function WorkExperience() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '0px 0px -10% 0px' });

  return (
    <section ref={sectionRef} id="work-experience" style={{ padding: '5rem 0' }}>
      <div className="shell">
        {/* Heading — centered */}
        <motion.h2
          className="services-h2"
          style={{ textAlign: 'center', maxWidth: 'none', width: '100%', marginBottom: '3rem' }}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.08 }}
        >
          <span className="line-reveal-line">
            <span className="line-reveal-inner revealed">Where I've worked</span>
          </span>
        </motion.h2>

        {/* Cards — centered, Dell first, ideaForge second */}
        <motion.div
          className="flex flex-col md:flex-row md:items-stretch items-center justify-center gap-8 md:gap-6 mx-auto"
          style={{ maxWidth: '58rem' }}
          initial={{ opacity: 0, y: 32 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.18 }}
        >
          {/* ── 1. Dell — Sky blue (bg-sky-600) ── */}
          <Card
            title="Dell Technologies"
            subtitle="Software Engineer Intern · 2026"
            logoSrc="/dell-logo-trim.png"
            logoAlt="Dell Technologies"
            logoStyle={{
              width: 'min(85%, 22rem)',
              height: 'auto',
              objectFit: 'contain',
            }}
            description={[
              'Engineered PowerStore VSA platform enhancements applying Java, Python, REST APIs, Microservices, and cloud-native dev.',
              'Created automation with Python, Perl, Bash for Linux/UNIX troubleshooting and DevOps workflows.',
              'Executed system-level testing and performance optimization, reducing VM latency by 14.6% and improving overall performance by 17.2%.',
            ]}
            tags={['Virtualization', 'Containerization', 'SDLC', 'DevOps']}
          >
            <CanvasRevealEffect
              animationSpeed={3}
              containerClassName="bg-sky-600"
              colors={[[125, 211, 252]]}
            />
          </Card>

          {/* ── 2. ideaForge — Green (bg-emerald-900) ── */}
          <Card
            title="ideaForge Technologies"
            subtitle="Software Engineer Intern · 2025"
            logoSrc="/ideaforge-logo-trim.png"
            logoAlt="ideaForge Technologies"
            logoStyle={{
              width: 'min(62%, 15rem)',
              height: 'auto',
              objectFit: 'contain',
            }}
            description={[
              'Built backend services using Core Java, Spring Boot, FastAPI, and Rust integrating 3 RESTful APIs to process 100k+ geospatial points/day.',
              'Engineered automated aerial photogrammetry workflows processing 500+ drone images using Microservices and event-driven architecture.',
              'Built real-time defect-detection pipelines with Kafka-based event streaming, AI-assisted automation, and distributed processing.',
            ]}
            tags={['Geospatial Data', 'Kafka Streaming', 'REST APIs', 'Backend Dev']}
          >
            <CanvasRevealEffect
              animationSpeed={3}
              containerClassName="bg-emerald-600"
              colors={[[52, 211, 153]]}
            />
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
