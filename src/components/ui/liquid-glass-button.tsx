import React from 'react';

export const LiquidGlassButton = ({ text = "Resume", href = "#", className = "" }) => {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={`liquid-glass-btn ${className}`}>
      <span className="liquid-glass-btn-text">{text}</span>
    </a>
  );
};
