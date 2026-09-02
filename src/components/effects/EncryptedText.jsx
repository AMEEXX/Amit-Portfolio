import React, { useState, useEffect, useRef } from 'react';

const DEFAULT_CHARSET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-={}[];:,.<>/?';

export default function EncryptedText({
  text = '',
  className = '',
  revealDelayMs = 55,
  flipDelayMs = 45,
  lineDelayMs = 0,
  trigger = false,
  as: Component = 'span',
}) {
  const containerRef = useRef(null);
  const [displayedChars, setDisplayedChars] = useState([]);
  const randomChar = (charset) => charset.charAt(Math.floor(Math.random() * charset.length));

  useEffect(() => {
    if (!text) return;
    const chars = text.split('');
    setDisplayedChars(
      chars.map((ch) => ({
        char: ch === ' ' ? ' ' : randomChar(DEFAULT_CHARSET),
        revealed: false,
        isSpace: ch === ' ',
      }))
    );
  }, [text]);

  useEffect(() => {
    if (!trigger || !text) return;

    let cancelled = false;
    let startTime = 0;
    let lastFlip = 0;
    let revealedCount = 0;
    let rafId = null;
    const chars = text.split('');

    const tick = (now) => {
      if (cancelled) return;
      if (!startTime) startTime = now;
      const elapsed = now - startTime;
      const count = Math.min(chars.length, Math.floor(elapsed / Math.max(1, revealDelayMs)));

      if (count !== revealedCount) {
        revealedCount = count;
        setDisplayedChars((prev) =>
          prev.map((item, i) => {
            if (i < revealedCount) {
              return { char: chars[i], revealed: true, isSpace: chars[i] === ' ' };
            } else {
              return {
                char: chars[i] === ' ' ? ' ' : randomChar(DEFAULT_CHARSET),
                revealed: false,
                isSpace: chars[i] === ' ',
              };
            }
          })
        );
      }

      if (count >= chars.length) return;

      if (now - lastFlip >= Math.max(0, flipDelayMs)) {
        setDisplayedChars((prev) =>
          prev.map((item, i) => {
            if (i >= revealedCount && !item.isSpace) {
              return { ...item, char: randomChar(DEFAULT_CHARSET) };
            }
            return item;
          })
        );
        lastFlip = now;
      }

      rafId = requestAnimationFrame(tick);
    };

    const timer = setTimeout(() => {
      rafId = requestAnimationFrame(tick);
    }, lineDelayMs);

    return () => {
      cancelled = true;
      clearTimeout(timer);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [trigger, text, revealDelayMs, flipDelayMs, lineDelayMs]);

  return (
    <Component ref={containerRef} className={`encrypted-text ${className}`} aria-label={text}>
      {displayedChars.map((item, i) => (
        <span
          key={i}
          className={`encrypted-text__char ${
            item.revealed ? 'encrypted-text__char--revealed' : 'encrypted-text__char--encrypted'
          } ${item.isSpace ? 'encrypted-text__char--space' : ''}`}
        >
          {item.isSpace ? '\u00A0' : item.char}
        </span>
      ))}
    </Component>
  );
}
