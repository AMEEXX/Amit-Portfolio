import React, { useEffect, useState } from 'react';

export default function PageLoader({ onComplete }) {
  const [counter, setCounter] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    let start = 0;
    const interval = setInterval(() => {
      start += Math.floor(Math.random() * 8) + 4;
      if (start >= 100) {
        start = 100;
        setCounter(100);
        clearInterval(interval);

        setTimeout(() => {
          setIsExiting(true);
          if (onComplete) onComplete();

          setTimeout(() => {
            setIsHidden(true);
          }, 700);
        }, 300);
      } else {
        setCounter(start);
      }
    }, 45);

    return () => clearInterval(interval);
  }, [onComplete]);

  if (isHidden) return null;

  return (
    <div
      className="page-loader"
      style={{
        transition: 'transform 0.7s cubic-bezier(0.22, 1, 0.36, 1)',
        transform: isExiting ? 'translateY(-100%)' : 'translateY(0)',
      }}
    >
      <div
        className="loader-center"
        style={{
          transform: isExiting ? 'translateY(-12px)' : 'translateY(0)',
          opacity: isExiting ? 0 : 1,
        }}
      >
        <div className="loader-brand">
          <svg viewBox="0 0 48 48" fill="currentColor">
            <path d="M24 2c2.2 13.8 7.9 19.6 22 22-14.1 2.4-19.8 8.2-22 22-2.2-13.8-7.9-19.6-22-22 14.1-2.4 19.8-8.2 22-22Z" />
          </svg>
          Amit Hota
        </div>
        <p className="loader-tagline">Code crafted with precision.</p>
      </div>

      <div className="loader-progress">
        <div className="loader-track">
          <div className="loader-fill" style={{ width: `${counter}%` }} />
        </div>
        <div className="loader-meta">
          <span>Loading</span>
          <span className="loader-counter">{String(counter).padStart(3, '0')}</span>
        </div>
      </div>
    </div>
  );
}
