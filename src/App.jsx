import React, { useState } from 'react';
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

export default function App() {
  useLenis();

  const [isLoaderFinished, setIsLoaderFinished] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      {/* Page Loader */}
      <PageLoader onComplete={() => setIsLoaderFinished(true)} />

      {/* Navbar */}
      <Navbar onOpenModal={() => setIsModalOpen(true)} />

      {/* Main Content Area */}
      <main id="main">
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
      </main>

      {/* Footer */}
      <Footer onOpenModal={() => setIsModalOpen(true)} />

      {/* Request Modal */}
      <RequestModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
