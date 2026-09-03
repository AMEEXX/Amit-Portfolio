import React, { useState, useEffect } from 'react';
import { useLenis } from './hooks/useLenis';
import PageLoader from './components/PageLoader';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import WorkExperience from './components/WorkExperience';
import CreateBand from './components/CreateBand';
import Portfolio from './components/Portfolio';
import Services from './components/Services';
import Education from './components/Experience';
import Stats from './components/Stats';
import Footer from './components/Footer';
import RequestModal from './components/RequestModal';
import StarfieldScene from './components/effects/StarfieldScene';
import { TracingBeam } from '@/components/ui/tracing-beam';
import KeyboardShowcase from './components/keyboard-showcase';

import { motion } from 'motion/react';

export default function App() {
  useLenis();

  const [isLoaderFinished, setIsLoaderFinished] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Force scroll position to top (0,0) when loader is active and when it finishes
  useEffect(() => {
    window.scrollTo(0, 0);
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
  }, [isLoaderFinished]);

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      {/* Page Loader */}
      <PageLoader onComplete={() => setIsLoaderFinished(true)} />

      {/* Navbar */}
      <Navbar onOpenModal={() => setIsModalOpen(true)} />

      {/* Main Content Area — 3D Warp Entrance on Launch (Zero Y-Offset to prevent scroll shift) */}
      <motion.main
        id="main"
        initial={{
          rotateX: -5,
          skewY: -1.5,
          scaleY: 1.8,
          scaleX: 0.5,
          y: 0,
          opacity: 0,
        }}
        animate={
          isLoaderFinished
            ? {
                rotateX: 0,
                skewY: 0,
                scaleY: 1,
                scaleX: 1,
                y: 0,
                opacity: 1,
                transition: {
                  duration: 0.5,
                  ease: [0.59, 0, 0.35, 1],
                },
              }
            : {
                rotateX: -5,
                skewY: -1.5,
                scaleY: 1.8,
                scaleX: 0.5,
                y: 0,
                opacity: 0,
              }
        }
        style={{
          transformPerspective: 1000,
          originX: 0.5,
          originY: 0,
        }}
      >
        {/* Hero Section */}
        <Hero isLoaderFinished={isLoaderFinished} onOpenModal={() => setIsModalOpen(true)} />

        {/* Starfield Container for Mid-Sections */}
        <div className="starfield-zone" id="starfieldZone">
          <StarfieldScene />

          <TracingBeam className="px-6">
            {/* About */}
            <About />

            {/* Where I've Worked — canvas-reveal cards (Dell + ideaForge) */}
            <WorkExperience />

            {/* CreateBand — Design / Develop / → / Deploy */}
            <CreateBand />

            {/* Portfolio */}
            <Portfolio />

            {/* 3D Skills Keyboard — scroll-driven, self-contained */}
            <KeyboardShowcase />

            {/* Education — IIIT Bhubaneswar */}
            <Education />

            {/* Stats */}
            <Stats />
          </TracingBeam>
        </div>
      </motion.main>

      {/* Footer */}
      <Footer onOpenModal={() => setIsModalOpen(true)} />

      {/* Request Modal */}
      <RequestModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
