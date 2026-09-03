import React, { useEffect, useState, useRef } from 'react';
import { CometCard } from '@/components/ui/comet-card';
import { GradientButton } from '@/components/ui/gradient-button';
import { StaticLiquidTag } from '@/components/ui/static-liquid-tag';
import { motion, useInView } from 'motion/react';

const PROJECTS = [
  {
    name: 'PowerStore VSA on OpenShift',
    tag: '#DELL-INTERN',
    desc: 'Platform migration from VMware ESXi to Red Hat OpenShift.',
    longDesc: 'Engineered PowerStore VSA platform changes migrating from VMware ESXi to Red Hat OpenShift/Kubernetes. Automated CI/CD workflows using Jenkins, GitLab CI, and GitHub Actions. Reduced VM latency by 14.6% and improved overall performance by 17.2%.',
    tech: ['Java', 'Python', 'Kubernetes', 'OpenShift', 'Jenkins'],
    img: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?q=80&w=1287&auto=format&fit=crop',
    link: '#',
    github: 'https://github.com/AMEEXX',
  },
  {
    name: 'FlyghtCloud Platform',
    tag: '#IDEA-FORGE',
    desc: 'Cloud-based platform supporting scalable drone flight services.',
    longDesc: 'Contributed to the cloud-based FlyghtCloud Platform, supporting 5,000+ flight hours through scalable backend services. Built real-time defect-detection pipelines processing 100k+ geospatial points/day with Kafka-based event streaming.',
    tech: ['Java', 'Python', 'FastAPI', 'Kafka', 'REST APIs'],
    img: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?q=80&w=1287&auto=format&fit=crop',
    link: '#',
    github: 'https://github.com/AMEEXX',
  },
  {
    name: 'Future Vault',
    tag: '#CLOUD-NATIVE',
    desc: 'A time-capsule app for scheduled notes with event-driven processing.',
    longDesc: 'Created a full-stack cloud application with asynchronous processing for 1,000+ scheduled notes. Implemented RESTful web services, Microservices, Spring-JMS, and Kafka for event-driven processing supporting 500+ API requests/day.',
    tech: ['Java', 'Spring Boot', 'Rust', 'Kafka', 'Docker'],
    img: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1287&auto=format&fit=crop',
    link: '#',
    github: 'https://github.com/AMEEXX',
  },
  {
    name: 'AI Agent Marketplace',
    tag: '#GEN-AI',
    desc: 'Discover, deploy, and interact with autonomous AI agents.',
    longDesc: 'Created a Generative AI agent platform to discover, deploy, configure, and interact with 100+ autonomous AI agents. Integrated LangChain, OpenAI API, and modular MERN components for scalable backend workflows.',
    tech: ['ReactJS', 'Spring Boot', 'LangChain', 'OpenAI API'],
    img: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1287&auto=format&fit=crop',
    link: '#',
    github: 'https://github.com/AMEEXX',
  },
  {
    name: 'AI Attendance Tracker',
    tag: '#AI-VISION',
    desc: 'An AI-based attendance tracker app utilizing facial recognition.',
    longDesc: 'A comprehensive computer vision system that automates attendance tracking in large environments. It uses state-of-the-art facial embedding models to recognize individuals in real-time, drastically reducing administrative overhead and ensuring secure access control.',
    tech: ['React', 'Python', 'OpenCV', 'TensorFlow', 'PostgreSQL'],
    img: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?q=80&w=1287&auto=format&fit=crop',
    link: '#',
    github: 'https://github.com/AMEEXX',
  },
  {
    name: 'Portfolio Web',
    tag: '#FRONTEND',
    desc: 'My personal portfolio and interactive resume platform.',
    longDesc: 'A highly interactive and visually stunning personal portfolio featuring 3D animations, custom shader effects, dynamic layout transitions, and glassmorphic UI components. Designed to highlight engineering projects and professional achievements.',
    tech: ['React', 'TailwindCSS', 'Framer Motion', 'Three.js'],
    img: 'https://images.unsplash.com/photo-1481481322814-16a3a411dc82?q=80&w=1287&auto=format&fit=crop',
    link: '#',
    github: 'https://github.com/AMEEXX',
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
                  <div className="relative mt-4 flex gap-2 pt-4 md:gap-3">
                    <GradientButton asChild className="flex-1 text-xs md:text-sm py-2 px-3 md:px-4">
                      <a
                        href={item.link}
                        onClick={(e) => e.stopPropagation()}
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
                  </div>
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
