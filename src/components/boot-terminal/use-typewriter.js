// src/components/boot-terminal/use-typewriter.js
import { useState, useEffect, useRef, useCallback } from 'react';

export const SCRIPT_LINES = [
  { type: 'cmd', text: '$ whoami' },
  { type: 'out', text: 'amit_hota — developer & designer' },
  { type: 'cmd', text: '$ status --check' },
  { type: 'out', text: 'all systems ready' },
  { type: 'cmd', text: '$ ./launch site' },
];

export function useTypewriter({ onKeyStroke, onScriptComplete }) {
  // Array of revealed line states: { type, text, isComplete }
  const [lines, setLines] = useState([]);
  const [isDone, setIsDone] = useState(false);

  const scriptIndexRef = useRef(0);
  const charIndexRef = useRef(0);
  const timeoutRef = useRef(null);
  const isCancelledRef = useRef(false);

  const clearTimer = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const fastForward = useCallback(() => {
    if (isCancelledRef.current || isDone) return;
    isCancelledRef.current = true;
    clearTimer();

    // Instantly reveal all lines fully
    setLines(
      SCRIPT_LINES.map((item) => ({
        type: item.type,
        text: item.text,
        isComplete: true,
      }))
    );
    setIsDone(true);
    if (onScriptComplete) onScriptComplete();
  }, [isDone, clearTimer, onScriptComplete]);

  useEffect(() => {
    isCancelledRef.current = false;
    scriptIndexRef.current = 0;
    charIndexRef.current = 0;

    function typeNextStep() {
      if (isCancelledRef.current) return;

      const sIdx = scriptIndexRef.current;
      if (sIdx >= SCRIPT_LINES.length) {
        setIsDone(true);
        if (onScriptComplete) onScriptComplete();
        return;
      }

      const currentItem = SCRIPT_LINES[sIdx];

      if (currentItem.type === 'out') {
        // Output lines appear quickly in full
        setLines((prev) => {
          const next = [...prev];
          next[sIdx] = { type: 'out', text: currentItem.text, isComplete: true };
          return next;
        });
        scriptIndexRef.current += 1;
        charIndexRef.current = 0;
        // Pause 550ms before next command
        timeoutRef.current = setTimeout(typeNextStep, 550);
      } else {
        // Command lines type character by character
        const charIdx = charIndexRef.current;
        const fullText = currentItem.text;

        if (charIdx < fullText.length) {
          const nextChar = fullText.slice(0, charIdx + 1);
          setLines((prev) => {
            const next = [...prev];
            next[sIdx] = { type: 'cmd', text: nextChar, isComplete: false };
            return next;
          });

          if (onKeyStroke) onKeyStroke();

          charIndexRef.current += 1;
          // Random jitter 40ms - 65ms
          const delay = Math.floor(Math.random() * 25) + 40;
          timeoutRef.current = setTimeout(typeNextStep, delay);
        } else {
          // Finished typing this command line
          setLines((prev) => {
            const next = [...prev];
            next[sIdx] = { type: 'cmd', text: fullText, isComplete: true };
            return next;
          });
          scriptIndexRef.current += 1;
          charIndexRef.current = 0;
          // Pause 600ms before output or next command
          timeoutRef.current = setTimeout(typeNextStep, 600);
        }
      }
    }

    // Small initial delay before typing starts
    timeoutRef.current = setTimeout(typeNextStep, 200);

    return () => {
      isCancelledRef.current = true;
      clearTimer();
    };
  }, []); // Run once on mount

  return {
    lines,
    isDone,
    fastForward,
  };
}
