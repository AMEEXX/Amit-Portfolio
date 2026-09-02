import React, { useEffect, useState, useRef } from 'react';
import { CometCard } from '@/components/ui/comet-card';
import { motion, useInView } from 'motion/react';

const PROJECTS = [
  {
    name: 'AI Attendance Tracker',
    tag: '#AI-VISION',
    desc: 'An AI-based attendance tracker app utilizing facial recognition.',
    img: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?q=80&w=1287&auto=format&fit=crop',
    link: '#',
  },
  {
    name: 'Future Vault',
    tag: '#CLOUD-NATIVE',
    desc: 'A time-capsule app for scheduled notes with event-driven processing.',
    img: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1287&auto=format&fit=crop',
    link: '#',
  },
  {
    name: 'AI Agent Marketplace',
    tag: '#GEN-AI',
    desc: 'Discover, deploy, and interact with autonomous AI agents.',
    img: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1287&auto=format&fit=crop',
    link: '#',
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

        {/* 3 cards in a single line */}
        <motion.div 
          className="flex flex-col xl:flex-row items-center justify-center gap-8 mx-auto w-full max-w-[90rem]"
          initial={{ opacity: 0, y: 32 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.18 }}
        >
          {PROJECTS.map((item, i) => (
            <CometCard key={i}>
              <a
                href={item.link}
                className="my-6 flex w-[28rem] max-w-full cursor-pointer flex-col items-stretch rounded-[24px] border-0 bg-[#1F2121] p-4 saturate-0 md:my-10 md:p-6 no-underline transition-all hover:saturate-100"
                aria-label={`View project ${item.name}`}
                style={{
                  transformStyle: "preserve-3d",
                  transform: "none",
                  opacity: 1,
                }}
              >
                <div className="mx-2 flex-1">
                  <div className="relative mt-2 aspect-[3/4] w-full">
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
                <div className="mt-4 flex flex-shrink-0 items-center justify-between p-4 font-mono text-white">
                  <div className="text-sm md:text-base truncate mr-2 font-bold">{item.name}</div>
                  <div className="text-xs md:text-sm text-emerald-400 font-semibold">{item.tag}</div>
                </div>
              </a>
            </CometCard>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
