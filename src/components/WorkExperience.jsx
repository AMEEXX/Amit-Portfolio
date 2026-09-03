import React, { useRef, useState } from 'react';
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
const Card = ({ title, subtitle, description, logoSrc, logoAlt, logoStyle, tags, children }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="border border-white/[0.2] group/canvas-card flex items-center justify-center max-w-md w-full mx-auto p-6 relative h-[42rem]"
    >
      {/* Exact corner icons from demo */}
      <Icon className="absolute h-6 w-6 -top-3 -left-3 text-white" />
      <Icon className="absolute h-6 w-6 -bottom-3 -left-3 text-white" />
      <Icon className="absolute h-6 w-6 -top-3 -right-3 text-white" />
      <Icon className="absolute h-6 w-6 -bottom-3 -right-3 text-white" />

      {/* Canvas reveal — exact from demo */}
      <AnimatePresence>
        {hovered && (
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
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none group-hover/canvas-card:opacity-0 group-hover/canvas-card:-translate-y-4 transition duration-300 z-30">
          <img
            src={logoSrc}
            alt={logoAlt}
            style={logoStyle}
          />
        </div>

        {/* Company name — fades in + slides up on hover */}
        <h2 className="text-white text-2xl opacity-0 group-hover/canvas-card:opacity-100 relative z-10 font-bold group-hover/canvas-card:-translate-y-2 transition duration-200 mt-4">
          {title}
        </h2>

        {/* Role subtitle */}
        <p
          className="text-[17px] font-bold text-white/95 opacity-0 group-hover/canvas-card:opacity-100 transition duration-300 mt-1"
          style={{ transitionDelay: '50ms' }}
        >
          {subtitle}
        </p>

        {/* Highlights — appear after title */}
        <ul
          className="opacity-0 group-hover/canvas-card:opacity-100 transition duration-300 mt-4 space-y-2 text-left px-2"
          style={{ transitionDelay: '80ms' }}
        >
          {description.map((line, i) => (
            <li key={i} className="flex gap-2.5 items-start text-base font-semibold text-white drop-shadow-md leading-relaxed">
              <span className="mt-[8px] w-1.5 h-1.5 rounded-full bg-white/90 shrink-0" />
              {line}
            </li>
          ))}
        </ul>

        {/* Tags */}
        {tags && (
          <div 
            className="flex flex-wrap items-center justify-start gap-3 mt-6 px-2 opacity-0 group-hover/canvas-card:opacity-100 transition duration-300"
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
          className="flex flex-col lg:flex-row items-center justify-center gap-6 mx-auto"
          style={{ maxWidth: '58rem' }}
          initial={{ opacity: 0, y: 32 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.18 }}
        >
          {/* ── 1. Dell — Sky blue (bg-sky-600) ── */}
          <Card
            title="Dell Technologies"
            subtitle="Software Engineer Intern · 2026"
            logoSrc="/dell-logo-new.png"
            logoAlt="Dell Technologies"
            logoStyle={{
              height: '80px',
              width: 'auto',
              maxWidth: '220px',
              transform: 'scale(2.8)',
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
            logoSrc="/ideaforge-logo.png"
            logoAlt="ideaForge Technologies"
            logoStyle={{
              height: '64px',
              width: 'auto',
              objectFit: 'contain',
              transform: 'scale(2.8)',
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
