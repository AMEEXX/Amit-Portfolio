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
const Card = ({ title, subtitle, description, logoSrc, logoAlt, logoStyle, children }) => {
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
      <div className="relative z-20 w-full text-center">

        {/* Logo: slides up + fades out on hover */}
        <div className="group-hover/canvas-card:-translate-y-4 group-hover/canvas-card:opacity-0 transition duration-200 w-full mx-auto flex items-center justify-center">
          <img
            src={logoSrc}
            alt={logoAlt}
            style={logoStyle}
          />
        </div>

        {/* Company name — fades in + slides up on hover */}
        <h2 className="text-white text-xl opacity-0 group-hover/canvas-card:opacity-100 relative z-10 font-bold group-hover/canvas-card:-translate-y-2 transition duration-200 mt-4">
          {title}
        </h2>

        {/* Role subtitle */}
        <p
          className="text-sm opacity-0 group-hover/canvas-card:opacity-100 transition duration-300 mt-1"
          style={{ color: 'rgba(255,255,255,0.55)', transitionDelay: '50ms' }}
        >
          {subtitle}
        </p>

        {/* Highlights — appear after title */}
        <ul
          className="opacity-0 group-hover/canvas-card:opacity-100 transition duration-300 mt-4 space-y-2 text-left px-2"
          style={{ transitionDelay: '80ms' }}
        >
          {description.map((line, i) => (
            <li key={i} className="flex gap-2 items-start text-sm" style={{ color: 'rgba(255,255,255,0.72)' }}>
              <span className="mt-[6px] w-1.5 h-1.5 rounded-full bg-white/60 shrink-0" />
              {line}
            </li>
          ))}
        </ul>
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
              transform: 'translateY(100px) scale(3.0)',
              objectFit: 'contain',
            }}
            description={[
              'Migrated PowerStore VSA to Red Hat OpenShift container platform.',
              'Reduced VM latency by 14.6% via optimized scheduling.',
              'Improved system throughput by 17% with async workload distribution.',
            ]}
          >
            <CanvasRevealEffect
              animationSpeed={3}
              containerClassName="bg-sky-600"
              colors={[[125, 211, 252]]}
            />
          </Card>

          {/* ── 2. ideaForge — Green (bg-emerald-900) ── */}
          <Card
            title="ideaForge Technology"
            subtitle="Software Engineer Intern · 2025"
            logoSrc="/ideaforge-logo.png"
            logoAlt="ideaForge Technology"
            logoStyle={{
              height: '64px',
              width: 'auto',
              objectFit: 'contain',
              transform: 'translateY(100px) scale(2.8)',
            }}
            description={[
              'Built FlyghtCloud backend processing 100k+ geospatial data points per day.',
              'Integrated real-time Kafka streaming for live UAV telemetry.',
              'Designed REST APIs for drone fleet management & mission planning.',
            ]}
          >
            <CanvasRevealEffect
              animationSpeed={5.1}
              containerClassName="bg-emerald-900"
            />
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
