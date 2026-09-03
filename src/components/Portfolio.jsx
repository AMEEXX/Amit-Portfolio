import React, { useEffect, useState, useRef } from 'react';
import { CometCard } from '@/components/ui/comet-card';
import { GradientButton } from '@/components/ui/gradient-button';
import { StaticLiquidTag } from '@/components/ui/static-liquid-tag';
import { motion, useInView } from 'motion/react';

const PROJECTS = [
  {
    name: 'Attract',
    tag: '#AI-VISION',
    desc: 'A mobile facial recognition app for seamless classroom attendance.',
    longDesc: 'An innovative AI-powered mobile app designed for teachers. The app is securely pinned on the teacher’s phone and circulated around the classroom. Students snap quick photos of themselves, and the system automatically logs their attendance using advanced facial recognition models.',
    tech: ['React', 'Python', 'OpenCV', 'TensorFlow', 'PostgreSQL'],
    img: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?q=80&w=1287&auto=format&fit=crop',
    link: null,
    github: 'https://github.com/AMEEXX/Attract-AI-Based-Attendance-Tracker',
  },
  {
    name: 'PowerStore VSA on OpenShift',
    tag: '#DELL-INTERN',
    desc: 'Platform migration from VMware ESXi to Red Hat OpenShift.',
    longDesc: 'Engineered PowerStore VSA platform enhancements for virtualized infrastructure, applying Object-Oriented Design, Java, Python, REST APIs, and Microservices. Automated CI/CD workflows across 2 platforms and executed system-level testing, reducing VM latency by 14.6% and improving overall performance by 17.2%.',
    tech: ['Java', 'Python', 'Kubernetes', 'OpenShift', 'Jenkins'],
    img: '/dell-powerstore-all-flash-storage-hero-2998x1400.avif',
    link: null,
    github: null,
    internal: 'Dell Proprietary Internal Tool',
  },
  {
    name: 'YourTube',
    tag: '#PRODUCTIVITY',
    desc: 'A minimalist YouTube client restricted to whitelisted educational content.',
    longDesc: 'Developed a highly focused YouTube alternative designed for deep work and learning. The platform strictly streams videos and channels from a predefined whitelist, entirely stripping away distractions like comments, unrelated recommendations, and UI clutter to ensure users only watch what they are supposed to.',
    tech: ['React', 'Node.js', 'MongoDB', 'Express', 'YouTube API'],
    img: 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?q=80&w=1287&auto=format&fit=crop',
    link: 'https://vercel.com/ameexxs-projects/v0-your-tube-clone',
    github: 'https://github.com/AMEEXX/YourTube-rw',
  },
  {
    name: 'Future Vault',
    tag: '#CLOUD-NATIVE',
    desc: 'A time-capsule app for scheduled notes with event-driven processing.',
    longDesc: 'Created a full-stack cloud application with asynchronous processing for 1,000+ scheduled notes. Implemented RESTful web services, Microservices, Spring-JMS, and Kafka for event-driven processing supporting 500+ API requests/day.',
    tech: ['Java', 'Spring Boot', 'Rust', 'Kafka', 'Docker'],
    img: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1287&auto=format&fit=crop',
    link: 'https://open-later-rust.vercel.app/',
    github: 'https://github.com/AMEEXX/Open_Later_Rust',
  },
  {
    name: 'Portfolio Web',
    tag: '#FRONTEND',
    desc: 'My personal portfolio and interactive resume platform.',
    longDesc: 'A highly interactive and visually stunning personal portfolio featuring 3D animations, custom shader effects, dynamic layout transitions, and glassmorphic UI components. Designed to highlight engineering projects and professional achievements.',
    tech: ['React', 'TailwindCSS', 'Framer Motion', 'Three.js'],
    img: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop',
    link: null,
    github: 'https://github.com/AMEEXX/Amit-Portfolio',
  },
  {
    name: 'AI Agent Marketplace',
    tag: '#GEN-AI',
    desc: 'Discover, deploy, and interact with autonomous AI agents.',
    longDesc: 'Created a Generative AI agent platform to discover, deploy, configure, and interact with 100+ autonomous AI agents. Integrated LangChain, OpenAI API, and modular MERN components for scalable backend workflows.',
    tech: ['ReactJS', 'Spring Boot', 'LangChain', 'OpenAI API'],
    img: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1287&auto=format&fit=crop',
    link: null,
    github: 'https://github.com/AMEEXX/AI_Agent_Marketplace',
  }
];

export default function Portfolio() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '0px 0px -10% 0px' });

  return (
    <section className="portfolio" id="works" ref={sectionRef} style={{ padding: '5rem 0' }}>
      <div className="shell portfolio-inner">
        <div className="portfolio-header" style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <motion.h2 
            className="portfolio-h2" 
            style={{ textAlign: 'center', maxWidth: 'none', width: '100%', margin: '0 auto' }}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.08 }}
          >
            <span className="line-reveal-line">
              <span className="line-reveal-inner revealed">Things I've Built</span>
            </span>
          </motion.h2>
        </div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-10 mx-auto w-full max-w-[90rem]"
          initial={{ opacity: 0, y: 32 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.18 }}
        >
          {PROJECTS.map((item, i) => (
            <CometCard 
              key={i}
              className="h-full w-full group/card"
              backContent={
                <div className="relative flex h-full w-full flex-col justify-between overflow-hidden rounded-[24px] border border-white/10 bg-gradient-to-b from-[#0d0d10] via-black to-black p-6 text-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06),0_20px_45px_-15px_rgba(0,0,0,0.7)]">
                  {/* Aesthetic Grid Pattern */}
                  <div 
                    className="pointer-events-none absolute inset-0 z-0 opacity-60 mix-blend-screen"
                    style={{
                      backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.06) 1px, transparent 1px)`,
                      backgroundSize: '24px 24px',
                      maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)',
                      WebkitMaskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)'
                    }}
                  />

                  {/* Ambient corner glow */}
                  <div className="pointer-events-none absolute -top-16 -right-16 z-0 h-48 w-48 rounded-full bg-blue-500/10 blur-3xl" />

                  <div className="relative z-10">
                    {/* Title & Description */}
                    <div className="mb-1.5 flex items-center gap-2">
                      <span className="h-4 w-1 rounded-full bg-blue-400" />
                      <h3 className="text-lg md:text-xl font-semibold tracking-tight text-white">{item.name}</h3>
                    </div>
                    <p className="mb-4 text-[13px] leading-relaxed text-white/60 line-clamp-4">{item.longDesc}</p>

                    {/* Tech Stack Pills */}
                    <div className="space-y-2.5">
                      <h4 className="text-xs font-bold text-blue-400/80">Tech Stack:</h4>
                      <div className="flex flex-wrap gap-2">
                        {item.tech.map(t => (
                          <StaticLiquidTag key={t} className="px-3 py-1" textClass="text-[11px] uppercase tracking-wider">
                            {t}
                          </StaticLiquidTag>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons: Live Project & GitHub */}
                  {(item.link || item.internal || item.github) && (
                    <div className="relative mt-4 flex gap-2 pt-4 md:gap-3 border-t border-white/5">
                      {item.link ? (
                        <GradientButton asChild className="flex-1 text-xs md:text-sm py-2 px-3 md:px-4">
                          <a
                            href={item.link}
                            onClick={(e) => e.stopPropagation()}
                            target="_blank"
                            rel="noreferrer"
                          >
                            Live Project
                            <span className="ml-1.5 inline-block transition-transform duration-300 group-hover:rotate-45">
                              <svg className="w-4 h-4 inline" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M7 17L17 7" />
                                <path d="M8 7h9v9" />
                              </svg>
                            </span>
                          </a>
                        </GradientButton>
                      ) : item.internal ? (
                        <div className="flex-1 relative group/internal">
                          <GradientButton 
                            className="w-full flex-1 text-xs md:text-sm py-2 px-3 md:px-4 cursor-not-allowed opacity-75"
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                          >
                            Internal Tool
                            <svg className="w-3.5 h-3.5 inline ml-1.5 opacity-60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                            </svg>
                          </GradientButton>
                          <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-max max-w-[200px] px-3 py-2 bg-[#1a1c1d] border border-white/10 text-white text-[11px] font-semibold rounded-lg opacity-0 translate-y-2 group-hover/internal:opacity-100 group-hover/internal:translate-y-0 transition-all duration-300 pointer-events-none z-50 text-center shadow-xl">
                            {item.internal}
                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#1a1c1d]" />
                          </div>
                        </div>
                      ) : null}

                      {item.github ? (
                        <GradientButton variant="variant" asChild className="flex-1 text-xs md:text-sm py-2 px-3 md:px-4">
                          <a
                            href={item.github}
                            onClick={(e) => e.stopPropagation()}
                            target="_blank"
                            rel="noreferrer"
                          >
                            GitHub
                          </a>
                        </GradientButton>
                      ) : null}
                    </div>
                  )}
                </div>
              }
            >
              <div
                className="flex w-full flex-col items-stretch rounded-[24px] border-0 bg-[#1F2121] p-4 saturate-0 transition-all group-hover/card:saturate-100 h-full"
                style={{
                  transformStyle: "preserve-3d",
                  transform: "none",
                  opacity: 1,
                }}
              >
                <div className="mx-2 flex-1 flex flex-col justify-center">
                  <div className="relative mt-2 aspect-square w-full">
                    <img
                      loading="lazy"
                      className="absolute inset-0 h-full w-full rounded-[18px] bg-[#000000] object-cover contrast-75"
                      alt={item.name}
                      src={item.img}
                      style={{
                        boxShadow: "rgba(0, 0, 0, 0.05) 0px 5px 6px 0px",
                        opacity: 1,
                      }}
                    />
                  </div>
                </div>
                <div className="mt-3 flex flex-shrink-0 items-center justify-between px-2 font-mono text-white">
                  <div className="text-xs md:text-sm truncate mr-2 font-bold">{item.name}</div>
                  <div className="text-[10px] md:text-xs text-emerald-400 font-semibold">{item.tag}</div>
                </div>
              </div>
            </CometCard>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
