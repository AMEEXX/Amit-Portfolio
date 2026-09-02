// src/components/boot-terminal/boot-terminal.jsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useTypewriter } from './use-typewriter';
import { useKeySound } from './use-key-sound';
import './boot-terminal.css';

export function BootTerminal({ onComplete, skippable = true, playOnce = true }) {
  const [phaseClass, setPhaseClass] = useState('');
  const [isUnmounted, setIsUnmounted] = useState(false);

  const { isMuted, toggleMute, playClick, playSweep, playChime, resumeContext } = useKeySound();
  const exitSequenceStartedRef = useRef(false);

  // Check sessionStorage for playOnce
  useEffect(() => {
    if (playOnce && typeof window !== 'undefined') {
      try {
        if (sessionStorage.getItem('boot-seen') === 'true') {
          setIsUnmounted(true);
          if (onComplete) onComplete();
        }
      } catch {}
    }
  }, [playOnce, onComplete]);

  // ── 7-Phase CRT Exit Sequence (Class-toggle state machine, 0 per-frame state renders) ──
  const startExitSequence = useCallback(() => {
    if (exitSequenceStartedRef.current) return;
    exitSequenceStartedRef.current = true;

    const reducedMotion = typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reducedMotion) {
      setPhaseClass('phase-iris-reveal');
      setTimeout(() => {
        try { sessionStorage.setItem('boot-seen', 'true'); } catch {}
        if (onComplete) onComplete();
        setIsUnmounted(true);
      }, 300);
      return;
    }

    // Phase A — Hold (250ms)
    setPhaseClass('phase-hold');

    setTimeout(() => {
      // Phase B — Flash (100ms)
      setPhaseClass('phase-flash');

      setTimeout(() => {
        // Phase C — Collapse V (400ms)
        setPhaseClass('phase-collapse-v');
        playSweep();

        setTimeout(() => {
          // Phase D — Collapse H (300ms)
          setPhaseClass('phase-collapse-h');

          setTimeout(() => {
            // Phase E — Beat (100ms)
            setPhaseClass('phase-beat');

            setTimeout(() => {
              // Phase F — Iris reveal (650ms)
              setPhaseClass('phase-iris-reveal');
              playChime();

              setTimeout(() => {
                // Phase G — Settle (200ms) & Complete
                try { sessionStorage.setItem('boot-seen', 'true'); } catch {}
                if (onComplete) onComplete();
                setIsUnmounted(true);
              }, 200);
            }, 650);
          }, 100);
        }, 300);
      }, 400);
    }, 100);
  }, [onComplete, playSweep, playChime]);

  const { lines, isDone, fastForward } = useTypewriter({
    onKeyStroke: playClick,
    onScriptComplete: startExitSequence,
  });

  const handleUserInteraction = useCallback(() => {
    resumeContext();
    if (!skippable) return;
    if (!isDone) {
      fastForward();
    } else if (!exitSequenceStartedRef.current) {
      startExitSequence();
    }
  }, [skippable, isDone, fastForward, startExitSequence, resumeContext]);

  // Global keydown handler for skip
  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === 'Tab' || e.key === 'Alt') return;
      handleUserInteraction();
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleUserInteraction]);

  if (isUnmounted) return null;

  return (
    <div
      className={`boot-terminal-overlay ${phaseClass}`}
      onClick={handleUserInteraction}
      role="button"
      tabIndex={0}
      aria-label="Terminal boot loader. Click or press any key to skip."
    >
      {/* Sound Mute Toggle Button */}
      <button
        type="button"
        className="boot-mute-btn"
        onClick={(e) => {
          e.stopPropagation();
          resumeContext();
          toggleMute();
        }}
        aria-label={isMuted ? 'Unmute sound' : 'Mute sound'}
      >
        {isMuted ? 'Sound Off' : 'Sound On'}
      </button>

      {/* Terminal Content — Top-aligned, pure text prompt */}
      <div className="boot-terminal-content">
        {lines.map((line, idx) => (
          <div
            key={idx}
            className={`boot-line ${line.type === 'cmd' ? 'boot-line--cmd' : 'boot-line--out'}`}
          >
            {line.type === 'cmd' ? (
              <>
                <span className="boot-prompt-symbol">$</span>
                <span>{line.text.replace(/^\$\s*/, '')}</span>
                {!line.isComplete && <span className="boot-cursor" />}
              </>
            ) : (
              <span>{line.text}</span>
            )}
          </div>
        ))}

        {/* Blinking block cursor after all commands finished typing during hold phase */}
        {isDone && phaseClass === 'phase-hold' && (
          <div className="boot-line boot-line--cmd">
            <span className="boot-prompt-symbol">$</span>
            <span className="boot-cursor" />
          </div>
        )}
      </div>

      {/* Skip Hint */}
      <div className="boot-skip-hint">Click or press any key to skip</div>
    </div>
  );
}
